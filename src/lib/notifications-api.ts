"use client"

import { requestWithAuth } from "./api-client"

export type NotificationType =
  | "match"
  | "connection"
  | "connection_request"
  | "message"
  | "document_shared"
  | "like"
  | "super_like"
  | "profile_view"
  | "deal_update"
  | "meeting_scheduled"
  | "subscription_expiry"
  | "verification_complete"
  | "match_expired"
  | "system"
  | string

export type NotificationPriority = "low" | "normal" | "high"

export type NotificationRecord = {
  id: string
  type: NotificationType
  title: string
  message: string
  payload: Record<string, unknown>
  priority?: NotificationPriority | null
  actionUrl?: string | null
  isRead: boolean
  readAt?: string | null
  createdAt: string
}

export type NotificationActivity = {
  id: string
  notificationId: string
  type: NotificationType
  text: string
  actorName?: string | null
  actorPhoto?: string | null
  actionUrl?: string | null
  createdAt: string
}

type ListNotificationsResponse = {
  notifications: NotificationRecord[]
  unreadCount: number
  hasMore: boolean
  offset: number
}

type NotificationDetailResponse = {
  notification: NotificationRecord
}

type NotificationActivityResponse = {
  activities: NotificationActivity[]
  hasMore: boolean
  offset: number
}

type UnreadCountResponse = {
  unreadCount: number
}

type MarkAllReadResponse = {
  markedCount: number
}

type MarkOneReadResponse = {
  notification: {
    id: string
    isRead: boolean
    readAt: string
  }
}

type ListNotificationOptions = {
  limit?: number
  offset?: number
  type?: string
  unreadOnly?: boolean
}

const readString = (value: unknown) => {
  if (typeof value !== "string") {
    if (
      value &&
      typeof value === "object" &&
      typeof (value as { toString?: () => string }).toString === "function"
    ) {
      const stringValue = (value as { toString: () => string }).toString()
      return stringValue && stringValue !== "[object Object]" ? stringValue : null
    }

    return null
  }

  const trimmed = value.trim()
  return trimmed || null
}

const readRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {}
  }

  return value as Record<string, unknown>
}

const normalizeNotification = (value: unknown): NotificationRecord | null => {
  if (!value || typeof value !== "object") {
    return null
  }

  const record = value as Record<string, unknown>
  const id = readString(record.id) || readString(record._id)
  const type = readString(record.type)
  const title = readString(record.title)
  const message = readString(record.message)

  if (!id || !type || !title || !message) {
    return null
  }

  return {
    id,
    type,
    title,
    message,
    payload: readRecord(record.payload),
    priority: readString(record.priority) as NotificationPriority | null,
    actionUrl: readString(record.actionUrl),
    isRead: typeof record.isRead === "boolean" ? record.isRead : Boolean(record.readAt),
    readAt: readString(record.readAt),
    createdAt: readString(record.createdAt) || new Date().toISOString(),
  }
}

function buildNotificationQuery(options: ListNotificationOptions = {}) {
  const params = new URLSearchParams()
  params.set("limit", String(options.limit ?? 50))
  params.set("offset", String(options.offset ?? 0))

  if (options.type) {
    params.set("type", options.type)
  }

  if (options.unreadOnly) {
    params.set("unreadOnly", "true")
  }

  return params.toString()
}

function readPayloadString(payload: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = readString(payload[key])
    if (value) {
      return value
    }
  }

  return null
}

export function notificationToActivity(notification: NotificationRecord): NotificationActivity {
  const text =
    notification.type === "message"
      ? notification.title || notification.message
      : notification.message || notification.title

  return {
    id: notification.id,
    notificationId: notification.id,
    type: notification.type,
    text,
    actorName: readPayloadString(notification.payload, [
      "senderName",
      "connectedUserName",
      "requesterName",
      "viewerName",
      "organizerName",
      "otherPartyName",
    ]),
    actorPhoto: readPayloadString(notification.payload, [
      "senderPhoto",
      "connectedUserPhoto",
      "requesterPhoto",
      "viewerPhoto",
      "organizerPhoto",
      "otherPartyPhoto",
    ]),
    actionUrl: notification.actionUrl,
    createdAt: notification.createdAt,
  }
}

export function normalizeNotificationEvent(payload: unknown) {
  return normalizeNotification(payload)
}

export async function listNotificationsApi(options: ListNotificationOptions = {}) {
  return requestWithAuth<ListNotificationsResponse>(
    `/notifications?${buildNotificationQuery(options)}`,
  )
}

export async function getNotificationApi(id: string) {
  const data = await requestWithAuth<NotificationDetailResponse>(
    `/notifications/${encodeURIComponent(id)}`,
  )

  return data.notification
}

export async function listNotificationActivitiesApi(limit = 50, offset = 0) {
  return requestWithAuth<NotificationActivityResponse>(
    `/notifications/activity-feed?limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(offset)}`,
  )
}

export async function getUnreadNotificationCountApi() {
  return requestWithAuth<UnreadCountResponse>("/notifications/unread-count")
}

export async function markAllNotificationsAsReadApi() {
  return requestWithAuth<MarkAllReadResponse>("/notifications/read", {
    method: "POST",
  })
}

export async function markNotificationAsReadApi(id: string) {
  return requestWithAuth<MarkOneReadResponse>(
    `/notifications/${encodeURIComponent(id)}/read`,
    {
      method: "PUT",
    },
  )
}
