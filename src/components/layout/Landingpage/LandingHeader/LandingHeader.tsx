"use client";
import * as React from "react";
import AppBar, { AppBarProps } from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { Box, Container, Link, Slide, styled } from "@mui/material";
import Image from "next/image";
import ButtonWithBackground from "@/components/ui/LandingPage/ButtonWithBackground/ButtonWithBackground";
import LoginFlowModal from "@/components/core/Auth/RegistrationLoginFlow/LoginFlowModal";
interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children?: React.ReactElement<unknown>;
}

function HideOnScroll(props: Props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children ?? <div />}
    </Slide>
  );
}

const HeaderStyled = styled(AppBar) <AppBarProps>`
  background: #ffffff;
  box-shadow: 0px 0px 10px rgba(109, 157, 197, 0.5);
  padding: 20px 0;
  @media (max-width: 899px) {
    padding: 15px 0;
  }
  .headerLogo{
     @media (max-width: 899px) {
    width: 150px;
    height: auto;
  }
  }
`;

export default function LandingHeader(props: Props) {
  const [loginOpen, setLoginOpen] = React.useState(false);

  // Named function instead of arrow function
  function openLoginModal() {
    setLoginOpen(true);
  }

  function closeLoginModal() {
    setLoginOpen(false);
  }
  return (
    <>
      <CssBaseline />
      <HideOnScroll {...props}>
        <HeaderStyled component="nav">
          <Toolbar disableGutters sx={{ minHeight: "initial !important" }}>
            <Container fixed maxWidth="xl">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  component={Link}
                  sx={{
                    flexGrow: 1,
                    textDecoration: "none",
                    display: "inline-flex",
                  }}
                  href="/"
                >
                  <Image
                    width={199}
                    height={48}
                    src="/assets/images/landing-logo.png"
                    alt="Logo"
                    className="headerLogo"
                  />
                </Typography>
                {/* <Button sx={{ marginLeft: 2 }} color="inherit">
                  Login
                </Button> */}
                <ButtonWithBackground buttonText="Login"
                  onClick={openLoginModal} />
              </Box>
            </Container>
          </Toolbar>
        </HeaderStyled>
      </HideOnScroll>

      <LoginFlowModal open={loginOpen} handleClose={closeLoginModal} />
    </>
  );
}
