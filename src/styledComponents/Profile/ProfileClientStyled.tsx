import { background, common, primary } from '@/theme/palette'
import { Box, styled } from '@mui/material'

export const ProfileClientStyled = styled(Box)`
    padding:20px;
    background-color:${background.paper};
    border-radius:20px;
   
  .profileLeft{
    .profileSocialLinks{
      img{
        transition: 0.3s all ease;
      }
      &:hover{
        img{
          transform: scale(1.1);
        }
      }
    }
    .profileLeftImgWrap{
      width: 100%;
      aspect-ratio: 1 / 1;
      margin: 0 0 20px;
      line-height: 0;
      overflow: hidden;
      border-radius: 24px;
      background-color: ${common.white};
      img{
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
    }
    .modal_inner_wrap{
      .logout_icon_wrap{
        display: flex;
        width: 48px;
        height: 48px;
      }
      .checkbox_inp_cont {
        /* color: #D5D7DA; */

        .MuiSvgIcon-root {
          font-size: 28px;
        }
        /* &.Mui-checked {
          color:${primary.main};
        } */
        .MuiFormControlLabel-label  {
        color:${common.color6D9DC5}!important; 
        font-size: 14px;
        font-weight:500;
  }
      }

    }
  }
  .profileRight{
      .profile_rightSec_common_header_text{
      font-size: 16px;
      font-weight: 500;
      color:${primary.main};
    }
    .profile_rightSec_common_header_subtext{
      font-size: 14px;
      font-weight: 400;
      color:${common.color6D9DC5};
    }
    .banner_list_company {
        display: flex;
        margin: 0 -7px 8px;
        li {
          width: auto;
          position: relative;
          padding: 0 7px;
          &::after {
            content: "\\2022";
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
      .profile_rightSec_address_cont{
        .banner_list_address{
          display: flex;
          li{
            width: auto;
          position: relative;
          padding: 0 7px;
             &::after {
            content: "|";
            position: relative;
            right: -7px;
          }
           &:first-of-type{
            padding-left:0;
           }
          &:last-of-type {
            padding-right:0;
            &::after {
              display: none;
            }
          }
          }
        }
      }
      .profile_rightSec_about_li_cont{
            max-width: 600px;
            text-align: justify;
         .profile_rightSec_about_li_item{
          margin-bottom: 10px;
          &:last-of-type{
            margin-bottom: 0;
          }
          
         }
      }
  }
  `
