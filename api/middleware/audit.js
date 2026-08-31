const supabase = require('../supabase');

const auditLogger = async (req, res, next) => {
  // Only log mutations, ignore standard GET read requests
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    // We pass the role via headers from the frontend to bypass complex auth
    const role = req.headers['x-user-role'] || 'UNKNOWN';
    const action = `${req.method} executed on ${req.originalUrl}`;
    const targetId = req.params.id || req.body.id || null;

    const { error } = await supabase
      .from('audit_logs')
      .insert([{ role, action, target_id: targetId }]);

    if (error) console.error('[AUDIT ERROR]', error.message);
  }
  next();
};

module.exports = auditLogger;