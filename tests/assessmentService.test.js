const test = require('node:test');
const assert = require('node:assert/strict');
const { evaluateProjectFitness } = require('../src/services/assessmentService');

test('assessmentService - should correctly classify pure deterministic requirement as Pure SDLC', () => {
  const result = evaluateProjectFitness({
    problemNature: 'deterministic_rules',
    explainabilityNeed: 'strict_mathematical',
    dataMaturity: 'no_data_specs_only',
    errorTolerance: 'zero_tolerance_strict',
    budgetScale: 'low_cpu_only'
  });

  assert.equal(result.verdict, 'Pure SDLC (Deterministic)');
  assert.ok(result.score < -25, `Expected negative score, got ${result.score}`);
  assert.ok(result.confidenceScore >= 85, 'Confidence score should be >= 85');
  assert.equal(result.architecturalPattern, 'Clean Architecture / Hexagonal Ports & Adapters');
  assert.ok(result.guardrailRecommendations.length >= 3);
  assert.ok(result.suggestedToolchain.includes('Jest / PyTest'));
  assert.ok(result.breakdownScores.determinismNeed > 80);
});

test('assessmentService - should correctly classify generative natural language as Pure AiDLC', () => {
  const result = evaluateProjectFitness({
    problemNature: 'natural_language_ambiguity',
    explainabilityNeed: 'blackbox_acceptable',
    dataMaturity: 'large_high_quality_dataset',
    errorTolerance: 'high_generative_assistive',
    budgetScale: 'enterprise_h100_cluster'
  });

  assert.equal(result.verdict, 'Pure AiDLC / Agentic');
  assert.ok(result.score > 25, `Expected score > 25, got ${result.score}`);
  assert.ok(result.confidenceScore >= 85);
  assert.equal(result.architecturalPattern, 'Autonomous Multi-Agent / Dynamic Routing Engine');
  assert.ok(result.guardrailRecommendations.some(r => r.includes('Golden Evaluation')));
  assert.ok(result.suggestedToolchain.some(t => t.includes('LangGraph') || t.includes('vLLM')));
  assert.ok(result.breakdownScores.generativePower > 80);
});

test('assessmentService - should correctly recommend Compound AI for hybrid enterprise use-cases', () => {
  const result = evaluateProjectFitness({
    problemNature: 'hybrid_workflow',
    explainabilityNeed: 'probabilistic_acceptable',
    dataMaturity: 'some_unstructured',
    errorTolerance: 'low_guardrails_required',
    budgetScale: 'moderate_cloud_api'
  });

  assert.equal(result.verdict, 'Compound AI (Hybrid SDLC + AiDLC)');
  assert.equal(result.architecturalPattern, 'The Deterministic Sandwich Pattern & Dual-Loop Agile');
  assert.ok(result.guardrailRecommendations.some(r => r.includes('Deterministic Sandwich')));
  assert.ok(result.breakdownScores.costEfficiency >= 60);
});

test('assessmentService - should throw error when required fields are missing', () => {
  assert.throws(() => {
    evaluateProjectFitness({
      problemNature: 'deterministic_rules'
      // missing other fields
    });
  }, {
    message: 'Missing required assessment parameters'
  });
});
