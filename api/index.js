const express = require('express');
const cors = require('cors');
require('dotenv').config();

const supabase = require('./supabase');

const app = express();
const PORT = process.env.PORT || 3000;

// Core Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/api/health', async (req, res) => {
  try {
    const { data, error } = await supabase.from('cases').select('count', { count: 'exact', head: true });
    if (error) throw error;
    res.status(200).json({ status: 'Sherlock Engine Online', database: 'Connected' });
  } catch (err) {
    res.status(500).json({ status: 'Degraded', error: err.message });
  }
});

// Start local listener if not running in a serverless cloud environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`[SYSTEM] Sherlock Engine running on http://localhost:${PORT}`);
  });
}

module.exports = app;