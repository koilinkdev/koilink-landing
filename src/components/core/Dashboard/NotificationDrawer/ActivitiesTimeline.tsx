"use client";
import React from "react";
import {
  Avatar,
  Box,
  Typography,
  Button,
  styled,
} from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { common, primary, text } from "@/theme/palette";
import { Stack } from "@mui/system";
import Image from "next/image";
import Link from "next/link";
import { isDirectAssetUrl } from "@/lib/notification-display";

export const ActivitiesTimelineStyled = styled(Box)`
   margin-bottom:16px;
  .activity_cont_first_row {
    padding: 8px 4px;
    border-radius: 8px;
    margin-bottom: 8px;
    .activity_text {
      font-size: 14px;
      font-weight: 600px;
      color: ${primary.main};
    }
  }
  .single_item_cont {
    position: relative;
    padding: 4px;
    border-radius: 8px;
    margin-bottom: 8px;

    &::after {
      content: "";
      position: absolute;
      top: 37px;
      left: 16px;
      width: 1px;
      height: 100%;
      background-color: ${common.color1C1C1C1A};
      z-index: 0;
    }

    &:last-of-type::after {
      display: none;
    }
    .text_content {
      .primary_text {
        font-weight: 400;
        font-size: 14px;
        color: ${text.primary};
      }
      .secondary_text {
        font-weight: 400;
        font-size: 10px;
        color: ${common.color6D9DC5};
      }
    }
  }
`;

export type ActivityTimelineItem = {
  id: string;
  activitytext: string;
  time: string;
  image: string;
};

type ActivitiesTimelineProps = {
  activities?: ActivityTimelineItem[];
};

const ActivityImage = ({ src, alt }: { src: string; alt: string }) => {
  if (isDirectAssetUrl(src) && !src.startsWith("http")) {
    return <Image src={src} alt={alt} width={24} height={24} />;
  }

  return <Avatar src={src} alt={alt} sx={{ width: 24, height: 24 }} />;
};

const TimlienStyled = styled(Timeline)`
  padding: 0;
  margin: 0;
  .MuiTimelineItem-root {
    padding: 0;
    &::before {
      display: none;
    }
    &:last-of-type {
      .MuiTimelineConnector-root {
        display: none;
      }
    }
  }
  .MuiTimelineConnector-root {
    height: 14px;
    width: 1px;
    background: rgba(28, 28, 28, 0.1);
  }
  .activityTitle {
    font-size: 14px;
    font-weight: 400;
    color: ${text.primary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .activityTime {
    color: ${common.color6D9DC5};
    font-size: 10px;
  }
  .MuiTimelineContent-root {
    padding-left: 8px;
    overflow: hidden;
    padding-top: 12px;
  }
  .MuiTimelineDot-root {
    margin: 9px 0;
    background-color: transparent;
    box-shadow: none;
  }
`;
export default function ActivitiesTimeline({
  activities = [],
}: ActivitiesTimelineProps) {
  return (
    <ActivitiesTimelineStyled>
      <Stack
        className="activity_cont_first_row"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6" className="activity_text">
          Activities
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/dashboard/notification"
          className="notification_btn"
        >
          All
        </Button>
      </Stack>
      <TimlienStyled>
        {activities.map((item) => (
          <TimelineItem key={item.id}>
            <TimelineSeparator>
              <TimelineDot>
                <ActivityImage src={item.image} alt={`${item.activitytext} icon`} />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="h3" className="activityTitle">
                {item.activitytext}
              </Typography>
              <Typography variant="body1" className="activityTime">
                {item.time}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </TimlienStyled>
    </ActivitiesTimelineStyled>
  );
}
