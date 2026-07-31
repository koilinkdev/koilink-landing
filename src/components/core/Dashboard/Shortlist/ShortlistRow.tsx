"use client"

import React from "react"
import {
  CloseRounded,
  DeleteOutlineRounded,
  HandshakeRounded,
  VerifiedRounded,
} from "@mui/icons-material"
import { Avatar, Box, Tooltip } from "@mui/material"
import { formatNotificationTime } from "@/lib/notification-display"
import type { MatchProfileCard } from "@/lib/matchmaking-presenters"

export type ShortlistRowAction = "pass" | "like" | "remove"

type ShortlistRowProps = {
  card: MatchProfileCard
  shortlistedAt: string
  isBusy: boolean
  /** Disables the swipe actions when the daily swipe quota is spent. */
  canSwipe: boolean
  onAction: (action: ShortlistRowAction, card: MatchProfileCard) => void
  onOpenProfile: (card: MatchProfileCard) => void
}

const ShortlistRow = React.memo(function ShortlistRow({
  card,
  shortlistedAt,
  isBusy,
  canSwipe,
  onAction,
  onOpenProfile,
}: ShortlistRowProps) {
  const metaLine = [card.profileSubtypeLabel || card.userTypeLabel, card.location]
    .filter(Boolean)
    .join(" · ")

  return (
    <Box
      className={`shortlistRow${isBusy ? " isBusy" : ""}`}
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
