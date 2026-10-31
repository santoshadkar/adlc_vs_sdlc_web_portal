const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/server');

// Lightweight in-memory request executor for Express
function makeRequest(app, method, url, body = null) {
  return new Promise((resolve) => {
    const EventEmitter = require('events');
    const req = new EventEmitter();
    req.method = method.toUpperCase();
    req.url = url;
    req.headers = { 'content-type': 'application/json' };
    req.body = body || {};

    const res = new EventEmitter();
    res.statusCode = 200;
    res._headers = {};
    res.headersSent = false;

    let responseData = '';

    res.setHeader = (k, v) => { res._headers[k.toLowerCase()] = v; };
    res.getHeader = (k) => res._headers[k.toLowerCase()];
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (obj) => {
      res.setHeader('content-type', 'application/json');
      responseData = JSON.stringify(obj);
      res.end();
    };
    res.send = (str) => {
      responseData = str;
      res.end();
    };
    res.end = (chunk) => {
      if (chunk) responseData += chunk;
      let parsed = null;
      try {
        parsed = JSON.parse(responseData);
      } catch {
        parsed = responseData;
      }
      resolve({
        statusCode: res.statusCode,
        body: parsed,
        raw: responseData
      });
    };

    app.handle(req, res);
  });
}

test('API GET /api/health should return 200 and status UP', async () => {
  const res = await makeRequest(app, 'GET', '/api/health');
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 'UP');
  assert.equal(res.body.service, 'AiDLC-vs-SDLC-Decision-API');
});

test('API GET /api/overview should return paradigm data with core dimensions', async () => {
  const res = await makeRequest(app, 'GET', '/api/overview');
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 'success');
  assert.ok(res.body.data.title.includes('AiDLC vs SDLC'));
  assert.ok(Array.isArray(res.body.data.core_dimensions));
  assert.ok(res.body.data.core_dimensions.length >= 12);
  assert.ok(res.body.data.core_dimensions[0].deepDive, 'Dimension should have deep dive data');
});

test('API GET /api/phases should return 7 developmental phases with security gates', async () => {
  const res = await makeRequest(app, 'GET', '/api/phases');
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 'success');
  assert.equal(res.body.count, 7);
  assert.equal(res.body.data[0].phaseNumber, 1);
  assert.ok(res.body.data[0].securityGate, 'Phase should include security gate specification');
});

test('API GET /api/advantages should return SDLC and AiDLC pros/cons', async () => {
  const res = await makeRequest(app, 'GET', '/api/advantages');
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 'success');
  assert.ok(res.body.data.sdlc.advantages.length >= 4);
  assert.ok(res.body.data.aidlc.advantages.length >= 4);
});

test('API GET /api/matrix should return domain use cases with compliance frameworks', async () => {
  const res = await makeRequest(app, 'GET', '/api/matrix');
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 'success');
  assert.ok(res.body.count >= 8);
  assert.ok(res.body.data[0].complianceFramework, 'Domain matrix should include compliance frameworks');
});

test('API GET /api/hybrid-patterns should return compound AI architectures', async () => {
  const res = await makeRequest(app, 'GET', '/api/hybrid-patterns');
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 'success');
  assert.ok(res.body.data.some(p => p.id === 'sandwich'));
});

test('API GET /api/roles should return career and team evolution paths', async () => {
  const res = await makeRequest(app, 'GET', '/api/roles');
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 'success');
  assert.ok(res.body.count >= 6);
});

test('API GET /api/guardrails should return 5-layer guardrail architecture', async () => {
  const res = await makeRequest(app, 'GET', '/api/guardrails');
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 'success');
  assert.ok(Array.isArray(res.body.data.layers));
  assert.equal(res.body.data.layers.length, 5);
  assert.equal(res.body.data.layers[0].id, 'input_guardrails');
});

test('API GET /api/governance should return ISO 42001, NIST AI RMF, and EU AI Act', async () => {
  const res = await makeRequest(app, 'GET', '/api/governance');
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 'success');
  assert.ok(Array.isArray(res.body.data.frameworks));
  assert.ok(res.body.data.frameworks.some(f => f.name.includes('ISO/IEC 42001')));
  assert.ok(res.body.data.frameworks.some(f => f.name.includes('EU AI Act')));
});

test('API GET /api/security should return AppSec vs AI Sec and OWASP LLM Top 10', async () => {
  const res = await makeRequest(app, 'GET', '/api/security');
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 'success');
  assert.ok(Array.isArray(res.body.data.owaspTop10LLM));
  assert.equal(res.body.data.owaspTop10LLM.length, 10);
  assert.equal(res.body.data.owaspTop10LLM[0].code, 'LLM01');
});

test('API GET /api/case-studies should return 12 real-world enterprise case studies', async () => {
  const res = await makeRequest(app, 'GET', '/api/case-studies');
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 'success');
  assert.ok(Array.isArray(res.body.data));
  assert.equal(res.body.count, 12, 'Expected 12 case studies covering diverse domains');
  assert.ok(res.body.data.some(c => c.id === 'cs_automotive'));
  assert.ok(res.body.data.some(c => c.id === 'cs_energy'));
  assert.ok(res.body.data.some(c => c.id === 'cs_gov'));
});

test('API GET /api/diagrams should return architectural visual diagram metadata', async () => {
  const res = await makeRequest(app, 'GET', '/api/diagrams');
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 'success');
  assert.ok(Array.isArray(res.body.data));
  assert.ok(res.body.count >= 7);
  assert.ok(res.body.data.some(d => d.id === 'diag_sandwich'));
});

test('API POST /api/assess should return assessment verdict for valid request', async () => {
  const payload = {
    problemNature: 'deterministic_rules',
    explainabilityNeed: 'strict_mathematical',
    dataMaturity: 'no_data_specs_only',
    errorTolerance: 'zero_tolerance_strict',
    budgetScale: 'low_cpu_only'
  };

  const res = await makeRequest(app, 'POST', '/api/assess', payload);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 'success');
  assert.equal(res.body.data.verdict, 'Pure SDLC (Deterministic)');
});

test('API POST /api/assess should return 400 when missing fields', async () => {
  const res = await makeRequest(app, 'POST', '/api/assess', { problemNature: 'deterministic_rules' });
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.status, 'error');
  assert.equal(res.body.message, 'Missing required assessment parameters');
});

test('API POST /api/finops should return full TCO comparison and metrics', async () => {
  const payload = {
    dailyQueries: 25000,
    promptTokens: 500,
    completionTokens: 200,
    cacheHitRate: 0.40,
    modelTier: 'flagship'
  };

  const res = await makeRequest(app, 'POST', '/api/finops', payload);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 'success');
  assert.ok(res.body.data.metrics.pureSdlc);
  assert.ok(res.body.data.metrics.pureAidlc);
  assert.ok(res.body.data.metrics.compoundAi);
  assert.ok(res.body.data.metrics.selfHosted);
  assert.ok(res.body.data.metrics.compoundAi.annualSavingsUsd > 0);
});

test('API GET /api/toolkit should return production code boilerplates', async () => {
  const res = await makeRequest(app, 'GET', '/api/toolkit');
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 'success');
  assert.ok(Array.isArray(res.body.data));
  assert.ok(res.body.count >= 4);
  assert.ok(res.body.data.some(s => s.id === 'snippet_sandwich_ts'));
});

test('API GET /api/readiness-checklist should return 15 CAB audit criteria', async () => {
  const res = await makeRequest(app, 'GET', '/api/readiness-checklist');
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 'success');
  assert.ok(Array.isArray(res.body.data));
  assert.equal(res.body.data.length, 5); // 5 categories
});

test('API POST /api/readiness-audit should evaluate CAB readiness score', async () => {
  const payload = {
    checkedCriteriaIds: [
      'eval_golden_set', 'eval_statistical_gate',
      'guard_pii_sanitization', 'guard_prompt_injection',
      'bound_sandwich_pattern', 'bound_zero_direct_db_write', 'bound_zod_schema_assertion',
      'finops_monthly_spend_cap', 'finops_fallback_failover',
      'gov_eu_ai_act_classification', 'gov_distributed_tracing'
    ]
  };

  const res = await makeRequest(app, 'POST', '/api/readiness-audit', payload);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 'success');
  assert.ok(res.body.data.readinessScore > 50);
  assert.ok(res.body.data.status);
});
