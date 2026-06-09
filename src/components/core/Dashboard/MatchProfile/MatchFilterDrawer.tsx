"use client"

import { CloseRounded, FilterListRounded, MyLocationRounded } from "@mui/icons-material"
import { Box, Button, Chip, Divider, Drawer, Slider, Stack, Switch, Typography } from "@mui/material"
import React from "react"
import { DEFAULT_MATCH_PREFERENCES } from "@/lib/matchmaking-api"
import type { MatchFilterDrawerProps } from "./matchProfileTypes"

const ROLE_OPTIONS = ["investor", "company", "broker"] as const
const INVESTOR_TYPE_OPTIONS = [
  { value: "angel", label: "Angel" },
  { value: "venture_capital", label: "Venture Capital" },
  { value: "individual", label: "Individual" },
  { value: "institutional", label: "Institutional" },
  { value: "private_equity", label: "Private Equity" },
] as const
const INDUSTRY_OPTIONS = [
  "Technology",
  "Healthcare",
  "Finance",
  "Real Estate",
  "Energy",
  "Retail",
  "Manufacturing",
  "Education",
  "Media",
  "Transportation",
  "Food & Beverage",
  "SaaS",
] as const
const FUNDING_STAGE_OPTIONS = [
  { value: "idea", label: "Idea" },
  { value: "mvp", label: "MVP" },
  { value: "pre_seed", label: "Pre-Seed" },
  { value: "seed", label: "Seed" },
  { value: "pre_revenue", label: "Pre-Revenue" },
  { value: "series_a", label: "Series A" },
  { value: "series_b", label: "Series B" },
  { value: "series_c", label: "Series C" },
  { value: "revenue_generating", label: "Revenue Generating" },
  { value: "growth", label: "Growth" },
  { value: "mature", label: "Mature" },
  { value: "ipo", label: "IPO" },
] as const
const FUNDING_STATUS_OPTIONS = [
  { value: "seeking", label: "Seeking Funding" },
  { value: "funded", label: "Funded" },
  { value: "not_seeking", label: "Not Seeking" },
] as const

const MatchFilterDrawer = React.memo(function MatchFilterDrawer({
  open,
  activeFilterCount,
  draftPrefs,
  isSavingFilter,
  isDetectingLocation,
  onClose,
  onDraftChange,
  onDetectLocation,
  onSave,
}: MatchFilterDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: { xs: "100%", sm: 480 }, display: "flex", flexDirection: "column" } } }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" px={3} py={2.5} borderBottom="1px solid" borderColor="divider">
        <Stack direction="row" alignItems="center" spacing={1}>
          <FilterListRounded sx={{ color: "primary.main" }} />
          <Typography variant="h6" fontWeight={700}>Filters</Typography>
          {activeFilterCount > 0 && (
            <Box sx={{ px: 1, py: 0.25, borderRadius: 999, bgcolor: "primary.main", lineHeight: 1 }}>
              <Typography variant="caption" fontWeight={700} color="white">{activeFilterCount}</Typography>
            </Box>
          )}
        </Stack>
        <Button size="small" onClick={onClose} sx={{ minWidth: 0, p: 0.5 }}>
          <CloseRounded />
        </Button>
      </Stack>

      <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2 }}>
        <Stack spacing={3}>
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
              <Typography variant="body2" fontWeight={700}>Max distance</Typography>
              <Typography variant="body2" fontWeight={700} color="primary">
                {draftPrefs.maxDistance >= 500 ? "Any distance" : `Within ${draftPrefs.maxDistance} km`}
              </Typography>
            </Stack>
            <Slider
              value={draftPrefs.maxDistance}
              onChange={(_event, value) => onDraftChange((prefs) => ({ ...prefs, maxDistance: value as number }))}
              min={5}
              max={500}
              step={5}
              marks={[
                { value: 5, label: "5 km" },
                { value: 100, label: "100 km" },
                { value: 300, label: "300 km" },
                { value: 500, label: "Any" },
              ]}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => (value >= 500 ? "Any" : `${value} km`)}
            />
            <Button
              variant="text"
              size="small"
              startIcon={<MyLocationRounded />}
              onClick={onDetectLocation}
              disabled={isDetectingLocation}
              sx={{ mt: 0.5, px: 0 }}
            >
              {isDetectingLocation ? "Detecting..." : "Use my current location"}
            </Button>
          </Box>

          <Divider />
          <ChipGroup
            title="Profile type"
            values={ROLE_OPTIONS}
            selected={draftPrefs.roleTypes}
            getLabel={(role) => role.charAt(0).toUpperCase() + role.slice(1)}
            onToggle={(role) => onDraftChange((prefs) => ({
              ...prefs,
              roleTypes: prefs.roleTypes.includes(role)
                ? prefs.roleTypes.filter((item) => item !== role)
                : [...prefs.roleTypes, role],
            }))}
            helper="Leave unselected to show all types."
          />

          <Divider />
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="body2" fontWeight={700}>Verified profiles only</Typography>
              <Typography variant="caption" color="text.secondary">Show only identity-verified accounts.</Typography>
            </Box>
            <Switch
              checked={draftPrefs.verifiedOnly}
              onChange={(event) => onDraftChange((prefs) => ({ ...prefs, verifiedOnly: event.target.checked }))}
              color="primary"
            />
          </Stack>

          <Divider />
          <ChipGroup
            title="Investor type"
            values={INVESTOR_TYPE_OPTIONS.map((item) => item.value)}
            selected={draftPrefs.investorTypes}
            getLabel={(value) => INVESTOR_TYPE_OPTIONS.find((item) => item.value === value)?.label || value}
            onToggle={(value) => onDraftChange((prefs) => ({
              ...prefs,
              investorTypes: prefs.investorTypes.includes(value)
                ? prefs.investorTypes.filter((item) => item !== value)
                : [...prefs.investorTypes, value],
            }))}
          />

          <Divider />
          <ChipGroup
            title="Industry"
            values={INDUSTRY_OPTIONS}
            selected={draftPrefs.industries}
            getLabel={(value) => value}
            onToggle={(value) => onDraftChange((prefs) => ({
              ...prefs,
              industries: prefs.industries.includes(value)
                ? prefs.industries.filter((item) => item !== value)
                : [...prefs.industries, value],
            }))}
          />

          <Divider />
          <ChipGroup
            title="Funding / company stage"
            values={FUNDING_STAGE_OPTIONS.map((item) => item.value)}
            selected={draftPrefs.fundingStages}
            getLabel={(value) => FUNDING_STAGE_OPTIONS.find((item) => item.value === value)?.label || value}
            onToggle={(value) => onDraftChange((prefs) => ({
              ...prefs,
              fundingStages: prefs.fundingStages.includes(value)
                ? prefs.fundingStages.filter((item) => item !== value)
                : [...prefs.fundingStages, value],
            }))}
          />

          <Divider />
          <ChipGroup
            title="Funding status"
            values={FUNDING_STATUS_OPTIONS.map((item) => item.value)}
            selected={draftPrefs.fundingStatuses}
            getLabel={(value) => FUNDING_STATUS_OPTIONS.find((item) => item.value === value)?.label || value}
            onToggle={(value) => onDraftChange((prefs) => ({
              ...prefs,
              fundingStatuses: prefs.fundingStatuses.includes(value)
                ? prefs.fundingStatuses.filter((item) => item !== value)
                : [...prefs.fundingStatuses, value],
            }))}
          />
        </Stack>
      </Box>

      <Stack direction="row" spacing={1.5} px={3} py={2.5} borderTop="1px solid" borderColor="divider">
        <Button
          variant="outlined"
          fullWidth
          onClick={() => onDraftChange(DEFAULT_MATCH_PREFERENCES)}
          disabled={isSavingFilter}
        >
          Reset all
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={onSave}
          disabled={isSavingFilter}
        >
          {isSavingFilter ? "Saving..." : "Apply filters"}
        </Button>
      </Stack>
    </Drawer>
  )
})

type ChipGroupProps<T extends string> = {
  title: string
  values: readonly T[]
  selected: readonly string[]
  getLabel: (value: T) => string
  onToggle: (value: T) => void
  helper?: string
}

const ChipGroup = <T extends string>({
  title,
  values,
  selected,
  getLabel,
  onToggle,
  helper,
}: ChipGroupProps<T>) => (
  <Box>
    <Typography variant="body2" fontWeight={700} mb={1.5}>{title}</Typography>
    <Stack direction="row" flexWrap="wrap" gap={1}>
      {values.map((value) => (
        <Chip
          key={value}
          label={getLabel(value)}
          clickable
          color={selected.includes(value) ? "primary" : "default"}
          variant={selected.includes(value) ? "filled" : "outlined"}
          onClick={() => onToggle(value)}
          size="small"
        />
      ))}
    </Stack>
    {helper && (
      <Typography variant="caption" color="text.secondary" mt={0.75} display="block">
        {helper}
      </Typography>
    )}
  </Box>
)

export default MatchFilterDrawer
