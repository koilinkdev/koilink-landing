import React from "react"
import { getSignedReadableImageUrl } from "@/lib/chat-api"
import type { MatchProfileCard } from "@/lib/matchmaking-presenters"
import { isLocalAssetUrl, isRemoteImageUrl, VISIBLE_IMAGE_WINDOW } from "./matchProfileUtils"

/**
 * Resolves S3 photo URLs to short-lived signed-read URLs for the cards currently
 * in view. Works at the URL level (not per-profile) so every photo in a profile's
 * gallery gets resolved, and shared/duplicate URLs are only signed once.
 */
export const useResolvedMatchImages = (
  profiles: MatchProfileCard[],
  activeIndex: number,
) => {
  const [resolvedByUrl, setResolvedByUrl] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    const windowProfiles = profiles.slice(activeIndex, activeIndex + VISIBLE_IMAGE_WINDOW)

    const pendingUrls = new Set<string>()
    for (const profile of windowProfiles) {
      const candidateUrls = profile.images?.length ? profile.images : [profile.image]
      for (const url of candidateUrls) {
        if (url && isRemoteImageUrl(url) && !resolvedByUrl[url]) {
          pendingUrls.add(url)
        }
      }
    }

    if (pendingUrls.size === 0) {
      return
    }

    let cancelled = false

    const resolveImages = async () => {
      const resolvedEntries = await Promise.all(
        Array.from(pendingUrls).map(async (url) => {
          try {
            return [url, await getSignedReadableImageUrl(url)] as const
          } catch {
            return [url, ""] as const
          }
        }),
      )

      if (cancelled) return

      setResolvedByUrl((previousUrls) => {
        const nextUrls = { ...previousUrls }
        for (const [url, signedUrl] of resolvedEntries) {
          if (signedUrl) nextUrls[url] = signedUrl
        }
        return nextUrls
      })
    }

    void resolveImages()

    return () => {
      cancelled = true
    }
  }, [activeIndex, profiles, resolvedByUrl])

  const resolveUrl = React.useCallback(
    (url: string | undefined, fallback: string) => {
      if (url && resolvedByUrl[url]) return resolvedByUrl[url]
      if (isLocalAssetUrl(url)) return url as string
      return fallback
    },
    [resolvedByUrl],
  )

  const getCardImage = React.useCallback(
    (profile: MatchProfileCard) => resolveUrl(profile.image, profile.fallbackImage),
    [resolveUrl],
  )

  const getCardImages = React.useCallback(
    (profile: MatchProfileCard) => {
      const urls = profile.images?.length ? profile.images : [profile.image]
      return urls.map((url) => resolveUrl(url, profile.fallbackImage))
    },
    [resolveUrl],
  )

  return { getCardImage, getCardImages }
}
