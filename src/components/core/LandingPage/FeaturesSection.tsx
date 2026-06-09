import { FeaturesSectionStyled } from "@/styledComponents/LandingPage/FeaturesSectionStyled";
import { Box, Container, Grid, Typography } from "@mui/material";
import React from "react";
import SectionTitle from "./SectionTitle";
import FeaturesBoxCard from "./FeaturesBoxCard";
import Image from "next/image";

const FeaturesSection = () => {
  return (
    <FeaturesSectionStyled className="cmn_gap pt-0">
      <Container fixed maxWidth="xl">
        <SectionTitle
          subHeading="Features"
          heading={
            <>
              Unlock potential with employee <br /> engagement features
            </>
          }
        />
        <Box className="featuresGridWrap">
          <Box className="featuresGridBg" />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }} data-aos="fade-up">
              <Box display="flex" flexDirection="column" >
                <FeaturesBoxCard sx={{ marginBottom: 2, height: "50%" }}>
                  <Typography variant="h3" mb={{xs: 1, md: 2}} fontSize={{xs: 22, md: 24}}>
                    Impact model drivers
                  </Typography>
                  <Typography variant="body1" mb={2}>
                    Developed based on scientific practices, research, and
                    psychological insights, the IMPACT Model focuses on key
                    drivers, including Innovation, Motivation, Performance,
                    Autonomy, Connection, and Transformational Leadership that
                    help you understand the drivers behind employee engagement.
                  </Typography>
                  <Box className="featuresCardImage_sm">
                    <Image
                      src="/assets/images/feature-1.png"
                      alt="Impact model drivers image"
                      fill
                    />
                  </Box>
                </FeaturesBoxCard>
                <FeaturesBoxCard sx={{ height: "50%" }}>
                  <Typography variant="h3" mb={{xs: 1, md: 2}} fontSize={{xs: 22, md: 24}}>
                    Heatmap visualization
                  </Typography>
                  <Typography variant="body1" mb={2}>
                    Gain a comprehensive understanding of workplace engagement
                    through color-coded results, highlighting differences
                    between selected variables for each driver and question.
                  </Typography>
                  <Box className="featuresCardImage_sm">
                    <Image
                      src="/assets/images/feature-2.png"
                      alt="Heatmap visualization image"
                      fill
                    />
                  </Box>
                </FeaturesBoxCard>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} data-aos="fade-left">
              <FeaturesBoxCard>
                <Typography variant="h3" mb={{xs: 1, md: 2}} fontSize={{xs: 22, md: 24}}>
                  Impact model drivers
                </Typography>
                <Typography variant="body1" mb={2}>
                  Developed based on scientific practices, research, and
                  psychological insights, the IMPACT Model focuses on key
                  drivers, including Innovation, Motivation, Performance,
                  Autonomy, Connection, and Transformational Leadership that
                  help you understand the drivers behind employee engagement.
                </Typography>
                <Box className="featuresCardImage_lg">
                  <Image
                    src="/assets/images/feature-3.png"
                    alt="Heatmap visualization image"
                    fill
                  />
                </Box>
              </FeaturesBoxCard>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </FeaturesSectionStyled>
  );
};

export default FeaturesSection;
