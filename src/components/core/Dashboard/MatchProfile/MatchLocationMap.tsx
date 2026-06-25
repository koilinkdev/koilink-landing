"use client"

import { LaunchRounded, MapRounded, PlaceOutlined } from "@mui/icons-material"
import { Box, Typography } from "@mui/material"
import React from "react"

type MatchLocationMapProps = {
  /** Display label, e.g. "Kolkata, West Bengal, India". */
  location: string
  /** Cleaned query for the map, or null when the profile hid its location. */
  mapQuery: string | null
}

/**
 * Keyless map preview. The classic `maps.google.com/maps?...&output=embed`
 * endpoint renders an interactive map from a text query without an API key,
 * which suits us since match suggestions only expose a location string.
 */
const buildEmbedUrl = (query: string) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=11&ie=UTF8&iwloc=&output=embed`

const buildLinkUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

const MatchLocationMap = React.memo(function MatchLocationMap({
  location,
  mapQuery,
}: MatchLocationMapProps) {
  if (!mapQuery) {
    return (
      <Box className="locationCard locationCardEmpty">
        <Box className="locationPinBadge">
          <PlaceOutlined fontSize="small" />
        </Box>
        <Box>
          <Typography className="locationLabel">Location</Typography>
          <Typography className="locationEmptyText">
            This profile has not shared a location yet.
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box className="locationCard">
      <Box className="locationHeader">
        <Box className="locationPinBadge">
          <PlaceOutlined fontSize="small" />
        </Box>
        <Box className="locationHeaderText">
          <Typography className="locationLabel">Location</Typography>
          <Typography className="locationValue" title={location}>
            {location}
          </Typography>
        </Box>
        <a
          className="locationLink"
          href={buildLinkUrl(mapQuery)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <LaunchRounded fontSize="small" />
          <span>Open in Maps</span>
        </a>
      </Box>

      <Box className="locationMapFrame">
        <iframe
          title={`Map showing ${location}`}
          src={buildEmbedUrl(mapQuery)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <a
          className="locationMapOverlayLink"
          href={buildLinkUrl(mapQuery)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${location} in Google Maps`}
        >
          <span className="locationMapOverlayChip">
            <MapRounded fontSize="small" />
            View larger map
          </span>
        </a>
      </Box>
    </Box>
  )
})

export default MatchLocationMap
