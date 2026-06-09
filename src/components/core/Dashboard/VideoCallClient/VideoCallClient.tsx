"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Typography,
} from "@mui/material"
import Link from "next/link"
import { useRouter } from "next/navigation"
import AgoraRTC, {
  type IAgoraRTCClient,
  type IAgoraRTCRemoteUser,
  type ICameraVideoTrack,
  type IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng"
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded"
import MicRoundedIcon from "@mui/icons-material/MicRounded"
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded"
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded"
import VideocamOffRoundedIcon from "@mui/icons-material/VideocamOffRounded"
import CallEndRoundedIcon from "@mui/icons-material/CallEndRounded"
import { VideoCallClientStyled } from "@/styledComponents/VideoCallClient/VideoCallClientStyled"
import { useCallManager } from "@/components/core/Dashboard/Call/CallProvider"

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`
}

const VideoCallClient: React.FC = () => {
  const router = useRouter()
  const { activeCall, endActiveCall } = useCallManager()

  const activeCallRef = useRef(activeCall)
  activeCallRef.current = activeCall

  const clientRef = useRef<IAgoraRTCClient | null>(null)
  const localAudioTrackRef = useRef<IMicrophoneAudioTrack | null>(null)
  const localVideoTrackRef = useRef<ICameraVideoTrack | null>(null)
  const localVideoContainerRef = useRef<HTMLDivElement | null>(null)
  const remoteVideoContainerRef = useRef<HTMLDivElement | null>(null)
  const endRequestedRef = useRef(false)

  const [statusText, setStatusText] = useState("Connecting…")
  const [mediaMessage, setMediaMessage] = useState<string | null>(null)
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([])
  const [isMicEnabled, setIsMicEnabled] = useState(true)
  const [isCameraEnabled, setIsCameraEnabled] = useState(activeCall?.callType === "video")
  const [connectedAt, setConnectedAt] = useState<number | null>(null)
  const [durationSeconds, setDurationSeconds] = useState(0)

  useEffect(() => {
    if (!connectedAt) {
      setDurationSeconds(0)
      return
    }

    const intervalId = window.setInterval(() => {
      setDurationSeconds(Math.max(0, Math.floor((Date.now() - connectedAt) / 1000)))
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [connectedAt])

  useEffect(() => {
    if (!activeCall) {
      return
    }

    endRequestedRef.current = false
    setMediaMessage(null)
    setStatusText("Connecting…")
    setRemoteUsers([])
    setConnectedAt(null)
    setDurationSeconds(0)
    setIsMicEnabled(true)
    setIsCameraEnabled(activeCall.callType === "video")

    const client = AgoraRTC.createClient({
      mode: "rtc",
      codec: "vp8",
    })
    clientRef.current = client

    const syncRemoteUsers = () => {
      setRemoteUsers([...client.remoteUsers])
    }

    const handleUserPublished = async (
      user: IAgoraRTCRemoteUser,
      mediaType: "audio" | "video",
    ) => {
      try {
        await client.subscribe(user, mediaType)
        if (mediaType === "audio") {
          user.audioTrack?.play()
        }

        syncRemoteUsers()
      } catch {
        setMediaMessage("Could not connect to the other participant's media stream.")
      }
    }

    const handleUserUnpublished = () => {
      syncRemoteUsers()
    }

    const handleUserLeft = () => {
      syncRemoteUsers()
      setStatusText("Waiting for the other participant…")
      setConnectedAt(null)
    }

    const handleConnectionStateChange = (currentState: string) => {
      if (currentState === "CONNECTED") {
        setStatusText("Waiting for the other participant…")
        return
      }

      if (currentState === "DISCONNECTED") {
        setStatusText("Reconnecting…")
      }
    }

    client.on("user-published", handleUserPublished)
    client.on("user-unpublished", handleUserUnpublished)
    client.on("user-left", handleUserLeft)
    client.on("connection-state-change", handleConnectionStateChange)

    let cancelled = false

    const joinCall = async () => {
      try {
        await client.join(
          activeCall.appId,
          activeCall.channelName,
          activeCall.token,
          activeCall.uid,
        )

        if (cancelled) {
          return
        }

        const tracksToPublish: Array<IMicrophoneAudioTrack | ICameraVideoTrack> = []

        try {
          const audioTrack = await AgoraRTC.createMicrophoneAudioTrack()
          localAudioTrackRef.current = audioTrack
          tracksToPublish.push(audioTrack)
        } catch {
          setIsMicEnabled(false)
          setMediaMessage("Microphone access is unavailable. You can still receive the call.")
        }

        if (activeCall.callType === "video") {
          try {
            const videoTrack = await AgoraRTC.createCameraVideoTrack()
            localVideoTrackRef.current = videoTrack
            tracksToPublish.push(videoTrack)
          } catch {
            setIsCameraEnabled(false)
            setMediaMessage((previousMessage) =>
              previousMessage
                ? `${previousMessage} Camera access is unavailable.`
                : "Camera access is unavailable. Joined without video.",
            )
          }
        }

        if (cancelled) {
          return
        }

        if (tracksToPublish.length > 0) {
          await client.publish(tracksToPublish)
        }

        syncRemoteUsers()
        setStatusText("Waiting for the other participant…")
      } catch {
        setMediaMessage("Could not join the call. Please try again.")
      }
    }

    void joinCall()

    return () => {
      cancelled = true

      client.off("user-published", handleUserPublished)
      client.off("user-unpublished", handleUserUnpublished)
      client.off("user-left", handleUserLeft)
      client.off("connection-state-change", handleConnectionStateChange)

      const cleanup = async () => {
        try {
          localAudioTrackRef.current?.stop()
          localAudioTrackRef.current?.close()
          localAudioTrackRef.current = null

          localVideoTrackRef.current?.stop()
          localVideoTrackRef.current?.close()
          localVideoTrackRef.current = null

          await client.leave()
        } catch {
          // Best-effort cleanup; the call session is already ending.
        }
      }

      void cleanup()

      if (!endRequestedRef.current && activeCallRef.current?.channelName === activeCall.channelName) {
        endRequestedRef.current = true
        void endActiveCall("ended", {
          navigate: false,
          keepalive: true,
        })
      }
    }
  }, [activeCall, endActiveCall])

  useEffect(() => {
    if (!activeCall) {
      return
    }

    if (remoteUsers.length > 0) {
      setStatusText("Connected")
      setConnectedAt((currentValue) => currentValue || Date.now())
      return
    }

    setConnectedAt(null)
    setStatusText("Waiting for the other participant…")
  }, [activeCall, remoteUsers])

  useEffect(() => {
    const localTrack = localVideoTrackRef.current
    const container = localVideoContainerRef.current

    if (!localTrack || !container || !isCameraEnabled) {
      if (container) {
        container.innerHTML = ""
      }
      return
    }

    localTrack.play(container)

    return () => {
      localTrack.stop()
      container.innerHTML = ""
    }
  }, [activeCall, isCameraEnabled])

  useEffect(() => {
    const container = remoteVideoContainerRef.current
    const remoteVideoTrack = remoteUsers.find((user) => user.videoTrack)?.videoTrack || null

    if (!container) {
      return
    }

    if (!remoteVideoTrack) {
      container.innerHTML = ""
      return
    }

    remoteVideoTrack.play(container)

    return () => {
      remoteVideoTrack.stop()
      container.innerHTML = ""
    }
  }, [remoteUsers])

  const handleToggleMicrophone = async () => {
    const audioTrack = localAudioTrackRef.current
    if (!audioTrack) {
      setMediaMessage("Microphone access is not available on this device.")
      return
    }

    const nextValue = !isMicEnabled
    await audioTrack.setEnabled(nextValue)
    setIsMicEnabled(nextValue)
  }

  const handleToggleCamera = async () => {
    const videoTrack = localVideoTrackRef.current
    if (!videoTrack) {
      setMediaMessage("Camera access is not available on this device.")
      return
    }

    const nextValue = !isCameraEnabled
    await videoTrack.setEnabled(nextValue)
    setIsCameraEnabled(nextValue)
  }

  const handleLeaveCall = async () => {
    endRequestedRef.current = true
    await endActiveCall("ended")
  }

  if (!activeCall) {
    return (
      <VideoCallClientStyled>
        <Box className="empty_state">
          <Typography variant="h5" className="empty_title">
            No active call
          </Typography>
          <Typography variant="body1" className="empty_text">
            Start a video call from chat to join a room.
          </Typography>
          <Box className="empty_actions">
            <IconButton
              className="back_btn"
              component={Link}
              href="/dashboard/chat"
            >
              <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>
      </VideoCallClientStyled>
    )
  }

  return (
    <VideoCallClientStyled>
      <Box className="call_shell">
        <Box className="call_header">
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton
              color="primary"
              onClick={() => {
                router.push("/dashboard/chat")
              }}
              className="back_btn"
            >
              <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>

            <Avatar
              src={activeCall.counterpart.profilePhoto || undefined}
              sx={{
                width: 52,
                height: 52,
                bgcolor: "#2A8BF2",
                fontWeight: 700,
              }}
            >
              {activeCall.counterpart.displayName.slice(0, 1)}
            </Avatar>

            <Box>
              <Typography variant="h5" className="call_title">
                {activeCall.counterpart.displayName}
              </Typography>
              <Typography variant="body2" className="call_status">
                {statusText}
              </Typography>
            </Box>
          </Stack>

          <Box className="duration_chip">
            {connectedAt ? formatDuration(durationSeconds) : "Ringing"}
          </Box>
        </Box>

        {mediaMessage && (
          <Box className="call_notice">
            <Typography variant="body2">{mediaMessage}</Typography>
          </Box>
        )}

        <Box className="call_stage">
          <Box className="remote_stage">
            <Box ref={remoteVideoContainerRef} className="video_surface remote_video_surface" />

            {remoteUsers.length === 0 && (
              <Stack className="remote_placeholder" spacing={2} alignItems="center">
                <Avatar
                  src={activeCall.counterpart.profilePhoto || undefined}
                  sx={{
                    width: 92,
                    height: 92,
                    bgcolor: "rgba(255,255,255,0.16)",
                    fontSize: "2rem",
                    fontWeight: 700,
                  }}
                >
                  {activeCall.counterpart.displayName.slice(0, 1)}
                </Avatar>
                <Typography variant="h6">{activeCall.counterpart.displayName}</Typography>
                <Typography variant="body2">{statusText}</Typography>
              </Stack>
            )}
          </Box>

          <Box className="local_stage">
            {activeCall.callType === "video" && isCameraEnabled ? (
              <Box ref={localVideoContainerRef} className="video_surface local_video_surface" />
            ) : (
              <Stack className="local_placeholder" spacing={1} alignItems="center">
                <VideocamOffRoundedIcon sx={{ fontSize: 26 }} />
                <Typography variant="caption">Camera off</Typography>
              </Stack>
            )}
          </Box>
        </Box>

        <Box className="call_controls">
          <IconButton
            className={`control_btn ${isMicEnabled ? "" : "muted"}`}
            onClick={() => void handleToggleMicrophone()}
          >
            {isMicEnabled ? <MicRoundedIcon /> : <MicOffRoundedIcon />}
          </IconButton>

          {activeCall.callType === "video" && (
            <IconButton
              className={`control_btn ${isCameraEnabled ? "" : "muted"}`}
              onClick={() => void handleToggleCamera()}
            >
              {isCameraEnabled ? <VideocamRoundedIcon /> : <VideocamOffRoundedIcon />}
            </IconButton>
          )}

          <IconButton className="control_btn end_btn" onClick={() => void handleLeaveCall()}>
            <CallEndRoundedIcon />
          </IconButton>
        </Box>
      </Box>
    </VideoCallClientStyled>
  )
}

export default VideoCallClient
