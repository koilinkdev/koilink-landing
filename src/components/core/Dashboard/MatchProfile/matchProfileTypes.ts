import type React from "react"
import type { MatchPreferences } from "@/lib/matchmaking-api"

export type SwipeDecision = "like" | "pass" | "save"

export type SwipeLimitState = {
  message: string
  dailyLimit: number | null
  current: number | null
  /** True when the plan has none of this quota at all, rather than today's being spent. */
  upgradeRequired: boolean
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
