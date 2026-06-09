import { Box, styled } from "@mui/material";

export const SolutionSectionStyled = styled(Box)`
  position: relative;
  .solContent {
    padding: 78px 0;
    @media (max-width: 899px) {
      padding: 0;
    }
  }
  .solImg {
    position: relative;
    height: 100%;
    width: 100%;
    border-radius: 28px;
    overflow: hidden;
    @media (max-width: 899px) {
      height: 400px;
    }
    @media (max-width: 899px) {
      height: 300px;
    }
    img{
      object-fit: cover;
      object-position: top;
    }
  }
  .chipWrapper {
    max-width: 427px;
    margin-bottom: 48px;
    @media (max-width: 899px) {
      margin-bottom: 30px;
    }
  }
  .solHeadIcon{
    @media (max-width: 899px) {
      width: 40px;
      height: 40px;
      img{
        height: 100%;
        width: 100%;
      }
    }
  }
  .solHeadTitle{
    @media (max-width: 899px) {
      font-size: 22px;
    }
  }
`;
