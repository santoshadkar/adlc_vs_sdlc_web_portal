/**
 * Enterprise FinOps & TCO / Latency Simulator Service
 * Computes comparative total cost of ownership (TCO), latency profiles,
 * and operational resource metrics across SDLC, AiDLC, and Compound AI.
 */

const MODEL_PRICING = {
  flagship: {
    name: "Flagship Frontier LLM (GPT-4o / Claude 3.5 Sonnet)",
    inputCostPer1M: 3.00,    // $3.00 per 1M input tokens
    outputCostPer1M: 15.00,  // $15.00 per 1M output tokens
    cacheReadCostPer1M: 0.30, // 90% discount on cached tokens
    avgLatencyMs: 1650
  },
  balanced: {
    name: "Balanced High-Efficiency LLM (GPT-4o-mini / Claude 3.5 Haiku)",
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.60,
    cacheReadCostPer1M: 0.03,
    avgLatencyMs: 550
  },
  opensource: {
    name: "Self-Hosted Open Weights (Llama 3.3 70B / Mistral 8x22B)",
    inputCostPer1M: 0.60,    // Blended GPU instance cost amortized
    outputCostPer1M: 1.80,
    cacheReadCostPer1M: 0.05,
    avgLatencyMs: 680
  }
};

// Classical SDLC serverless compute cost (AWS Lambda / ECS Fargate + RDS)
const SDLC_COST_PER_MILLION_REQS = 2.50; // ~$2.50 per 1M requests including compute + database + networking
const SDLC_LATENCY_P95_MS = 38;

function calculateFinOps({
  dailyQueries = 50000,
  promptTokens = 800,
  completionTokens = 300,
  cacheHitRate = 0.35,
  modelTier = 'flagship'
}) {
  const queries = Math.max(100, Number(dailyQueries) || 50000);
  const pTokens = Math.max(50, Number(promptTokens) || 800);
  const cTokens = Math.max(20, Number(completionTokens) || 300);
  const hitRate = Math.min(0.9, Math.max(0, Number(cacheHitRate) || 0.35));
  const pricing = MODEL_PRICING[modelTier] || MODEL_PRICING.flagship;

  const monthlyQueries = queries * 30.416; // Average days per month
  const annualQueries = queries * 365;

  // 1. Classical SDLC Metrics
  const sdlcMonthlyCost = (monthlyQueries / 1000000) * SDLC_COST_PER_MILLION_REQS;
  const sdlcAnnualCost = sdlcMonthlyCost * 12;
  const sdlcCostPer1k = (sdlcMonthlyCost / monthlyQueries) * 1000;
  const sdlcCarbonKg = (annualQueries * 0.000015).toFixed(2); // ~15mg CO2e per CPU invocation

  // 2. Pure AiDLC (Every query goes un-cached to the frontier model)
  const monthlyInputTokens = monthlyQueries * pTokens;
  const monthlyOutputTokens = monthlyQueries * cTokens;
  const pureAidlcInputCost = (monthlyInputTokens / 1000000) * pricing.inputCostPer1M;
  const pureAidlcOutputCost = (monthlyOutputTokens / 1000000) * pricing.outputCostPer1M;
  const pureAidlcMonthlyCost = pureAidlcInputCost + pureAidlcOutputCost;
  const pureAidlcAnnualCost = pureAidlcMonthlyCost * 12;
  const pureAidlcCostPer1k = (pureAidlcMonthlyCost / monthlyQueries) * 1000;
  const pureAidlcLatencyP95 = pricing.avgLatencyMs;
  const pureAidlcCarbonKg = (annualQueries * 0.0022).toFixed(2); // ~2.2g CO2e per frontier LLM generation

  // 3. Compound AI (Semantic Caching + SLM Triage + Deterministic Fallback)
  // - cacheHitRate % queries served via Redis vector cache (near-zero token cost)
  // - 40% of uncached queries handled by lightweight triage SLM / small model
  // - Remainder handled by frontier model
  const cachedQueries = monthlyQueries * hitRate;
  const uncachedQueries = monthlyQueries * (1 - hitRate);

  const cacheInfraCost = 180; // Managed Redis Enterprise / Vector Cache cluster
  const slmQueries = uncachedQueries * 0.40;
  const frontierQueries = uncachedQueries * 0.60;

  const slmCost = ((slmQueries * pTokens) / 1000000) * MODEL_PRICING.balanced.inputCostPer1M +
                  ((slmQueries * cTokens) / 1000000) * MODEL_PRICING.balanced.outputCostPer1M;

  const frontierCost = ((frontierQueries * pTokens) / 1000000) * pricing.inputCostPer1M +
                      ((frontierQueries * cTokens) / 1000000) * pricing.outputCostPer1M;

  const compoundMonthlyCost = cacheInfraCost + slmCost + frontierCost + sdlcMonthlyCost;
  const compoundAnnualCost = compoundMonthlyCost * 12;
  const compoundCostPer1k = (compoundMonthlyCost / monthlyQueries) * 1000;
  
  // Weighted P95 Latency: Cache hits: ~25ms; SLM: ~320ms; Frontier: ~1650ms
  const compoundLatencyP95 = Math.round(
    (hitRate * 25) + ((1 - hitRate) * 0.4 * 320) + ((1 - hitRate) * 0.6 * pricing.avgLatencyMs)
  );
  const compoundCarbonKg = (annualQueries * (0.0022 * (1 - hitRate) * 0.6 + 0.0002)).toFixed(2);

  // 4. Dedicated Self-Hosted Cluster (2x H100 SXM5 node on AWS / Azure)
  // ~$7.50/hr per 8x H100 node on 1-yr reserved instance, ~1 node required per 100k daily queries
  const requiredGpuNodes = Math.max(1, Math.ceil(queries / 80000));
  const hourlyNodeRate = 7.45;
  const selfHostedMonthlyCost = requiredGpuNodes * (hourlyNodeRate * 24 * 30.416) + 450; // + $450 MLOps platform
  const selfHostedAnnualCost = selfHostedMonthlyCost * 12;
  const selfHostedCostPer1k = (selfHostedMonthlyCost / monthlyQueries) * 1000;
  const selfHostedLatencyP95 = MODEL_PRICING.opensource.avgLatencyMs;

  const annualSavingsVsPureAidlc = pureAidlcAnnualCost - compoundAnnualCost;
  const savingsPercentage = Math.round(((pureAidlcAnnualCost - compoundAnnualCost) / pureAidlcAnnualCost) * 100);

  // FinOps Recommendation
  let recommendation = "";
  if (queries < 10000) {
    recommendation = "Low Volume Stage: Leverage Compound AI with managed frontier APIs. Self-hosting GPUs would yield idle waste. Enforce semantic caching to keep annual spend under $15k.";
  } else if (queries >= 10000 && queries < 150000) {
    recommendation = "High-Growth Enterprise Tier: Compound AI architecture provides optimal unit economics. Semantic caching + SLM triage saves approximately " + savingsPercentage + "% compared to pure frontier model calls.";
  } else {
    recommendation = "Hyper-Scale Tier: At " + queries.toLocaleString() + " daily queries, transition to a hybrid architecture: self-host quantized open-weights (Llama 3.3 70B on vLLM) for 80% of traffic, reserving commercial frontier APIs strictly for complex edge cases.";
  }

  return {
    inputs: {
      dailyQueries: queries,
      promptTokens: pTokens,
      completionTokens: cTokens,
      cacheHitRate: hitRate,
      modelTier,
      modelName: pricing.name
    },
    metrics: {
      pureSdlc: {
        architecture: "Pure SDLC (Microservices / Serverless)",
        monthlyCostUsd: Math.round(sdlcMonthlyCost),
        annualCostUsd: Math.round(sdlcAnnualCost),
        costPer1kQueriesUsd: Number(sdlcCostPer1k.toFixed(3)),
        latencyP95Ms: SDLC_LATENCY_P95_MS,
        carbonKgCo2eYear: Number(sdlcCarbonKg),
        techStack: "Go / Java Spring / Node.js + PostgreSQL + AWS ECS"
      },
      pureAidlc: {
        architecture: "Pure AiDLC (Direct Frontier LLM API)",
        monthlyCostUsd: Math.round(pureAidlcMonthlyCost),
        annualCostUsd: Math.round(pureAidlcAnnualCost),
        costPer1kQueriesUsd: Number(pureAidlcCostPer1k.toFixed(2)),
        latencyP95Ms: pureAidlcLatencyP95,
        carbonKgCo2eYear: Number(pureAidlcCarbonKg),
        techStack: `${pricing.name} (Direct un-cached REST calls)`
      },
      compoundAi: {
        architecture: "Compound AI (Semantic Cache + SLM Triage + Guardrails)",
        monthlyCostUsd: Math.round(compoundMonthlyCost),
        annualCostUsd: Math.round(compoundAnnualCost),
        costPer1kQueriesUsd: Number(compoundCostPer1k.toFixed(2)),
        latencyP95Ms: compoundLatencyP95,
        carbonKgCo2eYear: Number(compoundCarbonKg),
        annualSavingsUsd: Math.round(annualSavingsVsPureAidlc),
        savingsPercent: savingsPercentage,
        techStack: "Redis Semantic Cache + Llama 3 8B Triage + Frontier LLM + Zod Post-Flight"
      },
      selfHosted: {
        architecture: "Self-Hosted Private GPU Cluster (vLLM / TensorRT-LLM)",
        monthlyCostUsd: Math.round(selfHostedMonthlyCost),
        annualCostUsd: Math.round(selfHostedAnnualCost),
        costPer1kQueriesUsd: Number(selfHostedCostPer1k.toFixed(2)),
        latencyP95Ms: selfHostedLatencyP95,
        requiredGpuNodes,
        techStack: `${requiredGpuNodes}x 8x H100 SXM5 Nodes + vLLM + Triton Inference Server`
      }
    },
    recommendation
  };
}

module.exports = {
  calculateFinOps,
  MODEL_PRICING
};
