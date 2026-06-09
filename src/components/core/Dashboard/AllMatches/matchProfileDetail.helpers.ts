"use client"

import type { MatchSummary } from "@/lib/matchmaking-api"
import type { SearchProfileResult } from "@/lib/search-api"
import type { DashboardMatchRow } from "./allMatches.types"

export const DEFAULT_MATCH_PROFILE_AVATAR = "/assets/images/profile-avatar.svg"

export function isDirectProfileAssetUrl(value?: string | null) {
  if (!value) return false

  return (
    value.startsWith("/") ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  )
}

export function getNameInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function humanize(value?: string | null) {
  if (!value) return ""

  return value
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function normalizeInvestmentAmount(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
    return undefined
  }

  return value
}

function buildCompanyOrFirmLabel(values: Array<string | null | undefined>) {
  return values.find((value) => typeof value === "string" && value.trim()) || "Business connection"
}

function buildLocationLabel(values: Array<string | null | undefined>) {
  return values.find((value) => typeof value === "string" && value.trim()) || "Location not shared"
}

export function buildDashboardMatchRowFromSearchResult(
  result: SearchProfileResult,
  options?: { avatarUrl?: string | null },
): DashboardMatchRow {
  const directAvatar = result.profile.profilePhoto
  const avatar =
    options?.avatarUrl ||
    (isDirectProfileAssetUrl(directAvatar) ? directAvatar || undefined : undefined) ||
    DEFAULT_MATCH_PROFILE_AVATAR

  return {
    id: result.matchId
      ? `#${result.matchId.slice(-6).toUpperCase()}`
      : `#${result.userId.slice(-6).toUpperCase()}`,
    name: result.profile.displayName || "Unknown user",
    companyName: buildCompanyOrFirmLabel([
      result.profile.companyName,
      result.profile.companyProfile?.companyName,
      result.profile.brokerProfile?.firmName,
      result.profile.headline,
    ]),
    address: buildLocationLabel([
      result.profile.locationLabel,
      result.profile.completeLocation,
    ]),
    userType: result.profile.userTypeLabel || humanize(result.profile.roleType) || "Connection",
    avatar,
    status: result.isOnline ? "Active" : "Inactive",
    headline: result.profile.headline || null,
    stage: result.profile.companyProfile?.companyStage || undefined,
    industry: result.profile.companyProfile?.industry || undefined,
    investment: normalizeInvestmentAmount(result.profile.companyProfile?.fundingAmount),
    roleType: result.profile.roleType,
    verified: result.profile.isVerified,
    verificationLevel: result.profile.verificationLevel,
    profileTypeLabel: result.profile.profileTypeLabel || undefined,
    investorProfile: result.profile.investorProfile,
    investorType: result.profile.investorProfile?.investorType || undefined,
    fundingStatus: result.profile.companyProfile?.fundingStatus || undefined,
    city: result.profile.city || undefined,
    state: result.profile.state || undefined,
    country: result.profile.country || undefined,
    matchedAt: result.matchedAt || undefined,
    matchScore: result.matchScore,
    lastActive: result.lastActive,
    isOnline: result.isOnline,
    distance: result.distance,
    bio: result.profile.bio || null,
    about: result.profile.about || result.profile.bio || null,
    keyData: result.profile.keyData || null,
    matchReasons: result.matchReasons,
    compatibilityFactors: result.compatibilityFactors,
    companyProfile: result.profile.companyProfile,
    brokerProfile: result.profile.brokerProfile,
    conversationId: result.conversationId,
    canChat: result.canChat,
  }
}

export function buildDashboardMatchRowFromMatchSummary(
  match: MatchSummary,
  options?: { avatarUrl?: string | null },
): DashboardMatchRow | null {
  const profile = match.user

  if (!profile) {
    return null
  }

  const directAvatar = profile.profilePhoto
  const avatar =
    options?.avatarUrl ||
    (isDirectProfileAssetUrl(directAvatar) ? directAvatar || undefined : undefined) ||
    DEFAULT_MATCH_PROFILE_AVATAR

  return {
    id: `#${match.matchId.slice(-6).toUpperCase()}`,
    name: profile.displayName || "Unknown user",
    companyName: buildCompanyOrFirmLabel([
      profile.companyName,
      profile.companyProfile?.companyName,
      profile.brokerProfile?.firmName,
      profile.headline,
    ]),
    address: buildLocationLabel([
      profile.locationLabel,
      profile.completeLocation,
      [profile.city, profile.state, profile.country].filter(Boolean).join(", "),
    ]),
    userType: profile.userTypeLabel || humanize(profile.roleType) || "Connection",
    avatar,
    status: profile.isOnline ? "Active" : "Inactive",
    headline: profile.headline || null,
    stage: profile.companyProfile?.companyStage || profile.stage || undefined,
    industry: profile.companyProfile?.industry || profile.industry || undefined,
    investment: normalizeInvestmentAmount(
      profile.companyProfile?.fundingAmount ?? profile.fundingAmount,
    ),
    roleType: profile.roleType,
    verified: profile.isVerified,
    verificationLevel: profile.verificationLevel,
    profileTypeLabel: profile.profileTypeLabel || undefined,
    investorProfile: profile.investorProfile,
    companyProfile: profile.companyProfile,
    brokerProfile: profile.brokerProfile,
    investorType: profile.investorProfile?.investorType || undefined,
    fundingStatus: profile.companyProfile?.fundingStatus || profile.fundingStatus || undefined,
    city: profile.city || undefined,
    state: profile.state || undefined,
    country: profile.country || undefined,
    matchedAt: match.matchedAt || undefined,
    matchScore: match.matchScore,
    lastActive: profile.lastActive,
    isOnline: profile.isOnline,
    bio: profile.bio || null,
    about: profile.about || profile.bio || null,
    keyData: profile.keyData || null,
    conversationId: match.conversationId,
    canChat: match.canChat,
  }
}
