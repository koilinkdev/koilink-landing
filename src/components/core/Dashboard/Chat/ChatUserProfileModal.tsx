"use client"

import React, { useEffect, useRef, useState } from "react"
import { Box, CircularProgress, Typography } from "@mui/material"
import MatchProfileDetailModal from "@/components/core/Dashboard/AllMatches/MatchProfileDetailModal"
import type { DashboardMatchRow } from "@/components/core/Dashboard/AllMatches/allMatches.types"
import {
  DEFAULT_MATCH_PROFILE_AVATAR,
  buildDashboardMatchRowFromMatchSummary,
  buildDashboardMatchRowFromSearchResult,
  isDirectProfileAssetUrl,
} from "@/components/core/Dashboard/AllMatches/matchProfileDetail.helpers"
import DashboardModal from "@/components/ui/Dashboard/DashboardModal"
import { getSignedReadableImageUrl } from "@/lib/chat-api"
import { getMatchDetailsApi } from "@/lib/matchmaking-api"
import { searchProfilesApi } from "@/lib/search-api"
import { common, primary } from "@/theme/palette"

type CachedRowEntry = {
  row: DashboardMatchRow
  isRich: boolean
}

interface ChatUserProfileModalProps {
  open: boolean
  matchId: string | null
  initialAvatarUrl?: string | null
  onClose: () => void
}

const modalSlotProps = {
  backdrop: {
    sx: {
      backgroundColor: "rgba(13, 28, 46, 0.22)",
      backdropFilter: "blur(1.5px)",
    },
  },
}

function getProvidedAvatarUrl(value?: string | null) {
  if (!value || value === DEFAULT_MATCH_PROFILE_AVATAR) {
    return null
  }

  return value
}

async function resolveProfileAvatarUrl(
  photo?: string | null,
  providedAvatarUrl?: string | null,
) {
  const existingAvatarUrl = getProvidedAvatarUrl(providedAvatarUrl)
  if (existingAvatarUrl) {
    return existingAvatarUrl
  }

  if (!photo) {
    return DEFAULT_MATCH_PROFILE_AVATAR
  }

  if (isDirectProfileAssetUrl(photo)) {
    return photo
  }

  try {
    return await getSignedReadableImageUrl(photo)
  } catch {
    return DEFAULT_MATCH_PROFILE_AVATAR
  }
}

export default function ChatUserProfileModal({
  open,
  matchId,
  initialAvatarUrl,
  onClose,
}: ChatUserProfileModalProps) {
  const rowCacheRef = useRef<Record<string, CachedRowEntry>>({})

  const [row, setRow] = useState<DashboardMatchRow | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !matchId) {
      setRow(null)
      setIsLoading(false)
      setError(null)
      return
    }

    let cancelled = false
    const cachedEntry = rowCacheRef.current[matchId]

    setRow(cachedEntry?.row ?? null)
    setError(null)
    setIsLoading(!cachedEntry?.isRich)

    if (cachedEntry?.isRich) {
      return
    }

    const loadProfile = async () => {
      const [searchResult, matchResult] = await Promise.allSettled([
        searchProfilesApi({}, 100, 0),
        getMatchDetailsApi(matchId),
      ])

      if (cancelled) return

      const baseMatch =
        matchResult.status === "fulfilled" ? matchResult.value : null
      const richResult =
        searchResult.status === "fulfilled"
          ? searchResult.value.profiles.find((profile) => profile.matchId === matchId)
          : undefined

      const avatarUrl = await resolveProfileAvatarUrl(
        richResult?.profile.profilePhoto ?? baseMatch?.user?.profilePhoto ?? null,
        initialAvatarUrl,
      )

      if (cancelled) return

      const nextRow =
        richResult != null
          ? buildDashboardMatchRowFromSearchResult(richResult, { avatarUrl })
          : baseMatch != null
            ? buildDashboardMatchRowFromMatchSummary(baseMatch, { avatarUrl })
            : null

      if (nextRow) {
        rowCacheRef.current[matchId] = {
          row: nextRow,
          isRich: richResult != null,
        }
        setRow(nextRow)
        setIsLoading(false)
        return
      }

      if (!cachedEntry?.row) {
        const searchError =
          searchResult.status === "rejected" ? searchResult.reason : null
        const matchError =
          matchResult.status === "rejected" ? matchResult.reason : null

        setError(
          matchError instanceof Error
            ? matchError.message
            : searchError instanceof Error
              ? searchError.message
              : "Failed to load profile. Please try again.",
        )
      }

      setIsLoading(false)
    }

    void loadProfile()

    return () => {
      cancelled = true
    }
  }, [initialAvatarUrl, matchId, open])

  if (open && row) {
    return <MatchProfileDetailModal open={open} row={row} onClose={onClose} />
  }

  return (
    <DashboardModal
      open={open}
      onClose={onClose}
      maxWidth="md"
      slotProps={modalSlotProps}
    >
      <Box
        sx={{
          minHeight: 240,
          px: 4,
          py: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          textAlign: "center",
        }}
      >
        {isLoading ? (
          <>
            <CircularProgress size={36} sx={{ color: primary.main }} />
            <Typography sx={{ fontSize: 14, color: common.color6D9DC5 }}>
              Loading profile...
            </Typography>
          </>
        ) : (
          <Typography sx={{ fontSize: 14, color: common.color6D9DC5, lineHeight: 1.7 }}>
            {error || "No profile details are available for this conversation right now."}
          </Typography>
        )}
      </Box>
    </DashboardModal>
  )
}
