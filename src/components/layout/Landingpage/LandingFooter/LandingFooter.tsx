"use client";

import { common, primary, text } from "@/theme/palette";
import {
  Box,
  Container,
  List,
  ListItem,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";

const LandingFooterStyled = styled(Box)`
  padding: 80px 0;
  background: ${common.white};
  box-shadow: 0px -1px 6px -2px rgba(54, 61, 77, 0.101961);
  @media (max-width: 899px) {
    padding: 60px 0;
  }
  .footerTop {
    .footerTop_row {
      justify-content: space-between;
      margin: 0 -15px -20px;
      @media (max-width: 599px) {
        flex-wrap: wrap;
      }
      .footerTop_col {
        padding: 0 15px;
        margin-bottom: 20px;
        @media (max-width: 599px) {
          width: 100%;
        }
      }
      .footerLogo {
        display: inline-flex;
        margin-bottom: 40px;
        @media (max-width: 899px) {
          margin-bottom: 30px;
        }
        @media (max-width: 599px) {
          margin-bottom: 20px;
        }
      }
      .footerSocialLinks {
        a {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 32px;
          height: 32px;
          border: 1px solid transparent;
          border-radius: 5px;
          &:hover {
            border-color: ${primary.main};
            box-shadow: 0 0 8px 4px rgba(127, 222, 216, 0.5);
          }
        }
      }

      .footerTopMenuList {
        li {
          margin-bottom: 18px;
          width: auto;
          &:last-child {
            margin-bottom: 0;
          }
          a {
            font-size: 14px;
            color: ${text.secondary};
            text-decoration: none;
            &:hover {
              color: ${primary.main};
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
  .footerBot {
    .footerBot_row {
      align-items: center;
      justify-content: space-between;
      margin: 0 -15px -30px;
      @media (max-width: 899px) {
        flex-wrap: wrap;
        flex-direction: column-reverse;
      }
      .footerBot_col {
        padding: 0 15px;
        margin-bottom: 30px;
        @media (max-width: 899px) {
          width: 100%;
        }
        .footerBotMenuList {
          display: flex;
          margin: 0 -9px;
          li {
            padding: 0 9px;
            width: auto;
            a {
              font-size: 14px;
              color: ${text.secondary};
              text-decoration: none;
              &:hover {
                color: ${primary.main};
                text-decoration: underline;
              }
            }
          }
        }
        .copyrightText {
          color: ${common.color31445A};
          a {
            color: inherit;
            text-decoration: none;
            font-size: inherit;
            &:hover {
              color: ${primary.main};
            }
          }
        }
        .certificateList {
          .certificateImgWrap {
            @media (max-width: 599px) {
              width: calc(100% / 4);
            }
            img {
              @media (max-width: 599px) {
                width: 100%;
                height: auto;
              }
            }
          }
        }
      }
    }
  }
  .footerSeparator {
    padding: 2px 0;
    background: linear-gradient(
      90deg,
      rgba(0, 51, 153, 0) 0%,
      #7fded8 50%,
      rgba(0, 51, 153, 0) 100%
    );
    margin: 40px 0;
    @media (max-width: 599px) {
      margin: 30px 0;
    }
  }
`;

const footerTopLinks = [
  {
    linkName: "About",
    linkPath: "#url",
  },
  {
    linkName: "Security & Compliance",
    linkPath: "#url",
  },
  {
    linkName: "Contact",
    linkPath: "#url",
  },
];
const footerBotLinks = [
  {
    linkName: "Privacy Policy",
    linkPath: "#url",
  },
  {
    linkName: "Terms of Service",
    linkPath: "#url",
  },
  {
    linkName: "Cookies Policy",
    linkPath: "#url",
  },
];

const certificationsListData = [
  "/assets/images/certi1.png",
  "/assets/images/certi2.png",
  "/assets/images/certi3.png",
  "/assets/images/certi4.png",
];
const LandingFooter = () => {
  return (
    <LandingFooterStyled>
      <Container fixed maxWidth="xl">
        <Box className="footerTop">
          <Stack className="footerTop_row" direction="row">
            <Box className="footerTop_col">
              <Link href="/" className="footerLogo">
                <Image
                  src="/assets/images/footer-logo.png"
                  width={199}
                  height={48}
                  alt="Footer Logo"
                />
              </Link>
              <Stack
                className="footerSocialLinks"
                spacing={2.5}
                direction="row"
                alignItems="center"
              >
                <Link href="#url">
                  <Image
                    src="/assets/icons/facebook-icon.svg"
                    alt="X Icon"
                    width={12}
                    height={16}
                  />
                </Link>
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
              </Stack>
            </Box>
            <Box className="footerTop_col">
              <List disablePadding className="footerTopMenuList">
                {footerTopLinks.map((item, index) => (
                  <ListItem key={index} disablePadding>
                    <Link href={item.linkPath}>{item.linkName}</Link>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Stack>
        </Box>
        <Box className="footerSeparator" />
        <Box className="footerBot">
          <Stack className="footerBot_row" direction="row">
            <Box className="footerBot_col">
              <Typography
                className="copyrightText"
                variant="body1"
                mb={1.2}
                fontSize={14}
              >
                &copy; 2025 - <Link href="/">Koilink Solutions</Link>.
              </Typography>
              <List disablePadding className="footerBotMenuList">
                {footerBotLinks.map((item, index) => (
                  <ListItem key={index} disablePadding>
                    <Link href={item.linkPath}>{item.linkName}</Link>
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box className="footerBot_col">
              <Stack
                direction="row"
                spacing={{ xs: 2, md: 4 }}
                className="certificateList"
              >
                {certificationsListData.map((item, index) => (
                  <Box className="certificateImgWrap" key={index}>
                    <Image
                      src={item}
                      width={80}
                      height={80}
                      alt={`Certificate ${index}`}
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Container>
    </LandingFooterStyled>
  );
};

export default LandingFooter;
