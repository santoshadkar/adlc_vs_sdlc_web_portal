require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  appName: process.env.APP_NAME || 'AiDLC-vs-SDLC-Portal',
  appVersion: process.env.APP_VERSION || '1.0.0',
  enableAssessmentApi: process.env.ENABLE_ASSESSMENT_API !== 'false',
  corsOrigin: process.env.CORS_ORIGIN || '*'
};

module.exports = config;
