"use client"

import { Box, Stack, Typography } from "@mui/material"
import Image from "next/image"
import React from "react"
import { formatMatchProfileTitle, type MatchProfileCard } from "@/lib/matchmaking-presenters"
import { isRemoteImageUrl } from "./matchProfileUtils"

type MatchQueuePanelProps = {
  profiles: MatchProfileCard[]
  isLoadingMore: boolean
  getCardImage: (profile: MatchProfileCard) => string
}

const MatchQueuePanel = React.memo(function MatchQueuePanel({
  profiles,
  isLoadingMore,
  getCardImage,
}: MatchQueuePanelProps) {
  return (
    <Box className="queuePanel">
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1}
        mb={2}
      >
        <Box>
          <Typography className="sectionTitle">Up Next</Typography>
          <Typography className="sectionSubtitle">
            Quick previews to keep the website flow feeling as fast as the mobile swipe deck.
          </Typography>
        </Box>
        <Typography className="sectionBadge">{profiles.length} in queue</Typography>
      </Stack>

      {profiles.length > 0 ? (
        <Box className="queueGrid">
          {profiles.map((profile) => (
            <Box key={profile.id} className="queueCard">
              <Box className="queueCardImage">
                <Image
                  src={getCardImage(profile)}
                  alt={`${profile.name} preview`}
                  fill
                  sizes="(max-width: 899px) 100vw, 24vw"
                  unoptimized={isRemoteImageUrl(getCardImage(profile))}
                />
              </Box>
              <Box className="queueCardBody">
                <Typography className="queueCardTitle">{formatMatchProfileTitle(profile)}</Typography>
                <Typography className="queueCardMeta">
                  {profile.userTypeLabel} | {profile.location}
                </Typography>
                <Typography className="queueCardText">{profile.highlight}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box className="queueEmptyState">
          {isLoadingMore ? "Loading more profiles..." : "No more profiles waiting in the queue."}
        </Box>
      )}
    </Box>
  )
})

export default MatchQueuePanel
