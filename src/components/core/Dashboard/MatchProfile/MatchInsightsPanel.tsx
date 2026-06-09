"use client"

import { Box, Stack, Typography } from "@mui/material"
import React from "react"
import KeyDataDisplay from "@/components/ui/Dashboard/KeyDataDisplay"
import { formatMatchProfileTitle, type MatchProfileCard } from "@/lib/matchmaking-presenters"
import { ACTION_META } from "./matchProfileUtils"
import type { SwipeDecision } from "./matchProfileTypes"

type MatchInsightsPanelProps = {
  currentProfile: MatchProfileCard | null
  visibleDecision: SwipeDecision | null
  connectedCount: number
  savedCount: number
  passedCount: number
}

const MatchInsightsPanel = React.memo(function MatchInsightsPanel({
  currentProfile,
  visibleDecision,
  connectedCount,
  savedCount,
  passedCount,
}: MatchInsightsPanelProps) {
  return (
    <Box className="insightPanel">
      {currentProfile ? (
        <>
          <Box className="insightHero">
            <Typography className="insightEyebrow">Current Match Context</Typography>
            <Typography className="insightTitle">{currentProfile.name}</Typography>
            <Typography className="insightText">
              {currentProfile.about || currentProfile.thesis}
            </Typography>
          </Box>

          <Box className="metricGrid">
            <MetricCard label="User type" value={currentProfile.userTypeLabel} />
            <MetricCard label="Profile type" value={currentProfile.profileSubtypeLabel} />
            <MetricCard label="Fit score" value={`${currentProfile.fitScore}%`} />
            <MetricCard label="Capital" value={currentProfile.capital} />
          </Box>

          <Box className="detailsSection">
            <Typography className="detailsTitle">Profile Snapshot</Typography>
            <Stack spacing={1.25} className="snapshotList">
              <SnapshotRow label="Name" value={formatMatchProfileTitle(currentProfile)} />
              <SnapshotRow label="User type" value={currentProfile.userTypeLabel} />
              <SnapshotRow label="Profile type" value={currentProfile.profileSubtypeLabel} />
              <SnapshotRow label="Complete location" value={currentProfile.location} />
            </Stack>
          </Box>

          <Box className="detailsSection">
            <Typography className="detailsTitle">About</Typography>
            {currentProfile.aboutLines.length > 0 ? (
              <Stack spacing={1.1} className="aboutList">
                {currentProfile.aboutLines.map((item, index) => (
                  <Box key={`${currentProfile.id}-about-${index}`} className="aboutListItem">
                    <Typography className="aboutListIndex">{index + 1}.</Typography>
                    <Typography className="reasonText">{item}</Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography className="sectionSubtitle">
                This profile has not added an about summary yet.
              </Typography>
            )}
          </Box>

          <Box className="detailsSection">
            <Typography className="detailsTitle">Key Data</Typography>
            <KeyDataDisplay
              role={currentProfile.roleType}
              items={currentProfile.keyDataItems}
              emptyMessage="This profile has not added any key data yet."
            />
          </Box>

          <Box className="detailsSection">
            <Typography className="detailsTitle">Why this profile can work</Typography>
            <Stack spacing={1.25}>
              {currentProfile.reasons.map((reason) => (
                <Box key={reason} className="reasonRow">
                  <span className="reasonDot" />
                  <Typography className="reasonText">{reason}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box className="detailsSection">
            <Typography className="detailsTitle">Action preview</Typography>
            <Box className={`actionPreviewCard ${visibleDecision ?? "neutral"}`}>
              <Typography className="actionPreviewLabel">
                {visibleDecision ? ACTION_META[visibleDecision].label : "Waiting for input"}
              </Typography>
              <Typography className="actionPreviewText">
                {visibleDecision
                  ? ACTION_META[visibleDecision].helper
                  : "Use drag, buttons, or keyboard arrows to test the default, accept, and reject UI states."}
              </Typography>
            </Box>
          </Box>
        </>
      ) : (
        <Box className="emptyInsights">
          <Typography className="insightTitle">Review summary</Typography>
          <Typography className="insightText">
            Connected: {connectedCount} | Shortlisted: {savedCount} | Passed: {passedCount}
          </Typography>
        </Box>
      )}
    </Box>
  )
})

const MetricCard = ({ label, value }: { label: string; value: string }) => (
  <Box className="metricCard">
    <Typography className="metricLabel">{label}</Typography>
    <Typography className="metricValue">{value}</Typography>
  </Box>
)

const SnapshotRow = ({ label, value }: { label: string; value: string }) => (
  <Box className="snapshotRow">
    <Typography className="snapshotLabel">{label}</Typography>
    <Typography className="snapshotValue">{value}</Typography>
  </Box>
)

export default MatchInsightsPanel
