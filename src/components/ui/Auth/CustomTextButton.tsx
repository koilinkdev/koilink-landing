"use client";
import React from "react";
import { Button, styled } from "@mui/material";
import { primary } from "@/theme/palette";


interface TextButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const StyledTextButton = styled(Button)(({}) => ({
  padding: 0,
  minWidth: "unset",
  textTransform: "none",
  borderRadius: 0,
  fontSize: "14px",
  fontWeight:500,
  color: primary.main,
  "&:hover": {
    backgroundColor: "transparent",
    textDecoration: "underline",
  },
}));

const CustomTextButton: React.FC<TextButtonProps> = ({ onClick, children }) => {
  return (
    <StyledTextButton disableRipple variant="text" onClick={onClick}>
      {children}
    </StyledTextButton>
  );
};

export default CustomTextButton;
