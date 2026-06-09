"use client"

import React from "react"
import {
  Avatar,
  Box,
  Button,
  Chip,
  DialogActions,
  DialogContent,
  Stack,
  Tooltip,
  Typography,
  styled,
} from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import StraightenIcon from "@mui/icons-material/Straighten"
import HubOutlinedIcon from "@mui/icons-material/HubOutlined"
import { useRouter } from "next/navigation"
import DashboardModal from "@/components/ui/Dashboard/DashboardModal"
import KeyDataDisplay from "@/components/ui/Dashboard/KeyDataDisplay"
import { parseKeyData } from "@/lib/keyData"
import { primary, common, text, background } from "@/theme/palette"
import type { DashboardMatchRow } from "./allMatches.types"
import { getNameInitials } from "./matchProfileDetail.helpers"

function humanize(value?: string | null): string {
  if (!value) return ""
  return value
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function formatCurrency(amount?: number | null): string {
  if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) return ""
  if (amount >= 10_000_000) return `Rs.${(amount / 10_000_000).toFixed(1)}Cr`
  if (amount >= 100_000) return `Rs.${(amount / 100_000).toFixed(1)}L`
  if (amount >= 1_000) return `Rs.${(amount / 1_000).toFixed(0)}K`
  return `Rs.${amount.toLocaleString()}`
}

function formatInvestmentRange(min?: number | null, max?: number | null): string {
  if (!min && !max) return ""
  if (min && max) return `${formatCurrency(min)} - ${formatCurrency(max)}`
  if (min) return `${formatCurrency(min)}+`
  return `Up to ${formatCurrency(max)}`
}

function formatLastSeen(lastActive?: string | null, isOnline?: boolean): string {
  if (isOnline) return "Online now"
  if (!lastActive) return "Last seen unknown"

  const diffMs = Date.now() - new Date(lastActive).getTime()
  const minutes = Math.floor(diffMs / 60_000)

  if (minutes < 2) return "Just now"
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  if (days === 1) return "Yesterday"
  if (days < 30) return `${days}d ago`

  return new Date(lastActive).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  })
}

function formatMatchedDate(matchedAt?: string | null): string {
  if (!matchedAt) return ""
  return new Date(matchedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatDistance(distance?: number | null): string {
  if (typeof distance !== "number" || Number.isNaN(distance)) return ""
  if (distance < 1) return `${distance.toFixed(2)} km`
  if (distance < 10) return `${distance.toFixed(1)} km`
  return `${distance.toFixed(0)} km`
}

function normalizeScore(value?: number | null): number | null {
  if (typeof value !== "number" || Number.isNaN(value)) return null
  const scaledValue = value <= 1 ? value * 100 : value
  return Math.min(100, Math.max(0, scaledValue))
}

function formatPercentScore(value?: number | null): string {
  const normalizedValue = normalizeScore(value)
  return normalizedValue == null ? "" : `${Math.round(normalizedValue)}%`
}

function formatVerificationLabel(isVerified?: boolean, verificationLevel?: number): string {
  if (!isVerified) return "Not verified"
  if (typeof verificationLevel === "number" && verificationLevel > 0) {
    return `Level ${verificationLevel} verified`
  }
  return "Verified"
}

function uniqueCompact(values: Array<string | null | undefined>): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => value?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  )
}

function isMeaningfulLabel(value?: string | null): boolean {
  if (!value) return false
  const trimmedValue = value.trim()
  if (!trimmedValue) return false
  return trimmedValue.toLowerCase() !== "business connection"
}

function normalizeLocationLabel(value?: string | null): string {
  if (!value) return ""
  return value.trim().replace(/\s+/g, " ").toLowerCase()
}

function isSameLabel(left?: string | null, right?: string | null): boolean {
  return normalizeLocationLabel(left) !== "" && normalizeLocationLabel(left) === normalizeLocationLabel(right)
}

const ModalWrap = styled(Box)`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: min(920px, 90vw);
  min-height: 0;
  overflow: hidden;
`

const ProfileHeader = styled(Box)`
  background: linear-gradient(135deg, ${primary.dark} 0%, ${primary.main} 100%);
  padding: 28px 72px 24px 30px;
  position: relative;
`

const OnlineDot = styled(Box)<{ online?: boolean }>`
  position: absolute;
  bottom: 3px;
  right: 3px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: ${({ online }) => (online ? "#22c55e" : common.colorA7B4BF)};
  border: 2.5px solid ${primary.dark};
`

const SectionLabel = styled(Typography)`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${primary.main};
  margin-bottom: 10px;
`

const SectionCard = styled(Box)`
  border: 1px solid ${common.colorE8EBEC};
  border-radius: 12px;
  background: ${background.paper};
  padding: 18px 20px;

  @media (max-width: 760px) {
    padding: 16px;
  }
`

const DetailGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 16px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`

const DetailTile = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 3px;

  .tile-label {
    font-size: 11px;
    font-weight: 600;
    color: ${common.colorA7B4BF};
    line-height: 1.2;
  }

  .tile-value {
    font-size: 12px;
    font-weight: 600;
    color: ${text.primary};
    line-height: 1.45;
    word-break: break-word;
  }
`

const DetailRow = styled(Box)`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 0;

  .detail-label {
    font-size: 11px;
    font-weight: 600;
    color: ${common.colorA7B4BF};
    min-width: 118px;
    flex-shrink: 0;
    padding-top: 1px;
  }
`

const InsightGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`

const InsightTile = styled(Box)`
  padding: 14px;
  border-radius: 12px;
  border: 1px solid rgba(109, 157, 197, 0.18);
  background: linear-gradient(180deg, rgba(175, 236, 239, 0.12), rgba(255, 255, 255, 0.92));

  .insight-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${common.color6D9DC5};
    margin-bottom: 8px;
  }

  .insight-value {
    font-size: 17px;
    font-weight: 700;
    color: ${text.primary};
    line-height: 1.2;
  }

  .insight-helper {
    font-size: 11px;
    color: ${text.secondary};
    line-height: 1.45;
    margin-top: 6px;
  }
`

const ScoreTrack = styled(Box)`
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background-color: rgba(109, 157, 197, 0.18);
  overflow: hidden;
  margin-top: 10px;
`

const ScoreFill = styled(Box)<{ value: number }>`
  width: ${({ value }) => `${value}%`};
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, ${primary.light} 0%, ${primary.main} 100%);
`

const ReasonRow = styled(Box)`
  display: flex;
  align-items: flex-start;
  gap: 10px;

  .reason-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${primary.main};
    margin-top: 6px;
    flex-shrink: 0;
  }

  .reason-text {
    font-size: 12px;
    color: ${text.primary};
    line-height: 1.6;
  }
`

interface MatchProfileDetailModalProps {
  open: boolean
  row: DashboardMatchRow
  onClose: () => void
}

const MatchProfileDetailModal: React.FC<MatchProfileDetailModalProps> = ({
  open,
  row,
  onClose,
}) => {
  const router = useRouter()

  const handleStartChat = () => {
    if (row.conversationId) {
      router.push(`/dashboard/chat?conversationId=${row.conversationId}`)
    }
  }

  const roleType = row.roleType ?? ""
  const aboutText = row.about || row.bio || ""
  const keyDataItems = parseKeyData(row.keyData)
  const matchScoreLabel = formatPercentScore(row.matchScore)
  const matchDistanceLabel = formatDistance(row.distance)
  const companyOrFirmLabel = [
    row.companyProfile?.companyName,
    row.brokerProfile?.firmName,
    row.companyName,
  ].find((value) => {
    if (!isMeaningfulLabel(value)) return false
    if (isSameLabel(value, row.profileTypeLabel)) return false
    return true
  }) || ""

  const roleSummary = uniqueCompact([
    row.userType,
    row.profileTypeLabel && row.profileTypeLabel !== row.userType ? row.profileTypeLabel : undefined,
  ])

  const matchMetrics = [
    {
      label: "Overall match",
      value: matchScoreLabel,
      progress: normalizeScore(row.matchScore),
      helper: "Calculated from profile fit, preferences, and activity.",
    },
    {
      label: "Distance fit",
      value: formatPercentScore(row.compatibilityFactors?.distanceScore),
      progress: normalizeScore(row.compatibilityFactors?.distanceScore),
      helper: "Proximity score based on shared location relevance.",
    },
  ].filter((metric) => metric.value && metric.progress != null)

  const fallbackReasons = [
    row.compatibilityFactors?.roleCompatibility
      ? "Their role and profile type align well with your current matching preferences."
      : "",
    row.compatibilityFactors?.stageMatch
      ? "Stage expectations are close enough to support a productive conversation."
      : "",
    row.compatibilityFactors?.fundingMatch
      ? "Funding intent and deal appetite appear to line up."
      : "",
      (normalizeScore(row.compatibilityFactors?.sectorMatch) ?? 0) > 0
        ? "There is measurable overlap across industry or sector interests."
        : "",
  ].filter(Boolean)

  const blockedReasonPatterns = [/^specializes in\s+/i, /^\d+\+?\s+deals?\s+completed$/i]
  const locationReasonCandidates = new Set(
    uniqueCompact([
      row.address,
      [row.city, row.state, row.country].filter(Boolean).join(", "),
    ]).map((value) => normalizeLocationLabel(value)),
  )

  const matchReasons = (row.matchReasons?.length ? row.matchReasons : fallbackReasons)
    .filter((reason) => {
      const normalizedReason = normalizeLocationLabel(reason)
      if (!normalizedReason) return false
      if (blockedReasonPatterns.some((pattern) => pattern.test(reason))) return false
      if (locationReasonCandidates.has(normalizedReason)) return false
      return true
    })
    .slice(0, 5)

  const profileDetails: Array<{ label: string; value: string }> = []
  const profileTags: Array<{ label: string; values: string[] }> = []

  if (row.userType) {
    profileDetails.push({ label: "Role type", value: row.userType })
  }
  if (companyOrFirmLabel) {
    profileDetails.push({
      label: roleType === "broker" ? "Firm" : "Company",
      value: companyOrFirmLabel,
    })
  }
  if (row.headline && row.headline !== companyOrFirmLabel) {
    profileDetails.push({ label: "Headline", value: row.headline })
  }
  if (roleType === "investor" && row.investorProfile) {
    if (row.investorProfile.investorType) {
      profileDetails.push({
        label: "Investor type",
        value: humanize(row.investorProfile.investorType),
      })
    }
    if (row.investorProfile.investmentRange?.min != null || row.investorProfile.investmentRange?.max != null) {
      profileDetails.push({
        label: "Ticket size",
        value: formatInvestmentRange(
          row.investorProfile.investmentRange?.min,
          row.investorProfile.investmentRange?.max,
        ),
      })
    }
    if ((row.investorProfile.preferredIndustries?.length ?? 0) > 0) {
      profileTags.push({
        label: "Industries",
        values: row.investorProfile.preferredIndustries as string[],
      })
    }
    if ((row.investorProfile.preferredStages?.length ?? 0) > 0) {
      profileTags.push({
        label: "Stages",
        values: (row.investorProfile.preferredStages as string[]).map((stage) => humanize(stage)),
      })
    }
  }

  if (roleType === "company" && row.companyProfile) {
    if (row.companyProfile.companyStage) {
      profileDetails.push({
        label: "Stage",
        value: humanize(row.companyProfile.companyStage),
      })
    }
    if (row.companyProfile.industry) {
      profileDetails.push({ label: "Industry", value: row.companyProfile.industry })
    }
    if (row.companyProfile.sector && row.companyProfile.sector !== row.companyProfile.industry) {
      profileDetails.push({ label: "Sector", value: row.companyProfile.sector })
    }
    if (row.companyProfile.fundingStatus) {
      profileDetails.push({
        label: "Funding status",
        value: humanize(row.companyProfile.fundingStatus),
      })
    }
    if (row.companyProfile.fundingAmount != null && row.companyProfile.fundingAmount > 0) {
      profileDetails.push({
        label: "Seeking",
        value: formatCurrency(row.companyProfile.fundingAmount),
      })
    }
  }

  if (roleType === "broker" && row.brokerProfile) {
    if (row.brokerProfile.firmName && row.brokerProfile.firmName !== companyOrFirmLabel) {
      profileDetails.push({ label: "Firm", value: row.brokerProfile.firmName })
    }
    if (row.brokerProfile.brokerType) {
      profileDetails.push({
        label: "Broker type",
        value: humanize(row.brokerProfile.brokerType),
      })
    }
  }

  if (row.industry && roleType !== "company") {
    profileDetails.push({ label: "Industry", value: row.industry })
  }

  if (row.stage && roleType !== "company") {
    profileDetails.push({ label: "Funding stage", value: humanize(row.stage) })
  }

  const connectionDetails: Array<{ label: string; value: string }> = [
    { label: "Online / last seen", value: formatLastSeen(row.lastActive, row.isOnline) },
  ]

  if (row.matchedAt) {
    connectionDetails.push({ label: "Matched on", value: formatMatchedDate(row.matchedAt) })
  }
  if (matchDistanceLabel) {
    connectionDetails.push({ label: "Distance", value: matchDistanceLabel })
  }

  return (
    <DashboardModal
      open={open}
      onClose={onClose}
      maxWidth="md"
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(13, 28, 46, 0.22)",
            backdropFilter: "blur(1.5px)",
          },
        },
      }}
    >
      <ModalWrap>
        <ProfileHeader>
          <Stack direction="row" alignItems="flex-start" spacing={2}>
            <Box sx={{ position: "relative", flexShrink: 0 }}>
              <Avatar
                src={row.avatar}
                sx={{
                  width: 72,
                  height: 72,
                  fontSize: 22,
                  fontWeight: 700,
                  bgcolor: primary.light,
                  color: common.white,
                  border: "3px solid rgba(255,255,255,0.25)",
                }}
              >
                {!row.avatar && getNameInitials(row.name)}
              </Avatar>
              <OnlineDot online={row.isOnline} />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: common.white,
                    lineHeight: 1.2,
                    wordBreak: "break-word",
                  }}
                >
                  {row.name}
                </Typography>
                {row.verified && (
                  <Tooltip title={formatVerificationLabel(row.verified, row.verificationLevel)}>
                    <CheckCircleIcon sx={{ fontSize: 17, color: "#7FDED8", flexShrink: 0 }} />
                  </Tooltip>
                )}
              </Stack>

              {roleSummary.length > 0 && (
                <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.78)", mt: 0.5 }}>
                  {roleSummary.join(" - ")}
                </Typography>
              )}

              {companyOrFirmLabel && (
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: common.white,
                    mt: 0.75,
                    lineHeight: 1.35,
                  }}
                >
                  {companyOrFirmLabel}
                </Typography>
              )}

              {row.headline && row.headline !== companyOrFirmLabel && (
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.85)",
                    lineHeight: 1.55,
                    mt: 0.75,
                    maxWidth: "95%",
                  }}
                >
                  {row.headline}
                </Typography>
              )}

              <Stack direction="row" spacing={1} mt={1.5} flexWrap="wrap" sx={{ gap: "6px" }}>
                <Chip
                  icon={
                    <Box
                      component="span"
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        bgcolor: row.isOnline ? "#22c55e" : common.colorA7B4BF,
                        ml: "8px !important",
                        mr: "-4px !important",
                      }}
                    />
                  }
                  label={formatLastSeen(row.lastActive, row.isOnline)}
                  size="small"
                  sx={headerChipSx}
                />

                {matchScoreLabel && (
                  <Chip
                    icon={
                      <HubOutlinedIcon
                        sx={{
                          fontSize: "13px !important",
                          ml: "6px !important",
                          mr: "-4px !important",
                          color: "rgba(255,255,255,0.8) !important",
                        }}
                      />
                    }
                    label={`${matchScoreLabel} fit`}
                    size="small"
                    sx={headerChipSx}
                  />
                )}

                {matchDistanceLabel && (
                  <Chip
                    icon={
                      <StraightenIcon
                        sx={{
                          fontSize: "13px !important",
                          ml: "6px !important",
                          mr: "-4px !important",
                          color: "rgba(255,255,255,0.8) !important",
                        }}
                      />
                    }
                    label={`${matchDistanceLabel} away`}
                    size="small"
                    sx={headerChipSx}
                  />
                )}

                {row.matchedAt && (
                  <Chip
                    icon={
                      <CalendarTodayIcon
                        sx={{
                          fontSize: "11px !important",
                          ml: "6px !important",
                          mr: "-4px !important",
                          color: "rgba(255,255,255,0.8) !important",
                        }}
                      />
                    }
                    label={`Matched ${formatMatchedDate(row.matchedAt)}`}
                    size="small"
                    sx={headerChipSx}
                  />
                )}
              </Stack>
            </Box>
          </Stack>
        </ProfileHeader>

        <DialogContent
          sx={{
            px: "30px",
            pt: "28px",
            pb: "30px",
            overflowY: "auto",
            flex: 1,
            minHeight: 0,
          }}
        >
          <Stack spacing={3}>
            {aboutText && (
              <Box>
                <SectionLabel>About</SectionLabel>
                <SectionCard>
                  <Typography sx={{ fontSize: 12, color: text.secondary, lineHeight: 1.7 }}>
                    {aboutText}
                  </Typography>
                </SectionCard>
              </Box>
            )}

            {(matchMetrics.length > 0 || matchReasons.length > 0) && (
              <Box>
                <SectionLabel>Match insights</SectionLabel>
                  <Stack spacing={2}>
                    {matchMetrics.length > 0 && (
                      <InsightGrid>
                        {matchMetrics.map((metric) => (
                          <InsightTile key={metric.label}>
                            <Typography className="insight-label">{metric.label}</Typography>
                            <Typography className="insight-value">{metric.value}</Typography>
                            {metric.helper && (
                              <Typography className="insight-helper">{metric.helper}</Typography>
                            )}
                            {metric.progress != null && (
                              <ScoreTrack>
                                <ScoreFill value={metric.progress} />
                              </ScoreTrack>
                            )}
                          </InsightTile>
                        ))}
                      </InsightGrid>
                    )}

                    {matchReasons.length > 0 && (
                      <Stack spacing={1.25}>
                        {matchReasons.map((reason) => (
                          <ReasonRow key={reason}>
                            <Box className="reason-dot" />
                            <Typography className="reason-text">{reason}</Typography>
                          </ReasonRow>
                        ))}
                      </Stack>
                    )}
                  </Stack>
              </Box>
            )}

            <Box>
              <SectionLabel>Profile details</SectionLabel>
              <SectionCard>
                {profileDetails.length > 0 ? (
                  <DetailGrid>
                    {profileDetails.map((detail) => (
                      <DetailTile key={detail.label}>
                        <Typography className="tile-label">{detail.label}</Typography>
                        <Typography className="tile-value">{detail.value}</Typography>
                      </DetailTile>
                    ))}
                  </DetailGrid>
                ) : (
                  <Typography sx={{ fontSize: 12, color: text.secondary }}>
                    Profile details have not been shared yet.
                  </Typography>
                )}

                {profileTags.length > 0 && (
                  <Stack spacing={1.25} mt={2}>
                    {profileTags.map((tagGroup) => (
                      <DetailRow key={tagGroup.label}>
                        <Typography className="detail-label">{tagGroup.label}</Typography>
                        <Stack direction="row" flexWrap="wrap" gap={0.75}>
                          {tagGroup.values.map((value) => (
                            <Chip
                              key={`${tagGroup.label}-${value}`}
                              label={value}
                              size="small"
                              sx={detailChipSx}
                            />
                          ))}
                        </Stack>
                      </DetailRow>
                    ))}
                  </Stack>
                )}
              </SectionCard>
            </Box>

            <Box>
              <SectionLabel>Key data</SectionLabel>
              {keyDataItems.length > 0 ? (
                <KeyDataDisplay
                  role={roleType}
                  items={keyDataItems}
                  emptyMessage="This matched profile has not added any key data yet."
                />
              ) : (
                <SectionCard>
                  <Typography sx={{ fontSize: 12, color: text.secondary }}>
                    This matched profile has not added any key data yet.
                  </Typography>
                </SectionCard>
              )}
            </Box>

            <Box>
              <SectionLabel>Connection details</SectionLabel>
              <SectionCard>
                <DetailGrid>
                  {connectionDetails.map((detail) => (
                    <DetailTile key={detail.label}>
                      <Typography className="tile-label">{detail.label}</Typography>
                      <Typography className="tile-value">{detail.value}</Typography>
                    </DetailTile>
                  ))}
                </DetailGrid>
              </SectionCard>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: "30px", py: "20px", borderTop: `1px solid ${common.colorE8EBEC}` }}>
          <Stack direction="row" spacing={1.5} width="100%">
            <Button
              variant="outlined"
              fullWidth
              onClick={onClose}
              sx={{
                height: 40,
                fontSize: 12,
                fontWeight: 500,
                borderColor: common.colorD5D7DA,
                color: text.secondary,
                borderRadius: "8px",
                textTransform: "none",
                "&:hover": {
                  borderColor: primary.main,
                  color: primary.main,
                  bgcolor: "transparent",
                },
              }}
            >
              Close
            </Button>
            {row.canChat && row.conversationId && (
              <Button
                variant="contained"
                fullWidth
                disableElevation
                startIcon={<ChatBubbleOutlineIcon sx={{ fontSize: 15 }} />}
                onClick={handleStartChat}
                sx={{
                  height: 40,
                  fontSize: 12,
                  fontWeight: 600,
                  bgcolor: primary.main,
                  borderRadius: "8px",
                  textTransform: "none",
                  "&:hover": { bgcolor: primary.dark },
                }}
              >
                Start Chat
              </Button>
            )}
          </Stack>
        </DialogActions>
      </ModalWrap>
    </DashboardModal>
  )
}

const headerChipSx = {
  height: 24,
  fontSize: 10,
  fontWeight: 500,
  bgcolor: "rgba(255,255,255,0.15)",
  color: "rgba(255,255,255,0.9)",
  border: "1px solid rgba(255,255,255,0.2)",
  "& .MuiChip-label": { px: 1 },
}

const detailChipSx = {
  height: 22,
  fontSize: 11,
  fontWeight: 500,
  bgcolor: background.paper,
  color: text.secondary,
  border: `1px solid ${common.colorE8EBEC}`,
}

export default MatchProfileDetailModal
