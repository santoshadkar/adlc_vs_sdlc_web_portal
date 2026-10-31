const express = require('express');
const router = express.Router();
const {
  overviewData,
  phasesData,
  advantagesData,
  domainMatrix,
  hybridPatterns,
  roleEvolution,
  guardrailsData,
  governanceData,
  cybersecurityData,
  caseStudiesData,
  visualDiagramsData
} = require('../data/portalData');
const { evaluateProjectFitness } = require('../services/assessmentService');
const { calculateFinOps } = require('../services/finopsService');
const { codeSnippets, readinessCategories, evaluateReadiness } = require('../data/toolkitData');

// GET /api/overview
router.get('/overview', (req, res) => {
  res.json({
    status: 'success',
    data: overviewData
  });
});

// GET /api/phases
router.get('/phases', (req, res) => {
  res.json({
    status: 'success',
    count: phasesData.length,
    data: phasesData
  });
});

// GET /api/advantages
router.get('/advantages', (req, res) => {
  res.json({
    status: 'success',
    data: advantagesData
  });
});

// GET /api/matrix
router.get('/matrix', (req, res) => {
  res.json({
    status: 'success',
    count: domainMatrix.length,
    data: domainMatrix
  });
});

// GET /api/hybrid-patterns
router.get('/hybrid-patterns', (req, res) => {
  res.json({
    status: 'success',
    count: hybridPatterns.length,
    data: hybridPatterns
  });
});

// GET /api/roles
router.get('/roles', (req, res) => {
  res.json({
    status: 'success',
    count: roleEvolution.length,
    data: roleEvolution
  });
});

// GET /api/guardrails
router.get('/guardrails', (req, res) => {
  res.json({
    status: 'success',
    data: guardrailsData
  });
});

// GET /api/governance
router.get('/governance', (req, res) => {
  res.json({
    status: 'success',
    data: governanceData
  });
});

// GET /api/security
router.get('/security', (req, res) => {
  res.json({
    status: 'success',
    data: cybersecurityData
  });
});

// GET /api/case-studies
router.get('/case-studies', (req, res) => {
  res.json({
    status: 'success',
    count: caseStudiesData.length,
    data: caseStudiesData
  });
});

// GET /api/diagrams
router.get('/diagrams', (req, res) => {
  res.json({
    status: 'success',
    count: visualDiagramsData.length,
    data: visualDiagramsData
  });
});

// POST /api/assess
router.post('/assess', (req, res) => {
  try {
    const result = evaluateProjectFitness(req.body);
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST /api/finops
router.post('/finops', (req, res) => {
  try {
    const result = calculateFinOps(req.body || {});
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /api/toolkit
router.get('/toolkit', (req, res) => {
  res.json({
    status: 'success',
    count: codeSnippets.length,
    data: codeSnippets
  });
});

// GET /api/readiness-checklist
router.get('/readiness-checklist', (req, res) => {
  res.json({
    status: 'success',
    data: readinessCategories
  });
});

// POST /api/readiness-audit
router.post('/readiness-audit', (req, res) => {
  try {
    const checked = req.body?.checkedCriteriaIds || [];
    const result = evaluateReadiness(checked);
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /api/health
router.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'AiDLC-vs-SDLC-Decision-API',
    uptime: process.uptime()
  });
});

module.exports = router;
