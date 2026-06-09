"use client"

import {
  acceptCallApi,
  endCallApi,
  initiateCallApi,
  type CallEventPayload,
  type CallParticipant,
  type CallType,
} from "@/lib/call-api"
import { getAuthSession } from "@/lib/auth-session"
import { closeChatSocket, getChatSocket } from "@/lib/chat-socket"
import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material"
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

const ACTIVE_CALL_STORAGE_KEY = "koilink.active.call"

export type ActiveCallSession = {
  callId: string
  channelName: string
  conversationId: string
  callType: CallType
  appId: string
  token: string
  uid: number
  role: "caller" | "receiver"
  counterpart: CallParticipant
  initiatedAt: string
  acceptedAt: string | null
  expiresAt: string
  tokenExpiresAt: number
}

type StartCallOptions = {
  conversationId: string
  targetUserId: string
  callType?: CallType
}

type EndCallOptions = {
  navigate?: boolean
  keepalive?: boolean
}

type CallContextValue = {
  incomingCall: CallEventPayload | null
  activeCall: ActiveCallSession | null
  startCall: (options: StartCallOptions) => Promise<void>
  acceptIncomingCall: () => Promise<void>
  declineIncomingCall: () => Promise<void>
  endActiveCall: (reason?: string, options?: EndCallOptions) => Promise<void>
}

const CallContext = createContext<CallContextValue | null>(null)

function readStoredActiveCall() {
  if (typeof window === "undefined") {
    return null
  }

  const raw = window.sessionStorage.getItem(ACTIVE_CALL_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as ActiveCallSession
  } catch {
    window.sessionStorage.removeItem(ACTIVE_CALL_STORAGE_KEY)
    return null
  }
}

function writeStoredActiveCall(session: ActiveCallSession | null) {
  if (typeof window === "undefined") {
    return
  }

  if (!session) {
    window.sessionStorage.removeItem(ACTIVE_CALL_STORAGE_KEY)
    return
  }

  window.sessionStorage.setItem(ACTIVE_CALL_STORAGE_KEY, JSON.stringify(session))
}

export function CallProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const session = getAuthSession()
  const currentUserId = session?.user.id || null
  const token = session?.tokens.access || null

  const [incomingCall, setIncomingCall] = useState<CallEventPayload | null>(null)
  const [activeCall, setActiveCall] = useState<ActiveCallSession | null>(null)
  const [bannerMessage, setBannerMessage] = useState<string | null>(null)

  const currentUserIdRef = useRef<string | null>(currentUserId)
  const pathnameRef = useRef(pathname)
  const activeCallRef = useRef<ActiveCallSession | null>(null)
  const incomingCallRef = useRef<CallEventPayload | null>(null)

  useEffect(() => {
    setActiveCall(readStoredActiveCall())
  }, [])

  useEffect(() => {
    currentUserIdRef.current = currentUserId
  }, [currentUserId])

  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  useEffect(() => {
    activeCallRef.current = activeCall
    writeStoredActiveCall(activeCall)
  }, [activeCall])

  useEffect(() => {
    incomingCallRef.current = incomingCall
  }, [incomingCall])

  useEffect(() => {
    if (!token) {
      return
    }

    const socket = getChatSocket(token)

    const handleIncomingCall = (payload: CallEventPayload) => {
      if (activeCallRef.current?.channelName === payload.channelName) {
        return
      }

      setIncomingCall(payload)
      setBannerMessage(`${payload.caller.displayName} is calling you`)
    }

    const handleAcceptedCall = (payload: CallEventPayload & { acceptedByUserId: string }) => {
      const currentActiveCall = activeCallRef.current
      if (
        currentActiveCall &&
        currentActiveCall.channelName === payload.channelName
      ) {
        setActiveCall((previousCall) => {
          if (!previousCall || previousCall.channelName !== payload.channelName) {
            return previousCall
          }

          return {
            ...previousCall,
            acceptedAt: payload.acceptedAt,
            expiresAt: payload.expiresAt,
          }
        })

        if (payload.acceptedByUserId !== currentUserIdRef.current) {
          setBannerMessage(`${currentActiveCall.counterpart.displayName} joined the call`)
        }
      }
    }

    const handleEndedCall = (payload: CallEventPayload & { endedByUserId: string | null; reason: string }) => {
      if (incomingCallRef.current?.channelName === payload.channelName) {
        setIncomingCall(null)
      }

      if (activeCallRef.current?.channelName === payload.channelName) {
        setActiveCall(null)

        const counterpartName =
          payload.caller.userId === currentUserIdRef.current
            ? payload.receiver.displayName
            : payload.caller.displayName

        const nextMessage =
          payload.reason === "declined"
            ? `${counterpartName} declined the call`
            : payload.reason === "missed"
              ? "The call was missed"
              : payload.reason === "cancelled"
                ? "The call was cancelled"
                : payload.reason === "disconnected"
                  ? `${counterpartName} disconnected`
                  : "The call ended"

        setBannerMessage(nextMessage)

        if (pathnameRef.current.startsWith("/dashboard/videoCall")) {
          router.replace("/dashboard/chat")
        }
      }
    }

    socket.on("call:incoming", handleIncomingCall)
    socket.on("call:accepted", handleAcceptedCall)
    socket.on("call:ended", handleEndedCall)

    return () => {
      socket.off("call:incoming", handleIncomingCall)
      socket.off("call:accepted", handleAcceptedCall)
      socket.off("call:ended", handleEndedCall)
      closeChatSocket()
    }
  }, [router, token])

  useEffect(() => {
    if (!incomingCall) {
      return
    }

    const expiresAtMs = new Date(incomingCall.expiresAt).getTime()
    const remainingMs = expiresAtMs - Date.now()

    if (remainingMs <= 0) {
      setIncomingCall(null)
      return
    }

    const timeoutId = window.setTimeout(() => {
      if (incomingCallRef.current?.channelName !== incomingCall.channelName) {
        return
      }

      setIncomingCall(null)
      setBannerMessage("The incoming call expired")
    }, remainingMs)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [incomingCall])

  useEffect(() => {
    if (!activeCall || activeCall.acceptedAt || activeCall.role !== "caller") {
      return
    }

    const expiresAtMs = new Date(activeCall.expiresAt).getTime()
    const remainingMs = expiresAtMs - Date.now()

    if (remainingMs <= 0) {
      setActiveCall(null)
      setBannerMessage("The call was missed")

      if (pathnameRef.current.startsWith("/dashboard/videoCall")) {
        router.replace("/dashboard/chat")
      }

      return
    }

    const timeoutId = window.setTimeout(() => {
      if (
        activeCallRef.current?.channelName !== activeCall.channelName ||
        activeCallRef.current?.acceptedAt
      ) {
        return
      }

      void endCallApi(activeCall.channelName, "missed").catch(() => undefined)
      setActiveCall(null)
      setBannerMessage("The call was missed")

      if (pathnameRef.current.startsWith("/dashboard/videoCall")) {
        router.replace("/dashboard/chat")
      }
    }, remainingMs)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [activeCall, router])

  const startCall = useCallback(async (options: StartCallOptions) => {
    if (!currentUserId) {
      throw new Error("You need to sign in to start a call.")
    }

    const response = await initiateCallApi({
      targetUserId: options.targetUserId,
      callType: options.callType || "video",
    })

    const nextActiveCall: ActiveCallSession = {
      callId: response.callId,
      channelName: response.channelName,
      conversationId: response.conversationId,
      callType: response.callType,
      appId: response.appId,
      token: response.caller.token,
      uid: response.caller.uid,
      role: "caller",
      counterpart: response.receiver,
      initiatedAt: response.initiatedAt,
      acceptedAt: response.acceptedAt,
      expiresAt: response.expiresAt,
      tokenExpiresAt: response.caller.expiresAt,
    }

    setIncomingCall(null)
    setActiveCall(nextActiveCall)
    router.push("/dashboard/videoCall")
  }, [currentUserId, router])

  const acceptIncomingCall = useCallback(async () => {
    const pendingCall = incomingCallRef.current
    if (!pendingCall) {
      return
    }

    const response = await acceptCallApi(pendingCall.channelName)

    const nextActiveCall: ActiveCallSession = {
      callId: response.callId,
      channelName: response.channelName,
      conversationId: response.conversationId,
      callType: response.callType,
      appId: response.appId,
      token: response.token,
      uid: response.uid,
      role: "receiver",
      counterpart: response.caller,
      initiatedAt: response.initiatedAt,
      acceptedAt: response.acceptedAt,
      expiresAt: response.expiresAt,
      tokenExpiresAt: response.tokenExpiresAt,
    }

    setIncomingCall(null)
    setActiveCall(nextActiveCall)
    router.push("/dashboard/videoCall")
  }, [router])

  const declineIncomingCall = useCallback(async () => {
    const pendingCall = incomingCallRef.current
    if (!pendingCall) {
      return
    }

    try {
      await endCallApi(pendingCall.channelName, "declined")
    } finally {
      setIncomingCall(null)
    }
  }, [])

  const endActiveCall = useCallback(async (reason = "ended", options: EndCallOptions = {}) => {
    const currentActiveCall = activeCallRef.current
    if (!currentActiveCall) {
      return
    }

    const { navigate = true, keepalive = false } = options

    try {
      await endCallApi(currentActiveCall.channelName, reason, keepalive)
    } catch {
      // If the API fails during unload or disconnect cleanup, we still clear local state.
    } finally {
      setActiveCall(null)

      if (navigate && pathnameRef.current.startsWith("/dashboard/videoCall")) {
        router.replace("/dashboard/chat")
      }
    }
  }, [router])

  const value = useMemo<CallContextValue>(
    () => ({
      incomingCall,
      activeCall,
      startCall,
      acceptIncomingCall,
      declineIncomingCall,
      endActiveCall,
    }),
    [acceptIncomingCall, activeCall, declineIncomingCall, endActiveCall, incomingCall, startCall],
  )

  return (
    <CallContext.Provider value={value}>
      {children}

      <Dialog
        open={Boolean(incomingCall)}
        onClose={() => undefined}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "20px",
            p: 1,
          },
        }}
      >
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Avatar
              src={incomingCall?.caller.profilePhoto || undefined}
              sx={{
                width: 72,
                height: 72,
                bgcolor: "#2A8BF2",
                fontSize: "1.5rem",
                fontWeight: 700,
              }}
            >
              {incomingCall?.caller.displayName?.slice(0, 1) || "C"}
            </Avatar>

            <Stack spacing={1}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#0D1C2E" }}>
                {incomingCall?.caller.displayName || "Incoming call"}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(109, 157, 197, 0.9)" }}>
                Incoming {incomingCall?.callType || "video"} call
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1.5} sx={{ width: "100%" }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => void declineIncomingCall()}
                sx={{
                  borderRadius: "999px",
                  py: 1.2,
                  borderColor: "rgba(109, 157, 197, 0.35)",
                  color: "#6D9DC5",
                }}
              >
                Decline
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => void acceptIncomingCall()}
                sx={{
                  borderRadius: "999px",
                  py: 1.2,
                  background: "linear-gradient(325.78deg, #109da4 14.76%, #7fded8 87.3%)",
                  boxShadow: "none",
                }}
              >
                Join
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={Boolean(bannerMessage)}
        autoHideDuration={3500}
        onClose={() => setBannerMessage(null)}
        message={bannerMessage || ""}
      />
    </CallContext.Provider>
  )
}

export function useCallManager() {
  const context = useContext(CallContext)
  if (!context) {
    throw new Error("useCallManager must be used inside CallProvider")
  }

  return context
}
