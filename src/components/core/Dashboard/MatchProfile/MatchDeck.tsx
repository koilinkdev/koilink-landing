"use client"

import {
  AutoAwesomeRounded,
  LocationOnOutlined,
  ReplayRounded,
} from "@mui/icons-material"
import { Box, Button, Stack, Typography } from "@mui/material"
import Image from "next/image"
import React from "react"
import { formatMatchProfileTitle, type MatchProfileCard } from "@/lib/matchmaking-presenters"
import {
  ACTION_META,
  ANIMATION_DURATION,
  isRemoteImageUrl,
} from "./matchProfileUtils"
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

  return (
    <Box className="deckStage">
      {currentProfile ? (
        <>
          {nextProfile && (
            <Box
              className="deckBackCard"
              sx={{ transform: `translateY(20px) scale(${nextCardScale})` }}
            >
              <Box className="backCardImage">
                <Image
                  src={getCardImage(nextProfile)}
                  alt={nextProfile.name}
                  fill
                  sizes="(max-width: 1199px) 100vw, 60vw"
                  unoptimized={isRemoteImageUrl(getCardImage(nextProfile))}
                />
              </Box>
              <Box className="backCardScrim" />
              <Box className="backCardContent">
                <Typography className="backCardLabel">Up next</Typography>
                <Typography className="backCardTitle">
                  {formatMatchProfileTitle(nextProfile)}
                </Typography>
                <Typography className="backCardMeta">
                  {nextProfile.userTypeLabel} | {nextProfile.location}
                </Typography>
              </Box>
            </Box>
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
                src={getCardImage(currentProfile)}
                alt={`${currentProfile.name} profile`}
                fill
                sizes="(max-width: 1199px) 100vw, 60vw"
                unoptimized={isRemoteImageUrl(getCardImage(currentProfile))}
              />
            </Box>
            <Box className="cardScrim" />

            <Stack className="cardTopMeta" direction="row" justifyContent="space-between">
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Box className="glassPill">
                  <AutoAwesomeRounded fontSize="small" />
                  <span>{currentProfile.fitScore}% fit</span>
                </Box>
                <Box className="glassPill muted">
                  <span>{currentProfile.userTypeLabel}</span>
                </Box>
              </Stack>

              {currentProfile.verified && (
                <Box className="verifiedBadge">
                  <Image
                    src="/assets/icons/verified-greenTick-profile.svg"
                    alt="Verified profile"
                    width={18}
                    height={18}
                  />
                </Box>
              )}
            </Stack>

            <Box
              className={`decisionHalo ${visibleDecision ? "isVisible" : ""} ${
                visibleDecision ? visibleDecision : ""
              }`}
            >
              {visibleAction?.icon}
              <Typography className="decisionLabel">{visibleAction?.label}</Typography>
            </Box>

            <Box className="cardContent">
              <Typography className="cardTitle">{formatMatchProfileTitle(currentProfile)}</Typography>
              <Typography className="cardSubtitle">{currentProfile.title}</Typography>
              <Stack className="cardMetaRow" direction="row" spacing={0.75} alignItems="center">
                <LocationOnOutlined fontSize="small" />
                <Typography className="cardMetaText">
                  {currentProfile.location} | {currentProfile.company}
                </Typography>
              </Stack>
              <Typography className="cardHighlight">{currentProfile.highlight}</Typography>

              <Box className="tagRow">
                {currentProfile.tags.map((tag) => (
                  <Box key={tag} className="tagChip">
                    {tag}
                  </Box>
                ))}
              </Box>

              <Stack
                className="cardFooter"
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
              >
                <Typography className="cardFooterText">{currentProfile.capital}</Typography>
                <Box className="progressDots">
                  {Array.from({ length: Math.min(4, remainingCount) }).map((_, index) => (
                    <span key={`${currentProfile.id}-${index}`} className={index === 0 ? "isActive" : ""} />
                  ))}
                </Box>
              </Stack>
            </Box>
          </Box>
        </>
      ) : (
        <Box className="emptyState">
          <Typography className="emptyStateTitle">
            {isLoading ? "Loading profiles" : "Queue completed"}
          </Typography>
          <Typography className="emptyStateText">
            {isLoading
              ? "We are preparing your live match feed."
              : "You have reviewed the available profiles. Refresh the deck to check for new suggestions."}
          </Typography>
          <Button variant="contained" className="restartButton" onClick={onRestart}>
            <ReplayRounded fontSize="small" />
            {isLoading ? "Refreshing" : "Refresh deck"}
          </Button>
        </Box>
      )}
    </Box>
  )
})

export default MatchDeck
