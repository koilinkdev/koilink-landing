import { Box, styled } from "@mui/material";

export const FeaturesSectionStyled = styled(Box)`
  .featuresGridWrap {
    position: relative;
    z-index: 1;
    .featuresGridBgWrap{
        
    }
    .featuresGridBg {
      background: linear-gradient(135deg, #00b49d 0%, #003399 100%);
      max-width: 752px;
      max-height: 752px;
      height: 100%;
      width: 100%;
      opacity: 0.3;
      filter: blur(100px);
      position: absolute;
      top: 130px;
      bottom: 120px;
      left: 50%;
      transform: translateX(-50%);
      z-index: -1;
      pointer-events: none;
    }
  }
`;
