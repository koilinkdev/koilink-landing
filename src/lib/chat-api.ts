"use client"

import { API_BASE_URL, ApiError } from "./auth-api"
import { requestWithAuth } from "./api-client"

export type ChatMessageType = "text" | "image" | "document" | "video" | "audio"

export type ChatMessageAttachment = {
  documentId?: string
  key?: string | null
  url?: string | null
  name?: string | null
  filename?: string | null
  originalName?: string | null
  contentType?: string | null
  size?: number | null
}

export type ChatParticipant = {
  userId: string
  displayName: string
  profilePhoto: string | null
  roleType: string
  isOnline: boolean
  lastActive: string | null
}

export type ChatConversation = {
  _id: string
  matchId: string | null
  status: "active" | "archived" | "blocked" | "inactive"
  lastMessageText: string
  lastMessageAt: string | null
  lastMessageBy: string | null
  messageCount: number
  unreadCount: number
  isTyping: boolean
  otherUser: ChatParticipant | null
}

export type ChatMessage = {
  _id: string
  conversationId: string
  senderId: string
  sender: ChatParticipant | null
  messageType: ChatMessageType
  content: string
  attachments: ChatMessageAttachment[]
  status: "sent" | "delivered" | "read" | "failed"
  createdAt: string
}

type ConversationsResponse = {
  conversations: ChatConversation[]
  hasMore: boolean
  offset: number
}

type MessagesResponse = {
  messages: ChatMessage[]
  hasMore: boolean
  offset: number
}

type SignReadUploadResponse = {
  url?: string
  key?: string
  error?: string
}

type SignUploadResponse = {
  url?: string
  key?: string
  documentId?: string
  publicUrl?: string
  error?: string
}

type CompleteUploadResponse = {
  document?: {
    _id?: string
    key?: string
    url?: string
    contentType?: string
    size?: number
    metadata?: Record<string, unknown>
  }
  error?: string
}

type SignedReadableUploadSource = {
  key?: string
  url?: string
}

export type UploadedChatAttachment = {
  documentId: string
  key?: string
  url?: string | null
  name: string
  contentType: string
  size: number
}

export const SOCKET_BASE_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL?.replace(/\/$/, "") ??
  API_BASE_URL.replace(/\/api\/v1$/, "")

export async function listConversationsApi() {
  return requestWithAuth<ConversationsResponse>("/chat/conversations")
}

export async function listMessagesApi(conversationId: string) {
  return requestWithAuth<MessagesResponse>(`/chat/conversations/${conversationId}/messages`)
}

export async function sendMessageApi(
  conversationId: string,
  payload: {
    content: string
    messageType?: ChatMessageType
    attachments?: Array<string | { documentId?: string }>
  }
) {
  const data = await requestWithAuth<{ message: ChatMessage }>(
    `/chat/conversations/${conversationId}/messages`,
    {
      method: "POST",
      body: payload,
    }
  )

  return data.message
}

export async function markConversationAsReadApi(conversationId: string) {
  return requestWithAuth<{ markedCount: number }>(`/chat/conversations/${conversationId}/read`, {
    method: "PUT",
  })
}

export async function getSignedReadableUploadUrl(
  source: SignedReadableUploadSource,
  expiresIn = 1800,
) {
  const data = await requestWithAuth<SignReadUploadResponse>("/uploads/sign-read", {
    method: "POST",
    body: { ...source, expiresIn },
    expectEnvelope: false,
  })

  if (!data.url) {
    throw new ApiError(500, data.error || "Failed to generate signed read url", data)
  }

  return data.url
}

export async function getSignedReadableImageUrl(rawUrl: string) {
  return getSignedReadableUploadUrl({ url: rawUrl })
}

export async function uploadChatAttachmentApi(file: File): Promise<UploadedChatAttachment> {
  const contentType = file.type || "application/octet-stream"

  const signData = await requestWithAuth<SignUploadResponse>("/uploads/sign", {
    method: "POST",
    body: {
      contentType,
      kind: "chat-attachment",
      prefix: "chat-attachments",
    },
    expectEnvelope: false,
  })

  if (!signData.url || !signData.documentId) {
    throw new ApiError(500, signData.error || "Failed to initialize chat attachment upload", signData)
  }

  const putResponse = await fetch(signData.url, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: file,
  })

  if (!putResponse.ok) {
    throw new ApiError(500, "Failed to upload attachment to storage")
  }

  const completeData = await requestWithAuth<CompleteUploadResponse>("/uploads/complete", {
    method: "POST",
    body: {
      documentId: signData.documentId,
      size: file.size,
      publicUrl: signData.publicUrl,
      metadata: {
        source: "dashboard-chat",
        kind: "chat-attachment",
        fileName: file.name,
      },
    },
    expectEnvelope: false,
  })

  return {
    documentId: signData.documentId,
    key: completeData.document?.key || signData.key,
    url: signData.publicUrl || completeData.document?.url || null,
    name: file.name,
    contentType,
    size: file.size,
  }
}
