import { common, secondary } from "@/theme/palette";
import { Box, styled } from "@mui/material";

export const NewsletterSecStyled = styled(Box)`
  .newsletterWrap{
      background: linear-gradient(
        180deg,
        #109da4 0%,
        rgba(15, 131, 136, 0.8) 50%,
        #00a2aa 100%
      );
      border-radius: 32px;
      overflow: hidden;
      .newsletterInner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 104px 104px;
        @media (max-width: 899px) {
         padding: 30px;
         flex-wrap: wrap;
         justify-content: center;
        }
        h2 {
          max-width: 700px;
          padding-right: 30px;
          @media (max-width: 899px) {
            width: 100%;
            padding-right: 0;
            margin-bottom: 20px;
            text-align: center;
            font-size: 20px;
          }
          @media (max-width: 899px) {
            
          }
        }
        .joinBtn {
          background-color: ${common.white};
          box-shadow: 0px 0px 0px 6px rgba(255, 255, 255, 0.14902);
          border-radius: 50px;
          padding: 12px 66px;
          font-weight: 500;
          font-size: 14px;
          &:hover{
            background-color: ${secondary.main};
            color: ${common.white};
            box-shadow: 0px 0px 0px 6px rgba(255, 255, 255, 0.5);
            svg{
                path{
                    fill: ${common.white}
                }
            }
          }
          svg{
            margin-left: 10px;
          }
        }
      }
  }
`;
