
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

async function handleResponse(res) {
  if (res.ok) return res.json();

  let body;
  try {
    body = await res.json();
  } catch {
    throw new Error('An unexpected error occurred');
  }

  const err = new Error(body.message || 'Request failed');
  err.status = res.status;
  err.data = body.data || null;
  throw err;
}

export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    credentials: 'include',
  });
  return handleResponse(res);
}

export async function apiJson(path, method, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}
