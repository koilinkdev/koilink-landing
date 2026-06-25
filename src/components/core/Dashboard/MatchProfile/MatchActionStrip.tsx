"use client"

import {
  CloseRounded,
  HandshakeRounded,
  ReplayRounded,
  StarRounded,
} from "@mui/icons-material"
import { Box, Tooltip } from "@mui/material"
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
  const undoTitle =
    remainingRewinds === "unlimited"
      ? "Undo last swipe (unlimited)"
      : `Undo last swipe (${remainingRewinds} left today)`

  return (
    <>
      <Box className="actionDock">
        <Tooltip title={undoTitle} arrow>
          <span>
            <button
              type="button"
              className="dockButton rewind"
              onClick={onUndo}
              disabled={isRewinding || activeIndex === 0 || isAnimating}
              aria-label="Undo last swipe"
            >
              <ReplayRounded />
            </button>
          </span>
        </Tooltip>

        <Box className="dockDivider" />

        <Tooltip title="Pass" arrow>
          <span>
            <button
              type="button"
              className="dockButton pass"
              onClick={() => onAdvance("pass")}
              disabled={!canInteract}
              aria-label="Pass"
            >
              <CloseRounded />
            </button>
          </span>
        </Tooltip>

        <Tooltip title="Shortlist" arrow>
          <span>
            <button
              type="button"
              className="dockButton save"
              onClick={() => onAdvance("save")}
              disabled={!canShortlist}
              aria-label="Shortlist"
            >
              <StarRounded />
            </button>
          </span>
        </Tooltip>

        <Tooltip title="Connect" arrow>
          <span>
            <button
              type="button"
              className="dockButton like"
              onClick={() => onAdvance("like")}
              disabled={!canInteract}
              aria-label="Connect"
            >
              <HandshakeRounded />
            </button>
          </span>
        </Tooltip>
      </Box>

      <Box className="shortcutHint">
        <span className="key">
          <kbd>←</kbd>
          <span>Pass</span>
        </span>
        <span className="key">
          <kbd>↑</kbd>
          <span>Shortlist</span>
        </span>
        <span className="key">
          <kbd>→</kbd>
          <span>Connect</span>
        </span>
      </Box>
    </>
  )
})

export default MatchActionStrip
