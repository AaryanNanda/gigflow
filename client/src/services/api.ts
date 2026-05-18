// Dynamically point to Render in production, fallback to local port in development
const BASE_URL = import.meta.env.PROD 
  ? 'https://gigflow-backend1.onrender.com/api' // 👈 Replace with your exact Render Web Service URL
  : 'http://localhost:8080/api';

// Helper to grab headers with the auth token automatically attached
const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Generic GET request handler
  async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`GET ${endpoint} failed with status ${res.status}`);
    const data: unknown = await res.json();
    return data as T; 
  },

  // Generic POST request handler
  async post<T>(endpoint: string, body: unknown): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errData = (await res.json().catch(() => ({}))) as { message?: string };
      throw new Error(errData.message || `POST ${endpoint} failed`);
    }
    const data: unknown = await res.json();
    return data as T; 
  },

  // Generic PUT request handler
  async put<T>(endpoint: string, body: unknown): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`PUT ${endpoint} failed`);
    const data: unknown = await res.json();
    return data as T;
  },

  // Generic DELETE request handler
  async delete<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`DELETE ${endpoint} failed`);
    const data: unknown = await res.json();
    return data as T;
  },
};