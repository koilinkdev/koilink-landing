"use client";
import React from "react";
import {Drawer,styled,} from "@mui/material";
import NotificationTimeline from "@/components/core/Dashboard/NotificationDrawer/NotificationTimeline";
import ActivitiesTimeline, { type ActivityTimelineItem } from "@/components/core/Dashboard/NotificationDrawer/ActivitiesTimeline";
import MatchesTimeline, { type DrawerMatchItem } from "@/components/core/Dashboard/NotificationDrawer/MatchesTimeline";
import { common} from "@/theme/palette";
import { getAuthSession } from "@/lib/auth-session";
import { closeChatSocket, getChatSocket } from "@/lib/chat-socket";
import { getSignedReadableImageUrl } from "@/lib/chat-api";
import {
  listMatchesApi,
  type MatchRealtimeEvent,
  type MatchSummary,
} from "@/lib/matchmaking-api";
import {
  listNotificationActivitiesApi,
  listNotificationsApi,
  normalizeNotificationEvent,
  notificationToActivity,
  type NotificationActivity,
  type NotificationRecord,
} from "@/lib/notifications-api";
import {
  formatNotificationTime,
  getActivityFallbackImage,
  isDirectAssetUrl,
} from "@/lib/notification-display";

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
}

const NotificationDrawerStyled = styled(Drawer)`
.MuiDrawer-paper{
    width: 280px;
    padding: 20px;
    border-left: 1px solid ${common.color6D9DC5};
}
  .notification_btn {
    font-size: 14px;
    font-weight: 600;
    padding: 3px 10px 2px;
    border-radius: 4px;
    text-decoration: none;
    color: ${common.white};
    min-width: 38px;
    box-shadow: none;
    line-height: 1.1;
  }
`;

const NOTIFICATION_LIMIT = 4;
const ACTIVITY_LIMIT = 5;
const MATCH_LIMIT = 6;

const addUniqueById = <T extends { id: string }>(items: T[], nextItem: T) => {
  return [nextItem, ...items.filter((item) => item.id !== nextItem.id)];
};

const addUniqueMatch = (items: MatchSummary[], nextMatch: MatchSummary) => {
  return [
    nextMatch,
    ...items.filter((match) => match.matchId !== nextMatch.matchId),
  ];
};

const NotificationDrawer = ({ open, onClose }: NotificationDrawerProps) => {
  const session = getAuthSession();
  const token = session?.tokens.access || null;

  const [notifications, setNotifications] = React.useState<NotificationRecord[]>([]);
  const [activities, setActivities] = React.useState<NotificationActivity[]>([]);
  const [matches, setMatches] = React.useState<MatchSummary[]>([]);
  const [signedImages, setSignedImages] = React.useState<Record<string, string>>({});

  const loadDrawerData = React.useCallback(async () => {
    if (!token) {
      setNotifications([]);
      setActivities([]);
      setMatches([]);
      return;
    }

    const [notificationsResult, activitiesResult, matchesResult] = await Promise.allSettled([
      listNotificationsApi({ limit: NOTIFICATION_LIMIT }),
      listNotificationActivitiesApi(ACTIVITY_LIMIT),
      listMatchesApi("active", MATCH_LIMIT, 0),
    ]);

    if (notificationsResult.status === "fulfilled") {
      setNotifications(notificationsResult.value.notifications);
    }

    if (activitiesResult.status === "fulfilled") {
      setActivities(activitiesResult.value.activities);
    }

    if (matchesResult.status === "fulfilled") {
      setMatches(matchesResult.value.matches);
    }
  }, [token]);

  React.useEffect(() => {
    void loadDrawerData();
  }, [loadDrawerData]);

  React.useEffect(() => {
    if (!token) {
      return;
    }

    const socket = getChatSocket(token);

    const handleNotification = (payload: unknown) => {
      const notification = normalizeNotificationEvent(payload);
      if (!notification) {
        void loadDrawerData();
        return;
      }

      setNotifications((previous) =>
        addUniqueById(previous, notification).slice(0, NOTIFICATION_LIMIT),
      );
      setActivities((previous) =>
        addUniqueById(previous, notificationToActivity(notification)).slice(0, ACTIVITY_LIMIT),
      );
    };

    const handleMatchEvent = (payload: MatchRealtimeEvent) => {
      if (!payload.match) {
        void loadDrawerData();
        return;
      }

      setMatches((previous) =>
        addUniqueMatch(previous, payload.match).slice(0, MATCH_LIMIT),
      );
    };

    socket.on("notification", handleNotification);
    socket.on("match:new", handleMatchEvent);

    return () => {
      socket.off("notification", handleNotification);
      socket.off("match:new", handleMatchEvent);
      closeChatSocket();
    };
  }, [loadDrawerData, token]);

  React.useEffect(() => {
    const imageSources = [
      ...activities.map((activity) => activity.actorPhoto),
      ...matches.map((match) => match.user?.profilePhoto),
    ].filter((value): value is string => Boolean(value));

    const unresolvedSources = Array.from(new Set(imageSources)).filter(
      (source) =>
        !isDirectAssetUrl(source) &&
        !Object.prototype.hasOwnProperty.call(signedImages, source),
    );

    if (unresolvedSources.length === 0) {
      return;
    }

    let cancelled = false;

    const resolveImages = async () => {
      const resolvedEntries = await Promise.all(
        unresolvedSources.map(async (source) => {
          try {
            const signedUrl = await getSignedReadableImageUrl(source);
            return [source, signedUrl] as const;
          } catch {
            return [source, null] as const;
          }
        }),
      );

      if (cancelled) {
        return;
      }

      setSignedImages((previous) => {
        const next = { ...previous };
        for (const [source, signedUrl] of resolvedEntries) {
          next[source] = signedUrl || "";
        }
        return next;
      });
    };

    void resolveImages();

    return () => {
      cancelled = true;
    };
  }, [activities, matches, signedImages]);

  const getResolvedImage = React.useCallback(
    (source?: string | null) => {
      if (!source) {
        return null;
      }

      return signedImages[source] || (isDirectAssetUrl(source) ? source : null);
    },
    [signedImages],
  );

  const activityItems = React.useMemo<ActivityTimelineItem[]>(
    () =>
      activities.map((activity, index) => ({
        id: activity.id,
        activitytext: activity.text,
        time: formatNotificationTime(activity.createdAt),
        image:
          getResolvedImage(activity.actorPhoto) ||
          getActivityFallbackImage(activity.type, index),
      })),
    [activities, getResolvedImage],
  );

  const matchItems = React.useMemo<DrawerMatchItem[]>(
    () =>
      matches.map((match) => ({
        id: match.matchId,
        name: match.user?.displayName || "Unknown user",
        avatar: getResolvedImage(match.user?.profilePhoto),
      })),
    [getResolvedImage, matches],
  );

  return (
    <NotificationDrawerStyled anchor="right" open={open} onClose={onClose}>
      <NotificationTimeline notifications={notifications} />
      <ActivitiesTimeline activities={activityItems} />
      <MatchesTimeline matches={matchItems}/>
    </NotificationDrawerStyled>
  );
};

export default NotificationDrawer;
