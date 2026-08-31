const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// Admin Overview: Statistics + Immutable Audit Logs
router.get('/dashboard', async (req, res) => {
  try {
    const [casesRes, evidenceRes, usersRes, logsRes] = await Promise.all([
      supabase.from('cases').select('id', { count: 'exact', head: true }),
      supabase.from('evidence').select('id', { count: 'exact', head: true }),
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('audit_logs').select('*').order('timestamp', { ascending: false }).limit(50)
    ]);

    res.status(200).json({
      stats: {
        totalCases: casesRes.count || 0,
        totalEvidence: evidenceRes.count || 0,
        totalUsers: usersRes.count || 0
      },
      auditLogs: logsRes.data || []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;