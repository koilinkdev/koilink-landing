"use client"

import { Button, Stack, Typography } from "@mui/material"
import React from "react"
import type { MatchedConversation, SwipeLimitState } from "./matchProfileTypes"

type MatchFeedbackBannerProps = {
  feedbackMessage: string | null
  matchedConversation: MatchedConversation
  swipeLimitState: SwipeLimitState | null
  onOpenConversation: () => void
}

const MatchFeedbackBanner = React.memo(function MatchFeedbackBanner({
  feedbackMessage,
  matchedConversation,
  swipeLimitState,
  onOpenConversation,
}: MatchFeedbackBannerProps) {
  if (!feedbackMessage && !matchedConversation && !swipeLimitState) {
    return null
  }

  return (
    <Stack
      className={`feedbackBanner ${swipeLimitState ? "isWarning" : ""}`}
      direction={{ xs: "column", md: "row" }}
      alignItems={{ xs: "flex-start", md: "center" }}
      justifyContent="space-between"
      spacing={1.5}
    >
      <Stack spacing={0.75}>
        <Typography className="feedbackBannerText">
          {feedbackMessage || "Conversation unlocked."}
        </Typography>
        {swipeLimitState && (
          <Typography className="feedbackBannerMeta">
            {swipeLimitState.current !== null && swipeLimitState.dailyLimit !== null
              ? `You have used ${swipeLimitState.current} of ${swipeLimitState.dailyLimit} daily swipes.`
              : "Swipe actions are paused until your daily limit resets."}
          </Typography>
        )}
      </Stack>
      {matchedConversation && !swipeLimitState && (
        <Button className="feedbackBannerAction" onClick={onOpenConversation}>
          Open chat with {matchedConversation.displayName}
        </Button>
      )}
    </Stack>
  )
})

export default MatchFeedbackBanner
