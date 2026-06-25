"use client"

import {
  ArticleOutlined,
  DataObjectRounded,
  PlaceOutlined,
  VerifiedRounded,
} from "@mui/icons-material"
import { Box, Typography } from "@mui/material"
import React from "react"
import KeyDataDisplay from "@/components/ui/Dashboard/KeyDataDisplay"
import type { MatchProfileCard } from "@/lib/matchmaking-presenters"
import MatchLocationMap from "./MatchLocationMap"
import MatchScoreGauge from "./MatchScoreGauge"
import type { SwipeDecision } from "./matchProfileTypes"

type MatchInsightsPanelProps = {
  currentProfile: MatchProfileCard | null
  visibleDecision: SwipeDecision | null
  connectedCount: number
  savedCount: number
  passedCount: number
}

type TabKey = "overview" | "location" | "data"

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "overview", label: "Overview", icon: <ArticleOutlined /> },
  { key: "location", label: "Location", icon: <PlaceOutlined /> },
  { key: "data", label: "Key data", icon: <DataObjectRounded /> },
]

const FactCell = ({ label, value }: { label: string; value: string }) => (
  <Box className="factCell">
    <small>{label}</small>
    <b>{value}</b>
  </Box>
)

const TabSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box className="tabSection">
    <Typography className="tabSectionTitle">{title}</Typography>
    {children}
  </Box>
)

const OverviewTab = ({ profile }: { profile: MatchProfileCard }) => (
  <>
    <TabSection title="Quick facts">
      <Box className="factGrid">
        <FactCell label="User type" value={profile.userTypeLabel} />
        <FactCell label="Profile type" value={profile.profileSubtypeLabel} />
        <FactCell label="Capital" value={profile.capital} />
        <FactCell label="Location" value={profile.location} />
      </Box>
    </TabSection>

    <TabSection title="About">
      {profile.aboutLines.length > 0 ? (
        <Typography className="aboutText">{profile.aboutLines.join("\n")}</Typography>
      ) : (
        <Typography className="mutedText">
          This profile has not added an about summary yet.
        </Typography>
      )}
    </TabSection>

    <TabSection title="Why this profile can work">
      <Box>
        {profile.reasons.map((reason) => (
          <Box key={reason} className="reasonRow">
            <span className="reasonDot" />
            <Typography className="reasonText">{reason}</Typography>
          </Box>
        ))}
      </Box>
    </TabSection>
  </>
)

const MatchInsightsPanel = React.memo(function MatchInsightsPanel({
  currentProfile,
  visibleDecision,
  connectedCount,
  savedCount,
  passedCount,
}: MatchInsightsPanelProps) {
  const [tab, setTab] = React.useState<TabKey>("overview")

  // Reset to Overview whenever the candidate changes.
  const profileId = currentProfile?.id
  React.useEffect(() => {
    setTab("overview")
  }, [profileId])

  if (!currentProfile) {
    return (
      <Box className="dossier">
        <Box className="dossierEmpty">
          <Typography className="emptyStateTitle">Review summary</Typography>
          <Typography className="mutedText">
            Connected {connectedCount} · Shortlisted {savedCount} · Passed {passedCount}
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box className="dossier">
      <Box className="dossierHead">
        <Typography className="dossierEyebrow">Current match</Typography>
        <Box className="dossierIdentity">
          <Box className="dossierIdentityText">
            <Typography className="dossierName" component="div">
              <span>{currentProfile.name}</span>
              {currentProfile.verified && (
                <VerifiedRounded className="dossierVerified" sx={{ fontSize: 20, color: "primary.main" }} />
              )}
            </Typography>
            <Typography className="dossierRole">{currentProfile.title}</Typography>
          </Box>
          <MatchScoreGauge value={currentProfile.fitScore} size={84} stroke={7} />
        </Box>

        <Box className="dossierChips">
          <Box className="dossierChip">
            <small>Type</small>
            <b>{currentProfile.userTypeLabel}</b>
          </Box>
          <Box className="dossierChip">
            <small>Focus</small>
            <b>{currentProfile.profileSubtypeLabel}</b>
          </Box>
          <Box className="dossierChip">
            <small>Capital</small>
            <b>{currentProfile.capital}</b>
          </Box>
        </Box>
      </Box>

      <Box className="dossierTabs" role="tablist">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={tab === item.key}
            className={`segTab ${tab === item.key ? "active" : ""}`}
            onClick={() => setTab(item.key)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </Box>

      <Box className="dossierBody">
        {tab === "overview" && <OverviewTab profile={currentProfile} />}

        {tab === "location" && (
          <TabSection title="Where they are based">
            <MatchLocationMap location={currentProfile.location} mapQuery={currentProfile.mapQuery} />
          </TabSection>
        )}

        {tab === "data" && (
          <TabSection title="Key data">
            <KeyDataDisplay
              role={currentProfile.roleType}
              items={currentProfile.keyDataItems}
              emptyMessage="This profile has not added any key data yet."
            />
          </TabSection>
        )}

        <TabSection title="Action preview">
          <Box className={`actionPreviewCard ${visibleDecision ?? "neutral"}`}>
            <Typography className="actionPreviewLabel">
              {visibleDecision === "like"
                ? "Connect"
                : visibleDecision === "pass"
                  ? "Pass"
                  : visibleDecision === "save"
                    ? "Shortlist"
                    : "Waiting for input"}
            </Typography>
            <Typography className="actionPreviewText">
              {visibleDecision === "like"
                ? "Strong fit worth a conversation — release to connect."
                : visibleDecision === "pass"
                  ? "Not the right fit right now — release to pass."
                  : visibleDecision === "save"
                    ? "Keep this profile for later review."
                    : "Drag the card, use the dock, or press the arrow keys to decide."}
            </Typography>
          </Box>
        </TabSection>
      </Box>
    </Box>
  )
})

export default MatchInsightsPanel
