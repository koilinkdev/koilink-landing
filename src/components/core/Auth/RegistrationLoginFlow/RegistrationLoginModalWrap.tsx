"use client";
import React from 'react';
import {IconButton,Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {StyledRegistrationLoginModalWrapper} from '@/styledComponents/Auth/RegistrationLoginModalWrapperStyled'
interface RegistrationLoginModalWrapperProps {
  open: boolean;
  handleClose: () => void;
  children?: React.ReactNode;

}

export default function RegistrationLoginModalWrapper({ open, handleClose, children }: RegistrationLoginModalWrapperProps) {
  return (
    <StyledRegistrationLoginModalWrapper
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      fullWidth>

      <IconButton
        aria-label="close"
        onClick={handleClose}
        className="login_modal_close_btn"
      >
        <CloseIcon />
      </IconButton>

      <Box className="loginModal_tilted_wrap">
        <>{children}</>
      </Box>
    </StyledRegistrationLoginModalWrapper>
  );
}