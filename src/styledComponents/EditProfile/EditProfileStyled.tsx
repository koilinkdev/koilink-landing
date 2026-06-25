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
        border-radius: 12px;
        overflow: hidden;
        background: ${common.white};
        flex: 1;
        display: flex;
        flex-direction: column;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;

        &:focus-within {
          border-color: ${primary.main};
          box-shadow: 0 0 0 1px ${primary.main};
        }
        &.has_error {
          border-color: #d32f2f;
          &:focus-within {
            box-shadow: 0 0 0 1px #d32f2f;
          }
        }
      }

      .editor_textarea {
        display: block;
        width: 100%;
        box-sizing: border-box;
        flex: 1;
        border: 0;
        outline: 0;
        resize: none;
        padding: 14px 16px;
        font-size: 14px;
        line-height: 1.6;
        color: ${primary.main};
        font-family: inherit;
        background: ${common.white};

        &::placeholder {
          color: ${common.colorA7B4BF};
        }
      }

      .editor_footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 8px 16px;
        border-top: 1px solid ${common.colorE8EBEC};
        background: ${background.paper};

        .editor_hint {
          font-size: 11.5px;
          line-height: 1.4;
          color: ${common.color6D9DC5};
        }

        .editor_count {
          flex-shrink: 0;
          font-size: 12px;
          font-weight: 500;
          color: ${common.color6D9DC5};
          &.near {
            color: #B7791F;
          }
          &.over {
            color: #d32f2f;
          }
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
