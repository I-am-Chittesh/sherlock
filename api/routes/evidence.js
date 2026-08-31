const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// Dynamic Scoring Calculation Function
async function recalculateHypothesisScores(caseId) {
  // 1. Fetch all hypotheses for this case with their linked evidence
  const { data: hypotheses, error: hypError } = await supabase
    .from('hypotheses')
    .select(`
      id,
      hypothesis_evidence (
        evidence (
          id,
          weight,
          status
        )
      )
    `)
    .eq('case_id', caseId);

  if (hypError || !hypotheses) return;

  // 2. Compute dynamic score for each hypothesis
  for (const hyp of hypotheses) {
    const linked = hyp.hypothesis_evidence || [];
    let totalPotentialWeight = 0;
    let verifiedWeight = 0;

    linked.forEach(item => {
      const ev = item.evidence;
      if (ev) {
        totalPotentialWeight += ev.weight;
        if (ev.status === 'VERIFIED') {
          verifiedWeight += ev.weight;
        }
      }
    });

    // Score is the percentage of verified weight over total linked weight
    const newScore = totalPotentialWeight > 0 
      ? Math.round((verifiedWeight / totalPotentialWeight) * 100) 
      : 0;

    // Update database
    await supabase
      .from('hypotheses')
      .update({ score: newScore })
      .eq('id', hyp.id);
  }
}

// Create New Evidence Node (Taskbar "+" on Pinboard)
router.post('/', async (req, res) => {
  const { case_id, name, weight, parent_id, hypothesis_ids } = req.body;

  // Insert evidence node
  const { data: evidence, error: evError } = await supabase
    .from('evidence')
    .insert([{ case_id, name, weight: weight || 1, parent_id: parent_id || null }])
    .select()
    .single();

  if (evError) return res.status(500).json({ error: evError.message });

  // Map to hypotheses if provided
  if (hypothesis_ids && Array.isArray(hypothesis_ids) && hypothesis_ids.length > 0) {
    const mappings = hypothesis_ids.map(hypId => ({
      hypothesis_id: hypId,
      evidence_id: evidence.id
    }));
    await supabase.from('hypothesis_evidence').insert(mappings);
    await recalculateHypothesisScores(case_id);
  }

  res.status(201).json(evidence);
});

// Update Evidence Status (Triggers scoring recalculation)
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // PENDING, VERIFIED, DEBUNKED

  const { data: evidence, error } = await supabase
    .from('evidence')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // Recalculate dynamic scores for the entire case
  await recalculateHypothesisScores(evidence.case_id);

  res.status(200).json({ message: 'Status updated and hypothesis scores recalculated', evidence });
});

module.exports = router;