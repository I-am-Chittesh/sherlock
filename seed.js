const supabase = require('./api/supabase');

async function seedDatabase() {
  console.log('[SYSTEM] Initiating Data Injection...');

  // 1. Create the Case
  const { data: caseData, error: caseErr } = await supabase
    .from('cases')
    .insert([{ title: 'The Cyber Heist (Demo)', description: 'Unauthorized access to the central vault servers.', status: 'OPEN' }])
    .select()
    .single();

  if (caseErr) {
    console.error('[ERROR] Failed to create case:', caseErr.message);
    process.exit(1);
  }
  
  const caseId = caseData.id;
  console.log(`[OK] Case created: ${caseId}`);

  // 2. Create Root Evidence (The Anchor Node)
  const { data: ev1, error: ev1Err } = await supabase
    .from('evidence')
    .insert([{ case_id: caseId, name: 'Encrypted Server Logs', weight: 5, status: 'VERIFIED' }])
    .select()
    .single();

  // 3. Create Child Evidence (Linked to the Root Node)
  const { data: ev2 } = await supabase
    .from('evidence')
    .insert([{ case_id: caseId, name: 'Suspicious IP 192.168.x.x', weight: 8, status: 'PENDING', parent_id: ev1.id }])
    .select()
    .single();

  const { data: ev3 } = await supabase
    .from('evidence')
    .insert([{ case_id: caseId, name: 'Altered Access Badge', weight: 10, status: 'DEBUNKED', parent_id: ev1.id }])
    .select()
    .single();

  // 4. Create Competing Hypotheses
  const { data: hyp1 } = await supabase
    .from('hypotheses')
    .insert([{ case_id: caseId, theory_name: 'Theory A: Insider Threat', score: 33 }])
    .select()
    .single();

  const { data: hyp2 } = await supabase
    .from('hypotheses')
    .insert([{ case_id: caseId, theory_name: 'Theory B: External Syndicate', score: 0 }])
    .select()
    .single();

  // 5. Map Evidence to Hypotheses
  await supabase.from('hypothesis_evidence').insert([
    { hypothesis_id: hyp1.id, evidence_id: ev1.id },
    { hypothesis_id: hyp1.id, evidence_id: ev3.id },
    { hypothesis_id: hyp2.id, evidence_id: ev1.id },
    { hypothesis_id: hyp2.id, evidence_id: ev2.id }
  ]);

  console.log('[SYSTEM] Seed Complete. Database is locked and loaded.');
  process.exit(0);
}

seedDatabase();