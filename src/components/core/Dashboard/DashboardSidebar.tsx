"use client";

import React from "react";
// import ChatLinkIcon from "@/components/ui/icons/ChatLinkIcon";
import DashboardLinkIcon from "@/components/ui/icons/DashboardLinkIcon";
import PolicyLinkIcon from "@/components/ui/icons/PolicyLinkIcon";
import TermsLinkIcon from "@/components/ui/icons/TermsLinkIcon";
import ContactUsLinkIcon from "@/components/ui/icons/ContactUsLinkIcon";
import ProfileLinkIcon from "@/components/ui/icons/ProfileLinkIcon"
import AllMatchLinkIcon from "@/components/ui/icons/AllMatchLinkIcon";
import { common, error as errorPalette, primary } from "@/theme/palette";
import {
  Box,
  Icon,
  List,
  ListItem,
  styled,
  Typography,
} from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ChatLinkIcon from "@/components/ui/icons/ChatLinkIcon";
import { logoutApi } from "@/lib/auth-api";
import { clearAuthSession, getRefreshToken } from "@/lib/auth-session";


interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
}
const SidebarWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ open }) => ({
  width: 212,
  height: "100vh",
  backgroundColor: common.white,
  borderRight: "1px solid rgba(109, 157, 197, 0.56)",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 3,
  transition: "transform 0.3s ease",
  transform: "translateX(0)",
  padding: "92px 0 30px",

  "@media (max-width: 1199px)": {
    transform: open ? "translateX(0)" : "translateX(-100%)",
  },

  ".dashboardLogo": {
    position: "absolute", // or "relative", "fixed", etc.
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 1,
    display: "inline-flex",
  },
  ".dashboardMenu": {
    padding: "0 16px",
    height: "calc(100vh - 122px)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    ".dashboardMenuList": {
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
    },
    ".dashboardNavListItem": {
        marginBottom: "12px",
        "&:last-of-type": {
          marginBottom: "0",
        },
    },
    ".dashboardNavItem": {
      padding: "4px 28px",
      width: "100%",
      borderRadius: "8px",
      fontWeight: "400",
      fontSize: "14px",
      color: `${common.color6D9DC5}`,
      textDecoration: "none",
      position: "relative",
      display: "flex",
      alignItems: "center",
      lineHeight: "1.2",
      border: "none",
      backgroundColor: "transparent",
      cursor: "pointer",
      textAlign: "left",
      fontFamily: "inherit",
      transition: "background-color 0.2s ease, color 0.2s ease, opacity 0.2s ease",
      ".dashboardLinkText": {
        fontWeight: "inherit",
        fontSize: "inherit",
        color: "inherit",
        padding: "2px 0 0 4px",
        lineHeight: "1.2",
      },
      ".dashboardLinkIcon": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "20px",
        height: "20px",
        padding: 0,
      },
      "&:before": {
        content: '" "',
        position: "absolute",
        left: "0px",
        top: "50%",
        transform: "translateY(-50%)",
        width: "4px",
        height: "16px",
        borderRadius: "4px",
        backgroundColor: "transparent",
      },
      "&.activeLink": {
        backgroundColor: `${common.colorAFECEF66}`,
        color: `${primary.main}`,
        fontWeight: "500",
        "&:before": {
          backgroundColor: `${primary.main}`,
        },
      },
      "&:hover": {
        backgroundColor: `${common.colorAFECEF66}`,
      },
      "&:disabled": {
        cursor: "default",
      },
    },
    ".dashboardMenuFooter": {
      flexShrink: 0,
    },
    ".dashboardLogoutButton": {
      color: errorPalette.main,
      "&:hover": {
        backgroundColor: "rgba(217, 45, 32, 0.08)",
        color: errorPalette.main,
        "&:before": {
          backgroundColor: errorPalette.main,
        },
      },
      "&:focus-visible": {
        outline: `2px solid rgba(217, 45, 32, 0.18)`,
        outlineOffset: "2px",
      },
      "&.isLoading": {
        opacity: 0.72,
      },
    },

  },
}));

export const Overlay = styled(Box, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ open }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  opacity: open ? 1 : 0,
  pointerEvents: open ? "auto" : "none",
  transition: "opacity 0.3s ease",
  zIndex: 3,
  display: "none",
  "@media (max-width: 1199px)": {
    display: "block",
  },
}));





const DashboardSidebar = ({ open, onClose }: DashboardSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const navItems = [
    {
      pageName: "Dashboard",
      pageLink: "/dashboard",
      icon: <DashboardLinkIcon currentColor={pathname === "/dashboard" ? primary.main : common.color6D9DC5} />,
    },
    {
      pageName: "Match Profile",
      pageLink: "/dashboard/match-profile",
      icon: <AllMatchLinkIcon currentColor={pathname === "/dashboard/match-profile" ? primary.main : common.color6D9DC5} />,
    },
     {
      pageName: "Profile",
      pageLink: "/dashboard/profile",
      icon: <ProfileLinkIcon currentColor={pathname === "/dashboard/profile" ? primary.main : common.color6D9DC5} />,
    },
    {
      pageName: "Chat",
      pageLink: "/dashboard/chat",
      icon: <ChatLinkIcon currentColor={pathname === "/dashboard/chat" ? primary.main : common.color6D9DC5} />,
    },
    {
      pageName: "Policy",
      pageLink: "/dashboard/policy",
      icon: <PolicyLinkIcon currentColor={pathname === "/dashboard/policy" ? primary.main : common.color6D9DC5} />,
    },
    {
      pageName: "Terms",
      pageLink: "/dashboard/terms",
      icon: <TermsLinkIcon currentColor={pathname === "/dashboard/terms" ? primary.main : common.color6D9DC5} />,
    },
     {
      pageName: "Contact Us",
      pageLink: "/dashboard/contactus",
      icon: <ContactUsLinkIcon currentColor={pathname === "/dashboard/contactus" ? primary.main : common.color6D9DC5} />,
    },
  ];

  const handleLogout = React.useCallback(async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
    } catch {
      // Clear client session even if server-side revocation fails.
    } finally {
      clearAuthSession();
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("koilink.onboarding.preferences");
        window.sessionStorage.removeItem("koilink.active.call");
      }
      onClose();
      router.replace("/");
      router.refresh();
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, onClose, router]);

  return (
    <>
      <Overlay open={open} onClick={onClose} />
      <SidebarWrapper open={open}>
        <Link href="/dashboard" className="dashboardLogo">
          <Image
            src="/assets/images/dashboard-logo.png"
            width={159}
            height={40}
            alt="Dashboard Logo"
          />
        </Link>
        <Box className="dashboardMenu">
          <List disablePadding className="dashboardMenuList">
            {navItems.map((item) => (
              <ListItem key={item.pageName} disablePadding className="dashboardNavListItem">
                <Link
                  href={item.pageLink}
                  className={`dashboardNavItem ${pathname === item.pageLink ? "activeLink" : ""
                    }`}
                >
                  <Icon className="dashboardLinkIcon">{item.icon}</Icon>
                  <Typography variant="caption" className="dashboardLinkText">{item.pageName}</Typography>

                </Link>
              </ListItem>
            ))}
          </List>
          <Box className="dashboardMenuFooter">
            <Box
              component="button"
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`dashboardNavItem dashboardLogoutButton${isLoggingOut ? " isLoading" : ""}`}
            >
              <Icon className="dashboardLinkIcon">
                <LogoutOutlinedIcon sx={{ color: "inherit", fontSize: 20 }} />
              </Icon>
              <Typography variant="caption" className="dashboardLinkText">
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </SidebarWrapper>
    </>
  );
};

export default DashboardSidebar;
