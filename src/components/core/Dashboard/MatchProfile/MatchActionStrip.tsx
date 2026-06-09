"use client"

import {
  CloseRounded,
  HandshakeRounded,
  KeyboardArrowLeftRounded,
  KeyboardArrowRightRounded,
  KeyboardArrowUpRounded,
  ReplayRounded,
  StarRounded,
} from "@mui/icons-material"
import { Box, Stack, Typography } from "@mui/material"
import React from "react"
import type { SwipeDecision } from "./matchProfileTypes"

type MatchActionStripProps = {
  activeIndex: number
  isAnimating: boolean
  isRewinding: boolean
  rewindLimit: number | "unlimited"
  rewindsUsed: number
  canInteract: boolean
  canShortlist: boolean
  onUndo: () => void
  onAdvance: (decision: SwipeDecision) => void
}

const getRemainingRewinds = (limit: number | "unlimited", used: number) => {
  if (limit === "unlimited" || limit === -1) return "unlimited"
  return Math.max(limit - used, 0)
}

const MatchActionStrip = React.memo(function MatchActionStrip({
  activeIndex,
  isAnimating,
  isRewinding,
  rewindLimit,
  rewindsUsed,
  canInteract,
  canShortlist,
  onUndo,
  onAdvance,
}: MatchActionStripProps) {
  const remainingRewinds = getRemainingRewinds(rewindLimit, rewindsUsed)

  return (
    <>
      <Box className="actionStrip">
        <Stack alignItems="center" spacing={1}>
          <button
            type="button"
            className="actionButton rewindAction"
            onClick={onUndo}
            disabled={isRewinding || activeIndex === 0 || isAnimating}
            aria-label="Undo last swipe"
            title={
              remainingRewinds === "unlimited"
                ? "Undo last swipe (unlimited)"
                : `Undo last swipe (${remainingRewinds} left today)`
            }
          >
            <ReplayRounded />
          </button>
          <Typography className="actionLabel">
            {remainingRewinds === "unlimited" ? "Undo" : `Undo (${remainingRewinds})`}
          </Typography>
        </Stack>

        {[
          { decision: "pass" as const, label: "Pass", icon: <CloseRounded /> },
          { decision: "save" as const, label: "Shortlist", icon: <StarRounded /> },
          { decision: "like" as const, label: "Connect", icon: <HandshakeRounded /> },
        ].map((item) => (
          <Stack key={item.decision} alignItems="center" spacing={1}>
            <button
              type="button"
              className={`actionButton ${item.decision}Action`}
              onClick={() => onAdvance(item.decision)}
              disabled={item.decision === "save" ? !canShortlist : !canInteract}
              aria-label={item.label}
            >
              {item.icon}
            </button>
            <Typography className="actionLabel">{item.label}</Typography>
          </Stack>
        ))}
      </Box>

      <Stack
        className="shortcutBar"
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems={{ xs: "flex-start", sm: "center" }}
      >
        <Box className="shortcutItem">
          <KeyboardArrowLeftRounded />
          <span>Left arrow to pass</span>
        </Box>
        <Box className="shortcutItem">
          <KeyboardArrowUpRounded />
          <span>Up arrow to shortlist</span>
        </Box>
        <Box className="shortcutItem">
          <KeyboardArrowRightRounded />
          <span>Right arrow to connect</span>
        </Box>
      </Stack>
    </>
  )
})

export default MatchActionStrip
