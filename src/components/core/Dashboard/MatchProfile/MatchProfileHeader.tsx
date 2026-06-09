"use client"

import { TuneRounded } from "@mui/icons-material"
import { Badge, Box, Button, Stack, Typography } from "@mui/material"
import React from "react"
import type { HeaderStat } from "./matchProfileTypes"

type MatchProfileHeaderProps = {
  headerStats: HeaderStat[]
  activeFilterCount: number
  onOpenFilters: () => void
}

const MatchProfileHeader = React.memo(function MatchProfileHeader({
  headerStats,
  activeFilterCount,
  onOpenFilters,
}: MatchProfileHeaderProps) {
  return (
    <Stack
      className="matchProfileHeader"
      direction={{ xs: "column", xl: "row" }}
      alignItems={{ xs: "flex-start", xl: "center" }}
      justifyContent="space-between"
      spacing={2}
    >
      <Box>
        <Typography className="pageEyebrow">Desktop Match Flow</Typography>
        <Typography variant="h2" className="pageTitle">
          Match Profile
        </Typography>
        <Typography className="pageSubtitle">
          A swipe-style founder and investor queue for the web. Drag left to pass, drag right
          to connect, or shortlist a profile for later review.
        </Typography>
      </Box>

      <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
        <Box className="headerStatsGrid">
          {headerStats.map((item) => (
            <Box key={item.label} className="headerStatCard">
              <Typography className="headerStatValue">{item.value}</Typography>
              <Typography className="headerStatLabel">{item.label}</Typography>
            </Box>
          ))}
        </Box>
        <Badge badgeContent={activeFilterCount} color="primary" overlap="rectangular">
          <Button
            variant="outlined"
            size="small"
            startIcon={<TuneRounded />}
            onClick={onOpenFilters}
            sx={{ whiteSpace: "nowrap", minWidth: 120 }}
          >
            {activeFilterCount > 0
              ? `${activeFilterCount} Filter${activeFilterCount > 1 ? "s" : ""}`
              : "Filters"}
          </Button>
        </Badge>
      </Stack>
    </Stack>
  )
})

export default MatchProfileHeader
