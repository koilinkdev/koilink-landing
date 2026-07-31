"use client";
import { useState } from "react";
import { DashboardheaderStyled } from "@/styledComponents/Dashboard/DashboardheaderStyled";
import { Stack, Box, IconButton, Typography, Badge } from "@mui/material";
import Image from "next/image";
import { usePathname } from "next/navigation";
import CustomSearchAutocomplete from "@/components/ui/Dashboard/CustomSearchAutocomplete";
import NotificationDrawer from "@/components/core/Dashboard/NotificationDrawer";
import { useNotificationCenter } from "@/components/core/Dashboard/Notification/NotificationCenterProvider";
import ShortlistDrawer from "@/components/core/Dashboard/Shortlist/ShortlistDrawer";
import { useShortlist } from "@/components/core/Dashboard/Shortlist/ShortlistProvider";
import { StarRounded } from "@mui/icons-material";
import { secondary } from "@/theme/palette";

interface DashboardHeaderProps {
  toggleDrawer: () => void;
}

const DashboardHeader = ({ toggleDrawer }: DashboardHeaderProps) => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [shortlistOpen, setShortlistOpen] = useState(false);
  const notificationCenter = useNotificationCenter();
  const shortlist = useShortlist();
  const unreadCount = notificationCenter?.unreadCount || 0;
  const shortlistCount = shortlist?.capacity.count || 0;
  const toggleNotificationDrawer = () => setNotificationOpen((prev) => !prev);
  const closeNotificationDrawer = () => setNotificationOpen(false);
  const toggleShortlistDrawer = () => setShortlistOpen((prev) => !prev);
  const closeShortlistDrawer = () => setShortlistOpen(false);
  // atocomplete options
  const options = ["Option A", "Option B", "Option C"];
  const pathname = usePathname();

  const navItems = [
    {
      pageName: "Dashboard",
      pageLink: "/dashboard",
    },
    {
      pageName: "Profile",
      pageLink: "/dashboard/profile",
    },
     {
      pageName: "Edit Profile",
      pageLink: "/dashboard/profile/edit",
    },
    {
      pageName: "Chat",
      pageLink: "/dashboard/chat",
    },
    {
      pageName: "Notification",
      pageLink: "/dashboard/notification",   
    },
     {
      pageName: "Policy",
      pageLink: "/dashboard/policy",    
    },
    {
      pageName: "Terms",
      pageLink: "/dashboard/terms",   
    },
     {
      pageName: "Contact Us",
      pageLink: "/dashboard/contactus",   
    },
  ];
  const currentPage =navItems.find((item) => item.pageLink === pathname)?.pageName || "";

  return (
    <DashboardheaderStyled>
      <Box className="dashboardHeader_inner">
        <Stack
          className="header_left_sec"
          direction="row"
          spacing={1}
          alignItems="center"
        >
          <IconButton className=" icon_btn toggle_btn" color="primary"
           
            onClick={toggleDrawer}
          >
            <Image
              src="/assets/icons/toggle-icon.svg"
              width={20}
              height={20}
              alt="toggle button"

            />
          </IconButton>

          {/* <IconButton className="icon_btn" color="primary" >
            <Image
              src="/assets/icons/star-icon.svg"
              width={20}
              height={20}
              alt="star icon"
            />
          </IconButton> */}

          {/* <Link href={pathname} className="header_pagename">
            {currentPage}
          </Link> */}
          <Typography variant="body1" className="header_pagename">
            {currentPage}
          </Typography>
        </Stack>

        <Stack
          className="header_right_sec"
          direction="row"
          alignItems="center"
          spacing={2.5}
        >
          <Box className="searchbar_wrapper">
            {/* <TextField
              id="outlined-basic"
              placeholder="Search"
              variant="filled"
              className="headerSearchInput"
              
              sx={{color: common.color6D9DC5}}
              slotProps={{
                input: {
                  startAdornment: (
                    <Icon sx={{ width: "auto", height: "auto", display: "flex" }}>
                      <Image
                        src="/assets/icons/search-icon.svg"
                        width={16}
                        height={16}
                        alt="search icon"
                      />
                    </Icon>
                  ),
                  disableUnderline: true,
                }
              }}
            /> */}
            {/* <Autocomplete
            fullWidth
              disablePortal
              options={options}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Movie" />}
            /> */}
            <CustomSearchAutocomplete
              options={options}
            />
          </Box>

          <Box>
            <Stack className="rightbox_icon_wrapper">
              <IconButton className="icon_btn" color="primary">
                <Image
                  src="/assets/icons/stopwatch-icon.svg"
                  width={20}
                  height={20}
                  alt="timestamp icon"
                />
              </IconButton>
              {/* Sits immediately left of the bell. Uses the same StarRounded
                  icon and secondary colour as the deck's Shortlist action, so
                  the two read as the same feature. */}
              <IconButton
                className="icon_btn"
                aria-label={
                  shortlistCount > 0
                    ? `Shortlist, ${shortlistCount} saved`
                    : "Shortlist"
                }
                onClick={toggleShortlistDrawer}
              >
                <Badge
                  badgeContent={shortlistCount}
                  max={99}
                  overlap="circular"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: 9,
                      height: 15,
                      minWidth: 15,
                      padding: "0 4px",
                      backgroundColor: secondary.main,
                      color: "#fff",
                    },
                  }}
                >
                  <StarRounded sx={{ fontSize: 20, color: secondary.main }} />
                </Badge>
              </IconButton>

              <IconButton className="icon_btn" color="primary"
                aria-label={
                  unreadCount > 0
                    ? `Notifications, ${unreadCount} unread`
                    : "Notifications"
                }
                onClick={toggleNotificationDrawer}>
                <Badge
                  badgeContent={unreadCount}
                  max={99}
                  color="error"
                  overlap="circular"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: 9,
                      height: 15,
                      minWidth: 15,
                      padding: "0 4px",
                    },
                  }}
                >
                  <Image
                    src="/assets/icons/notification-icon.svg"
                    width={20}
                    height={20}
                    alt="notification icon"
                  />
                </Badge>
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </Box>
      <NotificationDrawer open={notificationOpen} onClose={closeNotificationDrawer} />
      <ShortlistDrawer open={shortlistOpen} onClose={closeShortlistDrawer} />
    </DashboardheaderStyled>
  );
};

export default DashboardHeader;
