import { getAuthSession } from "@/lib/auth-session"
import { parseKeyData } from "@/lib/keyData"
import { extractProfileDocuments } from "@/lib/profileDocuments"

type ProfileSection = Record<string, unknown> & {
  annualRevenue?: number
  brokerType?: string
  commissionStructure?: string
  companyName?: string
  companyStage?: string
  dealsCompleted?: number
  dealTypesHandled?: unknown
  facebookUrl?: string
  firmName?: string
  fundingAmount?: number
  industry?: string
  instagramUrl?: string
  investmentRange?: {
    min?: number
    max?: number
  }
  investorType?: string
  licenseNumber?: string
  linkedinUrl?: string
  portfolioSize?: number
  preferredIndustries?: string[]
  preferredStages?: string[]
  preRevenue?: boolean
  sector?: string
  specializations?: string[]
  teamSize?: number
  twitterUrl?: string
  useOfFunds?: string
  website?: string
}

type ProfileRecord = Record<string, unknown> & {
  about?: string
  bio?: string
  brokerProfile?: ProfileSection
  city?: string
  companyName?: string
  companyProfile?: ProfileSection
  country?: string
  dateOfBirth?: string | Date
  displayName?: string
  facebookProfile?: string
  firstName?: string
  fundingPreferences?: string
  fundingRequired?: number
  instagramProfile?: string
  investorProfile?: ProfileSection
  isVerified?: boolean
  keyData?: unknown
  lastName?: string
  linkedinProfile?: string
  roleType?: string
  state?: string
  xProfile?: string
}

export const humanize = (value?: string) => {
  if (!value) return ""
  return value
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (ch) => ch.toUpperCase())
}

const computeAge = (dateOfBirth?: string | Date) => {
  if (!dateOfBirth) return null
  const dob = new Date(dateOfBirth)
  if (Number.isNaN(dob.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - dob.getFullYear()
  const hasBirthdayPassed =
    now.getMonth() > dob.getMonth() ||
    (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate())
  if (!hasBirthdayPassed) age -= 1
  return age >= 0 ? age : null
}

const formatCurrency = (value?: number | null) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return ""
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

const toJoinedText = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean)
      .join(", ")
  }

  return typeof value === "string" ? value.trim() : ""
}

const formatDealTypes = (value: unknown) => {
  const dealTypeLabels: Record<string, string> = {
    ma: "M&A",
    vc: "VC",
    pe: "PE",
    debt: "Debt",
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? dealTypeLabels[item] || humanize(item) : ""))
      .filter(Boolean)
      .join(", ")
  }

  if (typeof value === "string" && value.trim()) {
    return dealTypeLabels[value.trim()] || humanize(value)
  }

  return ""
}

export const buildProfileDisplayData = (profile: ProfileRecord | null) => {
  const session = getAuthSession()
  const roleType = profile?.roleType ?? session?.user?.role
  const investorProfile = profile?.investorProfile ?? {}
  const companyProfile = profile?.companyProfile ?? {}
  const brokerProfile = profile?.brokerProfile ?? {}
  const age = computeAge(profile?.dateOfBirth)
  const displayName =
    profile?.displayName ||
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ").trim() ||
    (session?.user?.email ? session.user.email.split("@")[0] : "User")

  const ticketRangeLabel = (() => {
    const min = formatCurrency(investorProfile?.investmentRange?.min)
    const max = formatCurrency(investorProfile?.investmentRange?.max)
    if (min && max) return `${min} - ${max}`
    return max || min
  })()

  const roleLabel = (() => {
    if (roleType === "investor") {
      const investorType = humanize(investorProfile?.investorType)
      return investorType ? `${investorType} Investor` : "Investor"
    }
    if (roleType === "company") return "Seeking Investment"
    if (roleType === "broker") return "Broker"
    if (roleType) return humanize(roleType)
    return "Profile"
  })()

  const companyLinePrimary = (() => {
    if (roleType === "broker") {
      return brokerProfile?.firmName || profile?.companyName || "Broker Profile"
    }

    return (
      profile?.companyName ||
      companyProfile?.companyName ||
      (roleType === "investor" ? "Investment Profile" : roleType === "company" ? "Seeking Investment Profile" : "Business Profile")
    )
  })()

  const companyLineSecondary = (() => {
    if (roleType === "investor") {
      if (ticketRangeLabel) return `Ticket Size ${ticketRangeLabel}`
      if (profile?.fundingPreferences || investorProfile?.preferredStages?.[0]) {
        return `Funding Preference ${humanize(profile?.fundingPreferences || investorProfile?.preferredStages?.[0])}`
      }
      return "Open to relevant investment opportunities"
    }

    if (roleType === "company") {
      const amountSeeking = formatCurrency(companyProfile?.fundingAmount ?? profile?.fundingRequired)
      if (amountSeeking) return `Amount Seeking ${amountSeeking}`
      if (companyProfile?.companyStage) return humanize(companyProfile.companyStage)
      return "Open to investor conversations"
    }

    if (roleType === "broker") {
      const dealType = formatDealTypes(brokerProfile?.dealTypesHandled)
      if (dealType) return `${dealType} Deals`
      if (brokerProfile?.licenseNumber) return `License ${brokerProfile.licenseNumber}`
      return "Open to strategic deal flow"
    }

    return "Open for opportunities"
  })()

  const aboutItems = (() => {
    const rawAbout = typeof profile?.about === "string"
      ? profile.about
      : typeof profile?.bio === "string"
        ? profile.bio
        : ""

    return rawAbout
      .split(/\r?\n+/)
      .map((item: string) => item.trim())
      .filter(Boolean)
  })()

  const detailItems = (() => {
    if (roleType === "investor") {
      return [
        { label: "Ticket Size", value: ticketRangeLabel },
        { label: "Portfolio Size / AUM", value: formatCurrency(investorProfile?.portfolioSize) },
        { label: "Sectors of Interest", value: toJoinedText(investorProfile?.preferredIndustries) },
        { label: "Funding Preferences", value: humanize(profile?.fundingPreferences || investorProfile?.preferredStages?.[0]) },
      ].filter((item) => item.value)
    }

    if (roleType === "company") {
      return [
        { label: "Amount Seeking", value: formatCurrency(companyProfile?.fundingAmount ?? profile?.fundingRequired) },
        { label: "Business Stage", value: humanize(companyProfile?.companyStage) },
        { label: "Industry / Sector", value: companyProfile?.industry || companyProfile?.sector || "" },
        { label: "Annual Revenue", value: companyProfile?.preRevenue ? "Pre-revenue" : formatCurrency(companyProfile?.annualRevenue) },
        { label: "Team Size", value: companyProfile?.teamSize ? String(companyProfile.teamSize) : "" },
        { label: "Use of Funds", value: companyProfile?.useOfFunds || "" },
        { label: "Website URL", value: companyProfile?.website || "" },
      ].filter((item) => item.value)
    }

    if (roleType === "broker") {
      return [
        { label: "License / Registration No.", value: brokerProfile?.licenseNumber || "" },
        { label: "Deal Types Handled", value: formatDealTypes(brokerProfile?.dealTypesHandled) },
        { label: "Sectors of Interest", value: toJoinedText(brokerProfile?.specializations) },
        { label: "Commission Structure", value: brokerProfile?.commissionStructure || "" },
        { label: "Deals Closed", value: brokerProfile?.dealsCompleted ? String(brokerProfile.dealsCompleted) : "" },
      ].filter((item) => item.value)
    }

    return []
  })()

  const socialLinks = [
    { href: companyProfile?.website, socialname: "google", icon: "/assets/icons/google-icon.svg" },
    { href: profile?.xProfile || companyProfile?.twitterUrl, socialname: "x", icon: "/assets/icons/x-icon.svg" },
    { href: profile?.facebookProfile || companyProfile?.facebookUrl, socialname: "meta", icon: "/assets/icons/meta-icon.svg" },
    { href: profile?.instagramProfile, socialname: "instagram", icon: "/assets/icons/instagram-icon.svg" },
    { href: profile?.linkedinProfile || companyProfile?.linkedinUrl, socialname: "linkedin", icon: "/assets/icons/linkedin-icon.svg" },
  ].filter((item) => typeof item.href === "string" && item.href.trim().length > 0)

  return {
    roleType,
    nameWithAge: age ? `${displayName}, ${age}` : displayName,
    roleLabel,
    companyLinePrimary,
    companyLineSecondary,
    locationLinePrimary: [profile?.city, profile?.state, profile?.country].filter(Boolean).join(", ") || "Location not added",
    isVerified: Boolean(profile?.isVerified),
    keyDataItems: parseKeyData(profile?.keyData),
    documents: extractProfileDocuments(profile, profile?.roleType),
    aboutItems,
    detailItems,
    socialLinks,
  }
}
