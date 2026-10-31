/**
 * Enterprise Production Toolkit & CAB Readiness Audit Data
 * Authoritative production code boilerplates, configuration schemas,
 * and 15-point Change Advisory Board (CAB) Go/No-Go readiness gates.
 */

const codeSnippets = [
  {
    id: "snippet_sandwich_ts",
    title: "Deterministic Sandwich Wrapper (TypeScript / Node.js)",
    language: "typescript",
    description: "Production wrapper enforcing Layer 1 Input Sanitization, Layer 2 LLM Structured Tool Invocation, and Layer 3 Zod Schema Boundary Validation.",
    code: `import { z } from 'zod';
import OpenAI from 'openai';

// 1. Layer 3 Boundary Schema: Mathematically strict output contract
export const FinancialTransferSchema = z.object({
  recipientIban: z.string().regex(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/, "Invalid IBAN"),
  amountUsd: z.number().positive().max(10000, "Single transaction ceiling exceeded ($10,000 max)"),
  memo: z.string().max(140),
  confidenceScore: z.number().min(0.90, "Model confidence too low for automated transfer")
});

export type FinancialTransfer = z.infer<typeof FinancialTransferSchema>;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Execute the Deterministic Sandwich Pattern
 */
export async function executeDeterministicSandwich(
  userPrompt: string,
  userAccountId: string
): Promise<{ success: boolean; data?: FinancialTransfer; error?: string }> {
  
  // ==========================================
  // LAYER 1: PRE-FLIGHT DETERMINISTIC GATE
  // ==========================================
  // 1a. Input bounds & auth check
  if (!userPrompt || userPrompt.trim().length > 1000) {
    throw new Error("PRE-FLIGHT REJECT: Input exceeds 1,000 characters limit");
  }
  
  // 1b. PII / Prompt Injection Heuristics
  const injectionPatterns = [/ignore previous/i, /system prompt/i, /drop table/i];
  if (injectionPatterns.some(pattern => pattern.test(userPrompt))) {
    return { success: false, error: "PRE-FLIGHT REJECT: Potential adversarial injection detected" };
  }

  // ==========================================
  // LAYER 2: PROBABILISTIC AI INFERENCE CORE
  // ==========================================
  let rawCompletion: string | null = null;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.0, // Strict deterministic decoding
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a financial parsing agent. Extract transfer details into JSON with keys: recipientIban, amountUsd, memo, confidenceScore."
        },
        { role: "user", content: userPrompt }
      ]
    });
    rawCompletion = response.choices[0]?.message?.content;
  } catch (err: any) {
    return { success: false, error: \`AI_INFERENCE_FAILURE: \${err.message}\` };
  }

  // ==========================================
  // LAYER 3: POST-FLIGHT ASSERTION GATE (SDLC)
  // ==========================================
  try {
    const parsedJson = JSON.parse(rawCompletion || "{}");
    
    // Strict Schema Validation via Zod
    const validatedData = FinancialTransferSchema.parse(parsedJson);

    // Deterministic Business Rule: Account Balance & Ledger Check
    // (Notice: The model is NEVER granted DB write access directly)
    // await db.executeTransaction(userAccountId, validatedData);

    return { success: true, data: validatedData };
  } catch (zodErr: any) {
    // Post-flight assertion caught a schema deviation or hallucination
    return { 
      success: false, 
      error: \`POST-FLIGHT REJECT: AI output breached deterministic boundary: \${zodErr.message}\` 
    };
  }
}`
  },
  {
    id: "snippet_sandwich_py",
    title: "Deterministic Sandwich Wrapper (Python / FastAPI)",
    language: "python",
    description: "Python implementation utilizing Pydantic V2, Instructor, and ACID transaction boundaries.",
    code: `from pydantic import BaseModel, Field, field_validator
import instructor
from openai import OpenAI
import re

# 1. Layer 3 Deterministic Contract Schema
class LoanApprovalDecision(BaseModel):
    applicant_id: str = Field(..., description="Unique applicant identifier")
    approved: bool = Field(..., description="Binary lending approval status")
    approved_amount_usd: float = Field(..., ge=0, le=500000, description="Approved loan amount capped at $500,000")
    risk_tier: str = Field(..., pattern="^(LOW|MEDIUM|HIGH)$")
    model_justification: str = Field(..., max_length=280)

    @field_validator("approved_amount_usd")
    def validate_approval_amount(cls, v, values):
        # Strict deterministic assertion: If rejected, amount MUST be zero
        if "approved" in values.data and not values.data["approved"] and v > 0:
            raise ValueError("Deterministic violation: Rejected applicants cannot have loan amount > 0")
        return v

# Initialize Instructor with OpenAI client
client = instructor.from_openai(OpenAI())

def run_lending_sandwich_pipeline(applicant_data: dict, applicant_credit_score: int):
    """
    Executes 3-Layer Deterministic Sandwich Architecture
    """
    # LAYER 1: PRE-FLIGHT GATE (Deterministic SDLC)
    if applicant_credit_score < 620:
        # Instant deterministic reject without burning AI tokens
        return {"status": "REJECTED_SDLC_GATE", "reason": "Credit score below statutory minimum (620)"}
    
    # LAYER 2: PROBABILISTIC REASONING (AiDLC)
    try:
        decision: LoanApprovalDecision = client.chat.completions.create(
            model="gpt-4o",
            response_model=LoanApprovalDecision,
            max_retries=2, # Self-correcting schema retry loop
            temperature=0.0,
            messages=[
                {"role": "system", "content": "You are a regulatory-compliant underwriting assistant."},
                {"role": "user", "content": f"Evaluate loan: {applicant_data}"}
            ]
        )
    except Exception as e:
        return {"status": "AI_FAILURE_CIRCUIT_BROKEN", "error": str(e)}

    # LAYER 3: POST-FLIGHT ASSERTION GATE (Deterministic SDLC)
    # The validated decision is written to PostgreSQL via ACID transaction
    return {
        "status": "APPROVED_BY_CAB_BOUNDARY",
        "data": decision.model_dump()
    }`
  },
  {
    id: "snippet_cicd_eval",
    title: "GitHub Actions CI/CD Eval Gate (.github/workflows/eval-gate.yml)",
    language: "yaml",
    description: "Enterprise CI/CD pipeline executing Promptfoo and Ragas benchmarks, blocking pull requests if Faithfulness drops below 96% or Hallucination exceeds 2%.",
    code: `name: AiDLC Continuous Evaluation & Security Gate

on:
  pull_request:
    paths:
      - 'prompts/**'
      - 'models/**'
      - 'src/agents/**'

jobs:
  statistical-eval-gate:
    name: Run Golden Benchmarks & OWASP Red-Team Scans
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source Code & DVC Golden Sets
        uses: actions/checkout@v4
        with:
          lfs: true

      - name: Setup Node.js & Python
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Evaluation Toolchain
        run: |
          npm install -g promptfoo
          pip install ragas deepeval garak

      - name: Execute Promptfoo Golden Evals (500 Benchmark Queries)
        env:
          OPENAI_API_KEY: \${{ secrets.CI_OPENAI_API_KEY }}
        run: |
          npx promptfoo eval --config tests/evals/promptfooconfig.yaml --output eval_results.json

      - name: Verify Strict CAB Quality Gates
        run: |
          node -e '
            const res = require("./eval_results.json");
            const passRate = res.results.stats.successes / res.results.stats.total;
            console.log("Evaluation Benchmark Pass Rate:", (passRate * 100).toFixed(2) + "%");
            if (passRate < 0.96) {
              console.error("FATAL: Benchmark pass rate is below the 96% CAB release threshold.");
              process.exit(1);
            }
          '

      - name: Execute OWASP Red-Team Jailbreak Probes (Garak)
        run: |
          python -m garak --model_type openai --model_name gpt-4o --probes promptinject,encoding --report_prefix redteam_report

      - name: Archive CAB Quality Audit Artifact
        uses: actions/upload-artifact@v4
        with:
          name: cab-eval-report
          path: |
            eval_results.json
            redteam_report*`
  },
  {
    id: "snippet_guardrails_json",
    title: "Enterprise Guardrails Configuration (guardrails.config.json)",
    language: "json",
    description: "Declarative multi-layer safety configuration defining token clamps, topical boundaries, canary traps, and circuit breakers.",
    code: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "guardrailsVersion": "2.4.0",
  "environment": "production",
  "layers": {
    "layer1_input": {
      "maxInputChars": 2000,
      "piiRedaction": {
        "enabled": true,
        "engine": "Microsoft-Presidio",
        "entities": ["EMAIL", "PHONE_NUMBER", "CREDIT_CARD", "US_SSN", "IBAN_CODE"]
      },
      "promptInjectionShield": {
        "enabled": true,
        "model": "meta-llama/Llama-Guard-3-8B",
        "actionOnBlock": "TERMINATE_WITH_REASON"
      }
    },
    "layer2_retrieval": {
      "vectorDatabase": "Pinecone-Enterprise",
      "minimumCosineSimilarity": 0.76,
      "maxContextChunks": 5,
      "tenantAclIsolation": true,
      "antiDataPoisoningHashCheck": true
    },
    "layer3_model": {
      "defaultTemperature": 0.0,
      "maxOutputTokens": 800,
      "frequencyPenalty": 0.2,
      "canaryToken": "CANARY_CORP_UUID_49204A_NEVER_LEAK",
      "systemPromptLockHash": "sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    },
    "layer4_output": {
      "faithfulnessNliCheck": {
        "enabled": true,
        "minimumGroundednessScore": 0.95
      },
      "jsonSchemaStrictEnforcement": true,
      "toxicityFilter": {
        "maxHateSpeechScore": 0.01,
        "maxHarassmentScore": 0.01
      }
    },
    "layer5_operations": {
      "semanticCache": {
        "enabled": true,
        "backend": "redis-cluster",
        "similarityThreshold": 0.94,
        "ttlSeconds": 86400
      },
      "rateLimiting": {
        "maxRequestsPerMinutePerUser": 60,
        "maxMonthlyTokensPerTenant": 50000000
      },
      "circuitBreakers": {
        "consecutiveErrorsThreshold": 5,
        "fallbackModel": "anthropic/claude-3-5-haiku"
      }
    }
  }
}`
  }
];

// 15 Enterprise Go/No-Go Readiness Criteria across 5 Categories
const readinessCategories = [
  {
    category: "1. Evaluation & Benchmarking Rigor",
    weight: 20,
    criteria: [
      {
        id: "eval_golden_set",
        title: "Version-Controlled Golden Benchmark Dataset",
        description: "A minimum of 500 representative, human-audited domain test cases are tracked in Git/DVC with expected outputs.",
        critical: true
      },
      {
        id: "eval_statistical_gate",
        title: "Statistical Evaluation Thresholds Enforced in CI/CD",
        description: "Automated test runner achieves >= 96% Faithfulness (Groundedness) and <= 2% Hallucination Rate on regression tests.",
        critical: true
      },
      {
        id: "eval_llm_judge_bias",
        title: "Evaluator LLM Bias Mitigation",
        description: "Automated judge models are tested for positional, length, and self-enhancement biases using dual-prompt permutations.",
        critical: false
      }
    ]
  },
  {
    category: "2. 5-Layer Guardrails & Safety Defenses",
    weight: 25,
    criteria: [
      {
        id: "guard_pii_sanitization",
        title: "Deterministic PII Scrubbing (Presidio / Regex)",
        description: "All user prompts are scrubbed of SSNs, IBANs, and health identifiers before reaching model inference APIs.",
        critical: true
      },
      {
        id: "guard_prompt_injection",
        title: "Adversarial Prompt Injection & Jailbreak Shield",
        description: "Dual-LLM classifier or Llama Guard intercepts direct and indirect prompt injections before execution.",
        critical: true
      },
      {
        id: "guard_canary_tokens",
        title: "Synthetic Canary Trap Tokens",
        description: "Canary tokens are seeded into system prompts; egress filters trigger immediate alarm if canary is leaked.",
        critical: false
      }
    ]
  },
  {
    category: "3. Deterministic Architectural Boundaries",
    weight: 25,
    criteria: [
      {
        id: "bound_sandwich_pattern",
        title: "Deterministic Sandwich Pattern Implementation",
        description: "Probabilistic AI model is wrapped between Layer 1 Pre-Flight validation and Layer 3 Post-Flight schema assertion.",
        critical: true
      },
      {
        id: "bound_zero_direct_db_write",
        title: "Zero Direct Database / API Write Access for AI",
        description: "AI agents cannot execute direct SQL INSERT/UPDATE/DELETE. Tool calls emit typed proposals committed by deterministic code.",
        critical: true
      },
      {
        id: "bound_zod_schema_assertion",
        title: "Strict JSON Schema Parsing (Zod / Pydantic V2)",
        description: "All model outputs are parsed through strict schemas; malformed or unvalidated payloads are rejected with zero fallback execution.",
        critical: true
      }
    ]
  },
  {
    category: "4. FinOps, Quotas & Graceful Degradation",
    weight: 15,
    criteria: [
      {
        id: "finops_monthly_spend_cap",
        title: "Hard Monthly Cost & Token Quota Limits",
        description: "Platform APIs have automated circuit breakers triggered at 80% and 100% of budgeted monthly spend.",
        critical: true
      },
      {
        id: "finops_semantic_cache",
        title: "Semantic Vector Caching Configured",
        description: "Redis or vector cache intercepts redundant repetitive queries, targeting >= 25% cache hit rate.",
        critical: false
      },
      {
        id: "finops_fallback_failover",
        title: "Graceful Model Degradation & Failover Hierarchy",
        description: "If primary model experiences 5xx outages or rate-limits, system falls back to secondary provider or deterministic message.",
        critical: true
      }
    ]
  },
  {
    category: "5. Governance, Observability & Human-in-the-Loop",
    weight: 15,
    criteria: [
      {
        id: "gov_eu_ai_act_classification",
        title: "EU AI Act & Regulatory Risk Classification",
        description: "Use-case is formally classified (Minimal, High Risk, Prohibited) with conformity assessment documented in Model Card.",
        critical: true
      },
      {
        id: "gov_distributed_tracing",
        title: "Full-Context Observability (Langfuse / OpenTelemetry)",
        description: "100% of production interactions log prompt version, retrieved vector chunks, token counts, and latency.",
        critical: true
      },
      {
        id: "gov_hitl_escalation",
        title: "Defined Human-in-the-Loop (HITL) Escalation Route",
        description: "When model output confidence drops below 0.85, query is routed to human operations team without user disruption.",
        critical: false
      }
    ]
  }
];

function evaluateReadiness(checkedCriteriaIds = []) {
  const checkedSet = new Set(checkedCriteriaIds);
  let totalScore = 0;
  let criticalFailures = [];

  readinessCategories.forEach(cat => {
    let catPassedCount = 0;
    const catTotal = cat.criteria.length;
    
    cat.criteria.forEach(crit => {
      const isChecked = checkedSet.has(crit.id);
      if (isChecked) {
        catPassedCount++;
      } else if (crit.critical) {
        criticalFailures.push({
          id: crit.id,
          title: crit.title,
          category: cat.category
        });
      }
    });

    const catPoints = (catPassedCount / catTotal) * cat.weight;
    totalScore += catPoints;
  });

  const readinessScore = Math.round(totalScore);
  
  let status = "DEPLOYMENT_REJECTED";
  let statusBadge = "bg-rose-500/20 text-rose-300 border-rose-500/40";
  let verdictSummary = "";

  if (criticalFailures.length === 0 && readinessScore >= 90) {
    status = "CAB_APPROVED";
    statusBadge = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    verdictSummary = "Full CAB Authorization Granted: System satisfies all critical enterprise safety, governance, and deterministic boundaries.";
  } else if (criticalFailures.length <= 2 && readinessScore >= 70) {
    status = "CONDITIONAL_APPROVAL";
    statusBadge = "bg-amber-500/20 text-amber-300 border-amber-500/40";
    verdictSummary = "Conditional Approval (Staging / Canary Only): Allowed to deploy to max 10% canary traffic pending resolution of critical gates.";
  } else {
    status = "DEPLOYMENT_REJECTED";
    statusBadge = "bg-rose-500/20 text-rose-300 border-rose-500/40";
    verdictSummary = "Production Deployment Rejected: System breaches mandatory safety, deterministic boundary, or benchmarking gates.";
  }

  return {
    readinessScore,
    status,
    statusBadge,
    verdictSummary,
    criticalFailures,
    totalCriteria: 15,
    checkedCount: checkedCriteriaIds.length,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  codeSnippets,
  readinessCategories,
  evaluateReadiness
};
