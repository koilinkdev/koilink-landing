"use client"

import { TuneRounded } from "@mui/icons-material"
import { Box, Typography } from "@mui/material"
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
    <Box className="matchHeader">
      <Box>
        <Typography className="pageEyebrow">Home · Match flow</Typography>
        <Typography variant="h2" className="pageTitle">
          Home
        </Typography>
        <Typography className="pageSubtitle">
          Swipe through founders and investors. Drag right to connect, left to pass, or up to
          shortlist — full context and location sit in the dossier.
        </Typography>
      </Box>

      <Box className="statRail">
        {headerStats.map((item) => (
          <Box key={item.label} className={`statPill ${item.label === "Remaining" ? "accent" : ""}`}>
            <b>{item.value}</b>
            <span>{item.label}</span>
          </Box>
        ))}
        <button type="button" className="filterButton" onClick={onOpenFilters}>
          <TuneRounded />
          Filters
          {activeFilterCount > 0 && <span className="filterCount">{activeFilterCount}</span>}
        </button>
      </Box>
    </Box>
  )
})

export default MatchProfileHeader
