"use client"
import React from 'react'

import {
    Box,
    Typography,
    Button,
    List,
    ListItem,
    Avatar,
    styled,
    Stack
} from "@mui/material";

import { common, primary, text } from "@/theme/palette";
import Image from "next/image";
import Link from "next/link";
import { isDirectAssetUrl } from "@/lib/notification-display";

export const NotificationTimelineStyled = styled(Box)`
  margin-bottom: 24px;

  .notificationDrawer_matches_cont_first_row {
    padding: 8px 4px;
    border-radius: 8px;
    margin-bottom: 8px;
    .notificationDrawer_matches_text {
      font-size: 14px;
      font-weight: 600px;
      color: ${primary.main};
    }

  }

  .main_panel {
    li {
      margin-bottom: 8px;
      &:last-of-type{
        margin-bottom: 0;
      }
    }
    .single_item_cont {
      padding: 4px;
      border-radius: 8px;
      overflow: hidden;

      .notificationDrawer_matches_cont_textContent {
        overflow: hidden;
        .avatar_name {
          font-weight: 400;
          font-size: 14px;
          color: ${text.primary};
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
`;

export type DrawerMatchItem = {
    id: string;
    name: string;
    avatar?: string | null;
};

type MatchesTimelineProps = {
    matches?: DrawerMatchItem[];
};

const getNameInitials = (name: string) => {
    return name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

const MatchAvatar = ({ match }: { match: DrawerMatchItem }) => {
    if (!match.avatar) {
        return (
            <Avatar
                sx={{
                    width: 24,
                    height: 24,
                    fontSize: '10px',
                    fontWeight: 600,
                    backgroundColor: `${primary.main}`,
                    color: `${common.white}`,
                }}
            >
                {getNameInitials(match.name)}
            </Avatar>
        );
    }

    if (isDirectAssetUrl(match.avatar) && !match.avatar.startsWith("http")) {
        return (
            <Avatar sx={{ width: 24, height: 24 }}>
                <Image
                    src={match.avatar}
                    alt={`${match.name} avatar`}
                    width={24}
                    height={24}
                />
            </Avatar>
        );
    }

    return (
        <Avatar
            src={match.avatar}
            alt={`${match.name} avatar`}
            sx={{ width: 24, height: 24 }}
        />
    );
};

const MatchesTimeline = ({ matches = [] }: MatchesTimelineProps) => {
    return (
        <NotificationTimelineStyled>
            <Stack
                className="notificationDrawer_matches_cont_first_row"
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography variant="h6" className="notificationDrawer_matches_text">
                    Matches
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    href="/dashboard"
                    className="notification_btn"
                >
                    All
                </Button>
            </Stack>

            <List disablePadding className="main_panel">
                {matches.map((userInfo) => (
                    <ListItem key={userInfo.id} disablePadding>
                        <Stack
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            spacing={1}
                            className="single_item_cont"
                        >
                            <MatchAvatar match={userInfo} />
                            <Box className="notificationDrawer_matches_cont_textContent">
                                <Typography
                                    className="avatar_name"
                                    variant="body2"
                                >
                                    {userInfo.name}
                                </Typography>
                            </Box>
                        </Stack>
                    </ListItem>
                ))}
            </List>
        </NotificationTimelineStyled>
    );
}


export default MatchesTimeline
