"use client"

import { requestWithAuth } from "./api-client"

export type CallType = "video" | "audio"
export type CallStatus = "ringing" | "active" | "ended" | "missed" | "declined"

export type CallParticipant = {
  userId: string
  displayName: string
  profilePhoto: string | null
  roleType: string
  isOnline: boolean
  lastActive: string | null
}

export type CallEventPayload = {
  callId: string
  channelName: string
  conversationId: string
  callType: CallType
  status: CallStatus
  initiatedAt: string
  acceptedAt: string | null
  endedAt: string | null
  expiresAt: string
  caller: CallParticipant
  receiver: CallParticipant
}

export type InitiateCallResponse = CallEventPayload & {
  appId: string
  caller: CallParticipant & {
    uid: number
    token: string
    expiresAt: number
  }
  receiver: CallParticipant & {
    uid: number
  }
}

export type AcceptCallResponse = CallEventPayload & {
  appId: string
  uid: number
  token: string
  tokenExpiresAt: number
  tokenExpiresAtDate: string
}

export async function initiateCallApi(payload: {
  targetUserId: string
  callType?: CallType
}) {
  return requestWithAuth<InitiateCallResponse>("/call/initiate", {
    method: "POST",
    body: payload,
  })
}

export async function acceptCallApi(channelName: string) {
  return requestWithAuth<AcceptCallResponse>("/call/accept", {
    method: "POST",
    body: { channelName },
  })
}

export async function endCallApi(channelName?: string, reason?: string, keepalive = false) {
  return requestWithAuth<{ message: string; reason: string }>("/call/end", {
    method: "POST",
    body: {
      channelName,
      reason,
    },
    keepalive,
  })
}
