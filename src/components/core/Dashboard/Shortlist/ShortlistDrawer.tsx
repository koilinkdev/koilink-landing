"use client"

import React from "react"
import { useRouter } from "next/navigation"
import {
  Alert,
  Box,
  Button,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { StarRounded } from "@mui/icons-material"
import { ShortlistDrawerStyled } from "@/styledComponents/Shortlist/ShortlistDrawerStyled"
import { listShortlistApi } from "@/lib/shortlist-api"
import { swipeProfileApi } from "@/lib/matchmaking-api"
import { getMyLimitsApi } from "@/lib/subscription-api"
import { mapSuggestionToCard, type MatchProfileCard } from "@/lib/matchmaking-presenters"
import { getSwipeLimitState, hasQuotaRemaining } from "../MatchProfile/matchProfileUtils"
import { useShortlist } from "./ShortlistProvider"
import ShortlistRow, { type ShortlistRowAction } from "./ShortlistRow"

const PAGE_SIZE = 15

type ShortlistDrawerProps = {
  open: boolean
  onClose: () => void
}

type ShortlistItem = {
  card: MatchProfileCard
  shortlistedAt: string
}

type Banner = {
  severity: "success" | "info" | "warning" | "error"
  message: string
  actionLabel?: string
  onAction?: () => void
}

type QuotaState = {
  canSwipe: boolean
}

// Optimistic until the limits call answers, so buttons are not briefly disabled
// for users who do have quota.
const OPTIMISTIC_QUOTA: QuotaState = {
  canSwipe: true,
}

const ShortlistDrawer = ({ open, onClose }: ShortlistDrawerProps) => {
  const router = useRouter()
  const shortlist = useShortlist()

  const [items, setItems] = React.useState<ShortlistItem[]>([])
  const [total, setTotal] = React.useState(0)
  const [hasMore, setHasMore] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isLoadingMore, setIsLoadingMore] = React.useState(false)
  const [loadError, setLoadError] = React.useState<string | null>(null)
  const [busyUserId, setBusyUserId] = React.useState<string | null>(null)
  const [banner, setBanner] = React.useState<Banner | null>(null)
  const [quota, setQuota] = React.useState<QuotaState>(OPTIMISTIC_QUOTA)

  const capacity = shortlist?.capacity ?? null

  const loadFirstPage = React.useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)

    try {
      const page = await listShortlistApi(PAGE_SIZE, 0)
      setItems(
        page.items.map((entry) => ({
          card: mapSuggestionToCard(entry),
          shortlistedAt: entry.shortlistedAt,
        })),
      )
      setTotal(page.total)
      setHasMore(page.hasMore)
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Could not load your shortlist.",
      )
      setItems([])
      setTotal(0)
      setHasMore(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadQuota = React.useCallback(async () => {
    try {
      const limits = await getMyLimitsApi()
      setQuota({
        canSwipe: hasQuotaRemaining(limits.usage.swipes.remaining),
      })
    } catch {
      // The server is authoritative on every swipe, so the worst case of an
      // optimistic default is one rejected action with a clear message.
      setQuota(OPTIMISTIC_QUOTA)
    }
  }, [])

  // Refetched on every open rather than cached: entries are pruned server-side
  // when a candidate deactivates, photo URLs are presigned with a one-hour
  // expiry, and quotas reset at midnight.
  React.useEffect(() => {
    if (!open) return

    setBanner(null)
    void loadFirstPage()
    void loadQuota()
    void shortlist?.refresh()
    // `shortlist` identity changes whenever capacity does, which would re-run
    // this on every mutation and fight the optimistic list updates below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, loadFirstPage, loadQuota])

  const handleLoadMore = React.useCallback(async () => {
    if (isLoadingMore) return
    setIsLoadingMore(true)

    try {
      // Keyed off the rendered count, not a stored cursor: rows removed locally
      // shift the server-side window, and an offset of `items.length` stays
      // correct where a saved offset would skip an entry.
      const page = await listShortlistApi(PAGE_SIZE, items.length)
      setItems((previous) => {
        const seen = new Set(previous.map((item) => item.card.userId))
        return [
          ...previous,
          ...page.items
            .filter((entry) => !seen.has(entry.userId))
            .map((entry) => ({
              card: mapSuggestionToCard(entry),
              shortlistedAt: entry.shortlistedAt,
            })),
        ]
      })
      setTotal(page.total)
      setHasMore(page.hasMore)
    } catch (error) {
      setBanner({
        severity: "error",
        message: error instanceof Error ? error.message : "Could not load more profiles.",
      })
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, items.length])

  const dropItem = React.useCallback((userId: string) => {
    setItems((previous) => previous.filter((item) => item.card.userId !== userId))
    setTotal((previous) => Math.max(previous - 1, 0))
  }, [])

  const handleAction = React.useCallback(
    async (action: ShortlistRowAction, card: MatchProfileCard) => {
      if (busyUserId) return

      setBusyUserId(card.userId)
      setBanner(null)

      try {
        if (action === "remove") {
          // Guarded rather than optional-chained: a silent no-op would drop the
          // row from the list while the entry still exists on the server.
          if (!shortlist) {
            throw new Error("Shortlist is unavailable right now.")
          }

          await shortlist.remove(card.userId)
          dropItem(card.userId)
          setBanner({
            severity: "info",
            message: `${card.name} removed. They will reappear in your deck.`,
          })
          return
        }

        const direction = action === "like" ? "right" : "left"
        const response = await swipeProfileApi(card.userId, direction)

        // The server clears the parked entry as part of the swipe, so the badge
        // is corrected locally instead of spending a round trip on the summary.
        shortlist?.registerExternalRemoval()
        dropItem(card.userId)

        setQuota({ canSwipe: hasQuotaRemaining(response.limits.swipesRemaining) })

        if (response.match?.isNewMatch && response.match.conversationId) {
          const conversationId = response.match.conversationId
          setBanner({
            severity: "success",
            message: `It's a match with ${response.match.user?.displayName || card.name}.`,
            actionLabel: "Open chat",
            onAction: () => {
              onClose()
              router.push(`/dashboard/chat?conversationId=${conversationId}`)
            },
          })
          return
        }

        setBanner({
          severity: "success",
          message:
            action === "like"
              ? `Interest recorded for ${card.name}.`
              : `Passed on ${card.name}.`,
        })
      } catch (error) {
        // A quota rejection leaves the row in place: the candidate is still
        // parked server-side, so removing it here would lie about the state.
        const limitState = getSwipeLimitState(error)

        if (limitState) {
          setQuota({ canSwipe: false })

          setBanner({
            severity: "warning",
            message: limitState.message,
            ...(limitState.upgradeRequired
              ? {
                  actionLabel: "See plans",
                  onAction: () => {
                    onClose()
                    router.push("/dashboard/subscription")
                  },
                }
              : {}),
          })
          return
        }

        setBanner({
          severity: "error",
          message: error instanceof Error ? error.message : "That action did not go through.",
        })
      } finally {
        setBusyUserId(null)
      }
    },
    [busyUserId, dropItem, onClose, router, shortlist],
  )

  const handleOpenProfile = React.useCallback(
    (card: MatchProfileCard) => {
      onClose()
      router.push(`/dashboard/profile/${card.userId}`)
    },
    [onClose, router],
  )


  // Hidden below 60%: an empty shortlist framed as "0 of 100" reads as a target
  // to fill rather than a queue to clear.
  const showCapacityMeter = Boolean(capacity && capacity.count / capacity.limit >= 0.6)
  const capacityPercent = capacity
    ? Math.min(Math.round((capacity.count / capacity.limit) * 100), 100)
    : 0

  return (
    <ShortlistDrawerStyled anchor="right" open={open} onClose={onClose}>
      <Box className="shortlistHeader">
        <Box className="shortlistHeaderRow">
          <Typography component="h2" className="shortlistTitle">
            <StarRounded />
            Shortlist
            {total > 0 && <span className="shortlistCountChip">{total}</span>}
          </Typography>
          <IconButton size="small" onClick={onClose} aria-label="Close shortlist">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Typography className="shortlistSubtitle">
          Profiles you parked to decide on later. They stay out of your deck until you act.
        </Typography>

        {showCapacityMeter && capacity && (
          <Box className="capacityMeter">
            <Box className="capacityTrack">
              <Box
                className={`capacityFill${capacity.isFull ? " isFull" : ""}`}
                sx={{ width: `${capacityPercent}%` }}
              />
            </Box>
            <span className="capacityLabel">
              {capacity.isFull
                ? `Shortlist full — ${capacity.limit} of ${capacity.limit}. Act on a few to make room.`
                : `${capacity.count} of ${capacity.limit} saved`}
            </span>
          </Box>
        )}
      </Box>

      <Box className="shortlistBody">
        {banner && (
          <Alert
            className="shortlistBanner"
            severity={banner.severity}
            onClose={() => setBanner(null)}
            action={
              banner.actionLabel && banner.onAction ? (
                <Button color="inherit" size="small" onClick={banner.onAction}>
                  {banner.actionLabel}
                </Button>
              ) : undefined
            }
          >
            {banner.message}
          </Alert>
        )}

        {isLoading ? (
          <>
            {[0, 1, 2].map((key) => (
              <Box key={key} className="shortlistSkeletonRow">
                <Skeleton variant="rounded" width={44} height={44} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="55%" height={20} />
                  <Skeleton variant="text" width="80%" height={16} />
                  <Skeleton variant="rounded" width="100%" height={34} sx={{ mt: 1 }} />
                </Box>
              </Box>
            ))}
          </>
        ) : loadError ? (
          <Box className="shortlistPlaceholder">
            <Typography className="placeholderTitle">Could not load your shortlist</Typography>
            <Typography className="placeholderBody">{loadError}</Typography>
            <Button size="small" variant="outlined" onClick={() => void loadFirstPage()}>
              Try again
            </Button>
          </Box>
        ) : items.length === 0 ? (
          <Box className="shortlistPlaceholder">
            <span className="placeholderIcon">
              <StarRounded />
            </span>
            <Typography className="placeholderTitle">Nothing parked yet</Typography>
            <Typography className="placeholderBody">
              Shortlist a profile when you want to come back to it. It leaves your deck and waits
              here until you connect or pass.
            </Typography>
            <span className="placeholderHint">
              <kbd>↓</kbd> or the star button on a card
            </span>
          </Box>
        ) : (
          <>
            {items.map((item) => (
              <ShortlistRow
                key={item.card.userId}
                card={item.card}
                shortlistedAt={item.shortlistedAt}
                isBusy={busyUserId === item.card.userId}
                canSwipe={quota.canSwipe}
                onAction={(action, card) => void handleAction(action, card)}
                onOpenProfile={handleOpenProfile}
              />
            ))}

            {hasMore && (
              <Box
                component="button"
                type="button"
                className="loadMoreButton"
                onClick={() => void handleLoadMore()}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? "Loading…" : `Show more (${Math.max(total - items.length, 0)})`}
              </Box>
            )}
          </>
        )}
      </Box>
    </ShortlistDrawerStyled>
  )
}

export default ShortlistDrawer
