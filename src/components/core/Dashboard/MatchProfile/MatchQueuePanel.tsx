"use client"

import { Box, Typography } from "@mui/material"
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
    <Box className="queueBlock">
      <Box className="queueHead">
        <Typography className="queueTitle">Up next in your queue</Typography>
        {profiles.length > 0 && (
          <Typography className="queueBadge">{profiles.length} waiting</Typography>
        )}
      </Box>

      {profiles.length > 0 ? (
        <Box className="queueStrip">
          {profiles.map((profile) => {
            const image = getCardImage(profile)
            return (
              <Box key={profile.id} className="queueChip">
                <Box className="queueAvatar">
                  <Image
                    src={image}
                    alt={`${profile.name} preview`}
                    fill
                    sizes="52px"
                    unoptimized={isRemoteImageUrl(image)}
                  />
                </Box>
                <Box className="queueChipText">
                  <Typography className="queueChipName">
                    {formatMatchProfileTitle(profile)}
                  </Typography>
                  <Typography className="queueChipMeta">
                    {profile.userTypeLabel} · {profile.location}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
      ) : (
        <Box className="queueEmpty">
          {isLoadingMore ? "Loading more profiles…" : "No more profiles waiting in the queue."}
        </Box>
      )}
    </Box>
  )
})

export default MatchQueuePanel
