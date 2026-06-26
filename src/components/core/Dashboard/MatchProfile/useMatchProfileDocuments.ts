import React from "react"
import { getProfileDocumentsByUserId } from "@/lib/profile-api"
import type { ProfileDocument } from "@/lib/profileDocuments"
import type { MatchProfileCard } from "@/lib/matchmaking-presenters"

/**
 * Lazily loads each candidate's public documents by userId for the cards in view
 * (current + a small prefetch window), caching per user so swiping back and forth
 * never refetches. Returns `undefined` for a user that hasn't loaded yet (so the UI
 * can show a loading state) and `[]` once loaded with no documents.
 */
export const useMatchProfileDocuments = (
  profiles: MatchProfileCard[],
  activeIndex: number,
) => {
  const [documentsByUser, setDocumentsByUser] = React.useState<
    Record<string, ProfileDocument[]>
  >({})

  React.useEffect(() => {
    const windowProfiles = profiles.slice(activeIndex, activeIndex + 2)
    const pendingUserIds = windowProfiles
      .map((profile) => profile.userId)
      .filter((userId): userId is string => Boolean(userId) && documentsByUser[userId] === undefined)

    if (pendingUserIds.length === 0) {
      return
    }

    let cancelled = false

    const loadDocuments = async () => {
      await Promise.all(
        pendingUserIds.map(async (userId) => {
          try {
            const documents = await getProfileDocumentsByUserId(userId)
            if (cancelled) return
            setDocumentsByUser((previous) => ({ ...previous, [userId]: documents }))
          } catch {
            if (cancelled) return
            // Cache an empty result so we don't hammer a failing endpoint on every swipe.
            setDocumentsByUser((previous) => ({ ...previous, [userId]: [] }))
          }
        }),
      )
    }

    void loadDocuments()

    return () => {
      cancelled = true
    }
  }, [activeIndex, profiles, documentsByUser])

  return React.useCallback(
    (userId?: string): ProfileDocument[] | undefined =>
      userId ? documentsByUser[userId] : undefined,
    [documentsByUser],
  )
}
