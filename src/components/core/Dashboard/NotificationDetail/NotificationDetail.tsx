"use client"

import React from "react"
import { background, common, primary } from "@/theme/palette"
import { Typography, Box, styled } from "@mui/material"
import { useParams } from "next/navigation"
import {
  getNotificationApi,
  markNotificationAsReadApi,
  type NotificationRecord,
} from "@/lib/notifications-api"
import { formatNotificationTime } from "@/lib/notification-display"

const AboutNotificationDetailStyled = styled(Box)`
  padding: 20px;
  border-radius: 20px;
  background-color: ${background.paper};

  .individual_notification_header{
     display: flex;
     justify-content:space-between;
     align-items: center;
     margin-bottom:16px;
      p{
        color:${common.color6D9DC5};
        font-weight: 400;
        &:first-of-type{
            font-size: 14px;
        }
        &:last-of-type{
            font-size: 12px;
        }
      }
  }
  .notification_title_text{
          font-size: 14px;
          font-weight: 500;
          color:${primary.main};
          margin-bottom: 10px;
  }

  .content_line {
    font-size: 12px;
    line-height: 160%;
    margin-bottom: 15px;
    color:${common.color6D9DC5};
  }

`;

const readPayloadString = (
  payload: Record<string, unknown>,
  keys: string[],
) => {
  for (const key of keys) {
    const value = payload[key]
    if (typeof value === "string" && value.trim()) {
      return value.trim()
    }
  }

  return null
}

const getNotificationSender = (notification: NotificationRecord) => {
  return (
    readPayloadString(notification.payload, [
      "senderName",
      "connectedUserName",
      "requesterName",
      "viewerName",
      "organizerName",
      "otherPartyName",
    ]) ||
    notification.type
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, (character) => character.toUpperCase())
  )
}

const NotificationDetail = () => {
  const params = useParams<{ slug?: string | string[] }>()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
  const [notification, setNotification] = React.useState<NotificationRecord | null>(null)

  React.useEffect(() => {
    if (!slug) {
      setNotification(null)
      return
    }

    let cancelled = false

    const loadNotification = async () => {
      try {
        const data = await getNotificationApi(slug)
        if (!cancelled) {
          setNotification(data)
        }

        if (!data.isRead) {
          void markNotificationAsReadApi(data.id)
        }
      } catch {
        if (!cancelled) {
          setNotification(null)
        }
      }
    }

    void loadNotification()

    return () => {
      cancelled = true
    }
  }, [slug])

  const contentLines = notification?.message ? [notification.message] : []

  return (
    <AboutNotificationDetailStyled>
      <Box className="individual_notification_header">
        <Typography component="p">
          {notification ? getNotificationSender(notification) : ""}
        </Typography>
        <Typography component="p">
          {notification ? formatNotificationTime(notification.createdAt) : ""}
        </Typography>
      </Box>
      <Typography className="notification_title_text" variant="h6">
        {notification?.title || ""}
      </Typography>
      {contentLines.map((line, index) => (
        <Typography
          key={index}
          className="content_line"
        >
          {line}
        </Typography>
      ))}
    </AboutNotificationDetailStyled>
  )
}

export default NotificationDetail
