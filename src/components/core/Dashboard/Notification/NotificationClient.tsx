"use client"

import React from "react"
import NotificationCard from "@/components/core/Dashboard/Notification/NotificationCard"
import { Box, Grid, Typography, Stack } from "@mui/material"
import { AboutNotificationClientStyle } from "@/styledComponents/Notification/NotificationClientStyled"
import {
  listNotificationsApi,
  normalizeNotificationEvent,
  type NotificationRecord,
} from "@/lib/notifications-api"
import {
  formatNotificationSectionTitle,
  formatNotificationTime,
  getNotificationPageIcon,
  getNotificationPageIconColor,
  toDashboardNotificationHref,
} from "@/lib/notification-display"
import { closeChatSocket, getChatSocket } from "@/lib/chat-socket"
import { getAuthSession } from "@/lib/auth-session"

type NotificationSection = {
  sectionTitle: string
  notifications: NotificationRecord[]
}

const groupNotificationsByDate = (notifications: NotificationRecord[]) => {
  const sections = new Map<string, NotificationRecord[]>()

  for (const notification of notifications) {
    const sectionTitle = formatNotificationSectionTitle(notification.createdAt)
    const sectionItems = sections.get(sectionTitle) || []
    sectionItems.push(notification)
    sections.set(sectionTitle, sectionItems)
  }

  return Array.from(sections.entries()).map<NotificationSection>(
    ([sectionTitle, sectionNotifications]) => ({
      sectionTitle,
      notifications: sectionNotifications,
    }),
  )
}

const NotificationClient = () => {
  const session = getAuthSession()
  const token = session?.tokens.access || null
  const [notifications, setNotifications] = React.useState<NotificationRecord[]>([])

  const loadNotifications = React.useCallback(async () => {
    if (!token) {
      setNotifications([])
      return
    }

    try {
      const data = await listNotificationsApi({ limit: 100 })
      setNotifications(data.notifications)
    } catch {
      setNotifications([])
    }
  }, [token])

  React.useEffect(() => {
    void loadNotifications()
  }, [loadNotifications])

  React.useEffect(() => {
    if (!token) {
      return
    }

    const socket = getChatSocket(token)
    const handleNotification = (payload: unknown) => {
      const notification = normalizeNotificationEvent(payload)
      if (!notification) {
        void loadNotifications()
        return
      }

      setNotifications((previous) => [
        notification,
        ...previous.filter((item) => item.id !== notification.id),
      ])
    }

    socket.on("notification", handleNotification)

    return () => {
      socket.off("notification", handleNotification)
      closeChatSocket()
    }
  }, [loadNotifications, token])

  const notificationSections = React.useMemo(
    () => groupNotificationsByDate(notifications),
    [notifications],
  )

  return (
    <AboutNotificationClientStyle>
      <Grid container spacing={2.5}>
        {notificationSections.map((section) => (
          <Grid size={{ xs: 12, md: 6 }} key={section.sectionTitle}>
            <Box sx={{ px: 1.5 }}>
              <Box className="notification_SecTitle_cont">
                <Typography
                  variant="h4"
                  className="notificationPage_timeSec_text"
                >
                  {section.sectionTitle}
                </Typography>
              </Box>
              <Stack spacing={1.5}>
                {section.notifications.map((item, index) => (
                  <NotificationCard
                    key={item.id}
                    iconColor={getNotificationPageIconColor(item.type, index)}
                    title={item.title}
                    description={item.message}
                    time={formatNotificationTime(item.createdAt)}
                    badge={!item.isRead ? 1 : undefined}
                    src={getNotificationPageIcon(item.type)}
                    alt={`${item.type} icon`}
                    href={toDashboardNotificationHref(item.id)}
                  />
                ))}
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
    </AboutNotificationClientStyle>
  )
}

export default NotificationClient
