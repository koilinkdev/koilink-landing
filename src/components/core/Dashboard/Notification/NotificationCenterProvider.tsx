"use client"

import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Box, IconButton, Snackbar, Stack, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { getAuthSession } from "@/lib/auth-session"
import { closeChatSocket, getChatSocket } from "@/lib/chat-socket"
import {
  getUnreadNotificationCountApi,
  markAllNotificationsAsReadApi,
  normalizeNotificationEvent,
  type NotificationRecord,
} from "@/lib/notifications-api"
import {
  getNotificationPageIcon,
  getNotificationPageIconColor,
  toDashboardNotificationHref,
} from "@/lib/notification-display"

const TOAST_DURATION_MS = 5000
const PRIORITY_TOAST_DURATION_MS = 8000

// Guards against the same notification being counted twice if the server ever
// re-emits, and caps memory on a long-lived session.
const SEEN_ID_LIMIT = 200

type NotificationCenterValue = {
  unreadCount: number
  refreshUnreadCount: () => Promise<void>
  registerRead: (readCount?: number) => void
  markAllRead: () => Promise<void>
}

const NotificationCenterContext = React.createContext<NotificationCenterValue | null>(null)

export function NotificationCenterProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const session = getAuthSession()
  const token = session?.tokens.access || null

  const [unreadCount, setUnreadCount] = React.useState(0)
  const [queue, setQueue] = React.useState<NotificationRecord[]>([])
  const [activeToast, setActiveToast] = React.useState<NotificationRecord | null>(null)
  const seenIdsRef = React.useRef<Set<string>>(new Set())

  const refreshUnreadCount = React.useCallback(async () => {
    if (!token) {
      setUnreadCount(0)
      return
    }

    try {
      const data = await getUnreadNotificationCountApi()
      setUnreadCount(data.unreadCount || 0)
    } catch {
      // Keep the last known count rather than flashing the badge to zero.
    }
  }, [token])

  React.useEffect(() => {
    void refreshUnreadCount()
  }, [refreshUnreadCount])

  // Show one toast at a time; promote the head of the queue when the slot frees.
  // High-priority items (Super Swipes, new connections) jump the queue so they are
  // not buried behind a backlog of low-value notices.
  React.useEffect(() => {
    if (activeToast || queue.length === 0) {
      return
    }

    const priorityIndex = queue.findIndex((item) => item.priority === "high")
    const nextIndex = priorityIndex === -1 ? 0 : priorityIndex

    setActiveToast(queue[nextIndex])
    setQueue((previous) => previous.filter((_item, index) => index !== nextIndex))
  }, [activeToast, queue])

  React.useEffect(() => {
    if (!token) {
      return
    }

    const socket = getChatSocket(token)

    const handleNotification = (payload: unknown) => {
      const notification = normalizeNotificationEvent(payload)

      if (!notification) {
        void refreshUnreadCount()
        return
      }

      const seenIds = seenIdsRef.current
      if (seenIds.has(notification.id)) {
        return
      }

      seenIds.add(notification.id)
      if (seenIds.size > SEEN_ID_LIMIT) {
        seenIds.delete(seenIds.values().next().value as string)
      }

      setUnreadCount((previous) => previous + 1)
      setQueue((previous) => [...previous, notification])
    }

    socket.on("notification", handleNotification)

    return () => {
      socket.off("notification", handleNotification)
      closeChatSocket()
    }
  }, [refreshUnreadCount, token])

  const registerRead = React.useCallback((readCount = 1) => {
    setUnreadCount((previous) => Math.max(previous - readCount, 0))
  }, [])

  const markAllRead = React.useCallback(async () => {
    if (!token) {
      return
    }

    try {
      await markAllNotificationsAsReadApi()
      setUnreadCount(0)
    } catch {
      // Re-sync from the server so the badge does not drift on failure.
      void refreshUnreadCount()
    }
  }, [refreshUnreadCount, token])

  const value = React.useMemo<NotificationCenterValue>(
    () => ({ unreadCount, refreshUnreadCount, registerRead, markAllRead }),
    [markAllRead, refreshUnreadCount, registerRead, unreadCount],
  )

  const dismissToast = () => setActiveToast(null)

  const openActiveToast = () => {
    if (!activeToast) {
      return
    }

    const href = toDashboardNotificationHref(activeToast.id)
    setActiveToast(null)
    router.push(href)
  }

  return (
    <NotificationCenterContext.Provider value={value}>
      {children}

      <Snackbar
        open={Boolean(activeToast)}
        // High-priority notifications earn a longer read; they usually carry an
        // action the user is expected to take.
        autoHideDuration={
          activeToast?.priority === "high" ? PRIORITY_TOAST_DURATION_MS : TOAST_DURATION_MS
        }
        onClose={(_event, reason) => {
          if (reason === "clickaway") {
            return
          }
          dismissToast()
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="flex-start"
          onClick={openActiveToast}
          sx={{
            cursor: "pointer",
            minWidth: 300,
            maxWidth: 380,
            p: 1.5,
            borderRadius: "12px",
            backgroundColor: "#FFFFFF",
            border:
              activeToast?.type === "super_like"
                ? "1px solid #1E88E5"
                : "1px solid rgba(109, 157, 197, 0.25)",
            boxShadow: "0 12px 32px rgba(13, 28, 46, 0.16)",
          }}
        >
          <Box
            sx={{
              flexShrink: 0,
              width: 32,
              height: 32,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: getNotificationPageIconColor(activeToast?.type),
            }}
          >
            <Image
              src={getNotificationPageIcon(activeToast?.type)}
              width={16}
              height={16}
              alt={`${activeToast?.type || "notification"} icon`}
            />
          </Box>

          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: 14,
                color: "#0D1C2E",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {activeToast?.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: 12,
                color: "rgba(109, 157, 197, 0.95)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {activeToast?.message}
            </Typography>
          </Box>

          <IconButton
            size="small"
            aria-label="Dismiss notification"
            onClick={(event) => {
              event.stopPropagation()
              dismissToast()
            }}
            sx={{ flexShrink: 0, p: 0.25 }}
          >
            <CloseIcon sx={{ fontSize: 16, color: "rgba(109, 157, 197, 0.9)" }} />
          </IconButton>
        </Stack>
      </Snackbar>
    </NotificationCenterContext.Provider>
  )
}

/**
 * Returns null outside the provider so leaf components (notification detail,
 * for instance) can stay usable in isolation without crashing.
 */
export function useNotificationCenter() {
  return React.useContext(NotificationCenterContext)
}
