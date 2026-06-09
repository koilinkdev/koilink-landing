import { SectionTitleStyled } from "@/styledComponents/LandingPage/SectionTitleStyled";
import { text } from "@/theme/palette";
import { Typography } from "@mui/material";
import React, { ReactNode } from "react";

interface sectionTitleProps {
  subHeading: string;
  heading: ReactNode;
}
const SectionTitle = ({ subHeading, heading }: sectionTitleProps) => {
  return (
    <SectionTitleStyled>
      <Typography
        textAlign="center"
        variant="body1"
        color="primary"
        fontWeight="bold"
        mb={1}
        textTransform="uppercase"
        fontSize={18}
      >
        {subHeading}
      </Typography>
      <Typography variant="h2" textAlign="center" color={text.primary}>
        {heading}
      </Typography>
    </SectionTitleStyled>
  );
};

export default SectionTitle;
