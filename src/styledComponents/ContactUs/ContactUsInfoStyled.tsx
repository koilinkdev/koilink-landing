import { Box, styled} from '@mui/material'
import { common, primary, secondary, text } from "@/theme/palette";

export const AboutContactUsInfoStyled = styled(Box)`
  padding: 20px;
  border-radius: 20px;
  background-color: ${common.colorF7F9FB};
  position: relative;
  overflow:hidden;
  z-index: 1;
  padding-bottom:300px;
  
    @media (max-width: 899px) {
      padding-bottom: 240px;
    }
  
  
  .contactus_leftsec_text_content {
    margin-bottom: 39px;
    
    .contactus_leftsec_title {
      font-size: 14px;
      font-weight: 600;
      color: ${primary.main};
    }
    
    .contactus_leftsec_subtitle {
      font-size: 12px;
      font-weight: 400;
      color: ${text.primary};
    }
  }
  
  .contactus_leftsec_links_items_cont {
    .contactus_leftsec_linkitem {
      display: flex;
      align-items: start;
      justify-content:start;
      margin-bottom: 20px; 
      text-decoration: none;
      font-size:16px;
      font-weight:400;
      color:${primary.main};
        white-space: pre-line;
         &:hover{    
           color:${secondary.main};
           text-decoration:underline;
        }
      &:last-child {
        margin-bottom: 0;
      }
 
      .contactus_leftsec_linkitem_icon {
        width:auto;
        height:auto;
        display:flex;
        justify-content:center;
        margin-right: 25px;
        flex-shrink: 0; 
      }
         
    }
  }
 .contactus_leftsec_social_links_cont {
  position: absolute;
  bottom: 36px;
  left: 23px;
  z-index: 1;

   .contactus_leftsec_social_linkitem{
    background-color: ${primary.main};
    border-radius: 50%;
    cursor: pointer;
     width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.3s ease, transform 0.3s ease;
    &:hover {
      background-color:${primary.light};
      transform: scale(1.1);
    }
     .contactus_leftsec_social_icon_cont {
     display:flex;
     width:auto;
     height:auto;
   
  }   
   }
 
}
   .contactus_leftsec_bg_decorative_circles {
    position: absolute;
    bottom: -60px;
    right:-30px;
    width: 305px;
    height:304px;
    pointer-events:none;
    @media (max-width: 899px) {
        width: 250px;
        height: 250px;
    }

    }
   
`