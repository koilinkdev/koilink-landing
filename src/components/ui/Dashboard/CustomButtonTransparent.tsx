import { common, text } from "@/theme/palette";
import { Button, ButtonProps, styled } from "@mui/material";
import React from "react";

interface CustomButtonProps extends ButtonProps {
  isSubmitting?: boolean;
  bgColor?: string;
  textColor?: string;
}

const BaseButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  function BaseButton(props, ref) {
    return <Button ref={ref} {...props} />;
  }
);

export const CustomButtonTransparent = styled(BaseButton, {
  shouldForwardProp: (prop) =>
    prop !== "isSubmitting" && prop !== "bgColor" && prop !== "textColor",
})<CustomButtonProps>(({ isSubmitting, bgColor, textColor }) => ({
  borderRadius: "29px", 
  boxShadow: "none",
  padding: "10px 30px",
  fontWeight: 600,
  fontSize: "18px",
  maxHeight: "50px",
  backgroundColor:bgColor||common.white, 
  color: textColor ||common.color6D9DC5, 
  border:`1px solid ${common.colorD5D7DA}`,
  ...(isSubmitting && {
    backgroundColor: text.secondary,
    color: "#fff",
    pointerEvents: "none",
  }),
  "&:hover": {
    boxShadow: "none",
    opacity: 0.9,
    backgroundColor: common.color6D9DC5,
    color:common.white
  },
}));
