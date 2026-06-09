import type {
  MatchSuggestionInvestorProfile,
  MatchSuggestionCompanyProfile,
  MatchSuggestionBrokerProfile,
} from "@/lib/matchmaking-api"

export type DashboardMatchCard = {
  text: string
  subtext: string
  thisMonthdata?: {
    value: string
    timePeriod: string
    icon: {
      src: string
      alt: string
    }
  }
  image: {
    src: string
    alt: string
  }
}

export type DashboardMatchRow = {
  id: string
  name: string
  companyName: string
  address: string
  userType: string
  avatar?: string
  status?: string
  headline?: string | null
  stage?: string
  industry?: string
  investment?: number
  roleType?: string
  verified?: boolean
  verificationLevel?: number
  profileTypeLabel?: string
  investorProfile?: MatchSuggestionInvestorProfile
  companyProfile?: MatchSuggestionCompanyProfile
  brokerProfile?: MatchSuggestionBrokerProfile
  investorType?: string
  fundingStatus?: string
  city?: string
  state?: string
  country?: string
  matchedAt?: string | null
  matchScore?: number | null
  lastActive?: string | null
  isOnline?: boolean
  distance?: number | null
  bio?: string | null
  about?: string | null
  keyData?: string | null
  matchReasons?: string[]
  compatibilityFactors?: {
    roleCompatibility: boolean
    sectorMatch: number
    stageMatch: boolean
    fundingMatch: boolean
    distanceScore: number
    profileCompleteness: number
    verificationBonus: number
  }
  conversationId?: string | null
  canChat?: boolean
}
