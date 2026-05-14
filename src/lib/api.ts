const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dentalcareback.onrender.com';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export const api = {
  auth: {
    register: (data: { name: string; email: string; password: string }) =>
      fetchAPI('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      fetchAPI('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => fetchAPI('/api/auth/logout', { method: 'POST' }),
    me: () => fetchAPI('/api/auth/me'),
    refresh: () => fetchAPI('/api/auth/refresh', { method: 'POST' }),
  },
  treatments: {
    list: () => fetchAPI('/api/treatments'),
    listAll: () => fetchAPI('/api/treatments/all'),
    get: (id: number) => fetchAPI(`/api/treatments/${id}`),
    create: (data: { name: string; description: string; duration: number; price: number; icon: string }) =>
      fetchAPI('/api/treatments', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<{ name: string; description: string; duration: number; price: number; icon: string; available: boolean }>) =>
      fetchAPI(`/api/treatments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => fetchAPI(`/api/treatments/${id}`, { method: 'DELETE' }),
  },
  appointments: {
    list: (params?: { date?: string; status?: string }) => {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      return fetchAPI(`/api/appointments${query ? `?${query}` : ''}`);
    },
    create: (data: { date: string; time: string; treatmentId: number; dentistId?: number }) =>
      fetchAPI('/api/appointments', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: { status: string }) =>
      fetchAPI(`/api/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => fetchAPI(`/api/appointments/${id}`, { method: 'DELETE' }),
    deleteAll: () => fetchAPI('/api/appointments/all/clear', { method: 'DELETE' }),
    availability: (treatmentId: number, date: string) =>
      fetchAPI(`/api/appointments/availability/${treatmentId}/${date}`),
    assignDentist: (appointmentId: number, dentistId: number) =>
      fetchAPI(`/api/appointments/${appointmentId}/assign-dentist`, { method: 'PUT', body: JSON.stringify({ dentistId }) }),
  },
  users: {
    list: () => fetchAPI('/api/users'),
    dentists: () => fetchAPI('/api/users/dentists'),
    create: (data: { name: string; email: string; password: string; role: 'USER' | 'DENTIST' }) =>
      fetchAPI('/api/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: { name: string; role: string }) =>
      fetchAPI(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => fetchAPI(`/api/users/${id}`, { method: 'DELETE' }),
    getMyTreatments: () => fetchAPI('/api/users/me/treatments'),
    setMyTreatments: (treatmentIds: number[]) =>
      fetchAPI('/api/users/me/treatments', { method: 'PUT', body: JSON.stringify({ treatmentIds }) }),
    getDentistsByTreatment: (treatmentId: number) =>
      fetchAPI(`/api/users/dentists-by-treatment/${treatmentId}`),
  },
  stats: {
    get: () => fetchAPI('/api/stats'),
  },
};
