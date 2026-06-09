"use client";

export type AuthRole = "investor" | "company" | "broker" | "admin";

export type AuthUser = {
  id: string;
  email?: string;
  phone?: string;
  role: AuthRole;
};

export type AuthTokens = {
  access: string;
  refresh?: string;
};

export type AuthSession = {
  user: AuthUser;
  tokens: AuthTokens;
};

const AUTH_SESSION_KEY = "koilink.auth.session";

export function saveAuthSession(session: AuthSession, persist = true) {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(session);
  if (persist) {
    window.localStorage.setItem(AUTH_SESSION_KEY, serialized);
    window.sessionStorage.removeItem(AUTH_SESSION_KEY);
    return;
  }

  window.sessionStorage.setItem(AUTH_SESSION_KEY, serialized);
  window.localStorage.removeItem(AUTH_SESSION_KEY);
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw =
    window.sessionStorage.getItem(AUTH_SESSION_KEY) ??
    window.localStorage.getItem(AUTH_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_SESSION_KEY);
  window.sessionStorage.removeItem(AUTH_SESSION_KEY);
}

export function getAccessToken() {
  return getAuthSession()?.tokens.access ?? null;
}

export function getRefreshToken() {
  return getAuthSession()?.tokens.refresh ?? null;
}

type JwtPayload = {
  exp?: number;
};

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;
    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string, skewMs = 10_000) {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  const expiryMs = payload.exp * 1000;
  return Date.now() + skewMs >= expiryMs;
}
