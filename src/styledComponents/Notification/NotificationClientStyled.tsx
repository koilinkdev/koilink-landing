import { Box, styled } from '@mui/material'
import { background, common } from '@/theme/palette'

export const AboutNotificationClientStyle = styled(Box)`
  padding: 40px;
  background-color: ${background.paper};
  border-radius: 20px;
  @media (max-width: 899px) {
    padding: 20px;
  }

  .notification_SecTitle_cont {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background-color: ${common.colorECEDF2};
      z-index: 0;
    }

    .notificationPage_timeSec_text {
      position: relative;
      background-color: ${background.paper};
      padding-right:12px;
      color: ${common.color515978};
      font-size: 14px;
      font-weight: 600;
      line-height: 1.8;
      z-index: 1;
    }
  }
`;