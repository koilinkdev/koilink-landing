"use client"

import {
  BoltRounded,
  CloseRounded,
  HandshakeRounded,
  LockRounded,
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
  canSuperLike: boolean
  /** False when the plan includes no Super Swipes at all, as opposed to none left today. */
  superLikesAvailable: boolean
  superLikesRemaining: number | "unlimited" | null
  onUndo: () => void
  onAdvance: (decision: SwipeDecision) => void
  onUpgrade: () => void
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
  canSuperLike,
  superLikesAvailable,
  superLikesRemaining,
  onUndo,
  onAdvance,
  onUpgrade,
}: MatchActionStripProps) {
  const remainingRewinds = getRemainingRewinds(rewindLimit, rewindsUsed)
  const undoTitle =
    remainingRewinds === "unlimited"
      ? "Undo last swipe (unlimited)"
      : `Undo last swipe (${remainingRewinds} left today)`

  const superTitle = !superLikesAvailable
    ? "Super Swipes are a paid feature"
    : superLikesRemaining === "unlimited"
      ? "Super Swipe (unlimited)"
      : superLikesRemaining === 0
        ? "No Super Swipes left today"
        : `Super Swipe${superLikesRemaining === null ? "" : ` (${superLikesRemaining} left today)`}`

  // Shown on the button rather than only in the tooltip: a quota the user cannot
  // see without hovering is a quota they will discover by being rejected.
  const superBadge =
    superLikesRemaining === "unlimited"
      ? "∞"
      : typeof superLikesRemaining === "number"
        ? String(superLikesRemaining)
        : null

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

        <Tooltip title={superTitle} arrow>
          <span>
            <button
              type="button"
              className={`dockButton super${superLikesAvailable ? "" : " isLocked"}`}
              // Stays clickable when locked so it can open the paywall - a hidden
              // or dead button converts worse than a visible locked one.
              onClick={() => (superLikesAvailable ? onAdvance("super") : onUpgrade())}
              disabled={superLikesAvailable && !canSuperLike}
              aria-label={superLikesAvailable ? "Super Swipe" : "Unlock Super Swipes"}
            >
              {superLikesAvailable ? <BoltRounded /> : <LockRounded />}
              {superLikesAvailable && superBadge !== null ? (
                <span className="dockBadge">{superBadge}</span>
              ) : null}
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
          <span>Super</span>
        </span>
        <span className="key">
          <kbd>↓</kbd>
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
