"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
  IconButton,
  ImageList,
  ImageListItem,
  Menu,
  MenuItem,
  Stack,
  TextareaAutosize,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { ChatClientStyled } from "@/styledComponents/Chat/ChatClientStyled"
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined"
import TheatersOutlinedIcon from "@mui/icons-material/TheatersOutlined"
import Image from "next/image"
import VideocamIcon from "@mui/icons-material/Videocam"
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded"
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined"
import ChatInputAutocomplete from "@/components/ui/Dashboard/ChatSecSearch"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
import { Download } from "@mui/icons-material"
import EmojiPicker from "emoji-picker-react"
import { StyledMenu } from "@/components/ui/Dashboard/StyledMenuChat"
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined"
import CloseIcon from "@mui/icons-material/Close"
import CameraAltIcon from "@mui/icons-material/CameraAlt"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import ContactPhoneIcon from "@mui/icons-material/ContactPhone"
import CallIcon from "@mui/icons-material/Call"
import CallMissedIcon from "@mui/icons-material/CallMissed"
import PersonIcon from "@mui/icons-material/Person"
import { useSearchParams } from "next/navigation"
import {
  getSignedReadableImageUrl,
  getSignedReadableUploadUrl,
  listConversationsApi,
  listMessagesApi,
  markConversationAsReadApi,
  sendMessageApi,
  uploadChatAttachmentApi,
  type ChatConversation,
  type ChatMessage,
  type ChatMessageAttachment,
  type ChatParticipant,
  type ChatMessageType,
} from "@/lib/chat-api"
import {
  closeChatSocket,
  getChatSocket,
  type ChatSocket,
} from "@/lib/chat-socket"
import { getAuthSession } from "@/lib/auth-session"
import { useCallManager } from "@/components/core/Dashboard/Call/CallProvider"
import type { MatchRealtimeEvent } from "@/lib/matchmaking-api"
import { formatDocumentSize } from "@/lib/profileDocuments"
import ChatUserProfileModal from "@/components/core/Dashboard/Chat/ChatUserProfileModal"

type MessageAttachmentViewModel = {
  source: string
  url: string | null
  name: string
  contentType?: string | null
  size?: number | null
}

type ChatMessageStatus = ChatMessage["status"]

interface MessageViewModel {
  id: number | string
  type: "text" | "image" | "video" | "file"
  text?: string
  attachments: MessageAttachmentViewModel[]
  isOwn: boolean
  time: string
  status?: ChatMessageStatus
}

type ChatOption = {
  id: string
  label: string
}

type ChatViewModel = {
  id: string
  otherUserId: string | null
  name: string
  role: string
  avatar: string
  status: string
  messages: MessageViewModel[]
  lastMessageText: string
}

type AttachmentPickerKind = "image" | "video" | "document"

type AttachmentPickerConfig = {
  kind: AttachmentPickerKind
  accept: string
  multiple: boolean
}

type PendingAttachment = {
  id: string
  file: File
  kind: AttachmentPickerKind
  previewUrl: string | null
  name: string
  size: number
}

type ContactFormData = {
  name: string
  phone: string
}

const DEFAULT_AVATAR = "/assets/images/profile-avatar.svg"
const DOCUMENT_ACCEPT =
  ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,text/csv"
const MAX_CHAT_IMAGE_ATTACHMENTS = 6

const ATTACHMENT_PICKER_CONFIG: Record<AttachmentPickerKind, AttachmentPickerConfig> = {
  image: {
    kind: "image",
    accept: "image/*",
    multiple: true,
  },
  video: {
    kind: "video",
    accept: "video/*",
    multiple: false,
  },
  document: {
    kind: "document",
    accept: DOCUMENT_ACCEPT,
    multiple: false,
  },
}

const humanize = (value?: string | null) => {
  if (!value) return ""

  return value
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

const isRemoteUrl = (value?: string | null) => {
  if (!value) return false
  return /^(https?:)?\/\//.test(value)
}

const isLocalAssetUrl = (value?: string | null) => {
  if (!value) return false
  return value.startsWith("/") || value.startsWith("data:") || value.startsWith("blob:")
}

const isDirectAvatarUrl = (value?: string | null) => {
  return isLocalAssetUrl(value)
}

const getAttachmentSource = (attachment: ChatMessageAttachment | unknown) => {
  if (typeof attachment === "string") {
    return attachment
  }

  if (!attachment || typeof attachment !== "object") {
    return null
  }

  if ("url" in attachment && typeof attachment.url === "string" && attachment.url) {
    return attachment.url
  }

  if ("key" in attachment && typeof attachment.key === "string" && attachment.key) {
    return attachment.key
  }

  if ("path" in attachment && typeof (attachment as { path?: unknown }).path === "string") {
    return (attachment as { path: string }).path
  }

  return null
}

const getAttachmentName = (attachment: ChatMessageAttachment | unknown) => {
  if (!attachment || typeof attachment !== "object") {
    return null
  }

  if ("name" in attachment && typeof attachment.name === "string" && attachment.name) {
    return attachment.name
  }

  if ("filename" in attachment && typeof attachment.filename === "string" && attachment.filename) {
    return attachment.filename
  }

  if (
    "originalName" in attachment &&
    typeof attachment.originalName === "string" &&
    attachment.originalName
  ) {
    return attachment.originalName
  }

  const source = getAttachmentSource(attachment)
  if (!source) {
    return null
  }

  return source.split("/").filter(Boolean).pop() || "Attachment"
}

const getAttachmentContentType = (attachment: ChatMessageAttachment | unknown) => {
  if (!attachment || typeof attachment !== "object") {
    return null
  }

  return "contentType" in attachment && typeof attachment.contentType === "string"
    ? attachment.contentType
    : null
}

const getAttachmentSize = (attachment: ChatMessageAttachment | unknown) => {
  if (!attachment || typeof attachment !== "object") {
    return null
  }

  return "size" in attachment && typeof attachment.size === "number" ? attachment.size : null
}

const getSignedSourcePayload = (source: string) => {
  if (isRemoteUrl(source)) {
    return {
      url: source.startsWith("//") ? `https:${source}` : source,
    }
  }

  return { key: source }
}

const buildAttachmentUrl = (
  source: string,
  signedAttachmentUrls: Record<string, string>,
) => {
  if (isLocalAssetUrl(source)) {
    return source
  }

  return signedAttachmentUrls[source] || (isRemoteUrl(source) ? source : null)
}

const getMessageAttachments = (
  attachments: ChatMessageAttachment[],
  signedAttachmentUrls: Record<string, string>,
): MessageAttachmentViewModel[] =>
  attachments.reduce<MessageAttachmentViewModel[]>((resolvedAttachments, attachment) => {
    const source = getAttachmentSource(attachment)
    if (!source) {
      return resolvedAttachments
    }

    resolvedAttachments.push({
      source,
      url: buildAttachmentUrl(source, signedAttachmentUrls),
      name: getAttachmentName(attachment) || "Attachment",
      contentType: getAttachmentContentType(attachment),
      size: getAttachmentSize(attachment),
    })

    return resolvedAttachments
  }, [])

const formatMessageTime = (value?: string | null) => {
  if (!value) return ""

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ""
  }

  const now = new Date()
  const isSameDay =
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate()

  if (isSameDay) {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const isYesterday =
    yesterday.getFullYear() === date.getFullYear() &&
    yesterday.getMonth() === date.getMonth() &&
    yesterday.getDate() === date.getDate()

  if (isYesterday) {
    return "Yesterday"
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  })
}

const formatLastSeen = (value?: string | null) => {
  if (!value) {
    return "recently"
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "recently"
  }

  const diffMs = Date.now() - date.getTime()
  if (diffMs <= 0) {
    return "just now"
  }

  const diffMinutes = Math.floor(diffMs / 60000)
  if (diffMinutes < 1) {
    return "just now"
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`
  }

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`
  }

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  })
}

const buildPresenceStatus = (participant: ChatParticipant | null, isTyping: boolean) => {
  if (isTyping) {
    return "typing..."
  }

  if (!participant) {
    return "last seen recently"
  }

  if (participant.isOnline) {
    return "online"
  }

  return `last seen ${formatLastSeen(participant.lastActive)}`
}

type ParsedLocation = {
  lat: number
  lng: number
}

type ParsedContact = {
  name: string
  phone: string
}

// Extracts a lat/lng pair from any of the common share formats we (or other
// apps) might produce: `?q=lat,lng`, a Google `/@lat,lng` path, or a `geo:` URI.
const parseLatLng = (text: string): ParsedLocation | null => {
  const match =
    text.match(/[?&]q=(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)/) ||
    text.match(/@(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)/) ||
    text.match(/geo:(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)/i)

  if (!match) {
    return null
  }

  const lat = Number(match[1])
  const lng = Number(match[2])

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    Math.abs(lat) > 90 ||
    Math.abs(lng) > 180
  ) {
    return null
  }

  return { lat, lng }
}

const LOCATION_HINT_REGEX = /📍|maps\.google|google\.[a-z.]+\/maps|geo:/i

// A text message is treated as a shared location only when it both *looks* like
// a location share and yields a valid coordinate pair.
const parseLocationContent = (text?: string | null): ParsedLocation | null => {
  if (!text || !LOCATION_HINT_REGEX.test(text)) {
    return null
  }

  return parseLatLng(text)
}

type ParsedCall = {
  label: string
  detail: string | null
  missed: boolean
  callType: "video" | "audio"
}

// Parses a call-log message stored by the backend as "📞 Video call · 02:34"
// or "📞 Missed audio call".
const parseCallContent = (text?: string | null): ParsedCall | null => {
  if (!text) {
    return null
  }

  const trimmed = text.trim()
  if (!trimmed.startsWith("📞")) {
    return null
  }

  const body = trimmed.replace(/^📞\s*/, "")
  if (!body) {
    return null
  }

  const [labelPart, detailPart] = body.split(" · ")

  return {
    label: labelPart.trim(),
    detail: detailPart ? detailPart.trim() : null,
    missed: /missed/i.test(body),
    callType: /audio/i.test(body) ? "audio" : "video",
  }
}

const parseContactContent = (text?: string | null): ParsedContact | null => {
  if (!text) {
    return null
  }

  const trimmed = text.trim()
  if (!trimmed.startsWith("👤")) {
    return null
  }

  const body = trimmed.replace(/^👤\s*Contact:\s*/i, "")
  // The share format separates name and phone with " — " (em dash).
  const [namePart, ...phoneParts] = body.split(" — ")
  const name = namePart.trim() || "Unknown"
  const phone = phoneParts.join(" — ").trim()

  return { name, phone }
}

const buildGoogleMapsUrl = (lat: number, lng: number) =>
  `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

// Keyless map thumbnail via the OpenStreetMap embed endpoint (no API key needed).
// We omit the embed's own marker and overlay our own pin so the centre point
// reads as a single, prominent WhatsApp-style pin.
const buildOsmEmbedUrl = (lat: number, lng: number) => {
  const dLat = 0.0045
  const dLng = 0.0065
  const bbox = `${lng - dLng},${lat - dLat},${lng + dLng},${lat + dLat}`
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox,
  )}&layer=mapnik`
}

const URL_SPLIT_REGEX = /(https?:\/\/[^\s]+)/g

// Turns inline URLs in a plain-text message into clickable links.
const renderTextWithLinks = (text: string) => {
  const segments = text.split(URL_SPLIT_REGEX)

  return segments.map((segment, index) => {
    if (!segment) {
      return null
    }

    if (/^https?:\/\//.test(segment)) {
      const href = segment.replace(/[.,;!?)\]]+$/, "")
      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="message-link"
        >
          {segment}
        </a>
      )
    }

    return <React.Fragment key={index}>{segment}</React.Fragment>
  })
}

const LocationMessageCard: React.FC<{ location: ParsedLocation }> = ({ location }) => {
  const mapsUrl = buildGoogleMapsUrl(location.lat, location.lng)

  return (
    <Box className="message_location">
      <Box
        component="a"
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="location_map_link"
        aria-label="Open shared location in Google Maps"
      >
        <Box
          component="iframe"
          src={buildOsmEmbedUrl(location.lat, location.lng)}
          className="location_map_frame"
          loading="lazy"
          title="Shared location map"
        />
        <Box className="location_map_overlay">
          <LocationOnIcon className="location_pin_icon" />
        </Box>
      </Box>
      <Box className="location_footer">
        <LocationOnIcon className="location_footer_icon" />
        <Box className="location_footer_text">
          <Typography className="location_title">Shared location</Typography>
          <Typography className="location_coords">
            {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
          </Typography>
        </Box>
        <Box
          component="a"
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="location_open_btn"
        >
          Open
        </Box>
      </Box>
    </Box>
  )
}

const ContactMessageCard: React.FC<{ contact: ParsedContact }> = ({ contact }) => {
  const sanitizedPhone = contact.phone.replace(/[^\d+]/g, "")

  return (
    <Box className="message_contact">
      <Box className="contact_avatar">
        <PersonIcon />
      </Box>
      <Box className="contact_info">
        <Typography className="contact_name">{contact.name}</Typography>
        {contact.phone ? (
          <Typography className="contact_phone">{contact.phone}</Typography>
        ) : (
          <Typography className="contact_phone">Contact</Typography>
        )}
      </Box>
      {sanitizedPhone ? (
        <Box
          component="a"
          href={`tel:${sanitizedPhone}`}
          className="contact_call_btn"
          aria-label={`Call ${contact.name}`}
        >
          <CallIcon />
        </Box>
      ) : null}
    </Box>
  )
}

const CallMessageCard: React.FC<{ call: ParsedCall; isOwn: boolean }> = ({ call, isOwn }) => {
  const CallTypeIcon = call.missed
    ? CallMissedIcon
    : call.callType === "audio"
      ? CallIcon
      : VideocamIcon

  return (
    <Box className={`message_call ${call.missed ? "missed" : ""}`}>
      <Box className="call_icon">
        <CallTypeIcon />
      </Box>
      <Box className="call_info">
        <Typography className="call_label">{call.label}</Typography>
        <Typography className="call_detail">
          {call.detail ? call.detail : isOwn ? "Outgoing" : "Incoming"}
        </Typography>
      </Box>
    </Box>
  )
}

const buildMessagePreview = (message: Pick<ChatMessage, "messageType" | "content" | "attachments">) => {
  if (message.messageType === "text") {
    const content = message.content || ""
    if (parseLocationContent(content)) {
      return "📍 Location"
    }
    if (parseContactContent(content)) {
      return "👤 Contact"
    }
    return content || "No messages yet"
  }

  if (message.messageType === "image") {
    return message.attachments.length > 1 ? `Sent ${message.attachments.length} images` : "Sent an image"
  }

  if (message.messageType === "video") {
    return "Sent a video"
  }

  if (message.messageType === "audio") {
    return "Sent an audio note"
  }

  return getAttachmentName(message.attachments[0]) || message.content || "Shared a document"
}

// Normalises a stored last-message string for the conversation list so shared
// locations/contacts read as friendly labels instead of raw URLs.
const formatConversationPreview = (text?: string | null) => {
  if (!text) {
    return ""
  }
  if (parseLocationContent(text)) {
    return "📍 Location"
  }
  if (parseContactContent(text)) {
    return "👤 Contact"
  }
  return text
}

const sortConversations = (conversations: ChatConversation[]) => {
  return [...conversations].sort((left, right) => {
    const leftTime = left.lastMessageAt ? new Date(left.lastMessageAt).getTime() : 0
    const rightTime = right.lastMessageAt ? new Date(right.lastMessageAt).getTime() : 0
    return rightTime - leftTime
  })
}

const upsertMessage = (messages: ChatMessage[], incomingMessage: ChatMessage) => {
  const nextMessages = messages.filter((message) => message._id !== incomingMessage._id)
  nextMessages.push(incomingMessage)
  nextMessages.sort((left, right) => {
    return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
  })
  return nextMessages
}

const upsertConversation = (
  conversations: ChatConversation[],
  incomingConversation: ChatConversation,
) => {
  const nextConversations = conversations.filter(
    (conversation) => conversation._id !== incomingConversation._id,
  )
  nextConversations.push(incomingConversation)
  return sortConversations(nextConversations)
}

const mapApiMessageToUi = (
  message: ChatMessage,
  currentUserId: string,
  signedAttachmentUrls: Record<string, string>,
): MessageViewModel => {
  const isOwn = message.senderId === currentUserId
  const attachments = getMessageAttachments(message.attachments, signedAttachmentUrls)
  const caption = message.content || undefined

  if (message.messageType === "image" && attachments.length > 0) {
    return {
      id: message._id,
      type: "image",
      attachments,
      text: caption,
      isOwn,
      time: formatMessageTime(message.createdAt),
      status: message.status,
    }
  }

  if (message.messageType === "video" && attachments.length > 0) {
    return {
      id: message._id,
      type: "video",
      attachments,
      text: caption,
      isOwn,
      time: formatMessageTime(message.createdAt),
      status: message.status,
    }
  }

  if (message.messageType !== "text") {
    return {
      id: message._id,
      type: "file",
      attachments,
      text: caption,
      isOwn,
      time: formatMessageTime(message.createdAt),
      status: message.status,
    }
  }

  return {
    id: message._id,
    type: "text",
    text: message.content,
    attachments: [],
    isOwn,
    time: formatMessageTime(message.createdAt),
    status: message.status,
  }
}

const isAcceptedAttachmentType = (file: File, kind: AttachmentPickerKind) => {
  const fileType = file.type.toLowerCase()

  if (kind === "image") {
    return fileType.startsWith("image/")
  }

  if (kind === "video") {
    return fileType.startsWith("video/")
  }

  return !fileType || (!fileType.startsWith("image/") && !fileType.startsWith("video/") && !fileType.startsWith("audio/"))
}

const getAttachmentUploadLabel = (kind: AttachmentPickerKind, count: number) => {
  if (kind === "image") {
    return `Uploading ${count} image${count === 1 ? "" : "s"}...`
  }

  if (kind === "video") {
    return "Uploading video..."
  }

  return "Uploading document..."
}

const getAttachmentSuccessLabel = (kind: AttachmentPickerKind, count: number) => {
  if (kind === "image") {
    return `${count} image${count === 1 ? "" : "s"} shared successfully.`
  }

  if (kind === "video") {
    return "Video shared successfully."
  }

  return "Document shared successfully."
}

const normalizeMessageStatus = (status?: ChatMessageStatus): ChatMessageStatus => {
  if (status === "delivered" || status === "read" || status === "failed") {
    return status
  }

  return "sent"
}

const renderMessageStatusIcon = (status?: ChatMessageStatus) => {
  const resolvedStatus = normalizeMessageStatus(status)

  if (resolvedStatus === "failed") {
    return (
      <CloseIcon
        className="message_status_icon"
        sx={{ fontSize: 15 }}
      />
    )
  }

  const StatusIcon = resolvedStatus === "sent" ? DoneOutlinedIcon : DoneAllRoundedIcon

  return (
    <StatusIcon
      className="message_status_icon"
      sx={{ fontSize: 16 }}
    />
  )
}

const ChatSecClient: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"))
  const searchParams = useSearchParams()
  const session = getAuthSession()
  const currentUserId = session?.user.id || ""
  const token = session?.tokens.access || null
  const { startCall } = useCallManager()

  const [open, setOpen] = useState(false)
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [messagesByConversation, setMessagesByConversation] = useState<Record<string, ChatMessage[]>>({})
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [isLoadingChats, setIsLoadingChats] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [signedAvatarUrls, setSignedAvatarUrls] = useState<Record<string, string>>({})
  const [signedAttachmentUrls, setSignedAttachmentUrls] = useState<Record<string, string>>({})
  const [socketConnected, setSocketConnected] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [anchorElPlus, setAnchorElPlus] = useState<null | HTMLElement>(null)
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false)
  const [openingAttachmentSource, setOpeningAttachmentSource] = useState<string | null>(null)
  const [filePickerConfig, setFilePickerConfig] = useState<AttachmentPickerConfig>(
    ATTACHMENT_PICKER_CONFIG.document,
  )
  const [pendingAttachments, setPendingAttachments] = useState<PendingAttachment[]>([])
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [isContactPickerOpen, setIsContactPickerOpen] = useState(false)
  const [contactFormData, setContactFormData] = useState<ContactFormData>({ name: "", phone: "" })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const socketRef = useRef<ChatSocket | null>(null)
  const selectedConversationIdRef = useRef<string | null>(null)
  const requestedConversationIdRef = useRef<string | null>(searchParams.get("conversationId"))
  const joinedConversationRef = useRef<string | null>(null)
  const typingTimeoutRef = useRef<number | null>(null)
  const isTypingRef = useRef(false)
  const loadedConversationIdsRef = useRef<Record<string, boolean>>({})
  const isMobileRef = useRef(isMobile)
  const pendingSocketMessageRef = useRef<{ conversationId: string; text: string } | null>(null)
  const cameraStreamRef = useRef<MediaStream | null>(null)
  const cameraVideoRef = useRef<HTMLVideoElement | null>(null)

  const openMoreMenu = Boolean(anchorEl)
  const openPlusMenu = Boolean(anchorElPlus)

  useEffect(() => {
    selectedConversationIdRef.current = selectedConversationId
  }, [selectedConversationId])

  useEffect(() => {
    requestedConversationIdRef.current = searchParams.get("conversationId")
  }, [searchParams])

  useEffect(() => {
    isMobileRef.current = isMobile
  }, [isMobile])

  const stopTyping = (conversationId?: string | null) => {
    if (typingTimeoutRef.current !== null) {
      window.clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }

    const activeConversationId = conversationId || selectedConversationIdRef.current
    const socket = socketRef.current
    if (!socket || !socket.connected || !activeConversationId || !isTypingRef.current) {
      isTypingRef.current = false
      return
    }

    socket.emit("message:typing", {
      conversationId: activeConversationId,
      isTyping: false,
    })
    isTypingRef.current = false
  }

  const updateDraft = (nextValue: string) => {
    setNewMessage(nextValue)

    const socket = socketRef.current
    const conversationId = selectedConversationIdRef.current
    if (!socket || !socket.connected || !conversationId || isUploadingAttachment) {
      return
    }

    if (!nextValue.trim()) {
      stopTyping(conversationId)
      return
    }

    if (!isTypingRef.current) {
      socket.emit("message:typing", {
        conversationId,
        isTyping: true,
      })
      isTypingRef.current = true
    }

    if (typingTimeoutRef.current !== null) {
      window.clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      stopTyping(conversationId)
    }, 1200)
  }

  const handleIncomingMessage = useCallback((incomingMessage: ChatMessage) => {
    if (!incomingMessage?.conversationId) {
      return
    }

    let isExistingMessage = false

    setMessagesByConversation((previousMessages) => {
      const existingMessages = previousMessages[incomingMessage.conversationId] || []
      isExistingMessage = existingMessages.some((message) => message._id === incomingMessage._id)

      return {
        ...previousMessages,
        [incomingMessage.conversationId]: upsertMessage(existingMessages, incomingMessage),
      }
    })

    const isSelectedConversation = selectedConversationIdRef.current === incomingMessage.conversationId
    const isIncomingFromOtherUser = incomingMessage.senderId !== currentUserId

    setConversations((previousConversations) =>
      sortConversations(
        previousConversations.map((conversation) => {
          if (conversation._id !== incomingMessage.conversationId) {
            return conversation
          }

          return {
            ...conversation,
            lastMessageText: buildMessagePreview(incomingMessage),
            lastMessageAt: incomingMessage.createdAt,
            lastMessageBy: incomingMessage.senderId,
            messageCount: isExistingMessage ? conversation.messageCount : conversation.messageCount + 1,
            unreadCount:
              isExistingMessage
                ? conversation.unreadCount
                : isIncomingFromOtherUser && !isSelectedConversation
                  ? conversation.unreadCount + 1
                  : 0,
          }
        }),
      ),
    )

    if (isIncomingFromOtherUser && isSelectedConversation) {
      const socket = socketRef.current
      if (socket?.connected) {
        socket.emit("messages:read", {
          conversationId: incomingMessage.conversationId,
        })
        return
      }

      void markConversationAsReadApi(incomingMessage.conversationId).catch(() => undefined)
    }
  }, [currentUserId])

  const handlePresenceUpdate = (payload: {
    userId: string
    isOnline: boolean
    lastActive: string
  }) => {
    setConversations((previousConversations) =>
      previousConversations.map((conversation) => {
        if (!conversation.otherUser || conversation.otherUser.userId !== payload.userId) {
          return conversation
        }

        return {
          ...conversation,
          otherUser: {
            ...conversation.otherUser,
            isOnline: payload.isOnline,
            lastActive: payload.lastActive,
          },
        }
      }),
    )
  }

  const handleTypingUpdate = (
    payload: {
      userId: string
      conversationId: string
    },
    isTyping: boolean,
  ) => {
    setConversations((previousConversations) =>
      previousConversations.map((conversation) => {
        if (
          conversation._id !== payload.conversationId ||
          !conversation.otherUser ||
          conversation.otherUser.userId !== payload.userId
        ) {
          return conversation
        }

        return {
          ...conversation,
          isTyping,
        }
      }),
    )
  }

  const handleMessagesRead = useCallback((payload: {
    conversationId: string
    readBy: string
  }) => {
    if (payload.readBy === currentUserId) {
      setConversations((previousConversations) =>
        previousConversations.map((conversation) => {
          if (conversation._id !== payload.conversationId) {
            return conversation
          }

          return {
            ...conversation,
            unreadCount: 0,
          }
        }),
      )
      return
    }

    setMessagesByConversation((previousMessages) => {
      const currentMessages = previousMessages[payload.conversationId]
      if (!currentMessages) {
        return previousMessages
      }

      return {
        ...previousMessages,
        [payload.conversationId]: currentMessages.map((message) =>
          message.senderId === currentUserId
            ? { ...message, status: "read" }
            : message,
        ),
      }
    })
  }, [currentUserId])

  const handleMessagesDelivered = useCallback((payload: {
    conversationId: string
    deliveredTo: string
  }) => {
    setMessagesByConversation((previousMessages) => {
      const currentMessages = previousMessages[payload.conversationId]
      if (!currentMessages) {
        return previousMessages
      }

      return {
        ...previousMessages,
        [payload.conversationId]: currentMessages.map((message) =>
          message.senderId === currentUserId && message.status === "sent"
            ? { ...message, status: "delivered" }
            : message,
        ),
      }
    })
  }, [currentUserId])

  const handleNewMatch = (payload: MatchRealtimeEvent) => {
    const nextConversation = payload.conversation
    const nextConversationId = payload.match.conversationId || nextConversation?._id || null

    if (nextConversation) {
      setConversations((previousConversations) =>
        upsertConversation(previousConversations, nextConversation),
      )
    }

    if (nextConversationId && !loadedConversationIdsRef.current[nextConversationId]) {
      loadedConversationIdsRef.current[nextConversationId] = false
    }

    if (nextConversationId && !selectedConversationIdRef.current) {
      setSelectedConversationId(nextConversationId)
      if (isMobileRef.current) {
        setOpen(true)
      }
    }

    if (payload.match.user?.displayName) {
      setFeedbackMessage(`Matched with ${payload.match.user.displayName}. Conversation unlocked.`)
    }
  }

  useEffect(() => {
    if (!token) {
      setIsLoadingChats(false)
      setFeedbackMessage("You need to sign in to use chat.")
      return
    }

    let cancelled = false

    const loadConversations = async () => {
      setIsLoadingChats(true)
      setFeedbackMessage(null)

      try {
        const data = await listConversationsApi()
        if (cancelled) {
          return
        }

        const nextConversations = sortConversations(data.conversations)
        setConversations(nextConversations)
        setSelectedConversationId((currentValue) => {
          const requestedConversationId = requestedConversationIdRef.current

          if (
            requestedConversationId &&
            nextConversations.some((conversation) => conversation._id === requestedConversationId)
          ) {
            return requestedConversationId
          }

          if (currentValue && nextConversations.some((conversation) => conversation._id === currentValue)) {
            return currentValue
          }

          return nextConversations[0]?._id || null
        })
      } catch (error) {
        if (cancelled) {
          return
        }

        setFeedbackMessage(
          error instanceof Error ? error.message : "Failed to load conversations.",
        )
      } finally {
        if (!cancelled) {
          setIsLoadingChats(false)
        }
      }
    }

    void loadConversations()

    return () => {
      cancelled = true
    }
  }, [token])

  useEffect(() => {
    const pendingAvatars = conversations.filter((conversation) => {
      const profilePhoto = conversation.otherUser?.profilePhoto
      return (
        typeof profilePhoto === "string" &&
        profilePhoto.length > 0 &&
        !isDirectAvatarUrl(profilePhoto) &&
        !signedAvatarUrls[conversation._id]
      )
    })

    if (pendingAvatars.length === 0) {
      return
    }

    let cancelled = false

    const loadSignedAvatars = async () => {
      const resolvedAvatars = await Promise.all(
        pendingAvatars.map(async (conversation) => {
          const profilePhoto = conversation.otherUser?.profilePhoto as string
          try {
            const signedUrl = await getSignedReadableImageUrl(profilePhoto)
            return [conversation._id, signedUrl] as const
          } catch {
            return [conversation._id, DEFAULT_AVATAR] as const
          }
        }),
      )

      if (cancelled) {
        return
      }

      setSignedAvatarUrls((previousAvatars) => {
        const nextAvatars = { ...previousAvatars }
        for (const [conversationId, avatarUrl] of resolvedAvatars) {
          nextAvatars[conversationId] = avatarUrl
        }
        return nextAvatars
      })
    }

    void loadSignedAvatars()

    return () => {
      cancelled = true
    }
  }, [conversations, signedAvatarUrls])

  useEffect(() => {
    const pendingAttachmentSources = Array.from(
      new Set(
        Object.values(messagesByConversation)
          .flatMap((messages) => messages)
          .flatMap((message) => message.attachments.map((attachment) => getAttachmentSource(attachment)))
          .filter(
            (source): source is string =>
              typeof source === "string" &&
              source.length > 0 &&
              !isLocalAssetUrl(source) &&
              !signedAttachmentUrls[source],
          ),
      ),
    )

    if (pendingAttachmentSources.length === 0) {
      return
    }

    let cancelled = false

    const loadSignedAttachmentUrls = async () => {
      const resolvedEntries = await Promise.all(
        pendingAttachmentSources.map(async (source) => {
          try {
            const signedUrl = await getSignedReadableUploadUrl(getSignedSourcePayload(source))
            return [source, signedUrl] as const
          } catch {
            return [source, source] as const
          }
        }),
      )

      if (cancelled) {
        return
      }

      setSignedAttachmentUrls((previousUrls) => {
        const nextUrls = { ...previousUrls }
        for (const [source, signedUrl] of resolvedEntries) {
          nextUrls[source] = signedUrl
        }
        return nextUrls
      })
    }

    void loadSignedAttachmentUrls()

    return () => {
      cancelled = true
    }
  }, [messagesByConversation, signedAttachmentUrls])

  useEffect(() => {
    if (!token) {
      return
    }

    const socket = getChatSocket(token)
    socketRef.current = socket

    const handleConnect = () => {
      setSocketConnected(true)
      setFeedbackMessage(null)

      const activeConversationId = selectedConversationIdRef.current
      if (activeConversationId) {
        socket.emit("conversation:join", activeConversationId)
        joinedConversationRef.current = activeConversationId
      }
    }

    const handleDisconnect = () => {
      setSocketConnected(false)
    }

    const handleSocketError = (payload: { message?: string }) => {
      if (payload?.message) {
        setFeedbackMessage(payload.message)
      }
    }

    const handleMessageSent = () => {
      pendingSocketMessageRef.current = null
    }

    const handleMessageError = (payload: { tempId?: string; error: string }) => {
      const pending = pendingSocketMessageRef.current
      if (pending) {
        setNewMessage(pending.text)
        pendingSocketMessageRef.current = null
      }
      setFeedbackMessage(payload.error || "Failed to send message. Try again.")
    }

    socket.on("connect", handleConnect)
    socket.on("disconnect", handleDisconnect)
    socket.on("message:new", ({ message }) => handleIncomingMessage(message))
    socket.on("message:sent", handleMessageSent)
    socket.on("message:error", handleMessageError)
    socket.on("messages:delivered", handleMessagesDelivered)
    socket.on("messages:read", handleMessagesRead)
    socket.on("user:presence", handlePresenceUpdate)
    socket.on("user:typing", (payload) => handleTypingUpdate(payload, true))
    socket.on("user:stopped-typing", (payload) => handleTypingUpdate(payload, false))
    socket.on("match:new", handleNewMatch)
    socket.on("error", handleSocketError)

    if (socket.connected) {
      handleConnect()
    }

    return () => {
      stopTyping(joinedConversationRef.current)

      if (joinedConversationRef.current) {
        socket.emit("conversation:leave", joinedConversationRef.current)
      }

      socket.off("connect", handleConnect)
      socket.off("disconnect", handleDisconnect)
      socket.off("message:new")
      socket.off("message:sent", handleMessageSent)
      socket.off("message:error", handleMessageError)
      socket.off("messages:delivered", handleMessagesDelivered)
      socket.off("messages:read")
      socket.off("user:presence")
      socket.off("user:typing")
      socket.off("user:stopped-typing")
      socket.off("match:new", handleNewMatch)
      socket.off("error", handleSocketError)

      closeChatSocket()
      socketRef.current = null
      joinedConversationRef.current = null
      setSocketConnected(false)
    }
  }, [handleIncomingMessage, handleMessagesDelivered, handleMessagesRead, token])

  useEffect(() => {
    const socket = socketRef.current

    if (!socket || !socketConnected) {
      return
    }

    const previousConversationId = joinedConversationRef.current
    if (previousConversationId && previousConversationId !== selectedConversationId) {
      stopTyping(previousConversationId)
      socket.emit("conversation:leave", previousConversationId)
    }

    if (selectedConversationId) {
      socket.emit("conversation:join", selectedConversationId)
      joinedConversationRef.current = selectedConversationId
      return
    }

    joinedConversationRef.current = null
  }, [selectedConversationId, socketConnected])

  useEffect(() => {
    if (!selectedConversationId) {
      return
    }

    const conversationId = selectedConversationId
    let cancelled = false

    const markConversationRead = () => {
      setConversations((previousConversations) =>
        previousConversations.map((conversation) => {
          if (conversation._id !== conversationId) {
            return conversation
          }

          return {
            ...conversation,
            unreadCount: 0,
          }
        }),
      )

      const socket = socketRef.current
      if (socket?.connected) {
        socket.emit("messages:read", { conversationId })
        return
      }

      void markConversationAsReadApi(conversationId).catch(() => undefined)
    }

    if (loadedConversationIdsRef.current[conversationId]) {
      markConversationRead()
      return
    }

    const loadMessages = async () => {
      setIsLoadingMessages(true)
      setFeedbackMessage(null)

      try {
        const data = await listMessagesApi(conversationId)
        if (cancelled) {
          return
        }

        loadedConversationIdsRef.current[conversationId] = true
        setMessagesByConversation((previousMessages) => ({
          ...previousMessages,
          [conversationId]: data.messages,
        }))
        markConversationRead()
      } catch (error) {
        if (cancelled) {
          return
        }

        setFeedbackMessage(
          error instanceof Error ? error.message : "Failed to load messages.",
        )
      } finally {
        if (!cancelled) {
          setIsLoadingMessages(false)
        }
      }
    }

    void loadMessages()

    return () => {
      cancelled = true
    }
  }, [selectedConversationId, socketConnected])

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current !== null) {
        window.clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  const toggleLeftPanel = () => setOpen((previousValue) => !previousValue)
  const closeLeftPanel = () => setOpen(false)

  const openAttachmentPicker = (kind: AttachmentPickerKind) => {
    if (!selectedConversationIdRef.current) {
      setFeedbackMessage("Select a conversation before sharing an attachment.")
      handlePlusMenuClose()
      return
    }

    const nextConfig = ATTACHMENT_PICKER_CONFIG[kind]
    setFilePickerConfig(nextConfig)
    setShowEmojiPicker(false)
    handlePlusMenuClose()

    if (fileInputRef.current) {
      fileInputRef.current.accept = nextConfig.accept
      fileInputRef.current.multiple = nextConfig.multiple
      fileInputRef.current.click()
    }
  }

  const handleFileClick = () => {
    openAttachmentPicker("document")
  }

  const removePendingAttachment = (id: string) => {
    setPendingAttachments((prev) => {
      const item = prev.find((a) => a.id === id)
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl)
      return prev.filter((a) => a.id !== id)
    })
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    event.target.value = ""

    if (selectedFiles.length === 0) return

    if (!selectedConversationIdRef.current) {
      setFeedbackMessage("Select a conversation before sharing an attachment.")
      return
    }

    const activePickerKind = filePickerConfig.kind
    const validFiles = selectedFiles.filter((f) => isAcceptedAttachmentType(f, activePickerKind))

    if (validFiles.length === 0) {
      setFeedbackMessage(
        activePickerKind === "document"
          ? "Please choose a supported document file."
          : `Please choose a valid ${activePickerKind} file.`,
      )
      return
    }

    setPendingAttachments((prev) => {
      const existingKind = prev[0]?.kind
      // If switching kind, release old blob URLs and start fresh
      let base = prev
      if (existingKind && existingKind !== activePickerKind) {
        base.forEach((a) => { if (a.previewUrl) URL.revokeObjectURL(a.previewUrl) })
        base = []
      }

      let filesToAdd: File[]
      if (activePickerKind === "image") {
        const available = MAX_CHAT_IMAGE_ATTACHMENTS - base.length
        if (available <= 0) return base
        filesToAdd = validFiles.slice(0, available)
      } else {
        // video / document: replace any existing with just 1 file
        base.forEach((a) => { if (a.previewUrl) URL.revokeObjectURL(a.previewUrl) })
        base = []
        filesToAdd = validFiles.slice(0, 1)
      }

      const newPending: PendingAttachment[] = filesToAdd.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        kind: activePickerKind,
        previewUrl: activePickerKind === "image" ? URL.createObjectURL(file) : null,
        name: file.name,
        size: file.size,
      }))

      return [...base, ...newPending]
    })
  }

  const handleMoreMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMoreMenuClose = () => {
    setAnchorEl(null)
  }

  const handlePlusMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElPlus(event.currentTarget)
  }

  const handlePlusMenuClose = () => {
    setAnchorElPlus(null)
  }

  const handleSelectConversation = (conversationId: string) => {
    if (conversationId === selectedConversationIdRef.current) {
      if (isMobile) {
        setOpen(true)
      }
      return
    }

    stopTyping(selectedConversationIdRef.current)
    setShowEmojiPicker(false)
    setNewMessage("")
    // Release blob URLs and clear preview queue on conversation switch
    setPendingAttachments((prev) => {
      prev.forEach((a) => { if (a.previewUrl) URL.revokeObjectURL(a.previewUrl) })
      return []
    })
    setSelectedConversationId(conversationId)

    if (isMobile) {
      setOpen(true)
    }
  }

  const handleSendWithAttachments = async (conversationId: string) => {
    const attachmentsToSend = [...pendingAttachments]
    const kind = attachmentsToSend[0].kind
    const messageType: ChatMessageType = kind === "document" ? "document" : kind
    const caption = newMessage.trim()

    // Clear UI immediately so the user sees the queue empty right away
    attachmentsToSend.forEach((a) => { if (a.previewUrl) URL.revokeObjectURL(a.previewUrl) })
    setPendingAttachments([])
    setNewMessage("")
    stopTyping(conversationId)

    setIsUploadingAttachment(true)
    setFeedbackMessage(getAttachmentUploadLabel(kind, attachmentsToSend.length))

    try {
      const uploadedAttachments = await Promise.all(
        attachmentsToSend.map((a) => uploadChatAttachmentApi(a.file)),
      )

      const message = await sendMessageApi(conversationId, {
        content: caption,
        messageType,
        attachments: uploadedAttachments.map((a) => ({ documentId: a.documentId })),
      })

      if (!socketRef.current?.connected) {
        handleIncomingMessage(message)
      }

      setFeedbackMessage(getAttachmentSuccessLabel(kind, uploadedAttachments.length))
    } catch (error) {
      setFeedbackMessage(
        error instanceof Error ? error.message : "Failed to share attachment.",
      )
    } finally {
      setIsUploadingAttachment(false)
    }
  }

  const handleSendMessage = async () => {
    const conversationId = selectedConversationIdRef.current
    if (!conversationId || isUploadingAttachment) return

    // Attachments take priority — caption in newMessage is included as content
    if (pendingAttachments.length > 0) {
      await handleSendWithAttachments(conversationId)
      return
    }

    const trimmedMessage = newMessage.trim()
    if (!trimmedMessage) return

    setFeedbackMessage(null)
    setNewMessage("")
    stopTyping(conversationId)

    try {
      const socket = socketRef.current
      if (socket?.connected) {
        pendingSocketMessageRef.current = { conversationId, text: trimmedMessage }
        socket.emit("message:send", {
          conversationId,
          text: trimmedMessage,
          messageType: "text",
        })
        return
      }

      const message = await sendMessageApi(conversationId, {
        content: trimmedMessage,
        messageType: "text",
      })
      handleIncomingMessage(message)
    } catch (error) {
      setNewMessage(trimmedMessage)
      setFeedbackMessage(
        error instanceof Error ? error.message : "Failed to send message.",
      )
    }
  }

  // ── Camera ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isCameraOpen) return

    let cancelled = false
    let activeVideoElement: HTMLVideoElement | null = null

    const startCamera = async () => {
      const video = cameraVideoRef.current
      if (!video) return
      activeVideoElement = video
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        cameraStreamRef.current = stream
        video.srcObject = stream
      } catch (err) {
        if (cancelled) return
        const domErr = err as DOMException
        setCameraError(
          domErr?.name === "NotAllowedError" || domErr?.name === "PermissionDeniedError"
            ? "Camera access denied. Please allow camera access in your browser settings."
            : "Failed to access camera. Please check your device.",
        )
      }
    }

    const timerId = window.setTimeout(() => { void startCamera() }, 150)

    return () => {
      cancelled = true
      window.clearTimeout(timerId)
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((t) => t.stop())
        cameraStreamRef.current = null
      }
      if (activeVideoElement) {
        activeVideoElement.srcObject = null
      }
      setCameraError(null)
    }
  }, [isCameraOpen])

  const handleOpenCamera = () => {
    handlePlusMenuClose()
    if (!selectedConversationIdRef.current) {
      setFeedbackMessage("Select a conversation before using camera.")
      return
    }
    setIsCameraOpen(true)
  }

  const handleCapturePhoto = () => {
    const video = cameraVideoRef.current
    if (!video || !video.videoWidth) return

    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0)

    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], `photo-${Date.now()}.jpg`, { type: "image/jpeg" })
      const previewUrl = URL.createObjectURL(blob)

      setPendingAttachments((prev) => {
        if (prev.length >= MAX_CHAT_IMAGE_ATTACHMENTS) {
          URL.revokeObjectURL(previewUrl)
          return prev
        }
        if (prev.length > 0 && prev[0].kind !== "image") {
          prev.forEach((a) => { if (a.previewUrl) URL.revokeObjectURL(a.previewUrl) })
          return [{ id: `cam-${Date.now()}`, file, kind: "image", previewUrl, name: file.name, size: file.size }]
        }
        return [...prev, { id: `cam-${Date.now()}`, file, kind: "image", previewUrl, name: file.name, size: file.size }]
      })

      setIsCameraOpen(false)
    }, "image/jpeg", 0.9)
  }

  const handleCloseCamera = () => {
    setIsCameraOpen(false)
  }

  // ── Location ──────────────────────────────────────────────────────────────
  const handleShareLocation = () => {
    handlePlusMenuClose()
    const conversationId = selectedConversationIdRef.current
    if (!conversationId) {
      setFeedbackMessage("Select a conversation before sharing location.")
      return
    }
    if (!navigator.geolocation) {
      setFeedbackMessage("Geolocation is not supported by your browser.")
      return
    }

    setIsLoadingLocation(true)
    setFeedbackMessage("Getting your location…")

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setIsLoadingLocation(false)
        setFeedbackMessage(null)
        const { latitude, longitude } = position.coords
        const locationText = `📍 My location: https://maps.google.com/?q=${latitude},${longitude}`
        try {
          const socket = socketRef.current
          if (socket?.connected) {
            pendingSocketMessageRef.current = { conversationId, text: locationText }
            socket.emit("message:send", { conversationId, text: locationText, messageType: "text" })
            return
          }
          const message = await sendMessageApi(conversationId, { content: locationText, messageType: "text" })
          handleIncomingMessage(message)
        } catch (error) {
          setFeedbackMessage(error instanceof Error ? error.message : "Failed to share location.")
        }
      },
      (error) => {
        setIsLoadingLocation(false)
        setFeedbackMessage(
          error.code === error.PERMISSION_DENIED
            ? "Location access denied. Please allow location access in your browser."
            : "Failed to get location. Please try again.",
        )
      },
      { timeout: 10000, enableHighAccuracy: true },
    )
  }

  // ── Contact ───────────────────────────────────────────────────────────────
  const sendContactMessage = async (conversationId: string, name: string, phone: string) => {
    const contactText = `👤 Contact: ${name}${phone ? ` — ${phone}` : ""}`
    try {
      const socket = socketRef.current
      if (socket?.connected) {
        pendingSocketMessageRef.current = { conversationId, text: contactText }
        socket.emit("message:send", { conversationId, text: contactText, messageType: "text" })
        return
      }
      const message = await sendMessageApi(conversationId, { content: contactText, messageType: "text" })
      handleIncomingMessage(message)
    } catch (error) {
      setFeedbackMessage(error instanceof Error ? error.message : "Failed to share contact.")
    }
  }

  const handleShareContact = async () => {
    handlePlusMenuClose()
    const conversationId = selectedConversationIdRef.current
    if (!conversationId) {
      setFeedbackMessage("Select a conversation before sharing a contact.")
      return
    }

    type ContactsNav = Navigator & {
      contacts?: {
        select: (props: string[], opts?: { multiple?: boolean }) => Promise<Array<{ name?: string[]; tel?: string[] }>>
      }
    }
    const nav = navigator as ContactsNav

    if (nav.contacts?.select) {
      try {
        const contacts = await nav.contacts.select(["name", "tel"], { multiple: false })
        if (contacts.length > 0) {
          const c = contacts[0]
          await sendContactMessage(conversationId, c.name?.[0] ?? "Unknown", c.tel?.[0] ?? "")
          return
        }
      } catch {
        // fall through to manual form
      }
    }

    setContactFormData({ name: "", phone: "" })
    setIsContactPickerOpen(true)
  }

  const handleContactFormSubmit = async () => {
    const conversationId = selectedConversationIdRef.current
    if (!conversationId) return
    const { name, phone } = contactFormData
    if (!name.trim() && !phone.trim()) {
      setFeedbackMessage("Please enter a name or phone number.")
      return
    }
    setIsContactPickerOpen(false)
    await sendContactMessage(conversationId, name.trim() || "Unknown", phone.trim())
  }

  // ── Attachment open ───────────────────────────────────────────────────────
  const handleOpenAttachment = async (attachment: MessageAttachmentViewModel) => {
    if (!attachment.source) {
      return
    }

    if (attachment.url && (isLocalAssetUrl(attachment.source) || signedAttachmentUrls[attachment.source])) {
      window.open(attachment.url, "_blank", "noopener,noreferrer")
      return
    }

    setOpeningAttachmentSource(attachment.source)

    try {
      const signedUrl =
        signedAttachmentUrls[attachment.source] ||
        (await getSignedReadableUploadUrl(getSignedSourcePayload(attachment.source)))

      setSignedAttachmentUrls((previousUrls) => ({
        ...previousUrls,
        [attachment.source]: signedUrl,
      }))

      window.open(signedUrl, "_blank", "noopener,noreferrer")
    } catch (error) {
      setFeedbackMessage(
        error instanceof Error ? error.message : "Failed to open attachment.",
      )
    } finally {
      setOpeningAttachmentSource(null)
    }
  }

  const renderAttachmentCaption = (text?: string) => {
    if (!text) {
      return null
    }

    return (
      <Typography variant="body2" className="message-text attachment-caption">
        {text}
      </Typography>
    )
  }

  const renderMessage = (message: MessageViewModel) => {
    switch (message.type) {
      case "text": {
        const text = message.text || ""

        const call = parseCallContent(text)
        if (call) {
          return <CallMessageCard call={call} isOwn={message.isOwn} />
        }

        const location = parseLocationContent(text)
        if (location) {
          return <LocationMessageCard location={location} />
        }

        const contact = parseContactContent(text)
        if (contact) {
          return <ContactMessageCard contact={contact} />
        }

        return (
          <Typography variant="body2" className="message-text">
            {renderTextWithLinks(text)}
          </Typography>
        )
      }
      case "image": {
        const images = message.attachments
        const maxVisible = 4
        const hasMore = images.length > maxVisible

        return (
          <Box>
            <ImageList cols={2} gap={12} className="message_images">
              {images.slice(0, maxVisible).map((imageAttachment, index) => (
                <ImageListItem key={`${imageAttachment.source}-${index}`} className="img_item">
                  {imageAttachment.url ? (
                    <Box
                      component="img"
                      src={imageAttachment.url}
                      alt={imageAttachment.name || `Shared image ${index + 1}`}
                      className="message_image_asset"
                    />
                  ) : (
                    <Box className="message_image_asset" />
                  )}
                  {index === maxVisible - 1 && hasMore && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        bgcolor: "rgba(0,0,0,0.6)",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "20px",
                        fontWeight: 600,
                      }}
                    >
                      +{images.length - maxVisible}
                    </Box>
                  )}
                </ImageListItem>
              ))}
            </ImageList>
            {renderAttachmentCaption(message.text)}
          </Box>
        )
      }
      case "video": {
        const videoAttachment = message.attachments[0]

        if (!videoAttachment) {
          return renderAttachmentCaption(message.text)
        }

        return (
          <Box className="message_video">
            {videoAttachment.url ? (
              <Box
                component="video"
                controls
                preload="metadata"
                className="message_video_player"
                src={videoAttachment.url}
              />
            ) : (
              <Box className="message_video_placeholder">
                <TheatersOutlinedIcon sx={{ width: 28, height: 28 }} />
              </Box>
            )}
            <Box className="message_video_meta">
              <Box className="file_info">
                <Typography variant="body2" className="file_name_text">
                  {videoAttachment.name}
                </Typography>
                <Typography variant="caption" className="file_size_text">
                  {formatDocumentSize(videoAttachment.size || undefined) || "Shared video"}
                </Typography>
              </Box>
              <IconButton
                className="download_icon"
                onClick={() => void handleOpenAttachment(videoAttachment)}
                disabled={openingAttachmentSource === videoAttachment.source}
              >
                <Download sx={{ width: 24, height: 24 }} />
              </IconButton>
            </Box>
            {renderAttachmentCaption(message.text)}
          </Box>
        )
      }
      case "file": {
        const fileAttachment = message.attachments[0]

        return (
          <Box>
            <Box className="message_file">
              <Icon className="file_icon">
                <InsertDriveFileOutlinedIcon sx={{ width: 32, height: 32 }} />
              </Icon>
              <Box className="file_info">
                <Typography variant="body2" className="file_name_text">
                  {fileAttachment?.name || "Attachment"}
                </Typography>
                <Typography variant="caption" className="file_size_text">
                  {formatDocumentSize(fileAttachment?.size || undefined) || "Shared file"}
                </Typography>
              </Box>
              <IconButton
                className="download_icon"
                onClick={() => fileAttachment && void handleOpenAttachment(fileAttachment)}
                disabled={!fileAttachment || openingAttachmentSource === fileAttachment.source}
              >
                <Download sx={{ width: 24, height: 24 }} />
              </IconButton>
            </Box>
            {renderAttachmentCaption(message.text)}
          </Box>
        )
      }
      default:
        return (
          <Typography variant="body2" className="message-text">
            {message.text}
          </Typography>
        )
    }
  }

  const chatItems: ChatViewModel[] = conversations.map((conversation) => {
    const profilePhoto = conversation.otherUser?.profilePhoto || null
    const avatar =
      signedAvatarUrls[conversation._id] ||
      (isDirectAvatarUrl(profilePhoto) ? profilePhoto : null) ||
      DEFAULT_AVATAR

    const messageList = (messagesByConversation[conversation._id] || []).map((message) =>
      mapApiMessageToUi(message, currentUserId, signedAttachmentUrls),
    )

    return {
      id: conversation._id,
      otherUserId: conversation.otherUser?.userId || null,
      name: conversation.otherUser?.displayName || "Unknown user",
      role: humanize(conversation.otherUser?.roleType) || "Connection",
      avatar,
      status: buildPresenceStatus(conversation.otherUser, conversation.isTyping),
      messages: messageList,
      lastMessageText:
        formatConversationPreview(conversation.lastMessageText) ||
        (messageList.length > 0
          ? formatConversationPreview(messageList[messageList.length - 1]?.text) || "Attachment"
          : "No messages yet"),
    }
  })

  const selectedConversation =
    chatItems.find((chat) => chat.id === selectedConversationId) ||
    chatItems[0] ||
    null

  const selectedMatchId =
    conversations.find((c) => c._id === (selectedConversation?.id ?? null))?.matchId ?? null

  const selectedMessages = selectedConversation
    ? [...selectedConversation.messages].reverse()
    : []

  const searchOptions: ChatOption[] = chatItems.map((chat) => ({
    id: chat.id,
    label: chat.name,
  }))

  const selectedSearchOption =
    searchOptions.find((option) => option.id === selectedConversation?.id) || null

  const handleStartVideoCall = async () => {
    if (!selectedConversation?.otherUserId) {
      setFeedbackMessage("Select an active conversation to start a call.")
      return
    }

    setFeedbackMessage(null)

    try {
      await startCall({
        conversationId: selectedConversation.id,
        targetUserId: selectedConversation.otherUserId,
        callType: "video",
      })
    } catch (error) {
      setFeedbackMessage(
        error instanceof Error ? error.message : "Failed to start the call.",
      )
    }
  }

  return (
    <ChatClientStyled>
      <Stack
        direction="row"
        spacing={isMobile ? 0 : 2.5}
        className="chatClient_row"
      >
        <Box className={`left_cont ${open ? "chatOpen" : ""}`}>
          <Box className="left_cont_header">
            <Box className="selected_user_cont">
              <Box className="selected_user_cont_left_side">
                {isMobile && (
                  <Box className="mobile_header">
                    <IconButton
                      disableRipple
                      onClick={closeLeftPanel}
                      className="mobile_close_btn"
                    >
                      <ArrowBackIosIcon sx={{ width: 28, height: 28 }} />
                    </IconButton>
                  </Box>
                )}
                <Box className="selected_user_avatar_wrap">
                  <Avatar
                    src={selectedConversation?.avatar || DEFAULT_AVATAR}
                    alt={selectedConversation?.name || "User"}
                    sx={{ width: 52, height: 52 }}
                  />
                </Box>
                <Box className="selected_user_name_status_wrap">
                  <Typography variant="h6" className="selected_user_name">
                    {selectedConversation?.name || "No conversations yet"}
                  </Typography>
                  <Typography variant="body1" className="selected_user_status">
                    {selectedConversation?.status || "Start a new match to begin chatting"}
                  </Typography>
                </Box>
              </Box>
              <Box className="menu_icons_cont">
                <IconButton
                  className="video_call_btn"
                  onClick={() => void handleStartVideoCall()}
                  disabled={!selectedConversation?.otherUserId}
                >
                  <VideocamIcon sx={{ width: 24, height: 24 }} />
                </IconButton>

                <IconButton
                  className="menu_btn"
                  onClick={handleFileClick}
                  disabled={!selectedConversation || isUploadingAttachment}
                >
                  <Image
                    src="/assets/icons/file-icon.svg"
                    alt="file icon"
                    width={24}
                    height={24}
                  />
                </IconButton>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  accept={filePickerConfig.accept}
                  multiple={filePickerConfig.multiple}
                />
                <IconButton className="menu_btn" onClick={handleMoreMenuOpen}>
                  <Image
                    src="/assets/icons/more-icon.svg"
                    alt="more icon"
                    width={24}
                    height={24}
                  />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={openMoreMenu}
                  onClose={handleMoreMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  slotProps={{
                    paper: {
                      sx: {
                        mt: 1,
                      },
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleMoreMenuClose()
                      setIsProfileModalOpen(true)
                    }}
                    disabled={!selectedMatchId}
                  >
                    View Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMoreMenuClose()
                    }}
                  >
                    Block User
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMoreMenuClose()
                    }}
                  >
                    Delete Chat
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Box>
          <Box className="left_cont_chatbody_cont">
            <Box className="chat-messages">
              {selectedConversation ? (
                selectedMessages.length > 0 ? (
                  selectedMessages.map((message) => {
                  const isCallMessage =
                    message.type === "text" && Boolean(parseCallContent(message.text))
                  const isLocationMessage =
                    message.type === "text" && Boolean(parseLocationContent(message.text))
                  const isContactMessage =
                    message.type === "text" && Boolean(parseContactContent(message.text))

                  return (
                    <Box key={message.id} className="message-container">
                      <Box
                        className={`message-wrapper ${
                          message.isOwn ? "own" : "other"
                        }`}
                      >
                        {!message.isOwn && (
                          <Avatar
                            src={selectedConversation.avatar}
                            alt={selectedConversation.name}
                            className="message-avatar"
                            sx={{ width: 36, height: 36, mr: 2 }}
                          />
                        )}
                        <Box className="message-content">
                          <Box
                            className={`message-bubble ${
                              message.isOwn ? "own" : "other"
                            } ${message.type === "image" ? "image-bubble" : ""} ${
                              message.type === "video" ? "video-bubble" : ""
                            } ${isLocationMessage ? "location-bubble" : ""} ${
                              isContactMessage ? "contact-bubble" : ""
                            } ${isCallMessage ? "call-bubble" : ""}`}
                          >
                            {renderMessage(message)}
                          </Box>
                          <Box className="message_time_wrap">
                            <Typography
                              variant="caption"
                              className={`message_time ${
                                message.isOwn ? "own" : "other"
                              }`}
                            >
                              {message.time}
                            </Typography>
                            {message.isOwn ? (
                              <Icon
                                className={`message_status own ${normalizeMessageStatus(message.status)}`}
                              >
                                {renderMessageStatusIcon(message.status)}
                              </Icon>
                            ) : null}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  )
                })
                ) : (
                  <Box className="no_chat_cont">
                    {isLoadingMessages
                      ? "Loading messages..."
                      : "No messages yet. Start the conversation."}
                  </Box>
                )
              ) : (
                <Box className="no_chat_cont">
                  {isLoadingChats
                    ? "Loading conversations..."
                    : feedbackMessage || "No conversations available yet."}
                </Box>
              )}
            </Box>

            <Box className="chat_input_wrap">
              {/* ── Pending attachment preview strip ── */}
              {pendingAttachments.length > 0 && (
                <Box className="attachment-preview-strip">
                  {pendingAttachments.map((attachment) => (
                    <Box key={attachment.id} className="attachment-preview-item">
                      {attachment.kind === "image" && attachment.previewUrl ? (
                        <Box
                          component="img"
                          src={attachment.previewUrl}
                          alt={attachment.name}
                          className="attachment-preview-image"
                        />
                      ) : (
                        <Box className="attachment-preview-icon">
                          {attachment.kind === "video"
                            ? <TheatersOutlinedIcon sx={{ fontSize: 28 }} />
                            : <InsertDriveFileOutlinedIcon sx={{ fontSize: 28 }} />}
                        </Box>
                      )}
                      <IconButton
                        className="attachment-remove-btn"
                        size="small"
                        onClick={() => removePendingAttachment(attachment.id)}
                        aria-label={`Remove ${attachment.name}`}
                      >
                        <CloseIcon sx={{ fontSize: 12 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}

              <Box className="chat-input">
                <IconButton
                  className="chat-input-icon"
                  onClick={handlePlusMenuOpen}
                  disabled={!selectedConversation || isUploadingAttachment}
                >
                  <AddOutlinedIcon fontSize="small" />
                </IconButton>

                <TextareaAutosize
                  value={newMessage}
                  onChange={(event) => updateDraft(event.target.value)}
                  placeholder={pendingAttachments.length > 0 ? "Add a caption…" : "Type a Message here"}
                  className="chat_textarea"
                  minRows={1}
                  maxRows={3}
                  disabled={!selectedConversation || isUploadingAttachment}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault()
                      void handleSendMessage()
                    }
                  }}
                />

                <Box className="chat-input-actions">
                  <IconButton
                    className="smile_icon"
                    onClick={() => setShowEmojiPicker((previousValue) => !previousValue)}
                    disabled={!selectedConversation || isUploadingAttachment}
                  >
                    <Image
                      src="/assets/icons/Smile icon.svg"
                      alt="smile icon"
                      width={24}
                      height={24}
                    />
                  </IconButton>
                  <IconButton
                    onClick={() => void handleSendMessage()}
                    className="send_btn"
                    disabled={
                      !selectedConversation ||
                      isUploadingAttachment ||
                      (pendingAttachments.length === 0 && !newMessage.trim())
                    }
                  >
                    <Image
                      src="/assets/icons/navigation-2.svg"
                      alt="send icon"
                      width={16}
                      height={16}
                    />
                  </IconButton>
                </Box>
                {showEmojiPicker && (
                  <Box className="emoji-picker-wrap">
                    <EmojiPicker
                      onEmojiClick={(emoji) => updateDraft(`${newMessage}${emoji.emoji}`)}
                    />
                  </Box>
                )}
              </Box>

              <StyledMenu
                anchorEl={anchorElPlus}
                open={openPlusMenu}
                onClose={handlePlusMenuClose}
                keepMounted={false}
                disablePortal
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
              >
                <MenuItem onClick={handleOpenCamera} title="Camera">
                  <CameraAltIcon sx={{ width: 24, height: 24 }} />
                </MenuItem>
                <MenuItem
                  onClick={handleShareLocation}
                  disabled={isLoadingLocation}
                  title="Share Location"
                >
                  {isLoadingLocation
                    ? <CircularProgress size={24} sx={{ color: "inherit" }} />
                    : <LocationOnIcon sx={{ width: 24, height: 24 }} />}
                </MenuItem>
                <MenuItem onClick={() => void handleShareContact()} title="Share Contact">
                  <ContactPhoneIcon sx={{ width: 24, height: 24 }} />
                </MenuItem>
                <MenuItem onClick={() => openAttachmentPicker("video")} title="Video">
                  <TheatersOutlinedIcon sx={{ width: 24, height: 24 }} />
                </MenuItem>
                <MenuItem onClick={() => openAttachmentPicker("image")} title="Images">
                  <PermMediaOutlinedIcon sx={{ width: 24, height: 24 }} />
                </MenuItem>
                <MenuItem onClick={() => openAttachmentPicker("document")} title="Document">
                  <InsertDriveFileOutlinedIcon sx={{ width: 24, height: 24 }} />
                </MenuItem>
              </StyledMenu>
              {feedbackMessage && (
                <Typography
                  variant="caption"
                  sx={{ display: "block", mt: 1, color: "rgba(109, 157, 197, 0.9)" }}
                >
                  {feedbackMessage}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Box className="right_cont">
          <Box className="right_cont_inner">
            <Box className="rightbox_header_cont">
              <Stack
                direction="row"
                spacing={1}
                justifyContent="flex-start"
                alignItems="center"
              >
                <Typography variant="h6" className="rightbox_text_header">
                  All Chats
                </Typography>
                <Box className="total_chat_count_cont">{chatItems.length}</Box>
              </Stack>
            </Box>

            <Box className="rightbox_search_wrap">
              <ChatInputAutocomplete
                withBorder
                value={selectedSearchOption}
                onChange={(_event, value) => {
                  if (value && typeof value !== 'string' && value.id) {
                    handleSelectConversation(String(value.id))
                  }
                }}
                options={searchOptions}
              />
            </Box>

            <Box className="rightbox_allUsers_wrap">
              {chatItems.map((chat) => (
                <Box
                  key={chat.id}
                  className={`single_user_cont ${
                    selectedConversation?.id === chat.id ? "selected" : ""
                  }`}
                  onClick={() => handleSelectConversation(chat.id)}
                >
                  <Box className="avatar_wrap">
                    <Avatar
                      src={chat.avatar}
                      alt={chat.name}
                      sx={{ width: 52, height: 52 }}
                    />
                  </Box>

                  <Box className="single_user_cont_rightSide">
                    <Box className="user_name_role_cont">
                      <Typography variant="h6" className="chat_name">
                        {chat.name}
                      </Typography>
                      <Typography variant="body1" className="chat_role">
                        {chat.role}
                      </Typography>
                    </Box>

                    <Typography variant="body2" className="message_text">
                      {chat.lastMessageText || "No messages yet"}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <Box
          className={open ? "chatOverlay_open chatOverlay" : "chatOverlay"}
          onClick={toggleLeftPanel}
        />
      </Stack>

      {/* ── User Profile Modal ───────────────────────────────────────── */}
      <ChatUserProfileModal
        open={isProfileModalOpen}
        matchId={selectedMatchId}
        initialAvatarUrl={selectedConversation?.avatar || null}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* ── Camera Modal ──────────────────────────────────────────────── */}
      <Dialog
        open={isCameraOpen}
        onClose={handleCloseCamera}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, bgcolor: "#000", overflow: "hidden" } }}
      >
        <DialogTitle
          sx={{
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          Take a Photo
          <IconButton onClick={handleCloseCamera} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {cameraError ? (
            <Box sx={{ p: 3, color: "#aaa", textAlign: "center", minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography>{cameraError}</Typography>
            </Box>
          ) : (
            <Box
              component="video"
              ref={cameraVideoRef}
              autoPlay
              playsInline
              muted
              sx={{ width: "100%", display: "block", maxHeight: "60vh", objectFit: "cover", bgcolor: "#111" }}
            />
          )}
        </DialogContent>
        {!cameraError && (
          <DialogActions sx={{ justifyContent: "center", py: 2.5, bgcolor: "#000" }}>
            <IconButton
              onClick={handleCapturePhoto}
              sx={{
                width: 64,
                height: 64,
                bgcolor: "#fff",
                border: "4px solid rgba(255,255,255,0.4)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.88)" },
              }}
            >
              <CameraAltIcon sx={{ fontSize: 30, color: "#111" }} />
            </IconButton>
          </DialogActions>
        )}
      </Dialog>

      {/* ── Contact Picker Fallback Modal ─────────────────────────────── */}
      <Dialog
        open={isContactPickerOpen}
        onClose={() => setIsContactPickerOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Share Contact
          <IconButton onClick={() => setIsContactPickerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField
              label="Name"
              value={contactFormData.name}
              onChange={(e) => setContactFormData((prev) => ({ ...prev, name: e.target.value }))}
              fullWidth
              size="small"
              autoFocus
            />
            <TextField
              label="Phone Number"
              value={contactFormData.phone}
              onChange={(e) => setContactFormData((prev) => ({ ...prev, phone: e.target.value }))}
              fullWidth
              size="small"
              type="tel"
              onKeyDown={(e) => { if (e.key === "Enter") void handleContactFormSubmit() }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            variant="contained"
            onClick={() => void handleContactFormSubmit()}
            fullWidth
            disabled={!contactFormData.name.trim() && !contactFormData.phone.trim()}
            sx={{
              borderRadius: 2,
              background: "linear-gradient(325.78deg, #109da4 14.76%, #7fded8 87.3%)",
              "&:hover": { background: "linear-gradient(325.78deg, #7fded8 14.76%, #109da4 87.3%)" },
              "&.Mui-disabled": { background: "rgba(109,157,197,0.2)", color: "rgba(255,255,255,0.6)" },
            }}
          >
            Share Contact
          </Button>
        </DialogActions>
      </Dialog>
    </ChatClientStyled>
  )
}

export default ChatSecClient
