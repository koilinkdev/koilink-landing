"use client"

import { API_BASE_URL, ApiError } from "./auth-api"
import { getAccessToken } from "./auth-session"

export type ApiEnvelope<T> = {
  success?: boolean
  data?: T
  error?: string
  message?: string
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

type AuthenticatedRequestOptions = {
  method?: HttpMethod
  body?: unknown
  keepalive?: boolean
  expectEnvelope?: boolean
}

function extractErrorMessage(data: ApiEnvelope<unknown> | Record<string, unknown> | null) {
  if (typeof data?.error === "string" && data.error) {
    return data.error
  }

  if (typeof data?.message === "string" && data.message) {
    return data.message
  }

  return "Request failed"
}

export function getRequiredAccessToken() {
  const token = getAccessToken()
  if (!token) {
    throw new ApiError(401, "Unauthorized")
  }

  return token
}

export async function requestWithAuth<T>(
  path: string,
  options: AuthenticatedRequestOptions = {},
) {
  const token = getRequiredAccessToken()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    keepalive: options.keepalive,
  })

  const data = (await response.json().catch(() => null)) as
    | ApiEnvelope<T>
    | Record<string, unknown>
    | null

  if (!response.ok) {
    throw new ApiError(response.status, extractErrorMessage(data), data)
  }

  if (options.expectEnvelope === false) {
    return (data ?? {}) as T
  }

  const envelope = data as ApiEnvelope<T> | null
  if (envelope?.data === undefined) {
    throw new ApiError(response.status, "Missing response data", data)
  }

  return envelope.data
}
