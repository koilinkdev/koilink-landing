"use client"
import { Button, ButtonProps, styled,Box } from "@mui/material";
import React from "react";

interface CustomButtonWithIconProps extends ButtonProps {
  icon?: React.ReactNode;
}

const BaseButtonWithIcon = React.forwardRef<HTMLButtonElement, CustomButtonWithIconProps>(
  function BaseButtonWithIcon({ icon, children, ...rest }, ref) {
    return (
      <Button ref={ref} {...rest}>
        {icon && <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>{icon}</Box>}
        {children}
      </Button>
    );
  }
);

export const CustomButtonRoundedWithIcon = styled(BaseButtonWithIcon)<CustomButtonWithIconProps>(() => ({
  borderRadius: "29px",
  boxShadow: "none",
  padding: "10px 30px",
  fontWeight: 600,
  fontSize: "18px",
  maxHeight: "50px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textTransform: "none",
}));
