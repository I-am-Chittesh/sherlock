const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// Hub Feed: Get all cases (powers the Pinterest-style grid and filter chips)
router.get('/', async (req, res) => {
  const { status } = req.query;
  let query = supabase.from('cases').select('id, title, status, created_at');
  
  if (status) query = query.eq('status', status.toUpperCase());
  
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
});

// Create New Case (Triggered by the taskbar "+")
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  const { data, error } = await supabase
    .from('cases')
    .insert([{ title, description }])
    .select();
    
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// War Room Payload: Fetch Case + All Linked Evidence + All Hypotheses in one shot
router.get('/:id/war-room', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('cases')
    .select(`
      *,
      evidence (*),
      hypotheses (*)
    `)
    .eq('id', id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
});

module.exports = router;