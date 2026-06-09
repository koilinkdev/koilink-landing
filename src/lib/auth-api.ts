"use client";

import type { AuthRole, AuthSession } from "./auth-session";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:4000/api/v1";

class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  token?: string;
};

function flattenValidationMessages(value: unknown): string[] {
  if (!value || typeof value !== "object") {
    return [];
  }

  const nextMessages: string[] = [];
  const recordValue = value as Record<string, unknown>;

  const formErrors = recordValue.formErrors;
  if (Array.isArray(formErrors)) {
    nextMessages.push(
      ...formErrors.filter((item): item is string => typeof item === "string" && item.trim().length > 0),
    );
  }

  const fieldErrors = recordValue.fieldErrors;
  if (fieldErrors && typeof fieldErrors === "object") {
    for (const messages of Object.values(fieldErrors as Record<string, unknown>)) {
      if (Array.isArray(messages)) {
        nextMessages.push(
          ...messages.filter((item): item is string => typeof item === "string" && item.trim().length > 0),
        );
      }
    }
  }

  return nextMessages;
}

function extractErrorMessage(data: Record<string, unknown> | null) {
  if (typeof data?.error === "string" && data.error) {
    return data.error;
  }

  if (typeof data?.message === "string" && data.message) {
    return data.message;
  }

  const validationMessages = flattenValidationMessages(data?.error);
  if (validationMessages.length > 0) {
    return validationMessages[0];
  }

  return "Request failed";
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = (await response.json().catch(() => null)) as
    | Record<string, unknown>
    | null;

  if (!response.ok) {
    const message = extractErrorMessage(data);
    throw new ApiError(response.status, message, data);
  }

  return (data ?? {}) as T;
}

type AuthResponse = {
  user: AuthSession["user"];
  tokens: AuthSession["tokens"];
  message?: string;
  devOtp?: string;
};

type VerifyOtpResponse = {
  ok: boolean;
  message?: string;
  user?: AuthSession["user"];
  tokens?: AuthSession["tokens"];
};

type RegisterResponse = {
  message?: string;
  devOtp?: string;
  pendingRegistration?: {
    email?: string;
    phone?: string;
    role: AuthRole;
    expiresAt: string;
  };
};

type ForgotPasswordResponse = {
  message: string;
  channel: "email" | "sms";
  target?: string;
  devOtp?: string;
};

type VerifyResetOtpResponse = {
  ok: boolean;
  resetToken: string;
  message: string;
};

type RefreshResponse = {
  access: string;
};

export async function registerApi(payload: {
  email?: string;
  phone?: string;
  password: string;
  role?: AuthRole;
}) {
  return request<RegisterResponse>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export async function verifyRegistrationOtpApi(payload: {
  email?: string;
  phone?: string;
  code: string;
}) {
  return request<VerifyOtpResponse>("/auth/verify-otp", {
    method: "POST",
    body: payload,
  });
}

export async function resendOtpApi(payload: {
  email?: string;
  phone?: string;
  purpose: "registration" | "reset-password";
}) {
  return request<ForgotPasswordResponse>("/auth/resend-otp", {
    method: "POST",
    body: payload,
  });
}

export async function loginApi(payload: { identifier: string; password: string }) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export async function forgotPasswordApi(payload: {
  email?: string;
  phone?: string;
  channel: "email" | "sms";
}) {
  return request<ForgotPasswordResponse>("/auth/password/forgot", {
    method: "POST",
    body: payload,
  });
}

export async function verifyResetOtpApi(payload: {
  email?: string;
  phone?: string;
  channel: "email" | "sms";
  code: string;
}) {
  return request<VerifyResetOtpResponse>("/auth/password/verify-otp", {
    method: "POST",
    body: payload,
  });
}

export async function updatePasswordApi(
  token: string,
  payload: { currentPassword: string; newPassword: string },
) {
  return request<{ message: string }>("/auth/password/update", {
    method: "POST",
    token,
    body: payload,
  });
}

export async function refreshAccessTokenApi(refreshToken: string) {
  return request<RefreshResponse>("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
  });
}

export async function logoutApi(refreshToken: string) {
  return request<{ message: string }>("/auth/logout", {
    method: "POST",
    body: { refreshToken },
  });
}

export async function updateOnboardingRoleApi(token: string, role: Exclude<AuthRole, "admin">) {
  return request<AuthResponse>("/auth/onboarding-role", {
    method: "PATCH",
    token,
    body: { role },
  });
}

export { API_BASE_URL, ApiError };
