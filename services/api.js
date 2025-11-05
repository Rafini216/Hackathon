
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Função auxiliar para fazer chamadas à API
 */
async function apiCall(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro na requisição' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}

// =============== Auth API ===============
export const authAPI = {
  async login(email, password) {
    return apiCall('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  },

  async register(name, email, password) {
    return apiCall('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    });
  },
};

// =============== Users API ===============
export const usersAPI = {
  async getAll() {
    return apiCall('/users', {
      method: 'GET',
    });
  },
};

// =============== Meetings API ===============
export const meetingsAPI = {
  async create(meetingData) {
    return apiCall('/meeting', {
      method: 'POST',
      body: meetingData,
    });
  },

  async getAll() {
    return apiCall('/meetings', {
      method: 'GET',
    });
  },

  async respond(meetingId, userId, accept) {
    return apiCall(`/meetings/respond/${meetingId}/${userId}?accept=${accept}`, {
      method: 'GET',
    });
  },
};

// =============== Groups API ===============
export const groupsAPI = {
  async create(groupData) {
    return apiCall('/groups', {
      method: 'POST',
      body: groupData,
    });
  },

  async getAll() {
    return apiCall('/groups', {
      method: 'GET',
    });
  },

  async update(groupId, groupData) {
    return apiCall(`/groups/${groupId}`, {
      method: 'PUT',
      body: groupData,
    });
  },

  async delete(groupId) {
    return apiCall(`/groups/${groupId}`, {
      method: 'DELETE',
    });
  },
};

