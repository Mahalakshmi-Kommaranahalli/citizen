const BASE_URL = '/api';

export async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP error ${response.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Grievances
  getGrievances: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/grievances${query ? `?${query}` : ''}`);
  },

  getGrievanceByToken: (token) => {
    return request(`/grievances/track/${encodeURIComponent(token)}`);
  },

  getGrievanceById: (id) => {
    return request(`/grievances/${id}`);
  },

  checkDuplicates: (payload) => {
    return request('/grievances/check-duplicates', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  lodgeGrievance: (payload) => {
    return request('/grievances', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateStatus: (id, payload) => {
    return request(`/grievances/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  addActionLog: (id, payload) => {
    return request(`/grievances/${id}/action-log`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  upvoteGrievance: (id) => {
    return request(`/grievances/${id}/upvote`, {
      method: 'POST',
    });
  },

  submitFeedback: (id, payload) => {
    return request(`/grievances/${id}/feedback`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  reopenGrievance: (id, payload) => {
    return request(`/grievances/${id}/reopen`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  reassignGrievance: (id, payload) => {
    return request(`/grievances/${id}/reassign`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Metadata
  getDepartments: () => request('/departments'),
  getWards: () => request('/wards'),
  getSlaRules: () => request('/sla-rules'),

  // Analytics & Admin
  getDashboardMetrics: () => request('/analytics/dashboard'),
  getAuditLogs: (limit = 100) => request(`/analytics/audit-logs?limit=${limit}`),
  
  getNotifications: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/notifications${query ? `?${query}` : ''}`);
  },
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'POST' }),

  timeTravel: (offsetHours) => request('/admin/time-travel', {
    method: 'POST',
    body: JSON.stringify({ offsetHours }),
  }),
  getSystemClock: () => request('/admin/system-clock'),
  runSlaAudit: () => request('/admin/run-sla-audit', { method: 'POST' }),
  resetDatabase: () => request('/admin/reset-database', { method: 'POST' }),
};

