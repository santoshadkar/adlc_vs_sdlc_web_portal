const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static frontend serving
app.use(express.static(path.join(__dirname, '..', 'public')));

// API routes
app.use('/api', apiRoutes);

// Fallback for single page app
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Centralized Error Handling
app.use((err, req, res, next) => {
  console.error('[Error]', err.stack || err.message);
  res.status(500).json({
    status: 'error',
    message: config.nodeEnv === 'production' ? 'Internal Server Error' : err.message
  });
});

// Start server if not imported by test runner
if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`[AiDLC vs SDLC Portal] Server running on port ${config.port} (${config.nodeEnv})`);
    console.log(`[AiDLC vs SDLC Portal] Visit http://localhost:${config.port}`);
  });
}

module.exports = app;
