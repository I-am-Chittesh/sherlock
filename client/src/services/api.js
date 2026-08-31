const API_BASE = '/api';

// Helper to grab role headers for audit tracking
const getHeaders = (role) => ({
  'Content-Type': 'application/json',
  'x-user-role': role || 'INVESTIGATOR'
});

export const api = {
  // Cases
  getCases: async (status) => {
    const url = status ? `${API_BASE}/cases?status=${status}` : `${API_BASE}/cases`;
    const res = await fetch(url);
    return res.json();
  },

  createCase: async (data, role) => {
    const res = await fetch(`${API_BASE}/cases`, {
      method: 'POST',
      headers: getHeaders(role),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getWarRoom: async (caseId) => {
    const res = await fetch(`${API_BASE}/cases/${caseId}/war-room`);
    return res.json();
  },

  // Evidence & Dynamic Scoring
  createEvidence: async (data, role) => {
    const res = await fetch(`${API_BASE}/evidence`, {
      method: 'POST',
      headers: getHeaders(role),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateEvidenceStatus: async (id, status, role) => {
    const res = await fetch(`${API_BASE}/evidence/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(role),
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Hypotheses
  createHypothesis: async (data, role) => {
    const res = await fetch(`${API_BASE}/hypotheses`, {
      method: 'POST',
      headers: getHeaders(role),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Admin Overview & Audit Logs
  getAdminDashboard: async () => {
    const res = await fetch(`${API_BASE}/admin/dashboard`);
    return res.json();
  }
};