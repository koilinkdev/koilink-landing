import React from "react"
import { getSignedReadableImageUrl } from "@/lib/chat-api"
import type { MatchProfileCard } from "@/lib/matchmaking-presenters"
import { isLocalAssetUrl, isRemoteImageUrl, VISIBLE_IMAGE_WINDOW } from "./matchProfileUtils"

export const useResolvedMatchImages = (
  profiles: MatchProfileCard[],
  activeIndex: number,
) => {
  const [resolvedImageUrls, setResolvedImageUrls] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    const unresolvedProfiles = profiles
      .slice(activeIndex, activeIndex + VISIBLE_IMAGE_WINDOW)
      .filter(
        (profile) =>
          profile.image &&
          isRemoteImageUrl(profile.image) &&
          !resolvedImageUrls[profile.id],
      )

    if (unresolvedProfiles.length === 0) {
      return
    }

    let cancelled = false

    const resolveImages = async () => {
      const resolvedEntries = await Promise.all(
        unresolvedProfiles.map(async (profile) => {
          try {
            const signedUrl = await getSignedReadableImageUrl(profile.image)
            return [profile.id, signedUrl] as const
          } catch {
            return [profile.id, profile.fallbackImage] as const
          }
        }),
      )

      if (cancelled) return

      setResolvedImageUrls((previousUrls) => {
        const nextUrls = { ...previousUrls }
        for (const [profileId, imageUrl] of resolvedEntries) {
          nextUrls[profileId] = imageUrl
        }
        return nextUrls
      })
    }

    void resolveImages()

    return () => {
      cancelled = true
    }
  }, [activeIndex, profiles, resolvedImageUrls])

  return React.useCallback(
    (profile: MatchProfileCard) => {
      if (resolvedImageUrls[profile.id]) return resolvedImageUrls[profile.id]
      if (isLocalAssetUrl(profile.image)) return profile.image
      return profile.fallbackImage
    },
    [resolvedImageUrls],
  )
}
