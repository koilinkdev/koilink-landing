"use client";
import { common } from "@/theme/palette";
import { Box, styled } from "@mui/material";

export const LandingPageStyled = styled(Box)`
  padding-top: 88px;
  background-color: ${common.colorFAFAFC};
  overflow-x: hidden;
  @media (max-width: 899px) {
    padding-top: 75px;
  }
`;