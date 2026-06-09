"use client"

import React from "react"
import AllMatchesTableSec from "./AllMatchesTableSec"
import AllMatchesTopSec from "./AllMatchesTopSec"
import type { DashboardMatchCard } from "./allMatches.types"
import {
  DEFAULT_MATCH_PROFILE_AVATAR,
  buildDashboardMatchRowFromSearchResult,
  isDirectProfileAssetUrl,
} from "./matchProfileDetail.helpers"
import { getAuthSession } from "@/lib/auth-session"
import { closeChatSocket, getChatSocket } from "@/lib/chat-socket"
import { getSignedReadableImageUrl } from "@/lib/chat-api"
import {
  searchProfilesApi,
  type SearchFilters,
  type SearchProfileResult,
  DEFAULT_SEARCH_FILTERS,
} from "@/lib/search-api"

const DashboardMatchesOverview = () => {
  const session = getAuthSession()
  const token = session?.tokens.access || null

  const [results, setResults] = React.useState<SearchProfileResult[]>([])
  const [summary, setSummary] = React.useState({
    totalMatches: 0,
    verifiedMatches: 0,
    activeMatches: 0,
  })
  const [isLoading, setIsLoading] = React.useState(true)
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null)
  const [signedAvatarUrls, setSignedAvatarUrls] = React.useState<Record<string, string>>({})
  const [appliedFilters, setAppliedFilters] = React.useState<SearchFilters>({ ...DEFAULT_SEARCH_FILTERS })

  const loadMatches = React.useCallback(async (filters: SearchFilters = {}) => {
    setIsLoading(true)
    setFeedbackMessage(null)

    try {
      const data = await searchProfilesApi(filters, 100, 0)
      setResults(data.profiles)
      setSummary(data.summary)

      if (data.profiles.length === 0) {
        setFeedbackMessage("No matches yet. Start swiping to unlock conversations.")
      }
    } catch (error) {
      setFeedbackMessage(
        error instanceof Error ? error.message : "Failed to load match dashboard data.",
      )
      setResults([])
      setSummary({ totalMatches: 0, verifiedMatches: 0, activeMatches: 0 })
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    void loadMatches(appliedFilters)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadMatches])

  // Resolve signed URLs for profile photos
  React.useEffect(() => {
    const unresolvedResults = results.filter(
      (result) => {
        const photo = result.profile.profilePhoto
        const rowKey = result.matchId ?? result.userId
        return photo && !isDirectProfileAssetUrl(photo) && !signedAvatarUrls[rowKey]
      },
    )

    if (unresolvedResults.length === 0) return

    let cancelled = false

    const resolveAvatars = async () => {
      const resolvedEntries = await Promise.all(
        unresolvedResults.map(async (result) => {
          const rowKey = result.matchId ?? result.userId
          try {
            const signedUrl = await getSignedReadableImageUrl(result.profile.profilePhoto || "")
            return [rowKey, signedUrl] as const
          } catch {
            return [rowKey, DEFAULT_MATCH_PROFILE_AVATAR] as const
          }
        }),
      )

      if (cancelled) return

      setSignedAvatarUrls((previousUrls) => {
        const nextUrls = { ...previousUrls }
        for (const [key, url] of resolvedEntries) {
          nextUrls[key] = url
        }
        return nextUrls
      })
    }

    void resolveAvatars()

    return () => {
      cancelled = true
    }
  }, [results, signedAvatarUrls])

  // Listen for new matches via socket and refresh
  React.useEffect(() => {
    if (!token) return

    const socket = getChatSocket(token)
    const handleMatchEvent = () => {
      void loadMatches(appliedFilters)
    }

    socket.on("match:new", handleMatchEvent)

    return () => {
      socket.off("match:new", handleMatchEvent)
      closeChatSocket()
    }
  }, [loadMatches, token, appliedFilters])

  const handleFiltersApply = React.useCallback(
    (filters: SearchFilters) => {
      setAppliedFilters(filters)
      void loadMatches(filters)
    },
    [loadMatches],
  )

  const cards = React.useMemo<DashboardMatchCard[]>(
    () => [
      {
        text: "Total Matches",
        subtext: summary.totalMatches.toLocaleString(),
        image: {
          src: "/assets/icons/total-matches-icon.svg",
          alt: "total matches",
        },
      },
      {
        text: "Verified Matches",
        subtext: summary.verifiedMatches.toLocaleString(),
        image: {
          src: "/assets/icons/verified-icon.svg",
          alt: "verified matches",
        },
      },
      {
        text: "Active Matches",
        subtext: summary.activeMatches.toLocaleString(),
        image: {
          src: "/assets/icons/active-user-icon.svg",
          alt: "active matches",
        },
      },
    ],
    [summary],
  )

  const rows = React.useMemo(
    () =>
      results.map((result) =>
        buildDashboardMatchRowFromSearchResult(result, {
          avatarUrl: signedAvatarUrls[result.matchId ?? result.userId],
        }),
      ),
    [results, signedAvatarUrls],
  )

  return (
    <>
      <AllMatchesTopSec cards={cards} />
      <AllMatchesTableSec
        rows={rows}
        isLoading={isLoading}
        feedbackMessage={feedbackMessage}
        appliedFilters={appliedFilters}
        onFiltersApply={handleFiltersApply}
      />
    </>
  )
}

export default DashboardMatchesOverview
