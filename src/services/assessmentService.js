/**
 * Pure business logic for the AiDLC vs SDLC Assessment Engine
 */

function evaluateProjectFitness(input) {
  const {
    problemNature,
    explainabilityNeed,
    dataMaturity,
    errorTolerance,
    budgetScale
  } = input;

  if (!problemNature || !explainabilityNeed || !dataMaturity || !errorTolerance || !budgetScale) {
    throw new Error('Missing required assessment parameters');
  }

  // Scoring points: negative favors SDLC, positive favors AiDLC
  let score = 0;
  const analysisPoints = [];

  // 1. Problem Nature
  if (problemNature === 'deterministic_rules') {
    score -= 40;
    analysisPoints.push('Problem domain follows well-defined mathematical or statutory rules, strongly favoring deterministic SDLC.');
  } else if (problemNature === 'pattern_recognition') {
    score += 20;
    analysisPoints.push('Problem relies on statistical patterns across high-dimensional data, well-suited for machine learning / AiDLC.');
  } else if (problemNature === 'natural_language_ambiguity') {
    score += 40;
    analysisPoints.push('Unstructured language, tone, or semantic intent demands generative AI and semantic context.');
  } else if (problemNature === 'hybrid_workflow') {
    score += 0; // Neutral anchor for hybrid compound systems
    analysisPoints.push('Workflow combines structured business logic with unstructured text/media processing.');
  }

  // 2. Explainability & Compliance
  if (explainabilityNeed === 'strict_mathematical') {
    score -= 30;
    analysisPoints.push('Zero tolerance for black-box execution requires 100% auditable code paths.');
  } else if (explainabilityNeed === 'probabilistic_acceptable') {
    score += 0;
    analysisPoints.push('Probabilistic explanations with citation grounds are acceptable.');
  } else if (explainabilityNeed === 'blackbox_acceptable') {
    score += 20;
    analysisPoints.push('Empirical high-accuracy performance is prioritized over line-by-line interpretability.');
  }

  // 3. Data Maturity
  if (dataMaturity === 'no_data_specs_only') {
    score -= 25;
    analysisPoints.push('Lack of curated data creates high friction for AiDLC; favors building logic from specifications.');
  } else if (dataMaturity === 'some_unstructured') {
    score += 10;
    analysisPoints.push('Presence of unstructured assets benefits from RAG and pre-trained LLMs.');
  } else if (dataMaturity === 'large_high_quality_dataset') {
    score += 25;
    analysisPoints.push('Rich high-quality dataset provides immediate leverage for fine-tuning or specialized evals.');
  }

  // 4. Error Tolerance
  if (errorTolerance === 'zero_tolerance_strict') {
    score -= 35;
    analysisPoints.push('Life-critical or strict regulatory zero-error tolerance forbids unconstrained probabilistic models.');
  } else if (errorTolerance === 'low_guardrails_required') {
    score -= 5;
    analysisPoints.push('Low error tolerance feasible only when wrapped in strict deterministic guardrails.');
  } else if (errorTolerance === 'high_generative_assistive') {
    score += 30;
    analysisPoints.push('Assistive/creative context where occasional variance or creative generation is an asset.');
  }

  // 5. Budget Scale
  if (budgetScale === 'low_cpu_only') {
    score -= 15;
    analysisPoints.push('Constrained compute budget favors standard CPU microservices with near-zero runtime inference overhead.');
  } else if (budgetScale === 'moderate_cloud_api') {
    score += 5;
    analysisPoints.push('Moderate cloud budget supports managed serverless LLM APIs with token caching.');
  } else if (budgetScale === 'enterprise_h100_cluster') {
    score += 20;
    analysisPoints.push('Dedicated GPU compute enables private on-premise model hosting, fine-tuning, and ultra-low latency.');
  }

  let verdict = '';
  let architecturalPattern = '';
  let recommendation = '';
  let confidenceScore = 90;
  let guardrailRecommendations = [];
  let suggestedToolchain = [];

  // Forced hybrid if explicitly hybrid_workflow or conflicting constraints
  const isHybridMandate = problemNature === 'hybrid_workflow' ||
    (problemNature === 'natural_language_ambiguity' && errorTolerance === 'low_guardrails_required') ||
    (problemNature === 'deterministic_rules' && dataMaturity === 'large_high_quality_dataset');

  if (score <= -25 && !isHybridMandate) {
    verdict = 'Pure SDLC (Deterministic)';
    confidenceScore = Math.min(98, 85 + Math.abs(score) / 5);
    architecturalPattern = 'Clean Architecture / Hexagonal Ports & Adapters';
    recommendation = 'Your project requires absolute determinism, mathematically provable logic, or operates under strict zero-error regulatory requirements. Rely on structured SDLC with exhaustive unit and integration testing. Avoid introducing probabilistic LLMs into core calculations.';
    guardrailRecommendations = [
      'Enforce static code analysis and strict schema validation (JSON Schema / Zod).',
      'Mandate 90%+ code branch coverage with automated regression suites.',
      'Deploy immutable CI/CD container artifacts with automated vulnerability scans.'
    ];
    suggestedToolchain = ['TypeScript / Java / Go', 'Docker & Kubernetes', 'Jest / PyTest', 'GitHub Actions', 'SonarQube'];
  } else if (score >= 35 && !isHybridMandate) {
    verdict = 'Pure AiDLC / Agentic';
    confidenceScore = Math.min(96, 85 + Math.abs(score) / 6);
    architecturalPattern = 'Autonomous Multi-Agent / Dynamic Routing Engine';
    recommendation = 'Your problem involves highly nuanced, unstructured data or human-like language synthesis where fixed rules break down. Adopt a full AiDLC approach centered on Golden Benchmark evaluation suites, semantic retrieval, and continuous prompt/data flywheels.';
    guardrailRecommendations = [
      'Establish a 500+ case Golden Evaluation dataset before writing system prompts.',
      'Implement LLM-as-a-judge automated benchmarking for every prompt modification.',
      'Deploy semantic caching and streaming token budget throttles to protect cost SLAs.',
      'Integrate adversarial red-teaming to prevent prompt injection and data leaks.'
    ];
    suggestedToolchain = ['LangGraph / LlamaIndex', 'vLLM / Hugging Face', 'Ragas & DeepEval', 'Langfuse / Phoenix', 'Pinecone / Qdrant'];
  } else {
    verdict = 'Compound AI (Hybrid SDLC + AiDLC)';
    confidenceScore = 95;
    architecturalPattern = 'The Deterministic Sandwich Pattern & Dual-Loop Agile';
    recommendation = 'Your project requires the intelligence of modern AI bounded by the reliability and safety of deterministic software. Implement the Deterministic Sandwich pattern: use SDLC for input sanitization and output schema validation, while allowing AiDLC to power the cognitive reasoning core.';
    guardrailRecommendations = [
      'Deterministic Sandwich Layer 1 (SDLC Pre-Flight): Input validation, PII scrubbing, token rate-limiting.',
      'Deterministic Sandwich Layer 2 (AiDLC Core): Contextual RAG retrieval, low-temp reasoning, structured function calling.',
      'Deterministic Sandwich Layer 3 (SDLC Post-Flight): Strict JSON schema parse, business rule verification, automatic rollback.',
      'Maintain separate sprint cadences: 2-week outer SDLC release cycle with daily inner-loop prompt/eval optimization.'
    ];
    suggestedToolchain = ['Next.js / Node.js + Express', 'DSPy / LangChain', 'Zod / Pydantic', 'DeepEval / Promptfoo', 'Redis Semantic Cache'];
  }

  // Dimensional breakdown radar scores (0 - 100)
  const breakdownScores = {
    determinismNeed: Math.max(10, Math.min(95, 50 - (score * 0.6))),
    generativePower: Math.max(10, Math.min(95, 50 + (score * 0.6))),
    costEfficiency: budgetScale === 'low_cpu_only' ? 95 : (budgetScale === 'moderate_cloud_api' ? 70 : 45),
    explainability: explainabilityNeed === 'strict_mathematical' ? 98 : (explainabilityNeed === 'probabilistic_acceptable' ? 65 : 40),
    speedToMarket: score > 0 ? 85 : 70
  };

  return {
    verdict,
    score,
    confidenceScore: Math.round(confidenceScore),
    architecturalPattern,
    recommendation,
    analysisPoints,
    guardrailRecommendations,
    suggestedToolchain,
    breakdownScores
  };
}

module.exports = {
  evaluateProjectFitness
};
