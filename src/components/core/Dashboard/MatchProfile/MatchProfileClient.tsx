"use client"

import { Box } from "@mui/material"
import { useRouter } from "next/navigation"
import React from "react"
import {
  DEFAULT_MATCH_PREFERENCES,
  getMatchPreferencesApi,
  getMatchSuggestionsApi,
  swipeProfileApi,
  undoSwipeApi,
  updateMatchPreferencesApi,
  type MatchPreferences,
} from "@/lib/matchmaking-api"
import { mapSuggestionToCard, type MatchProfileCard } from "@/lib/matchmaking-presenters"
import { getSignedReadableUploadUrl } from "@/lib/chat-api"
import type { ProfileDocument } from "@/lib/profileDocuments"
import { MatchProfileClientStyled } from "@/styledComponents/MatchProfile/MatchProfileClientStyled"
import MatchActionStrip from "./MatchActionStrip"
import MatchDeck from "./MatchDeck"
import MatchFeedbackBanner from "./MatchFeedbackBanner"
import MatchFilterDrawer from "./MatchFilterDrawer"
import MatchInsightsPanel from "./MatchInsightsPanel"
import MatchProfileHeader from "./MatchProfileHeader"
import { getMyLimitsApi } from "@/lib/subscription-api"
import { getShortlistRejection } from "@/lib/shortlist-api"
import { useShortlist } from "../Shortlist/ShortlistProvider"
import type {
  MatchedConversation,
  SwipeDecision,
  SwipeLimitState,
} from "./matchProfileTypes"
import {
  ANIMATION_DURATION,
  MAX_DRAG_DISTANCE,
  PREVIEW_THRESHOLD,
  SUGGESTION_PAGE_SIZE,
  SWIPE_THRESHOLD,
  appendUnique,
  clamp,
  getSwipeLimitState,
  hasQuotaRemaining,
  isTypingTarget,
} from "./matchProfileUtils"
import { useResolvedMatchImages } from "./useResolvedMatchImages"
import { useMatchProfileDocuments } from "./useMatchProfileDocuments"

const countActiveFilters = (preferences: MatchPreferences) => {
  let count = 0
  if (preferences.maxDistance < 500) count++
  if (preferences.roleTypes.length) count++
  if (preferences.verifiedOnly) count++
  if (preferences.investorTypes.length) count++
  if (preferences.industries.length) count++
  if (preferences.fundingStages.length) count++
  if (preferences.fundingStatuses.length) count++
  return count
}

const MatchProfileClient = () => {
  const router = useRouter()
  const shortlist = useShortlist()
  const [profiles, setProfiles] = React.useState<MatchProfileCard[]>([])
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [dragX, setDragX] = React.useState(0)
  const [isDragging, setIsDragging] = React.useState(false)
  const [isAnimating, setIsAnimating] = React.useState(false)
  const [activeDecision, setActiveDecision] = React.useState<SwipeDecision | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isLoadingMore, setIsLoadingMore] = React.useState(false)
  const [hasMore, setHasMore] = React.useState(false)
  const [nextOffset, setNextOffset] = React.useState(0)
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null)
  const [swipeLimitState, setSwipeLimitState] = React.useState<SwipeLimitState | null>(null)
  const [swipesRemaining, setSwipesRemaining] = React.useState<number | "unlimited" | null>(null)
  const [matchedConversation, setMatchedConversation] = React.useState<MatchedConversation>(null)
  const [connectedIds, setConnectedIds] = React.useState<string[]>([])
  const [passedIds, setPassedIds] = React.useState<string[]>([])
  const [savedIds, setSavedIds] = React.useState<string[]>([])
  const [rewindsUsed, setRewindsUsed] = React.useState(0)
  const [rewindLimit, setRewindLimit] = React.useState<number | "unlimited">("unlimited")
  const [isRewinding, setIsRewinding] = React.useState(false)
  const [filterOpen, setFilterOpen] = React.useState(false)
  const [draftPrefs, setDraftPrefs] = React.useState<MatchPreferences>(DEFAULT_MATCH_PREFERENCES)
  const [savedPrefs, setSavedPrefs] = React.useState<MatchPreferences>(DEFAULT_MATCH_PREFERENCES)
  const [isSavingFilter, setIsSavingFilter] = React.useState(false)
  const [isDetectingLocation, setIsDetectingLocation] = React.useState(false)

  const dragStartXRef = React.useRef<number | null>(null)
  const pointerIdRef = React.useRef<number | null>(null)
  const animationTimerRef = React.useRef<number | null>(null)
  const { getCardImage, getCardImages } = useResolvedMatchImages(profiles, activeIndex)
  const getProfileDocuments = useMatchProfileDocuments(profiles, activeIndex)
  const [openingDocumentId, setOpeningDocumentId] = React.useState<string | null>(null)

  const currentProfile = profiles[activeIndex] ?? null
  const nextProfiles = React.useMemo(
    () => profiles.slice(activeIndex + 1, activeIndex + 4),
    [activeIndex, profiles],
  )
  const visibleDecision =
    activeDecision ??
    (dragX >= PREVIEW_THRESHOLD
      ? "like"
      : dragX <= -PREVIEW_THRESHOLD
        ? "pass"
        : null)
  // Only the generic swipe quota gates ordinary swiping.
  const canSwipe = !swipeLimitState
  const canInteract = Boolean(currentProfile) && !isAnimating && !isLoading && canSwipe
  const canShortlist = Boolean(currentProfile) && !isAnimating && !isLoading
  const remainingCount = Math.max(profiles.length - activeIndex, 0)
  const activeFilterCount = React.useMemo(() => countActiveFilters(savedPrefs), [savedPrefs])
  // The persisted total, not this session's tally, so it always agrees with the
  // header badge and the drawer. Connected/Passed stay session-scoped because
  // there is no equivalent persisted surface for them.
  const shortlistedCount = shortlist?.capacity.count ?? savedIds.length
  const headerStats = React.useMemo(() => {
    const stats = [
      // "In deck" rather than "Remaining": this is local deck position, not quota.
      { label: "In deck", value: remainingCount },
      { label: "Connected", value: connectedIds.length },
      { label: "Shortlisted", value: shortlistedCount },
      { label: "Passed", value: passedIds.length },
    ]

    if (typeof swipesRemaining === "number") {
      stats.splice(1, 0, { label: "Swipes left", value: swipesRemaining })
    }

    return stats
  }, [
    connectedIds.length,
    passedIds.length,
    remainingCount,
    shortlistedCount,
    swipesRemaining,
  ])

  const clearAnimationTimer = React.useCallback(() => {
    if (animationTimerRef.current !== null) {
      window.clearTimeout(animationTimerRef.current)
      animationTimerRef.current = null
    }
  }, [])

  const resetMotion = React.useCallback(() => {
    setDragX(0)
    setIsDragging(false)
    dragStartXRef.current = null
    pointerIdRef.current = null
  }, [])

  const loadSuggestions = React.useCallback(async (options?: { reset?: boolean; requestOffset?: number }) => {
    const reset = options?.reset ?? false
    if (reset) {
      setIsLoading(true)
      setFeedbackMessage(null)
    } else {
      setIsLoadingMore(true)
    }

    try {
      const data = await getMatchSuggestionsApi(SUGGESTION_PAGE_SIZE, options?.requestOffset ?? 0)
      const mappedProfiles = data.suggestions.map(mapSuggestionToCard)
      setSwipeLimitState(null)

      setProfiles((previousProfiles) => {
        if (reset) return mappedProfiles

        const existingIds = new Set(previousProfiles.map((profile) => profile.id))
        return [
          ...previousProfiles,
          ...mappedProfiles.filter((profile) => !existingIds.has(profile.id)),
        ]
      })

      setHasMore(data.hasMore)
      setNextOffset(data.offset)

      if (reset) {
        setActiveIndex(0)
        setMatchedConversation(null)
        if (mappedProfiles.length === 0) {
          setFeedbackMessage("No eligible profiles are available right now.")
        }
      }
    } catch (error) {
      setFeedbackMessage(
        error instanceof Error ? error.message : "Failed to load match suggestions.",
      )

      if (reset) {
        setProfiles([])
        setActiveIndex(0)
        setHasMore(false)
        setNextOffset(0)
      }
    } finally {
      if (reset) {
        setIsLoading(false)
      } else {
        setIsLoadingMore(false)
      }
    }
  }, [])

  React.useEffect(() => {
    void loadSuggestions({ reset: true, requestOffset: 0 })
  }, [loadSuggestions])

  React.useEffect(() => {
    getMatchPreferencesApi()
      .then((data) => {
        const loaded: MatchPreferences = { ...DEFAULT_MATCH_PREFERENCES, ...data }
        setDraftPrefs(loaded)
        setSavedPrefs(loaded)
      })
      .catch(() => {
        // Defaults are already usable if preferences cannot load.
      })
  }, [])

  // Quotas are fetched up front so the dock renders real numbers before the user
  // acts, instead of only learning the limit by hitting it.
  const refreshQuotas = React.useCallback(async () => {
    try {
      const limits = await getMyLimitsApi()
      setSwipesRemaining(limits.usage.swipes.remaining)
      setRewindsUsed(limits.usage.rewinds.used)
      setRewindLimit(
        limits.usage.rewinds.unlimited ? "unlimited" : limits.usage.rewinds.limit,
      )

      if (hasQuotaRemaining(limits.usage.swipes.remaining)) {
        setSwipeLimitState(null)
      }
    } catch {
      // Optimistic defaults stay in place; the server is still authoritative on
      // every swipe, so the worst case is one rejected action.
    }
  }, [])

  React.useEffect(() => {
    void refreshQuotas()
  }, [refreshQuotas])

  // Counters reset at midnight, so a tab left open overnight would otherwise show
  // a stale "0 left" until the user tried and failed.
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void refreshQuotas()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [refreshQuotas])

  const advanceProfile = React.useCallback(
    (decision: SwipeDecision) => {
      if (!currentProfile || isAnimating || isLoading) return
      if (!canSwipe && decision !== "save") {
        setFeedbackMessage(swipeLimitState?.message || "Daily swipe limit reached.")
        return
      }

      // A full shortlist is known client-side, so reject before the card
      // animates away rather than advancing and rolling back.
      if (decision === "save" && shortlist?.capacity.isFull) {
        setFeedbackMessage(
          `Your shortlist is full (${shortlist.capacity.limit}). Act on a few saved profiles to make room.`,
        )
        return
      }


      clearAnimationTimer()
      setIsAnimating(true)
      setIsDragging(false)
      setActiveDecision(decision)
      dragStartXRef.current = null
      pointerIdRef.current = null
      setFeedbackMessage(null)
      setDragX(
        decision === "like"
          ? MAX_DRAG_DISTANCE * 1.6
          : decision === "pass"
            ? MAX_DRAG_DISTANCE * -1.6
            : 0,
      )

      const processedProfile = currentProfile

      animationTimerRef.current = window.setTimeout(async () => {
        try {
          // Shortlisting is a park, not a decision, so it goes to its own
          // endpoint and never touches swipe quota. The server removes the
          // profile from the deck, which is why the card advances on success.
          if (decision === "save") {
            if (!shortlist) {
              throw new Error("Shortlist is unavailable right now.")
            }

            const result = await shortlist.add(processedProfile.userId)
            setSavedIds((ids) => appendUnique(ids, processedProfile.id))
            setFeedbackMessage(
              result.alreadyShortlisted
                ? `${processedProfile.name} is already in your shortlist.`
                : `${processedProfile.name} saved. Open the star in the header to decide later.`,
            )
            setActiveIndex((index) => index + 1)
            setActiveDecision(null)
            setDragX(0)
            setIsAnimating(false)
            return
          }

          const swipeResponse = await swipeProfileApi(
            processedProfile.userId,
            decision === "like" ? "right" : "left",
          )

          // Only reachable when a shortlisted profile was somehow still in the
          // local deck (a stale page held across a shortlist made elsewhere).
          if (swipeResponse.removedFromShortlist) {
            shortlist?.registerExternalRemoval()
          }

          // The response carries live quotas on every swipe; previously it was
          // discarded, which is why no counter could be shown.
          setSwipesRemaining(swipeResponse.limits.swipesRemaining)

          if (decision === "like") {
            setConnectedIds((ids) => appendUnique(ids, processedProfile.id))
            setSwipeLimitState(null)

            if (swipeResponse.match?.conversationId && swipeResponse.match.isNewMatch) {
              const matchedName = swipeResponse.match.user?.displayName || processedProfile.name
              setMatchedConversation({
                conversationId: swipeResponse.match.conversationId,
                displayName: matchedName,
              })
              setFeedbackMessage(`It's a match with ${matchedName}. Chat is now unlocked.`)
            } else {
              setFeedbackMessage(`Interest recorded for ${processedProfile.name}.`)
            }
          } else {
            setPassedIds((ids) => appendUnique(ids, processedProfile.id))
          }

          setActiveIndex((index) => index + 1)
          setActiveDecision(null)
          setDragX(0)
          setIsAnimating(false)
        } catch (error) {
          const limitState = getSwipeLimitState(error)
          setActiveDecision(null)
          setDragX(0)
          setIsAnimating(false)

          // The card deliberately snaps back rather than advancing: nothing was
          // parked, so hiding the profile would lose it until the deck reloads.
          const shortlistRejection = getShortlistRejection(error)
          if (shortlistRejection) {
            setFeedbackMessage(shortlistRejection.message)
            void shortlist?.refresh()
            return
          }

          if (limitState) {
            setSwipeLimitState(limitState)
            setFeedbackMessage(limitState.message)
            return
          }

          setFeedbackMessage(error instanceof Error ? error.message : "Failed to process the swipe.")
        }
      }, ANIMATION_DURATION)
    },
    [
      canSwipe,
      clearAnimationTimer,
      currentProfile,
      isAnimating,
      isLoading,
      shortlist,
      swipeLimitState,
    ],
  )

  React.useEffect(() => () => clearAnimationTimer(), [clearAnimationTimer])

  React.useEffect(() => {
    if (isLoading || isLoadingMore || !hasMore || remainingCount > 4) return
    void loadSuggestions({ requestOffset: nextOffset })
  }, [hasMore, isLoading, isLoadingMore, loadSuggestions, nextOffset, remainingCount])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!currentProfile || isAnimating || isLoading || isTypingTarget(event.target)) return

      if (event.key === "ArrowLeft" && canSwipe) {
        event.preventDefault()
        advanceProfile("pass")
      }

      if (event.key === "ArrowRight" && canSwipe) {
        event.preventDefault()
        advanceProfile("like")
      }

      // Either vertical arrow shortlists; there is no longer a second
      // upward action to disambiguate from.
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault()
        advanceProfile("save")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [advanceProfile, canSwipe, currentProfile, isAnimating, isLoading])

  const handleUndo = React.useCallback(async () => {
    if (isRewinding || activeIndex === 0) return
    setIsRewinding(true)
    try {
      const result = await undoSwipeApi()
      const restoredUserId = result.undoneSwipedUserId

      setActiveIndex((index) => Math.max(index - 1, 0))
      setConnectedIds((ids) => ids.filter((id) => id !== restoredUserId))
      setPassedIds((ids) => ids.filter((id) => id !== restoredUserId))
      setSavedIds((ids) => ids.filter((id) => id !== restoredUserId))
      setMatchedConversation(null)
      setRewindsUsed(result.rewinds.used)
      setRewindLimit(result.rewinds.remaining === "unlimited" ? "unlimited" : result.rewinds.limit)

      setFeedbackMessage("Last swipe undone.")
    } catch (error) {
      // The rewind endpoint answers 403 with structured limit details, which used
      // to be flattened into a plain message with no upgrade affordance.
      const limitState = getSwipeLimitState(error)

      if (limitState) {
        setFeedbackMessage(limitState.message)
        if (limitState.upgradeRequired) {
          router.push("/dashboard/subscription")
        }
        return
      }

      setFeedbackMessage(error instanceof Error ? error.message : "Could not undo the swipe.")
    } finally {
      setIsRewinding(false)
    }
  }, [activeIndex, isRewinding, router])

  const handleSaveFilter = React.useCallback(async () => {
    setIsSavingFilter(true)
    try {
      const saved = await updateMatchPreferencesApi(draftPrefs)
      const merged: MatchPreferences = { ...DEFAULT_MATCH_PREFERENCES, ...saved }
      setSavedPrefs(merged)
      setDraftPrefs(merged)
      setFilterOpen(false)
      void loadSuggestions({ reset: true, requestOffset: 0 })
    } catch {
      setFeedbackMessage("Failed to save filters. Please try again.")
    } finally {
      setIsSavingFilter(false)
    }
  }, [draftPrefs, loadSuggestions])

  const handleDetectLocation = React.useCallback(() => {
    if (!navigator.geolocation) {
      setFeedbackMessage("Geolocation is not supported by your browser.")
      return
    }

    setIsDetectingLocation(true)
    navigator.geolocation.getCurrentPosition(
      () => {
        setIsDetectingLocation(false)
        setFeedbackMessage("Location detected. Set your preferred distance and save.")
      },
      () => {
        setIsDetectingLocation(false)
        setFeedbackMessage("Could not detect location. Please allow location access.")
      },
      { timeout: 10000 },
    )
  }, [])

  const handlePointerDown = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!canInteract || event.button !== 0) return

    pointerIdRef.current = event.pointerId
    dragStartXRef.current = event.clientX
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }, [canInteract])

  const handlePointerMove = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (
      !isDragging ||
      !canInteract ||
      pointerIdRef.current !== event.pointerId ||
      dragStartXRef.current === null
    ) {
      return
    }

    setDragX(clamp(
      event.clientX - dragStartXRef.current,
      MAX_DRAG_DISTANCE * -1,
      MAX_DRAG_DISTANCE,
    ))
  }, [canInteract, isDragging])

  const finishGesture = React.useCallback(() => {
    if (!isDragging) return
    if (Math.abs(dragX) >= SWIPE_THRESHOLD) {
      advanceProfile(dragX > 0 ? "like" : "pass")
      return
    }
    resetMotion()
  }, [advanceProfile, dragX, isDragging, resetMotion])

  const handlePointerUp = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    finishGesture()
  }, [finishGesture])

  const handlePointerCancel = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    resetMotion()
  }, [resetMotion])

  const handleRestart = React.useCallback(() => {
    clearAnimationTimer()
    setConnectedIds([])
    setPassedIds([])
    setSavedIds([])
    setActiveDecision(null)
    setIsAnimating(false)
    setSwipeLimitState(null)
    setMatchedConversation(null)
    resetMotion()
    void loadSuggestions({ reset: true, requestOffset: 0 })
  }, [clearAnimationTimer, loadSuggestions, resetMotion])

  const handleOpenFilters = React.useCallback(() => {
    setDraftPrefs(savedPrefs)
    setFilterOpen(true)
  }, [savedPrefs])

  const handleCloseFilters = React.useCallback(() => {
    setFilterOpen(false)
    setDraftPrefs(savedPrefs)
  }, [savedPrefs])

  const handleOpenDocument = React.useCallback(async (document: ProfileDocument) => {
    if (!document.url && !document.key) {
      setFeedbackMessage("This document is missing its file link.")
      return
    }

    setOpeningDocumentId(document.documentId)
    try {
      const signedUrl = await getSignedReadableUploadUrl(
        document.url ? { url: document.url } : { key: document.key },
      )
      window.open(signedUrl, "_blank", "noopener,noreferrer")
    } catch {
      setFeedbackMessage("Could not open the document. Please try again.")
    } finally {
      setOpeningDocumentId(null)
    }
  }, [])

  const openMatchedConversation = React.useCallback(() => {
    if (matchedConversation?.conversationId) {
      router.push(`/dashboard/chat?conversationId=${matchedConversation.conversationId}`)
    }
  }, [matchedConversation?.conversationId, router])

  const nextCardScale = 0.94 + Math.min(Math.abs(dragX) / 1200, 0.03)
  const currentCardTransform =
    activeDecision === "save"
      ? "translate3d(0px, -96px, 0px) scale(0.95)"
      : `translate3d(${dragX}px, 0px, 0px) rotate(${dragX / 18}deg) scale(${isDragging ? 1.01 : 1})`
  const currentCardOpacity = activeDecision === "save" && isAnimating ? 0 : 1

  return (
    <MatchProfileClientStyled>
      <MatchProfileHeader
        headerStats={headerStats}
        activeFilterCount={activeFilterCount}
        onOpenFilters={handleOpenFilters}
      />

      <MatchFeedbackBanner
        feedbackMessage={feedbackMessage}
        matchedConversation={matchedConversation}
        swipeLimitState={swipeLimitState}
        onOpenConversation={openMatchedConversation}
        onUpgrade={() => router.push("/dashboard/subscription")}
      />

      <Box className="studioGrid">
        <Box className="stageColumn">
          <MatchDeck
            currentProfile={currentProfile}
            nextProfile={nextProfiles[0] ?? null}
            visibleDecision={visibleDecision}
            canInteract={canInteract}
            isDragging={isDragging}
            isLoading={isLoading}
            currentCardTransform={currentCardTransform}
            currentCardOpacity={currentCardOpacity}
            nextCardScale={nextCardScale}
            remainingCount={remainingCount}
            getCardImage={getCardImage}
            getCardImages={getCardImages}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onRestart={handleRestart}
          />
          <MatchActionStrip
            activeIndex={activeIndex}
            isAnimating={isAnimating}
            isRewinding={isRewinding}
            rewindLimit={rewindLimit}
            rewindsUsed={rewindsUsed}
            canInteract={canInteract}
            canShortlist={canShortlist}
            onUndo={() => { void handleUndo() }}
            onAdvance={advanceProfile}
          />
        </Box>

        <Box className="dossierColumn">
          <MatchInsightsPanel
            currentProfile={currentProfile}
            visibleDecision={visibleDecision}
            connectedCount={connectedIds.length}
            savedCount={shortlistedCount}
            passedCount={passedIds.length}
            documents={getProfileDocuments(currentProfile?.userId)}
            openingDocumentId={openingDocumentId}
            onOpenDocument={handleOpenDocument}
          />
        </Box>
      </Box>

      <MatchFilterDrawer
        open={filterOpen}
        activeFilterCount={activeFilterCount}
        draftPrefs={draftPrefs}
        savedPrefs={savedPrefs}
        isSavingFilter={isSavingFilter}
        isDetectingLocation={isDetectingLocation}
        onClose={handleCloseFilters}
        onDraftChange={setDraftPrefs}
        onDetectLocation={handleDetectLocation}
        onSave={() => { void handleSaveFilter() }}
      />

    </MatchProfileClientStyled>
  )
}

export default MatchProfileClient
