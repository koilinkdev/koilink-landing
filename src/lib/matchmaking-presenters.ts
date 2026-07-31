import { parseKeyData, type KeyDataEntry } from "./keyData"
import type { MatchSuggestion, MatchSuggestionRoleType } from "./matchmaking-api"

export type MatchProfileCard = {
  id: string
  userId: string
  roleType: MatchSuggestionRoleType
  name: string
  age: number | null
  image: string
  /** Ordered photo gallery (cover first). Always has at least one entry. */
  images: string[]
  fallbackImage: string
  verified: boolean
  profileType: "Investor" | "Company" | "Broker"
  userTypeLabel: string
  profileSubtypeLabel: string
  title: string
  company: string
  location: string
  stage: string
  capital: string
  fitScore: number
  highlight: string
  thesis: string
  tags: string[]
  reasons: string[]
  about: string | null
  aboutLines: string[]
  keyDataItems: KeyDataEntry[]
  /** Cleaned location string safe to drop into a map query, or null when not shared. */
  mapQuery: string | null
  hasLocation: boolean
}

const LOCATION_NOT_SHARED = "Location not shared"

/**
 * Backends frequently concatenate city/state/country and end up repeating the
 * country ("Kolkata, West Bengal, India, India"). Split on commas, trim, and
 * drop case-insensitive duplicate segments while preserving order.
 */
function cleanLocation(value?: string | null): string {
  if (!value) return ""

  const seen = new Set<string>()
  const parts: string[] = []

  for (const rawPart of value.split(",")) {
    const part = rawPart.trim()
    if (!part) continue

    const key = part.toLowerCase()
    if (seen.has(key)) continue

    seen.add(key)
    parts.push(part)
  }

  return parts.join(", ")
}

const DEFAULT_ROLE_IMAGE: Record<MatchProfileCard["profileType"], string> = {
  Investor: "/assets/icons/tableAvatar1.svg",
  Company: "/assets/icons/userPage-avatar.svg",
  Broker: "/assets/icons/tableAvatar2.svg",
}

function humanize(value?: string | null) {
  if (!value) return ""

  return value
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function splitProfileText(value?: string | null) {
  return (value || "")
    .split(/\r?\n+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function formatCurrency(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
    return null
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: value >= 1000000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value)
}

function mapRoleType(roleType: MatchSuggestion["profile"]["roleType"]): MatchProfileCard["profileType"] {
  if (roleType === "investor") return "Investor"
  if (roleType === "broker") return "Broker"
  return "Company"
}

function buildCapitalLabel(suggestion: MatchSuggestion) {
  if (suggestion.profile.roleType === "investor") {
    const range = suggestion.profile.investorProfile?.investmentRange
    const minLabel = formatCurrency(range?.min)
    const maxLabel = formatCurrency(range?.max)
    if (minLabel && maxLabel) {
      return `${minLabel} to ${maxLabel}`
    }
    if (maxLabel) {
      return `Up to ${maxLabel}`
    }
    return "Open investment range"
  }

  if (suggestion.profile.roleType === "company") {
    const fundingAmount = formatCurrency(suggestion.profile.companyProfile?.fundingAmount)
    if (fundingAmount) {
      return `${fundingAmount} target`
    }
    return suggestion.profile.companyProfile?.fundingStatus
      ? humanize(suggestion.profile.companyProfile.fundingStatus)
      : "Open to funding"
  }

  const dealsCompleted = suggestion.profile.brokerProfile?.dealsCompleted
  if (typeof dealsCompleted === "number" && dealsCompleted > 0) {
    return `${dealsCompleted}+ deals completed`
  }

  return "Open to strategic introductions"
}

export function mapSuggestionToCard(suggestion: MatchSuggestion): MatchProfileCard {
  const profileType = mapRoleType(suggestion.profile.roleType)
  const defaultImage = DEFAULT_ROLE_IMAGE[profileType]

  // Build the ordered photo set: gallery first, else the legacy single photo, else a role default.
  const gallery = Array.isArray(suggestion.profile.galleryPhotos)
    ? suggestion.profile.galleryPhotos.filter(
        (url): url is string => typeof url === "string" && url.trim().length > 0,
      )
    : []
  const images =
    gallery.length > 0
      ? gallery
      : suggestion.profile.profilePhoto
        ? [suggestion.profile.profilePhoto]
        : [defaultImage]
  const userTypeLabel = suggestion.profile.userTypeLabel || profileType
  const profileSubtypeLabel =
    suggestion.profile.profileTypeLabel ||
    (suggestion.profile.roleType === "investor"
      ? humanize(suggestion.profile.investorProfile?.investorType) || userTypeLabel
      : suggestion.profile.roleType === "broker"
        ? humanize(suggestion.profile.brokerProfile?.brokerType) || userTypeLabel
        : humanize(suggestion.profile.companyProfile?.companyStage) || userTypeLabel)

  const company =
    suggestion.profile.companyName ||
    suggestion.profile.companyProfile?.companyName ||
    suggestion.profile.brokerProfile?.firmName ||
    (profileType === "Investor"
      ? "Investor profile"
      : profileType === "Broker"
        ? "Broker profile"
        : "Company profile")

  const stage =
    suggestion.profile.companyProfile?.companyStage ||
    suggestion.profile.investorProfile?.preferredStages?.[0] ||
    suggestion.profile.brokerProfile?.brokerType ||
    "Open to connect"

  const industry =
    suggestion.profile.companyProfile?.industry ||
    suggestion.profile.investorProfile?.preferredIndustries?.[0] ||
    suggestion.profile.brokerProfile?.specializations?.[0] ||
    profileType

  const tags = Array.from(
    new Set(
      [
        profileType,
        industry,
        suggestion.profile.companyProfile?.sector,
        suggestion.profile.companyProfile?.companyStage,
      ]
        .filter(Boolean)
        .map((value) => humanize(String(value))),
    ),
  ).slice(0, 4)

  const location =
    cleanLocation(
      suggestion.profile.completeLocation || suggestion.profile.locationLabel,
    ) || LOCATION_NOT_SHARED
  const hasLocation = location !== LOCATION_NOT_SHARED

  const about = suggestion.profile.about || suggestion.profile.bio || null
  const highlight =
    about ||
    suggestion.matchReasons.join(" | ") ||
    "Promising profile ready for a thoughtful business conversation."

  const reasons = (
    suggestion.matchReasons.length > 0
      ? suggestion.matchReasons
      : [
          suggestion.compatibilityFactors.roleCompatibility
            ? "Role compatibility aligns with your account type."
            : "Profile is in your broader suggestion pool.",
          suggestion.compatibilityFactors.sectorMatch > 0
            ? "Sector preferences overlap."
            : "Worth exploring based on broader business fit.",
        ]
  ).map((reason) => cleanLocation(reason) || reason)

  return {
    id: suggestion.userId,
    userId: suggestion.userId,
    roleType: suggestion.profile.roleType,
    name: suggestion.profile.displayName,
    age: null,
    image: images[0],
    images,
    fallbackImage: defaultImage,
    verified: suggestion.profile.isVerified,
    profileType,
    userTypeLabel,
    profileSubtypeLabel,
    title: suggestion.profile.headline || `${profileSubtypeLabel} ${userTypeLabel}`.trim(),
    company,
    location,
    mapQuery: hasLocation ? location : null,
    hasLocation,
    stage: humanize(String(stage)),
    capital: buildCapitalLabel(suggestion),
    fitScore: suggestion.matchScore,
    highlight,
    thesis: reasons.join(" "),
    tags,
    reasons,
    about,
    aboutLines: splitProfileText(about),
    keyDataItems: parseKeyData(suggestion.profile.keyData),
  }
}

export function formatMatchProfileTitle(profile: MatchProfileCard) {
  return profile.age ? `${profile.name}, ${profile.age}` : profile.name
}
