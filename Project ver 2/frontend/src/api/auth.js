import { apiFetch } from "./api";

const TOKEN_KEY = "access_token";

export function setAccessToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function register({ email, password }) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: { email, password },
  });
}

export async function login({ email, password }) {
  const data = await apiFetch("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
  if (data?.access_token) {
    setAccessToken(data.access_token);
  }
  return data;
}

