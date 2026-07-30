"use client"

import { BoltRounded } from "@mui/icons-material"
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material"
import { useRouter } from "next/navigation"
import React from "react"
import { comparePlansApi, type ComparablePlan } from "@/lib/subscription-api"
import type { SuperLikeQuota, SwipeLimitState } from "./matchProfileTypes"

type SuperLikePaywallDialogProps = {
  open: boolean
  superQuota: SuperLikeQuota | null
  limitState: SwipeLimitState | null
  onClose: () => void
}

const describeAllowance = (plan: ComparablePlan) => {
  const perDay = plan.features?.superLikesPerDay

  if (typeof perDay !== "number") return "Super Swipes not included"
  if (perDay === -1) return "Unlimited Super Swipes"
  if (perDay === 0) return "Super Swipes not included"

  return `${perDay} Super Swipe${perDay === 1 ? "" : "s"} per day`
}

const formatPrice = (plan: ComparablePlan) => {
  if (plan.price === 0) return "Free"

  const amount = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: (plan.currency || "usd").toUpperCase(),
    maximumFractionDigits: 0,
  }).format(plan.price)

  return `${amount}/${plan.interval === "year" ? "yr" : "mo"}`
}

const SuperLikePaywallDialog = ({
  open,
  superQuota,
  limitState,
  onClose,
}: SuperLikePaywallDialogProps) => {
  const router = useRouter()
  const [plans, setPlans] = React.useState<ComparablePlan[] | null>(null)
  const [currentTier, setCurrentTier] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  // Fetched on open rather than on mount so the deck does not pay for a request
  // most sessions never need.
  React.useEffect(() => {
    if (!open || plans !== null) return

    let cancelled = false
    setIsLoading(true)

    comparePlansApi()
      .then((data) => {
        if (cancelled) return
        setPlans(data.plans)
        setCurrentTier(data.currentPlan?.tier ?? null)
      })
      .catch(() => {
        if (!cancelled) setPlans([])
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [open, plans])

  const isLockedOut = superQuota ? !superQuota.available : Boolean(limitState?.upgradeRequired)

  const upgradablePlans = (plans ?? []).filter((plan) => {
    const perDay = plan.features?.superLikesPerDay
    return typeof perDay === "number" && perDay !== 0
  })

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <BoltRounded sx={{ color: "#1E88E5" }} />
          <span>{isLockedOut ? "Unlock Super Swipes" : "Out of Super Swipes"}</span>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {isLockedOut
            ? "A Super Swipe puts you at the front of that person's queue and shows them exactly who you are, even if they are on a free plan."
            : "You have used today's Super Swipes. They reset at midnight, or you can move to a plan with a larger daily allowance."}
        </Typography>

        {isLoading && (
          <Stack alignItems="center" sx={{ py: 3 }}>
            <CircularProgress size={24} />
          </Stack>
        )}

        {!isLoading && upgradablePlans.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            Plan details are unavailable right now. Open the subscription page to see your options.
          </Typography>
        )}

        <Stack spacing={1.5}>
          {upgradablePlans.map((plan) => (
            <Box
              key={plan._id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                p: 1.5,
                border: "1px solid",
                borderColor: plan.tier === currentTier ? "#1E88E5" : "divider",
                borderRadius: 2,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                  {plan.displayName || plan.name}
                  {plan.tier === currentTier ? " · current" : ""}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {describeAllowance(plan)}
                </Typography>
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" }}>
                {formatPrice(plan)}
              </Typography>
            </Box>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Not now</Button>
        <Button
          variant="contained"
          onClick={() => {
            onClose()
            router.push("/dashboard/subscription")
          }}
        >
          See plans
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SuperLikePaywallDialog
