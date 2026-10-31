const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateFinOps } = require('../src/services/finopsService');

test('finopsService - should correctly calculate cost comparisons for default 50k queries/day', () => {
  const result = calculateFinOps({
    dailyQueries: 50000,
    promptTokens: 800,
    completionTokens: 300,
    cacheHitRate: 0.35,
    modelTier: 'flagship'
  });

  assert.ok(result.metrics.pureSdlc.monthlyCostUsd > 0);
  assert.ok(result.metrics.pureAidlc.monthlyCostUsd > result.metrics.pureSdlc.monthlyCostUsd);
  assert.ok(result.metrics.compoundAi.monthlyCostUsd < result.metrics.pureAidlc.monthlyCostUsd);
  assert.ok(result.metrics.compoundAi.annualSavingsUsd > 0);
  assert.ok(result.metrics.compoundAi.savingsPercent > 20);
  assert.ok(result.recommendation.length > 10);
});

test('finopsService - should demonstrate extreme unit economics difference between SDLC and Pure AiDLC', () => {
  const result = calculateFinOps({
    dailyQueries: 100000,
    promptTokens: 1000,
    completionTokens: 500,
    cacheHitRate: 0.50,
    modelTier: 'flagship'
  });

  // Pure SDLC should be orders of magnitude cheaper than un-cached Frontier LLM
  assert.ok(result.metrics.pureSdlc.costPer1kQueriesUsd < 0.05);
  assert.ok(result.metrics.pureAidlc.costPer1kQueriesUsd > 5.00);
  // Compound AI with 50% cache hit rate should save > 50%
  assert.ok(result.metrics.compoundAi.savingsPercent >= 50);
});

test('finopsService - should handle edge cases with fallback minimums', () => {
  const result = calculateFinOps({
    dailyQueries: -5,
    promptTokens: 0,
    completionTokens: 0,
    cacheHitRate: 2.0
  });

  assert.ok(result.inputs.dailyQueries >= 100);
  assert.ok(result.inputs.promptTokens >= 50);
  assert.ok(result.inputs.completionTokens >= 20);
  assert.ok(result.inputs.cacheHitRate <= 0.9);
});
