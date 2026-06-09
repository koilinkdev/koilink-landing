import { Box, styled } from "@mui/material";

export const DashboardWrapperStyled = styled(Box)`
  .dasboardMain {
    padding-top: 77px;
    .dashboardContent {
      padding: 24px;
      margin-left: 212px;
      height: calc(100vh - 77px);
      overflow-y: auto;
      @media (max-width: 1199px) {
        margin-left: 0;
      }
    }
  }
`;
