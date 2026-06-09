"use client"

import { io, type Socket } from "socket.io-client"
import {
  SOCKET_BASE_URL,
  type ChatMessage,
} from "./chat-api"
import type { CallEventPayload } from "./call-api"
import type { MatchRealtimeEvent } from "./matchmaking-api"

type ServerToClientEvents = {
  "conversation:joined": (payload: { conversationId: string }) => void
  "conversation:left": (payload: { conversationId: string }) => void
  "message:new": (payload: { message: ChatMessage }) => void
  "message:sent": (payload: { tempId?: string; messageId: string; sentAt: string }) => void
  "message:error": (payload: { tempId?: string; error: string }) => void
  "messages:delivered": (payload: { conversationId: string; deliveredTo: string; count?: number }) => void
  "messages:read": (payload: { conversationId: string; readBy: string; count?: number }) => void
  "user:typing": (payload: { userId: string; conversationId: string; isTyping: boolean }) => void
  "user:stopped-typing": (payload: { userId: string; conversationId: string }) => void
  "user:presence": (payload: { userId: string; isOnline: boolean; lastActive: string }) => void
  "call:incoming": (payload: CallEventPayload) => void
  "call:accepted": (payload: CallEventPayload & { acceptedByUserId: string }) => void
  "call:ended": (payload: CallEventPayload & { endedByUserId: string | null; reason: string }) => void
  "match:new": (payload: MatchRealtimeEvent) => void
  notification: (payload: unknown) => void
  error: (payload: { message?: string }) => void
}

type ClientToServerEvents = {
  "conversation:join": (conversationId: string) => void
  "conversation:leave": (conversationId: string) => void
  "message:send": (payload: {
    conversationId: string
    tempId?: string
    text?: string
    messageType?: "text" | "image" | "document" | "video" | "audio"
    attachments?: Array<string | { documentId?: string }>
  }) => void
  "message:typing": (payload: { conversationId: string; isTyping: boolean }) => void
  "messages:read": (payload: { conversationId: string }) => void
}

export type ChatSocket = Socket<ServerToClientEvents, ClientToServerEvents>

let socketInstance: ChatSocket | null = null
let socketToken: string | null = null
let socketConsumers = 0

export function getChatSocket(token: string) {
  if (socketInstance && socketToken === token) {
    socketConsumers += 1
    return socketInstance
  }

  if (socketInstance) {
    socketInstance.disconnect()
  }

  socketToken = token
  socketConsumers = 1
  socketInstance = io(SOCKET_BASE_URL, {
    autoConnect: true,
    auth: {
      token,
    },
  })

  return socketInstance
}

export function closeChatSocket() {
  if (!socketInstance) {
    return
  }

  socketConsumers = Math.max(socketConsumers - 1, 0)
  if (socketConsumers > 0) {
    return
  }

  socketInstance.disconnect()
  socketInstance = null
  socketToken = null
  socketConsumers = 0
}
