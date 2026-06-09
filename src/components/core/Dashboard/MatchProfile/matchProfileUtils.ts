import { CloseRounded, HandshakeRounded, StarRounded } from "@mui/icons-material"
import React from "react"
import { ApiError } from "@/lib/auth-api"
import type { SwipeDecision, SwipeLimitState } from "./matchProfileTypes"

export const SWIPE_THRESHOLD = 110
export const PREVIEW_THRESHOLD = 48
export const MAX_DRAG_DISTANCE = 190
export const ANIMATION_DURATION = 280
export const SUGGESTION_PAGE_SIZE = 12
export const VISIBLE_IMAGE_WINDOW = 4

export const ACTION_META: Record<
  SwipeDecision,
  { label: string; helper: string; icon: React.ReactNode }
> = {
  pass: {
    label: "Pass",
    helper: "Not the right fit right now",
    icon: React.createElement(CloseRounded, { fontSize: "large" }),
  },
  save: {
    label: "Shortlist",
    helper: "Keep this profile for later review",
    icon: React.createElement(StarRounded, { fontSize: "large" }),
  },
  like: {
    label: "Connect",
    helper: "Strong fit worth a conversation",
    icon: React.createElement(HandshakeRounded, { fontSize: "large" }),
  },
}

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

export const appendUnique = (items: string[], value: string) =>
  items.includes(value) ? items : [...items, value]

export const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

export const isLocalAssetUrl = (value?: string | null) => {
  if (!value) return false
  return value.startsWith("/") || value.startsWith("blob:")
}

export const isRemoteImageUrl = (value?: string | null) => {
  if (!value) return false
  if (value.length > 4096) return false
  return /^(https?:)?\/\//.test(value)
}

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

export const getSwipeLimitState = (error: unknown): SwipeLimitState | null => {
  if (!(error instanceof ApiError) || error.status !== 429 || !isObjectRecord(error.details)) {
    return null
  }

  const message =
    typeof error.details.error === "string" && error.details.error
      ? error.details.error
      : error.message || "Daily swipe limit reached."

  const dailyLimit =
    typeof error.details.limit === "number" && Number.isFinite(error.details.limit)
      ? error.details.limit
      : null

  const current =
    typeof error.details.current === "number" && Number.isFinite(error.details.current)
      ? error.details.current
      : null

  return {
    message,
    dailyLimit,
    current,
  }
}
