"use client";
import React from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  Avatar,
  styled,
} from "@mui/material";
import { common, primary, text } from "@/theme/palette";
import { Stack } from "@mui/system";
import Image from "next/image";
import Link from "next/link";
import type { NotificationRecord } from "@/lib/notifications-api";
import {
  formatNotificationTime,
  getDrawerNotificationIcon,
} from "@/lib/notification-display";

const getIcon = (type: string) => {
  const iconSrc = getDrawerNotificationIcon(type);
  return (
    <Box
      sx={{
        width: 16,
        height: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        src={iconSrc}
        alt={type}
        width={16}
        height={16}
      />
    </Box>
  );
};

export const NotificationTimelineStyled = styled(Box)`
  margin-bottom: 24px;

  .notification_cont_first_row {
    padding: 8px 4px;
    border-radius: 8px;
    margin-bottom: 8px;
    .notification_text {
      font-size: 14px;
      font-weight: 600px;
      color: ${primary.main};
    }

  }

  .main_panel {
    li {
      margin-bottom: 7px;
      &:last-of-type{
        margin-bottom: 0;
      }
    }
    .single_item_cont {
      padding: 4px;
      border-radius: 8px;

      overflow: hidden;

      .notificationContent {
        overflow: hidden;

        .notificationContent_title {
          font-weight: 400;
          font-size: 14px;
          color: ${text.primary};
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .notificationContent_time {
          font-weight: 400;
          font-size: 10px;
          color: ${common.color6D9DC5};
        }
      }
    }
  }
`;

type NotificationTimelineProps = {
  notifications?: NotificationRecord[];
};

export default function NotificationTimeline({
  notifications = [],
}: NotificationTimelineProps) {
  return (
    <NotificationTimelineStyled>
      <Stack
        className="notification_cont_first_row"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6" className="notification_text">
          Notifications
        </Typography>
        <Button variant="contained"
          color="primary"
          component={Link}
          href="/dashboard/notification"
          className="notification_btn">
          All
        </Button>
      </Stack>

      <List sx={{ p: 0 }} className="main_panel">
        {notifications.map((notification, index) => (
          <ListItem key={notification.id} sx={{ p: 0 }}>
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
              spacing={1}
              className="single_item_cont"
            >
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: index % 2 === 0 ? common.colorE5ECF6 : common.colorE3F5FF,
                  borderRadius: "8px",
                }}
              >
                {getIcon(notification.type)}
              </Avatar>
              <Box className="notificationContent">
                <Typography
                  className="notificationContent_title"
                  variant="body2"
                >
                  {notification.title || notification.message}
                </Typography>
                <Typography
                  className="notificationContent_time"
                  variant="body1"
                >
                  {formatNotificationTime(notification.createdAt)}
                </Typography>
              </Box>
            </Stack>
          </ListItem>
        ))}
      </List>
    </NotificationTimelineStyled>
  );
}
