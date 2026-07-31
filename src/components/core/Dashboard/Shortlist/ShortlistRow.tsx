"use client"

import React from "react"
import {
  BoltRounded,
  CloseRounded,
  DeleteOutlineRounded,
  HandshakeRounded,
  LockRounded,
  VerifiedRounded,
} from "@mui/icons-material"
import { Avatar, Box, Tooltip } from "@mui/material"
import { formatNotificationTime } from "@/lib/notification-display"
import type { MatchProfileCard } from "@/lib/matchmaking-presenters"

export type ShortlistRowAction = "pass" | "super" | "like" | "remove"

type ShortlistRowProps = {
  card: MatchProfileCard
  shortlistedAt: string
  isBusy: boolean
  /** Disables the three swipe actions when the daily swipe quota is spent. */
  canSwipe: boolean
  canSuperLike: boolean
  /** False when the plan has no Super Swipes at all, as opposed to none left today. */
  superLikesAvailable: boolean
  onAction: (action: ShortlistRowAction, card: MatchProfileCard) => void
  onOpenProfile: (card: MatchProfileCard) => void
  onUpgrade: () => void
}

const ShortlistRow = React.memo(function ShortlistRow({
  card,
  shortlistedAt,
  isBusy,
  canSwipe,
  canSuperLike,
  superLikesAvailable,
  onAction,
  onOpenProfile,
  onUpgrade,
}: ShortlistRowProps) {
  const metaLine = [card.profileSubtypeLabel || card.userTypeLabel, card.location]
    .filter(Boolean)
    .join(" · ")

  const superTitle = !superLikesAvailable
    ? "Super Swipes are a paid feature"
    : canSuperLike
      ? "Super Swipe"
      : "No Super Swipes left today"

  return (
    <Box
      className={`shortlistRow${isBusy ? " isBusy" : ""}${card.superLikedYou ? " superLikedYou" : ""}`}
    >
      <Box
        component="button"
        type="button"
        className="rowMain"
        onClick={() => onOpenProfile(card)}
        aria-label={`Open ${card.name}'s profile`}
      >
        <Avatar
          className="rowAvatar"
          src={card.image || undefined}
          variant="rounded"
          alt=""
        >
          {card.name?.[0] ?? "?"}
        </Avatar>

        <Box className="rowContent">
          <Box className="rowNameLine">
            <span className="rowName">{card.name}</span>
            {card.verified && (
              <VerifiedRounded className="rowVerified" titleAccess="Verified profile" />
            )}
            {card.superLikedYou && (
              <span className="rowSuperBadge">
                <BoltRounded />
                SUPER
              </span>
            )}
          </Box>

          <Box className="rowMeta">{metaLine || "Profile details unavailable"}</Box>

          <Box className="rowFooter">
            {card.fitScore > 0 && <span className="rowScore">{card.fitScore}% fit</span>}
            <span>Saved {formatNotificationTime(shortlistedAt)}</span>
          </Box>
        </Box>
      </Box>

      <Box className="rowActions">
        <Tooltip title="Remove from shortlist" arrow>
          <span>
            <Box
              component="button"
              type="button"
              className="rowAction remove"
              onClick={() => onAction("remove", card)}
              disabled={isBusy}
              aria-label={`Remove ${card.name} from shortlist`}
            >
              <DeleteOutlineRounded />
            </Box>
          </span>
        </Tooltip>

        <Box className="rowActionSpacer" />

        <Tooltip title={canSwipe ? "Pass" : "Daily swipe limit reached"} arrow>
          <span>
            <Box
              component="button"
              type="button"
              className="rowAction pass"
              onClick={() => onAction("pass", card)}
              disabled={isBusy || !canSwipe}
              aria-label={`Pass on ${card.name}`}
            >
              <CloseRounded />
            </Box>
          </span>
        </Tooltip>

        <Tooltip title={superTitle} arrow>
          <span>
            <Box
              component="button"
              type="button"
              className={`rowAction super${superLikesAvailable ? "" : " isLocked"}`}
              // Stays clickable when locked so it can open the paywall; a dead
              // button converts worse than a visible locked one.
              onClick={() =>
                superLikesAvailable ? onAction("super", card) : onUpgrade()
              }
              disabled={isBusy || (superLikesAvailable && (!canSwipe || !canSuperLike))}
              aria-label={
                superLikesAvailable ? `Super Swipe ${card.name}` : "Unlock Super Swipes"
              }
            >
              {superLikesAvailable ? <BoltRounded /> : <LockRounded />}
            </Box>
          </span>
        </Tooltip>

        <Tooltip title={canSwipe ? "Connect" : "Daily swipe limit reached"} arrow>
          <span>
            <Box
              component="button"
              type="button"
              className="rowAction connect"
              onClick={() => onAction("like", card)}
              disabled={isBusy || !canSwipe}
              aria-label={`Connect with ${card.name}`}
            >
              <HandshakeRounded />
            </Box>
          </span>
        </Tooltip>
      </Box>
    </Box>
  )
})

export default ShortlistRow
