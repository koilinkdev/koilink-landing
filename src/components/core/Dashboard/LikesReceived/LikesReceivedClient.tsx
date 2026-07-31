"use client"

import { LockRounded, VerifiedRounded } from "@mui/icons-material"
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material"
import { useRouter } from "next/navigation"
import React from "react"
import { listLikesReceivedApi, type LikesReceivedResponse } from "@/lib/matchmaking-api"
import { formatNotificationTime } from "@/lib/notification-display"

const PAGE_SIZE = 20

const LikesReceivedClient = () => {
  const router = useRouter()
  const [data, setData] = React.useState<LikesReceivedResponse | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    listLikesReceivedApi(PAGE_SIZE, 0)
      .then((response) => {
        if (!cancelled) setData(response)
      })
      .catch((cause) => {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : "Could not load received swipes.")
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const hiddenCount = React.useMemo(
    () => (data?.likes ?? []).filter((like) => !like.revealed).length,
    [data],
  )

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
        Interested in you
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Everyone who swiped right on your profile
        {data?.counts.total ? ` (${data.counts.total})` : ""}.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Counts stay honest even when identities are withheld, which is the point:
          the user can see how much interest they have before deciding to upgrade. */}
      {!isLoading && hiddenCount > 0 && data?.entitlement.upgradeRequired && (
        <Alert
          severity="info"
          sx={{ mb: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => router.push("/dashboard/subscription")}
            >
              See plans
            </Button>
          }
        >
          {hiddenCount} {hiddenCount === 1 ? "person is" : "people are"} interested but hidden on
          your plan.
        </Alert>
      )}

      {isLoading ? (
        <Stack alignItems="center" sx={{ py: 6 }}>
          <CircularProgress />
        </Stack>
      ) : (data?.likes.length ?? 0) === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No one has swiped right on you yet.
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {data?.likes.map((like, index) => (
            <Stack
              key={`${like.swiperId ?? "hidden"}-${like.swipedAt}-${index}`}
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{
                p: 1.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                cursor: like.revealed && like.swiperId ? "pointer" : "default",
              }}
              onClick={() => {
                if (like.revealed && like.swiperId) {
                  router.push(`/dashboard/profile/${like.swiperId}`)
                }
              }}
            >
              {like.revealed ? (
                <Avatar src={like.user?.profilePhoto || undefined} sx={{ width: 48, height: 48 }}>
                  {like.user?.displayName?.[0] ?? "?"}
                </Avatar>
              ) : (
                <Avatar sx={{ width: 48, height: 48, bgcolor: "action.disabledBackground" }}>
                  <LockRounded fontSize="small" />
                </Avatar>
              )}

              <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Typography sx={{ fontWeight: 600 }} noWrap>
                    {like.revealed ? like.user?.displayName || "Unknown" : "Someone"}
                  </Typography>
                  {like.revealed && like.user?.isVerified && (
                    <VerifiedRounded sx={{ fontSize: 16, color: "primary.main" }} />
                  )}
                </Stack>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {like.revealed
                    ? [like.user?.userTypeLabel, like.user?.completeLocation]
                        .filter(Boolean)
                        .join(" · ") || "Profile details unavailable"
                    : "Upgrade to see who this is"}
                </Typography>
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                {formatNotificationTime(like.swipedAt)}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default LikesReceivedClient
