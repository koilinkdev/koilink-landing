import { common, primary, secondary } from '@/theme/palette';
import { Box, Typography, styled } from '@mui/material';
import React from 'react';

interface TypingIndicatorProps {
    typingUsers: string;
}
const StyledTypingComponent = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;

  .loader_wrap {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: ${primary.light};
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    margin-right: 16px;
    padding: 5px;

    .loader {
      width: 2px;
      height: 2px;
      position: relative;
      /* background: ${common.color6D9DC5}; */

      &::before,
      &::after {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 6px;
        background: ${primary.main};
        width: 6px;
        height: 6px;
        border-radius: 50%;
        animation: jump 0.5s ease-in infinite alternate;
      }

      &::after {
        background: transparent;
        box-shadow: 10px -10px ${common.color6D9DC5},
          -10px -10px ${common.color6D9DC5};
        animation: split 0.5s ease-out infinite alternate;
      }
    }

    @keyframes split {
      0% {
        box-shadow: 4px -10px ${common.color6D9DC5},
          -4px -10px ${common.color6D9DC5};
      }
      100% {
        box-shadow: 10px -10px ${common.color6D9DC5},
          -10px -10px ${common.color6D9DC5};
      }
    }

    @keyframes jump {
      0% {
        transform: translate(-50%, -150%);
      }
      100% {
        transform: translate(-50%, 10%);
      }
    }
  }

  .typingUserText{
    font-size: 10px;
    font-weight: 500;
    color: ${secondary.main};
  }

  
  .typing_dots {
    display: flex;
    align-items: center;
    margin: 2px;

    .dot {
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background-color: ${common.color6D9DC5};
      margin-right:2px;
      animation: typingDot 1.4s infinite ease-in-out;

      &:first-of-type {
        animation-delay: 0s;
      }

      &:nth-of-type(2) {
        animation-delay: 0.2s;
      }

      &:nth-of-type(3) {
        animation-delay: 0.4s;
        margin-right:0
      }
    }

    @keyframes typingDot {
      0%,
      80%,
      100% {
        opacity: 0.3;
      }
      40% {
        opacity: 1;
      }
    }
  }
`;

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
    const typingText = `${typingUsers} is typing`
    return (
        <StyledTypingComponent>
            <Box className="loader_wrap">
                <Box className="loader" />
            </Box>

            <Typography variant="caption" className="typingUserText">
                {typingText}
            </Typography>

            <Box className="typing_dots">
                <Box className="dot"/>
                <Box className="dot"/>
                <Box className="dot"/>
            </Box>
        </StyledTypingComponent>
    );
};


