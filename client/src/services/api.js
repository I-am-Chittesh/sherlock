// Automatically uses the relative Vercel path in production, or localhost in development
const BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API Request Failed');
  }

  return response.json();
};

export const api = {
  getCases: (status = '') => {
    const query = status ? `?status=${status}` : '';
    return request(`/cases${query}`);
  },
  createCase: (data, role) => 
    request('/cases', { 
      method: 'POST', 
      body: JSON.stringify(data),
      headers: { 'x-user-role': role }
    }),
  getWarRoom: (caseId) => 
    request(`/cases/${caseId}/war-room`),
  createEvidence: (data, role) => 
    request('/evidence', { 
      method: 'POST', 
      body: JSON.stringify(data),
      headers: { 'x-user-role': role }
    }),
  updateEvidenceStatus: (id, status, role) => 
    request(`/evidence/${id}/status`, { 
      method: 'PUT', 
      body: JSON.stringify({ status }),
      headers: { 'x-user-role': role }
    }),
  createHypothesis: (data, role) => 
    request('/hypotheses', { 
      method: 'POST', 
      body: JSON.stringify(data),
      headers: { 'x-user-role': role }
    }),
  getAdminDashboard: () => request('/admin/dashboard')
};