import { text } from "@/theme/palette";
import { Button, ButtonProps, styled } from "@mui/material";
import React from "react";

interface CustomButtonProps extends ButtonProps {
  isSubmitting?: boolean;
}

const BaseButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  function BaseButton(props, ref) {
    return <Button ref={ref} {...props} />;
  }
);

export const CustomButtonRounded = styled(BaseButton, {
  shouldForwardProp: (prop) => prop !== "isSubmitting",
})<CustomButtonProps>(({ isSubmitting,}) => ({
  borderRadius: "29px",
  boxShadow: "none",
  padding: "10px 30px",
  fontWeight: 600,
  fontSize: "18px",
  maxHeight: "50px",

  ...(isSubmitting && {
    backgroundColor: text.secondary,
    color: "#fff",
    pointerEvents: "none",
  }),

  "&:hover": {
    boxShadow: "none",
  },

 
  "&.Mui-disabled": {
    backgroundColor: "rgba(109, 157, 197, 0.56)", 
    color: "#fff",
  },
}));
