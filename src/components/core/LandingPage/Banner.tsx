"use client";
import ButtonWithBackground from "@/components/ui/LandingPage/ButtonWithBackground/ButtonWithBackground";
import { BannerStyled } from "@/styledComponents/LandingPage/BannerStyled";
import {
  Box,
  Button,
  Grid,
  Icon,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Banner = () => {
  const [expanded, setExpanded] = useState(false);

  const fullText =
    "Experienced angel investor focused on early-stage tech startups and scalable business models. Actively seeking opportunities in fintech, AI, and other emerging sectors where innovation meets market potential.";

  const previewLimit = 120;
  const isLong = fullText.length > previewLimit;

  const toggleExpanded = () => setExpanded((prev) => !prev);

  const displayText =
    expanded || !isLong
      ? fullText
      : fullText.slice(0, previewLimit).trim() + "...";

  return (
    <BannerStyled className="cmn_gap bannerSec">
      <Container fixed maxWidth="xl">
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ md: 6, xs: 12 }}>
            <Box className="bannerLeft">
              <Typography
                variant="h1"
                color="primary"
                mb={2}
                sx={{
                  fontSize: {
                    xs: "32px",
                    md: "38px",
                    xl: "48px"
                  },
                }}
              >
                Ethan Walker
              </Typography>
              <Typography
                variant="h2"
                display="flex"
                alignItems="center"
                color="primary"
                fontWeight={400}
                textTransform="capitalize"
                mb={2}
                sx={{
                  fontSize: {
                    xs: "25px",
                    md: "30px",
                    xl: "38px"
                  },
                }}
              >
                <Icon sx={{ width: 32, height: 32, marginRight: 0.5 }}>
                  <Image
                    width={32}
                    height={32}
                    src="/assets/icons/map-pin.svg"
                    alt="Location Icon"
                  />
                </Icon>
                los angeles
              </Typography>
              <List disablePadding className="banner_list">
                <ListItem disablePadding>Funding Range</ListItem>
                <ListItem disablePadding>$ 20000</ListItem>
                <ListItem disablePadding>15% ROI</ListItem>
              </List>
              <Typography variant="body1" mb={{xs: 2, md: 4}} maxWidth={550} fontSize={{xs: 18, md: 20, xl: 24}} fontWeight={300}>
                {displayText}{" "}
                {isLong && (
                  <Button
                    disableRipple
                    sx={{
                      padding: 0,
                      backgroundColor: "transparent",
                      minWidth: "initial",
                      fontSize: "inherit",
                      fontWeight: "medium"
                    }}
                    variant="text"
                    size="small"
                    onClick={toggleExpanded}
                    
                  >
                    {expanded ? "Less" : "More"}
                  </Button>
                )}
              </Typography>
              <Stack
                className="socialLinks"
                spacing={5}
                direction="row"
                alignItems="center"
                mb={{xs: 3, md: 4}}
              >
                <Link href="#url">
                  <Image
                    src="/assets/icons/twitter-icon.svg"
                    alt="Facebook Icon"
                    width={16}
                    height={16}
                  />
                </Link>
                <Link href="#url">
                  <Image
                    src="/assets/icons/insta-icon.svg"
                    alt="Instagram Icon"
                    width={16}
                    height={16}
                  />
                </Link>
                <Link href="#url">
                  <Image
                    src="/assets/icons/facebook-icon.svg"
                    alt="X Icon"
                    width={12}
                    height={16}
                  />
                </Link>
              </Stack>
              <ButtonWithBackground buttonText="Join the network" />
            </Box>
          </Grid>
          <Grid size={{ md: 6, xs: 12 }}>
            <Box className="bannerRightImg">
              <Image
                src="/assets/images/banner-right.png"
                alt="Hero Image"
                width={620}
                height={600}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </BannerStyled>
  );
};

export default Banner;
