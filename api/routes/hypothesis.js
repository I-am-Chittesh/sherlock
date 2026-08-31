const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// Create Hypothesis Theory
router.post('/', async (req, res) => {
  const { case_id, theory_name } = req.body;
  const { data, error } = await supabase
    .from('hypotheses')
    .insert([{ case_id, theory_name, score: 0.0 }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

module.exports = router;