"use client"

import { requestWithAuth } from "./api-client"
import { ApiError } from "./auth-api"
import type { MatchSuggestion } from "./matchmaking-api"

/**
 * A parked candidate. Intentionally a superset of MatchSuggestion so the same
 * `mapSuggestionToCard` presenter that renders the deck can render the drawer
 * without a second mapper drifting out of sync with it.
 */
export type ShortlistEntry = MatchSuggestion & {
  shortlistedAt: string
}

export type ShortlistCapacity = {
  count: number
  limit: number
  remaining: number
  isFull: boolean
}

export type ShortlistPage = {
  items: ShortlistEntry[]
  total: number
  hasMore: boolean
  offset: number
  capacity: ShortlistCapacity
}

export type AddShortlistResult = {
  shortlisted: true
  /** True when the entry already existed; the call is a successful no-op. */
  alreadyShortlisted: boolean
  shortlistedAt?: string
  capacity: ShortlistCapacity
}

export type RemoveShortlistResult = {
  /** False when the entry was already gone. Still a success. */
  removed: boolean
  capacity: ShortlistCapacity
}

/** Machine-readable rejection reasons mirrored from the backend controller. */
export type ShortlistErrorCode =
  | "SHORTLIST_FULL"
  | "ALREADY_SWIPED"
  | "ALREADY_CONNECTED"
  | "CANDIDATE_UNAVAILABLE"

export type ShortlistRejection = {
  code: ShortlistErrorCode
  message: string
  capacity: ShortlistCapacity | null
}

const SHORTLIST_ERROR_CODES: ShortlistErrorCode[] = [
  "SHORTLIST_FULL",
  "ALREADY_SWIPED",
  "ALREADY_CONNECTED",
  "CANDIDATE_UNAVAILABLE",
]

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

function parseCapacity(value: unknown): ShortlistCapacity | null {
  if (!isObjectRecord(value)) return null
  if (typeof value.count !== "number" || typeof value.limit !== "number") return null

  return {
    count: value.count,
    limit: value.limit,
    remaining: typeof value.remaining === "number" ? value.remaining : 0,
    isFull: value.isFull === true,
  }
}

/**
 * Turns a shortlist rejection into structured state. Returns null for anything
 * that is not a recognised shortlist refusal, so callers fall through to their
 * generic error handling instead of mislabelling, say, a network failure as a
 * full shortlist.
 */
export function getShortlistRejection(error: unknown): ShortlistRejection | null {
  if (!(error instanceof ApiError) || !isObjectRecord(error.details)) {
    return null
  }

  const code = error.details.code
  if (typeof code !== "string" || !SHORTLIST_ERROR_CODES.includes(code as ShortlistErrorCode)) {
    return null
  }

  return {
    code: code as ShortlistErrorCode,
    message:
      typeof error.details.error === "string" && error.details.error
        ? error.details.error
        : error.message || "Could not shortlist this profile.",
    capacity: parseCapacity(error.details.capacity),
  }
}

export async function listShortlistApi(limit = 20, offset = 0) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  })

  return requestWithAuth<ShortlistPage>(`/matchmaking/shortlist?${params.toString()}`)
}

export async function getShortlistSummaryApi() {
  return requestWithAuth<ShortlistCapacity>("/matchmaking/shortlist/summary")
}

export async function addToShortlistApi(profileUserId: string) {
  return requestWithAuth<AddShortlistResult>("/matchmaking/shortlist", {
    method: "POST",
    body: { profileUserId },
  })
}

export async function removeFromShortlistApi(profileUserId: string) {
  return requestWithAuth<RemoveShortlistResult>(
    `/matchmaking/shortlist/${encodeURIComponent(profileUserId)}`,
    { method: "DELETE" },
  )
}
