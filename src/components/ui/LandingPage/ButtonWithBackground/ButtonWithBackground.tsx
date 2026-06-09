"use client";

import React, { MouseEventHandler } from "react";
import { common, primary } from "@/theme/palette";
import { Button, styled, Typography } from "@mui/material";

const ButtonWithBackgroundStyled = styled(Button)`
  border-radius: 30px;
  background-color: ${common.white};
  position: relative;
  z-index: 1;
  min-height: 49px;
  min-width: 166px;
  padding: 5px 45px;
  overflow: hidden;
  transition: 0.4s ease-in-out;
  filter: drop-shadow(0px 0px 1px #109da4);
  @media (max-width: 899px) {
    min-width: 150px;
    min-height: 45px;
  }
  &:hover {
    box-shadow: 0 0 8px 4px rgba(127, 222, 216, 0.5);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    /* transform: translateX(-50%); */
    width: 0;
    height: 100%;
    background-color: ${primary.light};
    opacity: 1;
    z-index: -1;
    transition: 0.4s ease-in-out;
  }
  .bg1 {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    /* transform: rotate(13.42deg); */
    z-index: -2;
  }
  .bg2 {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    /* transform: rotate(13.42deg); */
    z-index: -3;
  }
  .bg3 {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    /* transform: rotate(13.42deg); */
    z-index: -4;
  }
`;
export interface ButtonWithBackgroundProps {
  buttonText: string;
  onClick?: MouseEventHandler<HTMLButtonElement>; 
}
const ButtonWithBackground = ({ buttonText, onClick }: ButtonWithBackgroundProps) => {
  return (
    <ButtonWithBackgroundStyled onClick={onClick}>
      {buttonText}
      <Typography variant="caption" className="bg1">
        <svg
          width="40"
          height="49"
          viewBox="0 0 40 49"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.9453 -23.3684L39.2939 69.3092L-52.4067 47.4307L12.9453 -23.3684Z"
            fill="#7FDED8"
          />
        </svg>
      </Typography>
      <Typography variant="caption" className="bg2">
        <svg
          width="76"
          height="49"
          viewBox="0 0 76 49"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M75.5404 -11.3588L91.603 106.363L0.803399 81.0038L75.5404 -11.3588Z"
            fill="#7FDED8"
          />
        </svg>
      </Typography>
      <Typography variant="caption" className="bg3">
        <svg
          width="135"
          height="24"
          viewBox="0 0 135 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M98.6145 -113.259L134.698 23.1697L0.675253 -11.6582L98.6145 -113.259Z"
            fill="#109DA4"
          />
        </svg>
      </Typography>
    </ButtonWithBackgroundStyled>
  );
};

export default ButtonWithBackground;
