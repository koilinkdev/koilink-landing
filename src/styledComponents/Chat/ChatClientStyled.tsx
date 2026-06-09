import { Box, styled } from "@mui/material";
import { background, common, primary } from "@/theme/palette";

export const ChatClientStyled = styled(Box)`
  height: 100%;
  overflow: hidden;

  .chatClient_row {
    height: 100%;
  }

  .left_cont {
    transition: all 0.3s ease;
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;

    @media (max-width: 1199px) {
      transform: translateX(-100%);
      height: 100vh;
      background-color: ${common.white};
      position: fixed;
      top: 0;
      left: -100px;
      z-index: 4;
      transition: transform 0.3s ease;
      padding: 20px;
      border-radius: 0;
      width: 100%;

      &.chatOpen {
        transform: translateX(0);
        left: 0px;
      }
    }

    @media (max-width: 899px) {
      width: 100%;
    }

    .left_cont_header {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .selected_user_cont {
        display: flex;
        flex: 1;
        justify-content: space-between;
        align-items: center;
        padding: 20px;

        .selected_user_cont_left_side {
          display: flex;
          justify-content: start;
          align-items: center;
          .mobile_header {
            display: none;

            @media (max-width: 1199px) {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-right: 16px;

              .mobile_close_btn {
                color: ${primary.main};
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0px;
              }
            }
          }
          .selected_user_avatar_wrap {
            width: 54px;
            height: 54px;
            flex-shrink: 0;
          }
          .selected_user_name_status_wrap {
            padding-left: 16px;
            flex-basis: calc(100% - 254px);
            display: flex;
            flex-direction: column;
            .selected_user_name {
              font-size: 18px;
              font-weight: 700;
              color: ${common.color0D1C2E};
              margin-bottom: 6px;
              line-height: 1;
              max-width: 300px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .selected_user_status {
              font-size: 16px;
              font-weight: 500;
              color: ${common.color2A8BF2};
              max-width: 250px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
        .menu_icons_cont {
          padding-left: 8px;
          min-width: 200px;
          display: flex;
          justify-content: flex-end;
          .menu_btn {
            padding: 14px;
            box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.03),
              0px 7px 25px rgba(42, 139, 242, 0.03),
              0px 5px 25px rgba(42, 139, 242, 0.07);
            &:last-of-type {
              margin-left: 12px;
            }
          }
          .video_call_btn {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 12px;
            color: ${common.color707c97};
            padding: 14px;
            box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.03),
              0px 7px 25px rgba(42, 139, 242, 0.03),
              0px 5px 25px rgba(42, 139, 242, 0.07);
          }
        }
      }
    }
    .left_cont_chatbody_cont {
      width: 100%;
      background-color: ${background.paper};
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;

      .chat-messages {
        position: relative;
        display: flex;
        flex-direction: column-reverse;
        overflow-y: auto;
        flex: 1;
        min-height: 0;
        padding: 20px 20px 0;

        scroll-behavior: auto;
        contain: layout style;
        will-change: scroll-position;
        -webkit-overflow-scrolling: touch;

        .message-container {
          display: flex;
          flex-direction: column;
          max-width: 100%;
          margin-bottom: 17px;

          &:last-of-type {
            margin-bottom: 0px;
          }
          .message-wrapper {
            display: flex;
            align-items: flex-start;

            &.own {
              justify-content: flex-end;
            }

            &.other {
              justify-content: flex-start;
            }

            .message-avatar {
              flex-shrink: 0;
            }

            .message-content {
              display: flex;
              flex-direction: column;
              max-width: 320px;
              position: relative;

              .message-bubble {
                border-radius: 10px;
                font-size: 14px;
                font-weight: 400;
                padding: 16px;
                position: relative;
                word-wrap: break-word;
                margin-bottom: 5px;

                transition: transform 0.15s ease;

                &.own {
                  background-color: ${primary.main};
                  color: ${common.white};
                  border-top-right-radius: 0;
                  align-self: flex-end;
                }

                &.other {
                  background-color: ${common.white};
                  color: ${common.color6D9DC5};
                  border-top-left-radius: 0;
                  align-self: flex-start;
                }
                &.image-bubble {
                  padding: 0px 12px;
                }
                &.video-bubble {
                  padding: 12px;
                }

                .message_images {
                  position: relative;
                  margin: 0;
                  padding: 12px 0px;
                  .img_item {
                    position: relative;
                  }

                  .message_image_asset {
                    width: 100%;
                    height: 127px;
                    object-fit: cover;
                    border-radius: 12px;
                    display: block;
                    background-color: rgba(109, 157, 197, 0.08);
                  }
                }

                .message_file {
                  display: flex;
                  align-items: center;
                  position: relative;
                  width: 100%;

                  .file_icon {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px 23px;
                    background-color: rgba(109, 157, 197, 0.07);
                    border-radius: 6px;
                    margin-right: 16px;
                    position: relative;
                  }
                  .download_icon {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: ${common.color707c97};
                    padding: 12px;
                  }

                  .file_info {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    color: ${common.color6D9DC5};
                    line-height: 1.6;
                    margin-right: 16px;
                    max-width: 160px;
                    min-width: 0;
                    flex: 1;

                    .file_name_text {
                      font-size: 16px;
                      font-weight: 500;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      width: 100%;
                    }

                    .file_size_text {
                      font-size: 14px;
                      font-weight: 500;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      width: 100%;
                    }
                  }
                }

                .message_video {
                  display: flex;
                  flex-direction: column;
                  gap: 12px;
                  width: 100%;
                  min-width: 220px;

                  .message_video_player {
                    width: 100%;
                    max-width: 280px;
                    border-radius: 12px;
                    background-color: #000;
                    display: block;
                  }

                  .message_video_placeholder {
                    width: 100%;
                    min-height: 164px;
                    border-radius: 12px;
                    background: rgba(109, 157, 197, 0.08);
                    color: ${common.color6D9DC5};
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }

                  .message_video_meta {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                  }
                }

                .attachment-caption {
                  margin-top: 12px;
                }
              }
              .message_time_wrap {
                flex-shrink: 0;
                display: flex;
                justify-content: flex-end;
                position: relative;
                align-items: center;

                .message_time {
                  font-size: 14px;
                  font-weight: 500;
                  text-align: right;
                  white-space: nowrap;
                  color: rgba(109, 157, 197, 0.56);
                }
                .message_status {
                  display: none;
                  &.own {
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    margin-left: 4px;
                    line-height: 1;
                  }

                  .message_status_icon {
                    display: block;
                  }

                  &.sent,
                  &.delivered {
                    color: rgba(109, 157, 197, 0.72);
                  }

                  &.read {
                    color: #34b7f1;
                  }

                  &.failed {
                    color: #e57373;
                  }
                }
              }
            }
          }
        }
        .no_chat_cont {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          color: ${common.color6D9DC5};
          font-style: italic;
        }
      }

   
      .chat_input_wrap {
        padding: 20px;
        position: relative;

        .attachment-preview-strip {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 8px;
          padding-bottom: 12px;

          .attachment-preview-item {
            position: relative;
            width: 72px;
            height: 72px;
            border-radius: 8px;
            flex-shrink: 0;
            background: rgba(109, 157, 197, 0.08);
            border: 1px solid rgba(109, 157, 197, 0.22);
            overflow: visible;

            .attachment-preview-image {
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 8px;
              display: block;
            }

            .attachment-preview-icon {
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              color: rgba(109, 157, 197, 0.7);
              border-radius: 8px;
            }

            .attachment-remove-btn {
              position: absolute;
              top: -7px;
              right: -7px;
              width: 20px;
              height: 20px;
              min-width: 20px;
              background: #ff4d4f;
              color: #fff;
              z-index: 2;
              padding: 0;
              border-radius: 50%;

              &:hover {
                background: #ff7875;
              }
            }
          }
        }

        .chat-input {
          position: relative;
          border: 1px solid rgba(109, 157, 197, 0.56);
          border-radius: 8px;
          background:${common.white};
          display: flex;
          align-items: center;
          padding:6px 7px;
        }

        .chat_textarea {
          width: 100%;
          resize: none;
          outline: none;
          border: none;
          background: transparent;
          font-size: 14px;
          line-height: 1.4;
          padding: 8px 10px 8px 8px;
          color: ${common.color6D9DC5};
          font-weight: 400;
          &::placeholder {
            color: ${common.color6D9DC5};
        
          }
        }

        .chat-input-icon {
          padding: 6px;
          background: linear-gradient(325.78deg, #109da4 14.76%, #7fded8 87.3%);
          color: ${common.white};
          flex-shrink: 0;

          &:hover {
            background: linear-gradient(
              325.78deg,
              #7fded8 14.76%,
              #109da4 87.3%
            );
          }

          &.Mui-disabled {
            background: rgba(109, 157, 197, 0.2);
            color: rgba(255, 255, 255, 0.8);
          }
        }

        .chat-input-actions {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          .smile_icon {
            margin-right: 8px;
            padding: 6px;
          }

          .send_btn {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 8px;
            background: linear-gradient(
              325.78deg,
              #109da4 14.76%,
              #7fded8 87.3%
            );
            &:hover {
              background: linear-gradient(
                325.78deg,
                #7fded8 14.76%,
                #109da4 87.3%
              );
            }

            img {
              box-shadow: 4px 4px 25px rgba(42, 139, 242, 0.15),
                2px 2px 25px rgba(42, 139, 242, 0.05),
                4px 6px 10px rgba(42, 139, 242, 0.15);
            }

            &.Mui-disabled {
              background: rgba(109, 157, 197, 0.2);
            }
          }
        }

         .emoji-picker-wrap {
            position: absolute;
            bottom: 100%;
            right: 0;
            margin-bottom: 8px;
            z-index: 1000;
          }
      }
    }
  }

  .right_cont {
    width: 442px;
    background-color: ${background.paper};
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    padding: 20px 0px;
    height: 100%;

    @media (max-width: 1199px) {
      width: 100%;
      max-width: 100%;
    }

    .right_cont_inner {
      height: 100%;
      display: flex;
      flex-direction: column;
      min-height: 0;
      position: relative;

      .rightbox_header_cont {
        margin-bottom: 12px;
        padding: 0 19px;
        flex-shrink: 0;
        /* position: relative;  */

        display: flex;
        justify-content: space-between;
        align-items: center;

        .rightbox_text_header {
          font-size: 14px;
          font-weight: 500;
          color: ${primary.main};
        }

        .total_chat_count_cont {
          font-size: 12px;
          font-weight: 400;
          color: ${common.white};
          background-color: ${primary.main};
          padding: 2px 9px;
          border-radius: 4px;
          text-align: center;
        }
      }

      .rightbox_search_wrap {
        flex-shrink: 0;
        margin-bottom: 12px;
        padding: 0px 15px;
      }

      .rightbox_allUsers_wrap {
        flex: 1;
        overflow-y: auto;
        min-height: 0;
        position: relative;
        padding: 0px 15px;
        scroll-behavior: auto;

        will-change: scroll-position;
        -webkit-overflow-scrolling: touch;

        .single_user_cont {
          padding: 10px 16px;
          border-bottom: 1px solid rgba(109, 157, 197, 0.24);
          display: flex;
          align-items: center;
          flex-shrink: 0;
          position: relative;
          cursor: pointer;
          transition: background-color 0.2s ease;
          &:hover {
            background-color: ${common.colorE3F5FF};
          }

          &.selected {
            background-color: ${primary.main};

            .chat_name,
            .chat_role,
            .message_text {
              color: ${common.white} !important;
            }
          }

          .avatar_wrap {
            width: 52px;
            height: 52px;
            flex-shrink: 0;
            position: relative;
          }

          .single_user_cont_rightSide {
            padding-left: 12px;
            display: flex;
            flex-direction: column;
            flex-basis: calc(100% - 52px);
            position: relative;
            min-width: 0;

            .user_name_role_cont {
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 100%;
              margin-bottom: 5px;
              position: relative;

              .chat_name {
                font-weight: 500;
                font-size: 14px;
                flex: 1;
                color: ${primary.main};
                line-height: 1.5;
                overflow: hidden;
                text-overflow: ellipsis;
                min-width: 0;
                white-space: nowrap;
                position: relative;
              }

              .chat_role {
                font-size: 12px;
                font-weight: 400;
                color: rgba(109, 157, 197, 0.56);
                flex-shrink: 0;
                padding-left: 16px;
                position: relative;
                max-width: 120px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }

            .message_text {
              font-size: 12px;
              font-weight: 500;
              color: rgba(109, 157, 197, 0.56);
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              position: relative;
            }
          }
        }
      }
    }
  }

  .chatOverlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
    opacity: 1;
    pointer-events: auto;
    transition: opacity 0.3s ease;
    z-index: 3;
    display: none;

    @media (max-width: 1199px) {
      &.chatOverlay_open {
        display: block;
      }
    }
  }
`;
