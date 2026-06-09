"use client";

import { NewsletterSecStyled } from "@/styledComponents/LandingPage/NewsletterSecStyled";
import { Box, Button, Container, Typography } from "@mui/material";

const JoinArw = () => {
  return (
    <svg
      width="25"
      height="26"
      viewBox="0 0 25 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.2026 13.8306L10.562 20.4712C10.103 20.9302 9.36084 20.9302 8.90674 20.4712L7.80322 19.3677C7.34424 18.9087 7.34424 18.1665 7.80322 17.7124L12.5103 13.0054L7.80322 8.29834C7.34424 7.83936 7.34424 7.09717 7.80322 6.64307L8.90186 5.52979C9.36084 5.0708 10.103 5.0708 10.5571 5.52979L17.1978 12.1704C17.6616 12.6294 17.6616 13.3716 17.2026 13.8306Z"
        fill="#109DA4"
      />
    </svg>
  );
};
const NewsletterSec = () => {
  return (
    <NewsletterSecStyled className="cmn_gap pt-0" data-aos="fade-up">
      <Container fixed maxWidth="xl">
        <Box className="newsletterWrap">
          <Box
            className="newsletterInner"
            sx={{
              background:
                "url('/assets/images/newsletter-bg.png') no-repeat bottom center",
              backgroundSize: "cover",
            }}
          >
            <Typography variant="h2" color="white">
              Take the first step towards a more engaged workplace!
            </Typography>
            <Button className="joinBtn">
              JOIN
              <JoinArw />
            </Button>
          </Box>
        </Box>
      </Container>
    </NewsletterSecStyled>
  );
};

export default NewsletterSec;
