console.log('SUPER-MINIMAL DEBUG: App module loaded');
import express from 'express';
const app = express();

app.get('/health', (req, res) => {
  console.log('SUPER-MINIMAL DEBUG: /health endpoint called');
  res.json({ status: 'OK', message: 'Super minimal app works!' });
});

// Export for IIS
module.exports = app; 