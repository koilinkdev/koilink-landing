"use client";

import { common, primary, secondary } from "@/theme/palette";
import { styled, Box } from "@mui/material";


export const AboutAllMatchesTopSecStyled = styled(Box)`
    background-color:${common.colorF7F9FB};
    padding:20px;
    margin-bottom:28px;
    border-radius: 16px;
    width:100%;
    overflow: hidden;
    .allMatchCard_row{
      margin: 0 -24px;
      @media (max-width: 899px) {
        flex-wrap: wrap;
          margin: 0 -20px -20px;
          justify-content: center;
        }
      }
      .allMatchCard_col{
        padding: 0 24px;
        width: calc(100% / 3);
        border-right:1px solid ${common.color6D9DC58F};
        display: flex;
        justify-content: flex-start;
        min-width: 0;
        &.first_col{
          justify-content: flex-start;
        }
        &.last_col{
          justify-content: flex-start;
          border-right: none;
           @media (max-width: 899px) {
            justify-content: center;
            border-right: none;
           }
        }
        @media (max-width: 899px) {
          padding: 0 20px;
          width: calc(100% / 2);
          margin-bottom: 30px;
          &:nth-child(2n){
            border-right: none;
          }
      }
      @media (max-width: 599px) {
          width: 100%;
          border-right: none;
          margin-bottom: 20px;
      }
      }
    }  
    .matches_single_item{
       .icon_cont{
        display: flex;
        width:84px;
        height:84px;
        background: linear-gradient(201.18deg, #AFECEF 3.14%, #EFFFF6 86.04%);
        border-radius: 42px;
        justify-content:center;
        align-items: center;
       }
       .title_text{
         font-size:14px;
         font-weight:500;
         color:${primary.main};
         margin-bottom: 3px;
       }
       .value_text{
         font-size:28px;
         font-weight:600;
         color:${common.color6D9DC5};
         margin-bottom: 3px;
        
       }
       .graph_cont{
        .text_content{
          font-size:14px;
            font-weight:400;
            color:${common.color6D9DC5};
              .text_content_blue{
              font-weight:700;
              color:${secondary.main};
            }
        }
}
    }

`

