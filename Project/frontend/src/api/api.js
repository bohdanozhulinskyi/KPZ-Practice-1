export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function apiFetch(path, { method = "GET", body, token } = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let detail = "";
    try {
      const data = await res.json();
      detail = data?.detail ? `: ${data.detail}` : "";
    } catch {
      // ignore
    }
    throw new Error(`Request failed (${res.status})${detail}`);
  }

  // Some endpoints may return empty response bodies.
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
}

