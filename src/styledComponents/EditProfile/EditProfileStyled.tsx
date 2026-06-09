import { background, common, primary } from '@/theme/palette';
import { Box, styled } from '@mui/material';

export const AboutEditProfileClientStyled = styled(Box)`
  padding: 40px 40px;
  background-color: ${background.paper};
  border-radius: 20px;

  /* Ensure date picker popover appears above everything */
  & .MuiPickersPopper-root {
    z-index: 1400 !important;
  }

  & .MuiModal-root {
    z-index: 1400 !important;
  }

  .avatar_wrap_main_cont {
    display: flex;
    justify-content: center;
    margin-bottom: 32px;

    .avatar_wrap {
        width: 108px;
        height: 108px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        .avatar_fig {
            width: 100%;
            height: 100%;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
                /* object-fit: cover; */
            }
        }

        .pencil_cont {
            padding: 0;
            position: absolute;
            top: 76px;
            left: 80px;
                &:hover {
                  background-color:transparent;
                  filter: brightness(1.2);
                }
                img {
                  transition: filter 0.2s ease;
                  transform: scale(1.1);
                }
        }
    }
  }

  .form_wrap {
    padding-bottom: 20px;
    position: relative;
    overflow: visible;

    .editor_panel_wrap {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;

      .editor_panel {
        border: 1px solid ${common.colorE8EBEC};
        border-radius: 20px;
        overflow: hidden;
        background: ${common.white};
        min-height: 240px;
        flex: 1;
        display: flex;
        flex-direction: column;
        &.has_error {
          border-color: #d32f2f;
        }
      }

      .editor_toolbar {
        height: 48px;
        display: flex;
        align-items: center;
        gap: 2px;
        padding: 0 10px;
        border-bottom: 1px solid ${common.colorE8EBEC};
        background: ${background.paper};
        flex-shrink: 0;

        .tool_text {
          font-size: 20px;
          color: ${common.color6D9DC5};
          min-width: 28px;
        }

        .tool_btn {
          color: ${common.color6D9DC5};
          width: 28px;
          height: 28px;
          border-radius: 6px;
          &:hover {
            background: ${common.colorAFECEF66};
          }
        }

        .tool_dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: ${common.color6D9DC5};
          margin: 0 6px;
          opacity: 0.75;
        }
      }

      .editor_textarea {
        width: 100%;
        min-height: 180px;
        flex: 1;
        border: 0;
        outline: 0;
        resize: vertical;
        padding: 14px 16px;
        font-size: 14px;
        line-height: 1.5;
        color: ${primary.main};
        font-family: inherit;
        background: ${common.white};

        &::placeholder {
          color: ${common.colorA7B4BF};
        }
      }

      .editor_helper {
        margin-top: 4px;
        font-size: 12px;
        color: ${common.color6D9DC5};
        &.error {
          color: #d32f2f;
        }
      }
    }

    /* Ensure date picker has proper container */
    .MuiGrid-item {
      position: relative;
      overflow: visible;
    }

    .update_btn_cont {
      display: flex;
      justify-content: center;

      .update_btn{
        max-width: 386px;
        margin: 0 auto;
      }
    }
  }
`;
