"use client";

import { FeaturesBoxCardStyled } from "@/styledComponents/LandingPage/FeaturesBoxCardStyled";
import { CardProps } from "@mui/material";
import { ReactNode } from "react";

interface FeaturesBoxCardProps extends CardProps {
  children: ReactNode;
}

const FeaturesBoxCard = ({ children, ...rest }: FeaturesBoxCardProps) => {
  return <FeaturesBoxCardStyled {...rest}>{children}</FeaturesBoxCardStyled>;
};

export default FeaturesBoxCard;