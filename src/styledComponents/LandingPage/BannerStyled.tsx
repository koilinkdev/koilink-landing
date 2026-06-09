import { primary, text } from "@/theme/palette";
import { Box, styled } from "@mui/material";

export const BannerStyled = styled(Box)`
  &.bannerSec {
    &.cmn_gap {
      @media (max-width: 899px) {
        padding-top: 35px !important;
      }
    }
  }
  .banner_list {
    display: flex;
    margin: 0 -7px 16px;
    @media (max-width: 599px) {
      flex-wrap: wrap;
    }
    li {
      width: auto;
      position: relative;
      color: ${text.primary};
      font-size: 28px;
      padding: 0 7px;
      @media (max-width: 1199px) {
        font-size: 24px;
      }
      @media (max-width: 599px) {
        font-size: 20px;
        width: auto;
      }
      &::after {
        content: "|";
        position: relative;
        right: -7px;
      }
      &:last-of-type {
        &::after {
          display: none;
        }
      }
    }
  }
  .socialLinks {
    a {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      border: 1px solid ${primary.main};
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        transition: 0.3s all ease;
      }

      &:hover {
        img {
          transform: rotate(360deg);
        }
      }
    }
  }
  .bannerRightImg {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .bannerLeft {
    /* padding: 68px 0; */
    /* max-width: 550px; */
  }
`;
