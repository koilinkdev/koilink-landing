"use client"

import type { NotificationType } from "./notifications-api"

const MINUTE_MS = 60 * 1000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

export const isDirectAssetUrl = (value?: string | null) => {
  if (!value) return false

  return (
    value.startsWith("/") ||
    value.startsWith("data:") ||
    value.startsWith("blob:") ||
    /^(https?:)?\/\//.test(value)
  )
}

const isSameDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate()

const formatClock = (date: Date) =>
  date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  })

export function formatNotificationTime(value?: string | Date | null) {
  if (!value) return ""

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ""

  const now = new Date()
  const diff = Math.max(now.getTime() - date.getTime(), 0)

  if (diff < MINUTE_MS) {
    return "Just now"
  }

  if (diff < HOUR_MS) {
    const minutes = Math.max(Math.floor(diff / MINUTE_MS), 1)
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`
  }

  if (diff < DAY_MS) {
    const hours = Math.max(Math.floor(diff / HOUR_MS), 1)
    return `${hours} hour${hours === 1 ? "" : "s"} ago`
  }

  if (isSameDay(date, now)) {
    return `Today, ${formatClock(date)}`
  }

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (isSameDay(date, yesterday)) {
    return `Yesterday, ${formatClock(date)}`
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() === now.getFullYear() ? undefined : "numeric",
  })
}

export function formatNotificationSectionTitle(value?: string | Date | null) {
  if (!value) return "Earlier"

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return "Earlier"

  const now = new Date()
  if (isSameDay(date, now)) {
    return "Today"
  }

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (isSameDay(date, yesterday)) {
    return "Yesterday"
  }

  if (now.getTime() - date.getTime() < 7 * DAY_MS) {
    return date.toLocaleDateString(undefined, { weekday: "long" })
  }

  return date.toLocaleDateString("en-GB").replace(/\//g, "-")
}

export function getDrawerNotificationIcon(type?: NotificationType) {
  switch (type) {
    case "connection":
    case "connection_request":
    case "match":
    case "like":
    case "super_like":
    case "profile_view":
      return "/assets/icons/User-icon.svg"
    case "subscription_expiry":
      return "/assets/icons/Broadcast-icon.svg"
    case "system":
    case "match_expired":
      return "/assets/icons/BugBeetle.svg"
    default:
      return "/assets/icons/notification-icon.svg"
  }
}

export function getNotificationPageIcon(type?: NotificationType) {
  switch (type) {
    case "message":
      return "/assets/icons/notification-icon-notificationPage.svg"
    case "subscription_expiry":
    case "system":
      return "/assets/icons/redBell-notification.svg"
    case "connection":
    case "connection_request":
    case "match":
    case "profile_view":
      return "/assets/icons/box-icon-notification.svg"
    default:
      return "/assets/icons/yellowBox-notification.svg"
  }
}

export function getNotificationPageIconColor(type?: NotificationType, index = 0) {
  if (type === "subscription_expiry" || type === "system") {
    return "#FFEFF1"
  }

  if (type === "message") {
    return "#EEF3F1"
  }

  return index % 2 === 0 ? "#EEF3F1" : "#FFF4DE"
}

export function getActivityFallbackImage(type?: NotificationType, index = 0) {
  if (type === "message") {
    return "/assets/icons/activity-avatar2.svg"
  }

  if (type === "connection" || type === "match" || type === "profile_view") {
    return "/assets/icons/activity-avatar3.svg"
  }

  const fallbackImages = [
    "/assets/icons/activity-avatar.svg",
    "/assets/icons/activity-avatar2.svg",
    "/assets/icons/activity-avatar3.svg",
    "/assets/icons/activity-avatar4.svg",
    "/assets/icons/activity-avatar5.svg",
  ]

  return fallbackImages[index % fallbackImages.length]
}

export function toDashboardNotificationHref(id: string) {
  return `/dashboard/notification/${id}`
}
