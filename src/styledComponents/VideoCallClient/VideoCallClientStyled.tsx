import { background, common, primary } from "@/theme/palette"
import { Box, styled } from "@mui/material"

export const VideoCallClientStyled = styled(Box)`
  height: 100%;

  .call_shell,
  .empty_state {
    height: 100%;
    background: ${background.paper};
    border-radius: 20px;
    padding: 24px;
    display: flex;
    flex-direction: column;
  }

  .empty_state {
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .empty_title {
    font-weight: 700;
    color: ${common.color0D1C2E};
    margin-bottom: 8px;
  }

  .empty_text {
    color: ${common.color6D9DC5};
    max-width: 320px;
  }

  .empty_actions {
    margin-top: 20px;
  }

  .call_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;

    @media (max-width: 899px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .back_btn {
    width: 36px;
    height: 36px;
    color: ${primary.main};
    background: ${common.white};
    box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.03),
      0px 7px 25px rgba(42, 139, 242, 0.03),
      0px 5px 25px rgba(42, 139, 242, 0.07);
  }

  .call_title {
    font-size: 20px;
    font-weight: 700;
    color: ${common.color0D1C2E};
  }

  .call_status {
    color: ${common.color6D9DC5};
  }

  .duration_chip {
    border-radius: 999px;
    padding: 10px 16px;
    font-size: 13px;
    font-weight: 700;
    color: ${primary.main};
    background: rgba(42, 139, 242, 0.08);
  }

  .call_notice {
    border-radius: 12px;
    padding: 12px 16px;
    margin-bottom: 16px;
    color: ${common.color0D1C2E};
    background: rgba(127, 222, 216, 0.18);
  }

  .call_stage {
    flex: 1;
    min-height: 0;
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    background:
      radial-gradient(circle at top left, rgba(127, 222, 216, 0.28), transparent 32%),
      linear-gradient(160deg, #203048 0%, #112033 60%, #0d1724 100%);
  }

  .remote_stage {
    height: 100%;
    position: relative;
  }

  .video_surface {
    width: 100%;
    height: 100%;

    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .remote_placeholder {
    position: absolute;
    inset: 0;
    justify-content: center;
    color: ${common.white};
    text-align: center;
    padding: 24px;
    background:
      linear-gradient(180deg, rgba(13, 28, 46, 0.15) 0%, rgba(13, 28, 46, 0.55) 100%);
  }

  .local_stage {
    position: absolute;
    right: 20px;
    bottom: 20px;
    width: 220px;
    height: 150px;
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.18);
    background: rgba(10, 17, 27, 0.72);
    box-shadow: 0px 18px 30px rgba(0, 0, 0, 0.22);

    @media (max-width: 899px) {
      width: 144px;
      height: 108px;
      right: 12px;
      bottom: 12px;
    }
  }

  .local_placeholder {
    height: 100%;
    justify-content: center;
    color: rgba(255, 255, 255, 0.76);
  }

  .call_controls {
    display: flex;
    justify-content: center;
    gap: 16px;
    padding-top: 18px;
  }

  .control_btn {
    width: 56px;
    height: 56px;
    color: ${common.white};
    background: rgba(13, 28, 46, 0.9);
    border: 1px solid rgba(109, 157, 197, 0.24);

    &:hover {
      background: rgba(13, 28, 46, 1);
    }

    &.muted {
      background: rgba(109, 157, 197, 0.18);
      color: ${common.color0D1C2E};
    }

    &.end_btn {
      background: #e85d75;
      border-color: transparent;
    }
  }
`
