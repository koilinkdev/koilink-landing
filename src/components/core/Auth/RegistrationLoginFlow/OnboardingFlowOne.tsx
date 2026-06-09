"use client";
import React from "react";
import { Box, Typography, RadioGroup, Grid, Stack } from "@mui/material";
import { CustomButtonRounded } from '@/components/ui/Dashboard/CustomButtonRounded';
import StyledCheckLabel from "@/components/ui/Auth/Onboarding/StyledOnboardingCheckLabel";

interface OnboardingFlowOneProps {
  onContinue: (mode: "investment" | "networking") => void;
}
const OnboardingFlowOne: React.FC<OnboardingFlowOneProps> = ({
  onContinue,
}) => {
  const [mode, setMode] = React.useState<"investment" | "networking">("investment");

  const handleSubmit = () => {
    onContinue(mode);
  };
  return (
    <Box className="onboardingFormpWrap">
      <Box
        className="onboarding_common_bg left"
        sx={{
          backgroundImage: "url('/assets/icons/onboarding-left-icon.svg')",
          backgroundPosition: "bottom left"
        }}
      />
      <Box
        className="onboarding_common_bg right"
        sx={{
          backgroundImage: "url('/assets/icons/onboarding-right.svg')",
          backgroundPosition: "bottom right",
        }}
      />

      <Box
        className="onboardingOneForm_icon_bg one"
        sx={{
          backgroundImage: "url('/assets/icons/heart-icon.svg')",
        }}
      ></Box>
      <Box
        className="onboardingOneForm_icon_bg two"
        sx={{
          backgroundImage: "url('/assets/icons/flower-onboarding-icon.svg')",
        }}
      ></Box>
      <Box
        className="onboardingOneForm_icon_bg three"
        sx={{
          backgroundImage:
            "url('/assets/icons/onboarding-single-flower-icon.svg')",
        }}
      ></Box>
      <Box
        className="onboardingOneForm_icon_bg four"
        sx={{
          backgroundImage: "url('/assets/icons/star-icon.svg')",

        }}
      ></Box>
      <form className="onboardingFormpInnerWrap">
        <Grid container rowSpacing={5}>
          <Grid size={{ xs: 12 }}>
            <Box>
              <Typography variant="h4" className="onboarding_form_headerText">
                Welcome to Koilink
              </Typography>
              <Typography
                variant="body2"
                className="onboarding_form_headerSubText"
              >
                Discover tailored investment opportunities or build valuable
                connections in your industry.
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              className="radioBtnWrap"
              value={mode}
              onChange={(_event, value) => {
                setMode(value as "investment" | "networking");
              }}
            >
              <Stack
                direction="row"
                spacing={2.5}
                justifyContent="center"
                alignItems="center"
              >
                <StyledCheckLabel
                  value="investment"
                  title="Investment Opportunities"
                  description="Explore a curated list of businesses and individuals actively seeking funding. Discover high-potential startups, growth-stage companies, and personal projects aligned with your investment goals."
                />

                <StyledCheckLabel
                  value="networking"
                  title="Networking"
                  description="Build meaningful connections with brokers, investors, and industry professionals. Expand your network, collaborate on deals, and stay informed with real-time insights and opportunities."
                />
              </Stack>
            </RadioGroup>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box className="onboardingBtn_wrap">
              
                <CustomButtonRounded
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSubmit}
                // disabled
                >
                  Continue
                </CustomButtonRounded>
              
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default OnboardingFlowOne;
