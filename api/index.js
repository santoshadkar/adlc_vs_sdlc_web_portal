/**
 * Vercel Serverless Function Entrypoint
 * Bridges Express REST API to Vercel's serverless environment.
 */
const app = require('../src/server');

module.exports = app;
