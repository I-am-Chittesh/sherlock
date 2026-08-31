const express = require('express');
const cors = require('cors');
require('dotenv').config();

const supabase = require('./supabase');
const auditLogger = require('./middleware/audit');

const casesRouter = require('./routes/cases');
const evidenceRouter = require('./routes/evidence');
const hypothesisRouter = require('./routes/hypothesis');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', async (req, res) => {
  try {
    const { count, error } = await supabase.from('cases').select('*', { count: 'exact', head: true });
    if (error) throw error;
    res.status(200).json({ status: 'Sherlock Engine Online', database: 'Connected' });
  } catch (err) {
    res.status(500).json({ status: 'Degraded', error: err.message });
  }
});

// Mount Routes with Audit Middleware Attached
app.use('/api/cases', auditLogger, casesRouter);
app.use('/api/evidence', auditLogger, evidenceRouter);
app.use('/api/hypotheses', auditLogger, hypothesisRouter);
app.use('/api/admin', adminRouter);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`[SYSTEM] Sherlock Engine running on http://localhost:${PORT}`);
  });
}

module.exports = app;