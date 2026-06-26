"use client"

import { ChevronLeftRounded, ChevronRightRounded } from "@mui/icons-material"
import { Box, IconButton } from "@mui/material"
import Image from "next/image"
import React from "react"
import { isRemoteImageUrl } from "./matchProfileUtils"

type MatchCardPhotosProps = {
  images: string[]
  alt: string
  priority?: boolean
}

/**
 * Photo carousel for the front match card. Navigation is via arrow buttons only
 * (not drag): the buttons stop pointer propagation so tapping them never starts a
 * card swipe, while the rest of the card stays free for the swipe gesture.
 */
const MatchCardPhotos = ({ images, alt, priority }: MatchCardPhotosProps) => {
  const safeImages = images.length > 0 ? images : []
  const [index, setIndex] = React.useState(0)

  // Clamp if the gallery shrinks (e.g. an image fails to resolve).
  const activeIndex = Math.min(index, Math.max(safeImages.length - 1, 0))
  const hasMultiple = safeImages.length > 1

  const stopPointer = (event: React.PointerEvent) => event.stopPropagation()

  const goTo = (next: number) => {
    if (safeImages.length === 0) return
    const wrapped = (next + safeImages.length) % safeImages.length
    setIndex(wrapped)
  }

  const handlePrev = (event: React.MouseEvent) => {
    event.stopPropagation()
    goTo(activeIndex - 1)
  }
  const handleNext = (event: React.MouseEvent) => {
    event.stopPropagation()
    goTo(activeIndex + 1)
  }

  const activeImage = safeImages[activeIndex]

  return (
    <Box className="cardImage">
      {activeImage && (
        <Image
          key={activeIndex}
          src={activeImage}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 1099px) 100vw, 50vw"
          unoptimized={isRemoteImageUrl(activeImage)}
        />
      )}

      {hasMultiple && (
        <>
          {/* Segment indicators (Instagram/Tinder style) */}
          <Box className="cardPhotoSegments" aria-hidden>
            {safeImages.map((image, segmentIndex) => (
              <Box
                key={`${segmentIndex}-${image.slice(0, 24)}`}
                className={`cardPhotoSegment ${segmentIndex === activeIndex ? "isActive" : ""}`}
              />
            ))}
          </Box>

          <IconButton
            className="cardPhotoArrow left"
            onPointerDown={stopPointer}
            onClick={handlePrev}
            aria-label="Previous photo"
            size="small"
          >
            <ChevronLeftRounded />
          </IconButton>
          <IconButton
            className="cardPhotoArrow right"
            onPointerDown={stopPointer}
            onClick={handleNext}
            aria-label="Next photo"
            size="small"
          >
            <ChevronRightRounded />
          </IconButton>
        </>
      )}
    </Box>
  )
}

export default MatchCardPhotos
