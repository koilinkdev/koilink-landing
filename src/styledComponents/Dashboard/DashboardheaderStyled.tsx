import { Box, styled } from "@mui/material";
import { common, primary, } from "@/theme/palette";

export const DashboardheaderStyled = styled(Box)`
  border-bottom: 1px solid ${common.color6D9DC5};
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  /* width: 100%; */
  background-color: ${common.white};
  z-index: 3;
  margin-left: 212px;
  min-height: 68px;
  display: flex;
  align-items: center;

  .dashboardHeader_inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    width: 100%;
    padding: 20px 28px;

    .header_left_sec {
      
      .header_pagename {
        padding: 4px 8px;
        font-size: 18px;
        font-weight: 500;
        color: ${primary.main};
        text-decoration: none;
        &:not(.toggle_btn:first-of-type ){
        @media (min-width: 1200px) {
          margin-left: 0;
        }
      }
      }
      .icon_btn:not(.toggle_btn:first-of-type ){
        @media (min-width: 1200px) {
          margin-left: 0;
        }
      }
      }
    
    .header_right_sec {

      .searchbar_wrapper {
        max-width: 160px;
        .MuiAutocomplete-root{
          width: 100%;
          min-width: 160px;
        }

        .headerSearchInput {
          .MuiInputBase-root {
            padding-left: 8px;
            background-color: ${common.colorF7F9FB};
            border-radius: 8px;
            input {
              padding: 4px 8px 4px 4px;
              color: ${common.color6D9DC5};
              font-weight: 400;
              font-size: 14px;
              line-height: 1;
              ::placeholder {
                color: ${common.color6D9DC5};
                opacity: 1;
              }
            }
          }
        }
      }

      .rightbox_icon_wrapper {
        align-items: center;
        flex-direction: row;
        gap: 8px;
      }
    }
    .icon_btn {
      width: auto;
      height: auto;
      display: flex;
      /* padding:0; */
      
    }
     .toggle_btn {
      display: none;
      
      
}
  }
  @media (max-width: 1199px) {
    margin-left: 0;
      .dashboardHeader_inner{
    .toggle_btn  {
      display: flex;
}
}
    
  }
`;
