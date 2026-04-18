import { clearTokens, getAccessToken, getRefreshToken, getUserID, saveTokens } from "@/shared/auth/storage";

// For iOS Simulator / Android Emulator running backend locally.
// Change to your machine's LAN IP for physical device testing.
const BASE_URL = "http://localhost:4100";

type NavigateToLogin = () => void;

let navigateToLogin: NavigateToLogin | null = null;

export function setNavigateToLogin(fn: NavigateToLogin) {
  navigateToLogin = fn;
}

async function attemptTokenRefresh(): Promise<boolean> {
  try {
    const [refreshToken, userID] = await Promise.all([getRefreshToken(), getUserID()]);
    if (!refreshToken || !userID) return false;

    const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken, user_id: userID }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    await saveTokens(data.access_token, data.refresh_token, userID);
    return true;
  } catch {
    return false;
  }
}

export async function apiRequest(path: string, options: RequestInit = {}): Promise<Response> {
  const accessToken = await getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (response.status === 401) {
    const refreshed = await attemptTokenRefresh();
    if (refreshed) {
      // Retry with the new access token
      const newToken = await getAccessToken();
      headers["Authorization"] = `Bearer ${newToken}`;
      return fetch(`${BASE_URL}${path}`, { ...options, headers });
    }

    await clearTokens();
    navigateToLogin?.();
    throw new Error("SESSION_EXPIRED");
  }

  return response;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body?.error?.code ?? "UNKNOWN", body?.error?.message ?? "Login failed.");
  }

  return res.json() as Promise<{ access_token: string; refresh_token: string }>;
}

export async function register(email: string, password: string, role: string) {
  const res = await fetch(`${BASE_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body?.error?.code ?? "UNKNOWN", body?.error?.message ?? "Registration failed.");
  }

  return res.json() as Promise<{ id: string }>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function decodeJWTPayload(token: string): Record<string, unknown> {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return {};
  }
}

export function extractUserIDFromToken(token: string): string | null {
  const payload = decodeJWTPayload(token);
  return (payload.sub as string) ?? null;
}
