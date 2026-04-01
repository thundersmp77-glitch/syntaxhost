const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function request(path, { token, method = 'GET', body, formData } = {}) {
  const headers = {};
  if (!formData) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: formData || (body ? JSON.stringify(body) : undefined)
  });

  if (!res.ok) throw new Error((await res.json()).message || 'Request failed');
  if (res.status === 204) return null;
  return res.json();
}
