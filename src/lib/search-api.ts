"use client"

import { requestWithAuth } from "./api-client"
import type {
  MatchSuggestionInvestorProfile,
  MatchSuggestionCompanyProfile,
  MatchSuggestionBrokerProfile,
} from "./matchmaking-api"

// ─── Filter shape ─────────────────────────────────────────────────────────────

export type SearchRoleType = "investor" | "company" | "broker"
export type SearchInvestorType =
  | "individual"
  | "institutional"
  | "venture_capital"
  | "angel"
  | "private_equity"
export type SearchFundingStage =
  | "idea"
  | "mvp"
  | "pre_seed"
  | "seed"
  | "pre_revenue"
  | "series_a"
  | "series_b"
  | "series_c"
  | "revenue_generating"
  | "growth"
  | "mature"
  | "ipo"
export type SearchFundingStatus = "not_seeking" | "seeking" | "funded"
export type SearchSortBy =
  | "relevance"
  | "newest"
  | "completionScore"
  | "investmentSize"
  | "revenue"
  | "distance"

export type SearchFilters = {
  // Text search
  query?: string

  // Core preference filters (same as MatchProfile drawer)
  maxDistance?: number
  roleTypes?: SearchRoleType[]
  verifiedOnly?: boolean
  investorTypes?: SearchInvestorType[]
  industries?: string[]
  fundingStages?: SearchFundingStage[]
  fundingStatuses?: SearchFundingStatus[]

  // Location
  country?: string
  state?: string
  city?: string

  // Investment size
  investmentSizeMin?: number
  investmentSizeMax?: number

  // Premium: geospatial
  latitude?: number
  longitude?: number
  radiusKm?: number
  postalCode?: string

  // Premium: financial
  netWorthMin?: number
  netWorthMax?: number
  creditScoreMin?: number
  creditScoreMax?: number
  annualRevenueMin?: number
  annualRevenueMax?: number
  profitMarginMin?: number
  profitMarginMax?: number

  // Sorting
  sortBy?: SearchSortBy
}

export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  verifiedOnly: false,
  roleTypes: [],
  investorTypes: [],
  industries: [],
  fundingStages: [],
  fundingStatuses: [],
  sortBy: "relevance",
}

// ─── Response shape ───────────────────────────────────────────────────────────
// Each item represents a matched profile enriched with match metadata.

export type SearchProfileResult = {
  userId: string
  profile: {
    firstName: string | null
    lastName: string | null
    displayName: string
    roleType: SearchRoleType
    userTypeLabel: string
    profileTypeLabel: string
    profilePhoto: string | null
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
  // Match metadata (only present when searching matched profiles)
  matchId: string | null
  conversationId: string | null
  matchedAt: string | null
  status: string
  canChat: boolean
  canCall: boolean
  isOnline: boolean
  lastActive: string | null
  // Scoring
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

export type SearchSummary = {
  totalMatches: number
  verifiedMatches: number
  activeMatches: number
}

export type SearchResponse = {
  profiles: SearchProfileResult[]
  pagination: {
    total: number
    filtered: number
    limit: number
    offset: number
    hasMore: boolean
  }
  filters: {
    applied: Record<string, unknown>
    premium: boolean
    premiumFiltersUsed: boolean
  }
  summary: SearchSummary
}

// ─── API helpers ──────────────────────────────────────────────────────────────

function buildSearchQueryString(
  filters: SearchFilters,
  limit: number,
  offset: number,
): string {
  const params = new URLSearchParams()

  if (filters.query) params.set("query", filters.query)
  if (typeof filters.maxDistance === "number") params.set("maxDistance", String(filters.maxDistance))
  if (filters.verifiedOnly) params.set("verifiedOnly", "true")
  if (filters.country) params.set("country", filters.country)
  if (filters.state) params.set("state", filters.state)
  if (filters.city) params.set("city", filters.city)
  if (filters.postalCode) params.set("postalCode", filters.postalCode)
  if (typeof filters.latitude === "number") params.set("latitude", String(filters.latitude))
  if (typeof filters.longitude === "number") params.set("longitude", String(filters.longitude))
  if (typeof filters.radiusKm === "number") params.set("radiusKm", String(filters.radiusKm))
  if (typeof filters.investmentSizeMin === "number") params.set("investmentSizeMin", String(filters.investmentSizeMin))
  if (typeof filters.investmentSizeMax === "number") params.set("investmentSizeMax", String(filters.investmentSizeMax))
  if (typeof filters.netWorthMin === "number") params.set("netWorthMin", String(filters.netWorthMin))
  if (typeof filters.netWorthMax === "number") params.set("netWorthMax", String(filters.netWorthMax))
  if (typeof filters.creditScoreMin === "number") params.set("creditScoreMin", String(filters.creditScoreMin))
  if (typeof filters.creditScoreMax === "number") params.set("creditScoreMax", String(filters.creditScoreMax))
  if (typeof filters.annualRevenueMin === "number") params.set("annualRevenueMin", String(filters.annualRevenueMin))
  if (typeof filters.annualRevenueMax === "number") params.set("annualRevenueMax", String(filters.annualRevenueMax))
  if (typeof filters.profitMarginMin === "number") params.set("profitMarginMin", String(filters.profitMarginMin))
  if (typeof filters.profitMarginMax === "number") params.set("profitMarginMax", String(filters.profitMarginMax))
  if (filters.sortBy) params.set("sortBy", filters.sortBy)

  for (const role of filters.roleTypes ?? []) params.append("roleTypes", role)
  for (const type of filters.investorTypes ?? []) params.append("investorTypes", type)
  for (const ind of filters.industries ?? []) params.append("industries", ind)
  for (const stage of filters.fundingStages ?? []) params.append("fundingStages", stage)
  for (const status of filters.fundingStatuses ?? []) params.append("fundingStatuses", status)

  params.set("limit", String(limit))
  params.set("offset", String(offset))

  return params.toString()
}

export async function searchProfilesApi(
  filters: SearchFilters = {},
  limit = 100,
  offset = 0,
): Promise<SearchResponse> {
  const qs = buildSearchQueryString(filters, limit, offset)
  return requestWithAuth<SearchResponse>(`/search/profiles?${qs}`)
}
