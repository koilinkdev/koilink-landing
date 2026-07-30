import type React from "react"
import type { MatchPreferences } from "@/lib/matchmaking-api"

export type SwipeDecision = "like" | "pass" | "save" | "super"

export type QuotaType = "swipes" | "superLikes"

export type SwipeLimitState = {
  message: string
  dailyLimit: number | null
  current: number | null
  /** Which quota was exhausted. Running out of Super Swipes must not disable ordinary swiping. */
  quotaType: QuotaType
  /** True when the plan has none of this quota at all, rather than today's being spent. */
  upgradeRequired: boolean
  resetsAt: string | null
}

export type SuperLikeQuota = {
  used: number
  limit: number
  remaining: number | "unlimited"
  /** False when the plan includes no Super Swipes at all - show a paywall, not a countdown. */
  available: boolean
}

export type MatchedConversation = {
  conversationId: string
  displayName: string
} | null

export type HeaderStat = {
  label: string
  value: number
}

export type MatchFilterDrawerProps = {
  open: boolean
  activeFilterCount: number
  draftPrefs: MatchPreferences
  savedPrefs: MatchPreferences
  isSavingFilter: boolean
  isDetectingLocation: boolean
  onClose: () => void
  onDraftChange: React.Dispatch<React.SetStateAction<MatchPreferences>>
  onDetectLocation: () => void
  onSave: () => void
}
