"use client"

import React from "react"
import { getAuthSession } from "@/lib/auth-session"
import {
  addToShortlistApi,
  getShortlistSummaryApi,
  removeFromShortlistApi,
  type AddShortlistResult,
  type ShortlistCapacity,
} from "@/lib/shortlist-api"

const EMPTY_CAPACITY: ShortlistCapacity = {
  count: 0,
  limit: 100,
  remaining: 100,
  isFull: false,
}

type ShortlistContextValue = {
  capacity: ShortlistCapacity
  refresh: () => Promise<void>
  add: (profileUserId: string) => Promise<AddShortlistResult>
  remove: (profileUserId: string) => Promise<void>
  /**
   * Called after a swipe that the server reports also cleared a parked entry.
   * Keeps the badge honest without spending a round trip on the summary.
   */
  registerExternalRemoval: () => void
}

const ShortlistContext = React.createContext<ShortlistContextValue | null>(null)

function applyDelta(capacity: ShortlistCapacity, delta: number): ShortlistCapacity {
  const count = Math.max(capacity.count + delta, 0)
  return {
    count,
    limit: capacity.limit,
    remaining: Math.max(capacity.limit - count, 0),
    isFull: count >= capacity.limit,
  }
}

export function ShortlistProvider({ children }: { children: React.ReactNode }) {
  const session = getAuthSession()
  const token = session?.tokens.access || null

  const [capacity, setCapacity] = React.useState<ShortlistCapacity>(EMPTY_CAPACITY)

  const refresh = React.useCallback(async () => {
    if (!token) {
      setCapacity(EMPTY_CAPACITY)
      return
    }

    try {
      setCapacity(await getShortlistSummaryApi())
    } catch {
      // Keep the last known figure rather than flashing the badge to zero on a
      // transient failure. Every mutation re-syncs from the server anyway.
    }
  }, [token])

  React.useEffect(() => {
    void refresh()
  }, [refresh])

  // The shortlist can be mutated from another tab, and stale entries are pruned
  // server-side on read, so re-sync whenever the user comes back to this one.
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void refresh()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [refresh])

  const add = React.useCallback(async (profileUserId: string) => {
    const result = await addToShortlistApi(profileUserId)
    // Server-authoritative rather than optimistic: the add can be a no-op when
    // the entry already existed, and guessing would double-count a re-tap.
    setCapacity(result.capacity)
    return result
  }, [])

  const remove = React.useCallback(async (profileUserId: string) => {
    const result = await removeFromShortlistApi(profileUserId)
    setCapacity(result.capacity)
  }, [])

  const registerExternalRemoval = React.useCallback(() => {
    setCapacity((previous) => applyDelta(previous, -1))
  }, [])

  const value = React.useMemo<ShortlistContextValue>(
    () => ({ capacity, refresh, add, remove, registerExternalRemoval }),
    [add, capacity, refresh, registerExternalRemoval, remove],
  )

  return <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>
}

/**
 * Returns null outside the provider so components that can render standalone
 * (or in tests) do not crash. Callers must handle the null case.
 */
export function useShortlist() {
  return React.useContext(ShortlistContext)
}
