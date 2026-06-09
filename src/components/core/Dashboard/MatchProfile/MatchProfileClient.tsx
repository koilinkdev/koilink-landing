"use client"

import { Box, Grid } from "@mui/material"
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
import { MatchProfileClientStyled } from "@/styledComponents/MatchProfile/MatchProfileClientStyled"
import MatchActionStrip from "./MatchActionStrip"
import MatchDeck from "./MatchDeck"
import MatchFeedbackBanner from "./MatchFeedbackBanner"
import MatchFilterDrawer from "./MatchFilterDrawer"
import MatchInsightsPanel from "./MatchInsightsPanel"
import MatchProfileHeader from "./MatchProfileHeader"
import MatchQueuePanel from "./MatchQueuePanel"
import type { MatchedConversation, SwipeDecision, SwipeLimitState } from "./matchProfileTypes"
import {
  ANIMATION_DURATION,
  MAX_DRAG_DISTANCE,
  PREVIEW_THRESHOLD,
  SUGGESTION_PAGE_SIZE,
  SWIPE_THRESHOLD,
  appendUnique,
  clamp,
  getSwipeLimitState,
  isTypingTarget,
} from "./matchProfileUtils"
import { useResolvedMatchImages } from "./useResolvedMatchImages"

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
  const getCardImage = useResolvedMatchImages(profiles, activeIndex)

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
  const canSwipe = !swipeLimitState
  const canInteract = Boolean(currentProfile) && !isAnimating && !isLoading && canSwipe
  const canShortlist = Boolean(currentProfile) && !isAnimating && !isLoading
  const remainingCount = Math.max(profiles.length - activeIndex, 0)
  const activeFilterCount = React.useMemo(() => countActiveFilters(savedPrefs), [savedPrefs])
  const headerStats = React.useMemo(
    () => [
      { label: "Remaining", value: remainingCount },
      { label: "Connected", value: connectedIds.length },
      { label: "Shortlisted", value: savedIds.length },
      { label: "Passed", value: passedIds.length },
    ],
    [connectedIds.length, passedIds.length, remainingCount, savedIds.length],
  )

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

  const advanceProfile = React.useCallback(
    (decision: SwipeDecision) => {
      if (!currentProfile || isAnimating || isLoading) return
      if (!canSwipe && decision !== "save") {
        setFeedbackMessage(swipeLimitState?.message || "Daily swipe limit reached.")
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
          const swipeResponse =
            decision === "save"
              ? null
              : await swipeProfileApi(
                  processedProfile.userId,
                  decision === "like" ? "right" : "left",
                )

          if (decision === "like") {
            setConnectedIds((ids) => appendUnique(ids, processedProfile.id))
            setSwipeLimitState(null)

            if (swipeResponse?.match?.conversationId && swipeResponse.match.isNewMatch) {
              const matchedName = swipeResponse.match.user?.displayName || processedProfile.name
              setMatchedConversation({
                conversationId: swipeResponse.match.conversationId,
                displayName: matchedName,
              })
              setFeedbackMessage(`It's a match with ${matchedName}. Chat is now unlocked.`)
            } else {
              setFeedbackMessage(`Interest recorded for ${processedProfile.name}.`)
            }
          } else if (decision === "pass") {
            setPassedIds((ids) => appendUnique(ids, processedProfile.id))
          } else {
            setSavedIds((ids) => appendUnique(ids, processedProfile.id))
            setFeedbackMessage(`${processedProfile.name} added to your shortlist.`)
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

          if (limitState) {
            setSwipeLimitState(limitState)
            setFeedbackMessage(limitState.message)
            return
          }

          setFeedbackMessage(error instanceof Error ? error.message : "Failed to process the swipe.")
        }
      }, ANIMATION_DURATION)
    },
    [canSwipe, clearAnimationTimer, currentProfile, isAnimating, isLoading, swipeLimitState],
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

      if (event.key === "ArrowUp") {
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
      setFeedbackMessage("Last swipe undone.")
      setRewindsUsed(result.rewinds.used)
      setRewindLimit(result.rewinds.remaining === "unlimited" ? "unlimited" : result.rewinds.limit)
    } catch (error) {
      setFeedbackMessage(error instanceof Error ? error.message : "Could not undo the swipe.")
    } finally {
      setIsRewinding(false)
    }
  }, [activeIndex, isRewinding])

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
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, xl: 7, lg: 7 }}>
          <Box className="deckShell">
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

          <MatchQueuePanel
            profiles={nextProfiles}
            isLoadingMore={isLoadingMore}
            getCardImage={getCardImage}
          />
        </Grid>

        <Grid size={{ xs: 12, xl: 5, lg: 5 }}>
          <MatchInsightsPanel
            currentProfile={currentProfile}
            visibleDecision={visibleDecision}
            connectedCount={connectedIds.length}
            savedCount={savedIds.length}
            passedCount={passedIds.length}
          />
        </Grid>
      </Grid>

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
