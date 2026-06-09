import { primary } from "@/theme/palette";
import { Box, styled } from "@mui/material";

export const TimelineSecStyled = styled(Box)`
  .timelineSec {
    .timeline_each {
      padding: 55px 0;
      position: relative;
      @media (max-width: 899px) {
        padding: 20px 0;
        padding-left: 30px;
      }
      &::before {
        position: absolute;
        content: "";
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        height: 100%;
        border-radius: 20px;
        width: 2px;
        background-color: ${primary.main};
        @media (max-width: 899px) {
          left: 0;
          transform: none;
        }
      }
      &::after {
        position: absolute;
        content: "";
        top: 95px;
        left: 50%;
        transform: translateX(-50%);
        width: 18px;
        height: 18px;
        background: linear-gradient(180deg, #109da4 -66.67%, #7fded8 186.11%);
        box-shadow: 0px 0px 20px 9px rgba(250, 250, 252, 0.59);
        border-radius: 14px;
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        @media (max-width: 899px) {
          left: 0;
          transform: translateX(0);
          top: 60px;

        }
      }
      &.fadeInUp {
        &::after {
          opacity: 0;
          transform: translate(-50%, 70px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
      }
      &.fadeInUp {
        &.active {
          &::after {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      }
      &:first-of-type {
        padding-top: 0;
        &::after {
          top: 30px;
           @media (max-width: 899px) {
          top: 40px;

        }
        }
      }
      &:last-of-type {
        padding-bottom: 0;
      }
      &.timeline_opposite {
        .timeline_each_img {
          justify-content: flex-start;
          @media (max-width: 899px) {
            justify-content: flex-start;
          }
        }
        .timeline_each_content {
          margin-left: auto;
        }
      }
      .timeline_each_content {
        max-width: 500px;
        margin-right: auto;
        padding: 20px 0;
        @media (max-width: 899px) {
          max-width: initial;
        }
      }
      .timeline_each_img {
        display: flex;
        justify-content: flex-end;
        @media (max-width: 899px) {
          justify-content: flex-start;
        }
      }
    }
  }
`;
