"use client"

import {
  LocationOnOutlined,
  ReplayRounded,
  VerifiedRounded,
} from "@mui/icons-material"
import { Box, Button, Stack, Typography } from "@mui/material"
import Image from "next/image"
import React from "react"
import { formatMatchProfileTitle, type MatchProfileCard } from "@/lib/matchmaking-presenters"
import MatchScoreGauge from "./MatchScoreGauge"
import { ACTION_META, ANIMATION_DURATION, isRemoteImageUrl } from "./matchProfileUtils"
import type { SwipeDecision } from "./matchProfileTypes"

type MatchDeckProps = {
  currentProfile: MatchProfileCard | null
  nextProfile: MatchProfileCard | null
  visibleDecision: SwipeDecision | null
  canInteract: boolean
  isDragging: boolean
  isLoading: boolean
  currentCardTransform: string
  currentCardOpacity: number
  nextCardScale: number
  remainingCount: number
  getCardImage: (profile: MatchProfileCard) => string
  onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void
  onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => void
  onPointerUp: (event: React.PointerEvent<HTMLDivElement>) => void
  onPointerCancel: (event: React.PointerEvent<HTMLDivElement>) => void
  onRestart: () => void
}

const BackCard = ({
  profile,
  image,
  scale,
}: {
  profile: MatchProfileCard
  image: string
  scale: number
}) => (
  <Box className="deckBackCard" sx={{ transform: `translateY(16px) scale(${scale})` }}>
    <Box className="backCardImage">
      <Image
        src={image}
        alt={profile.name}
        fill
        sizes="(max-width: 1099px) 100vw, 50vw"
        unoptimized={isRemoteImageUrl(image)}
      />
    </Box>
    <Box className="backCardScrim" />
    <Box className="backCardContent">
      <Typography className="backCardLabel">Up next</Typography>
      <Typography className="backCardTitle">{formatMatchProfileTitle(profile)}</Typography>
      <Typography className="backCardMeta">
        {profile.userTypeLabel} · {profile.location}
      </Typography>
    </Box>
  </Box>
)

const MatchDeck = React.memo(function MatchDeck({
  currentProfile,
  nextProfile,
  visibleDecision,
  canInteract,
  isDragging,
  isLoading,
  currentCardTransform,
  currentCardOpacity,
  nextCardScale,
  remainingCount,
  getCardImage,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onRestart,
}: MatchDeckProps) {
  const visibleAction = visibleDecision ? ACTION_META[visibleDecision] : null

  if (!currentProfile) {
    return (
      <Box className="deckStage">
        {isLoading ? (
          <Box className="deckSkeleton" aria-label="Loading profiles" />
        ) : (
          <Box className="emptyState">
            <Typography className="emptyStateTitle">Queue completed</Typography>
            <Typography className="emptyStateText">
              You have reviewed every available profile. Refresh the deck to check for new
              suggestions, or widen your filters.
            </Typography>
            <Button variant="contained" className="restartButton" onClick={onRestart}>
              <ReplayRounded fontSize="small" />
              Refresh deck
            </Button>
          </Box>
        )}
      </Box>
    )
  }

  const cardImage = getCardImage(currentProfile)

  return (
    <Box className="deckStage">
      {nextProfile && (
        <BackCard profile={nextProfile} image={getCardImage(nextProfile)} scale={nextCardScale} />
      )}

      <Box
        className={`matchDeckCard ${canInteract ? "" : "isDisabled"}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        sx={{
          transform: currentCardTransform,
          opacity: currentCardOpacity,
          transition: isDragging
            ? "box-shadow 0.25s ease"
            : `transform ${ANIMATION_DURATION}ms ease, opacity ${ANIMATION_DURATION}ms ease, box-shadow 0.25s ease`,
        }}
      >
        <Box className="cardImage">
          <Image
            src={cardImage}
            alt={`${currentProfile.name} profile`}
            fill
            priority
            sizes="(max-width: 1099px) 100vw, 50vw"
            unoptimized={isRemoteImageUrl(cardImage)}
          />
        </Box>
        <Box className="cardTopScrim" />

        <Stack className="cardTopMeta" direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box className="glassPill muted">
            <span>{currentProfile.userTypeLabel}</span>
          </Box>
          {currentProfile.verified && (
            <Box className="verifiedBadge">
              <VerifiedRounded sx={{ fontSize: 15 }} />
              Verified
            </Box>
          )}
        </Stack>

        <Box className={`decisionHalo ${visibleDecision ? "isVisible" : ""} ${visibleDecision ?? ""}`}>
          {visibleAction?.icon}
          <Typography className="decisionLabel">{visibleAction?.label}</Typography>
        </Box>

        {/* Frosted identity bar — single source for name/role/location/tags */}
        <Box className="identityBar">
          <Box className="identityTop">
            <Box className="identityText">
              <Typography className="identityName">
                {formatMatchProfileTitle(currentProfile)}
              </Typography>
              <Typography className="identityRole">{currentProfile.title}</Typography>
            </Box>
            <MatchScoreGauge value={currentProfile.fitScore} size={68} stroke={6} />
          </Box>

          <Box className="identityMeta">
            <LocationOnOutlined fontSize="small" />
            <span>
              {currentProfile.location}
              {currentProfile.company ? ` · ${currentProfile.company}` : ""}
            </span>
          </Box>

          {currentProfile.tags.length > 0 && (
            <Box className="identityTags">
              {currentProfile.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="identityTag">
                  {tag}
                </span>
              ))}
            </Box>
          )}

          <Box className="identityFooter">
            <Typography className="identityCapital">{currentProfile.capital}</Typography>
            <Box className="progressDots" aria-hidden>
              {Array.from({ length: Math.min(4, remainingCount) }).map((_, index) => (
                <span key={`${currentProfile.id}-${index}`} className={index === 0 ? "isActive" : ""} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
})

export default MatchDeck
