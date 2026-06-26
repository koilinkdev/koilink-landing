"use client"

import type { ChatConversation } from "./chat-api"
import { requestWithAuth } from "./api-client"

export type SwipeDirection = "left" | "right" | "super"
export type MatchSuggestionRoleType = "investor" | "company" | "broker"

export type MatchSuggestionInvestorProfile = {
  investorType?: string | null
  preferredIndustries?: string[] | null
  preferredStages?: string[] | null
  investmentRange?: {
    min?: number | null
    max?: number | null
  } | null
}

export type MatchSuggestionCompanyProfile = {
  companyName?: string | null
  companyStage?: string | null
  industry?: string | null
  sector?: string | null
  fundingAmount?: number | null
  fundingStatus?: string | null
}

export type MatchSuggestionBrokerProfile = {
  firmName?: string | null
  brokerType?: string | null
  specializations?: string[] | null
  dealsCompleted?: number | null
}

export type MatchParticipantSummary = {
  userId: string
  firstName: string | null
  lastName: string | null
  displayName: string
  profilePhoto: string | null
  roleType: string
  userTypeLabel: string
  profileTypeLabel: string
  bio: string | null
  about: string | null
  keyData: string | null
  city: string | null
  state: string | null
  country: string | null
  completeLocation: string
  companyName: string | null
  headline: string
  locationLabel: string
  isVerified: boolean
  verificationLevel: number
  isOnline: boolean
  lastActive: string | null
  stage: string | null
  industry: string | null
  fundingAmount: number | null
  fundingStatus: string | null
  investorProfile?: MatchSuggestionInvestorProfile
  companyProfile?: MatchSuggestionCompanyProfile
  brokerProfile?: MatchSuggestionBrokerProfile
}

export type MatchSummary = {
  matchId: string
  conversationId: string | null
  matchedAt: string
  matchScore: number | null
  status: "active" | "unmatched" | "blocked" | "expired"
  canChat: boolean
  canCall: boolean
  user: MatchParticipantSummary | null
  conversation: ChatConversation | null
}

export type MatchRealtimeEvent = {
  isNewMatch: boolean
  match: MatchSummary
  conversation: ChatConversation | null
}

export type MatchSuggestion = {
  userId: string
  profile: MatchSuggestionProfile
  distance: number | null
  matchScore: number
  compatibilityFactors: {
    roleCompatibility: boolean
    sectorMatch: number
    stageMatch: boolean
    fundingMatch: boolean
    distanceScore: number
    profileCompleteness: number
    verificationBonus: number
  }
  matchReasons: string[]
}

export type MatchSuggestionProfile = {
    firstName: string | null
    lastName: string | null
    displayName: string
    roleType: MatchSuggestionRoleType
    userTypeLabel: string
    profileTypeLabel: string
    profilePhoto: string | null
    galleryPhotos?: string[] | null
    bio: string | null
    about: string | null
    keyData: string | null
    city: string | null
    state: string | null
    country: string | null
    completeLocation: string
    isVerified: boolean
    verificationLevel: number
    companyName?: string | null
    headline?: string
    locationLabel?: string
    investorProfile?: MatchSuggestionInvestorProfile
    companyProfile?: MatchSuggestionCompanyProfile
    brokerProfile?: MatchSuggestionBrokerProfile
}

type SuggestionsResponse = {
  suggestions: MatchSuggestion[]
  hasMore: boolean
  offset: number
}

type MatchesResponse = {
  matches: MatchSummary[]
  summary: {
    totalMatches: number
    verifiedMatches: number
    activeMatches: number
  }
  hasMore: boolean
  offset: number
}

export type SwipeResponse = {
  swipe: {
    id: string
    direction: SwipeDirection
    swipedAt: string
  }
  match: (MatchSummary & { isNewMatch: boolean }) | null
  limits: {
    swipesRemaining: number | "unlimited"
    dailyLimit: number
  }
}

export async function getMatchSuggestionsApi(limit = 12, offset = 0) {
  return requestWithAuth<SuggestionsResponse>(
    `/matchmaking/suggestions?limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(offset)}`,
  )
}

export async function swipeProfileApi(swipedUserId: string, direction: SwipeDirection) {
  return requestWithAuth<SwipeResponse>("/matchmaking/swipe", {
    method: "POST",
    body: {
      swipedUserId,
      direction,
    },
  })
}

export async function listMatchesApi(
  status: MatchSummary["status"] = "active",
  limit = 100,
  offset = 0,
) {
  return requestWithAuth<MatchesResponse>(
    `/matchmaking/matches?status=${encodeURIComponent(status)}&limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(offset)}`,
  )
}

export async function getMatchDetailsApi(matchId: string) {
  return requestWithAuth<MatchSummary>(`/matchmaking/match/${matchId}`)
}

export type UndoSwipeResponse = {
  undoneSwipeId: string
  undoneSwipedUserId: string
  unmatchedMatchId: string | null
  rewinds: {
    used: number
    limit: number | -1
    remaining: number | "unlimited"
  }
}

export async function undoSwipeApi() {
  return requestWithAuth<UndoSwipeResponse>("/matchmaking/undo", { method: "POST" })
}

export type MatchPreferences = {
  maxDistance: number
  roleTypes: string[]
  verifiedOnly: boolean
  investorTypes: string[]
  industries: string[]
  fundingStages: string[]
  fundingStatuses: string[]
}

export const DEFAULT_MATCH_PREFERENCES: MatchPreferences = {
  maxDistance: 500,
  roleTypes: [],
  verifiedOnly: false,
  investorTypes: [],
  industries: [],
  fundingStages: [],
  fundingStatuses: [],
}

export async function getMatchPreferencesApi() {
  return requestWithAuth<MatchPreferences>("/matchmaking/preferences")
}

export async function updateMatchPreferencesApi(prefs: MatchPreferences) {
  return requestWithAuth<MatchPreferences>("/matchmaking/preferences", {
    method: "POST",
    body: prefs,
  })
}
