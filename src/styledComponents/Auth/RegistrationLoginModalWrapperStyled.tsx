import { Dialog, styled } from "@mui/material";
import { common, primary } from "@/theme/palette";

export const StyledRegistrationLoginModalWrapper = styled(Dialog)`
  height: 100vh;
  .MuiPaper-root {
    height: calc(100% - 90px);
    background-color: transparent;
    border-radius: 30px;
    box-shadow: none;
    padding: 47px 24px;

    overflow: initial;

    @media (max-width: 1199px) {
      height: calc(100% - 70px);
    }
    @media (max-width: 899px) {
      height: calc(100% - 150px);
    }

    .login_modal_close_btn {
      position: absolute;
      top: 65px;
      right: 46px;
      width: 34px;
      height: 34px;
      z-index: 10;
      background-color: ${primary.light};
      padding: 0;
      .MuiSvgIcon-root {
        color: ${common.color31445A};
      }

      &:hover {
        background-color: ${primary.main};
        .MuiSvgIcon-root {
          color: ${common.white};
        }
      }
    }
    .loginModal_tilted_wrap {
      width: 100%;
      height: 100%;
      border-radius: 30px;
      padding: 0 0;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      &::before {
        position: absolute;
        content: "";
        left: 0;
        bottom: 0;
        width: calc(100% + 7px);
        height: calc(100% + 13px);
        background: linear-gradient(232.36deg, #afecef 9.91%, #7fded8 90.09%);
        border-radius: 30px;
        transform: rotate(2.7deg);
      }

      .loginModal_inner_wrap {
        background-color: ${common.white};
        height: 100%;
        width: 100%;
        display: flex;
        position: relative;
        border-radius: 30px;
        box-shadow: 0px 0px 80px 8px rgba(0, 0, 0, 0.12);
        overflow: hidden;

        .login_left_cont {
          width: 50%;
          height: 100%;
          position: relative;
          overflow: hidden;
          border-top-left-radius: 30px;
          border-bottom-left-radius: 30px;
          top: 0;
          left: 0;
          bottom: 0;
          @media (max-width: 1199px) {
            display: none;
          }

          .left_image_wrap {
            width: 100%;
            height: 100%;
            position: absolute;
            transition: opacity 0.3s ease-in-out;

            img {
              object-fit: cover;
              object-position: top;
            }

            .overlay_wrap {
              position: absolute;
              bottom: 51px;
              left: 50%;
              transform: translateX(-50%);
              width: 406px;
              min-height: 142px;
              padding: 20px 20px 5px;
              border-radius: 30px 0px;
              display: flex;
              justify-content: center;
              align-items: center;
              text-align: center;
              background: rgba(255, 255, 255, 0.2);
              backdrop-filter: blur(30px);
              -webkit-backdrop-filter: blur(30px);

              .dotSwiper {
                .overlay_design {
                  .blur_text {
                    color: ${common.colorF8F8F8};
                    font-weight: 400;
                    font-size: 22px;
                    margin-bottom: 5px;
                  }
                  .blur_subtext {
                    font-weight: 400;
                    font-size: 22px;
                    color: ${common.colorF8F8F8};
                    margin-bottom: 50px;
                  }
                }
               
              }
            }
          }
        }
        .login_right_cont {
          width: 50%;
          height: 100%;
          padding: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: auto;
          position: relative;
          z-index: 1;

          @media (max-width: 1199px) {
            width: 100%;
          }

          .form_bg {
            position: absolute;
            background-size: contain;
            background-repeat: no-repeat;
            z-index: 0;
            pointer-events: none;

            &.top {
              top: 0;
              left: 0;
              width: 180px;
              height: 180px;
              background-position: top left;
              @media (max-width: 1199px) {
                height: 120px;
              }
              @media (max-width: 899px) {
                height: 100px;
              }
            }
            &.bottom {
              bottom: 0;
              right: 0;
              width: 180px;
              height: 180px;
              background-position: bottom right;

              @media (max-width: 1199px) {
                height: 100px;
              }
            }
          }

          .login_right_cont_form {
            width: 100%;
            height: auto;
            padding: 0 50px;
            max-height: calc(100% - 60px);
            overflow-y: auto;
            z-index: 1;
            max-width: 500px;

            @media (max-width: 1199px) {
              padding: 0 30px;
              max-width: 460px;
            }

            .rightSec_form_header_cont {
              margin-bottom: 8px;
              .rightSec_form_headerText {
                text-align: center;
                font-size: 24px;
                font-weight: 700;
                color: ${primary.main};
                margin-bottom: 10px;
              }
              .rightSec_form_headerSubtext {
                max-width: 386px;
                text-align: center;
                font-size: 16px;
                font-weight: 400;
                color: ${common.color6D9DC5};
                margin: 0 auto;
              }
            }
            .radio_group_cont {
              margin-bottom: 8px;
              display: flex;
              justify-content: start;
              .MuiRadioGroup-root {
                flex-direction: row;
                .MuiFormControlLabel-root {
                  .MuiFormControlLabel-label {
                    font-size: 14px;
                    font-weight: 400;
                    color: ${common.color6D9DC5};
                  }
                  .MuiRadio-root {
                    color: ${common.color6D9DC5};
                    &.Mui-checked {
                      color: ${primary.main};
                    }
                  }
                }
              }
            }
            .email_ph_input_cont {
              margin-bottom: 15px;
            }
            .password_input_cont {
              margin-bottom: 15px;
            }

            .checkbox_inp_cont_wrap {
              margin-bottom: 10px;
              .checkbox_inp_cont {
                .checkbox_text {
                  font-size: 12px;
                  font-weight: 400;
                  color: ${common.color6D9DC5};
                  .checkbox_link_text {
                    text-decoration: none;
                    color: ${primary.main};
                    font-weight: 500;
                    &:hover {
                      text-decoration: underline;
                    }
                  }
                }
              }
            }
            .btn_wrap {
              margin-bottom: 20px;
            }
            .footer_link_box {
              display: flex;
              align-items: center;
              justify-content: center;
              .footer_link_text {
                text-align: center;
                font-size: 14px;
                font-weight: 400;
                color: ${common.color6D9DC5};

                &.green {
                  color: ${primary.main};
                }
              }
            }
          }
        }

        /* onboarding styles  */
        .onboardingOuterWrap {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 80px 80px;

          @media (max-width: 899px) {
            padding: 0;
          }

          .onboardingFormpWrap {
            max-width: 800px;
            background-color: ${common.white};
            padding: 55px 54px;
            border-radius: 30px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 1;
            overflow: hidden; /* clip overflow, let inner handle scroll */

            @media (max-width: 1199px) {
              padding: 60px 30px;
            }
            @media (max-width: 899px) {
              padding: 50px 40px;
            }
            .onboarding_common_bg {
              position: absolute;
              display: flex;
              background-size: contain;
              background-repeat: no-repeat;
              z-index: -1;
              pointer-events: none;
              &.left {
                width: 145px;
                height: 189px;
                bottom: 0;
                left: 0;
              }
              &.right {
                width: 145px;
                height: 189px;
                bottom: 0;
                right: 0;
              }
            }

            .onboardingOneForm_icon_bg {
              position: absolute;
              display: flex;
              background-size: contain;
              background-position: center;
              background-repeat: no-repeat;
              z-index: -1;
              pointer-events: none;

              &.one {
                width: 23px;
                height: 23px;
                left: 63px;
                top: 32px;
              }
              &.two {
                width: 26px;
                height: 26px;
                top: 53px;
                right: 88px;
              }
              &.three {
                width: 34px;
                height: 31px;
                top: 28%;
                left: 15%;
                @media (max-width: 1199px) {
                  top: 25%;
                  left: 12%;
                }
                @media (max-width: 899px) {
                  top: 20%;
                }
              }
              &.four {
                width: 35px;
                height: 33px;
                top: 25%;
                right: 18%;
                @media (max-width: 1199px) {
                  top: 20%;
                }
                @media (max-width: 899px) {
                  top: 20%;
                  right: 13%;
                }
              }
            }
            .onboardingTwoForm_icon_bg {
              position: absolute;
              display: flex;
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat;
              pointer-events: none;
              &.first {
                top: 47px;
                left: 57px;
                width: 23px;
                height: 21px;
              }
              &.second {
                top: 20px;
                left: 52%;
                width: 37px;
                height: 33px;
              }
              &.third {
                top: 40px;
                right: 49px;
                width: 31px;
                height: 28px;
              }
            }

            .onboardingFormpInnerWrap {
              width: 100%;
              max-height: 100%;
              padding: 10px;
              overflow-y: auto;
              display: flex;

              .onboardingFormpInnerWrap_content {
                /* display: flex;
                align-items: center;
                justify-content: center; */
                height: 100%;
                overflow-y: auto;
              }

              .onboarding_form_headerText {
                text-align: center;
                font-size: 24px;
                font-weight: 700;
                color: ${primary.main};
                margin-bottom: 10px;
              }
              .onboarding_form_headerSubText {
                max-width: 386px;
                text-align: center;
                font-size: 16px;
                font-weight: 400;
                color: ${common.color6D9DC5};
                margin: 0 auto;
              }

              .onboardingBtn_wrap {
                display: flex;
                justify-content: center;
                max-width: 386px;
                margin: 0 auto;
              }
              .onboardingTwo_tab_container {
                max-width: 480px;
                margin: 0 auto;
                .MuiTabs-root {
                  margin-bottom: 40px;
                  .MuiTab-root {
                    text-transform: none;
                    font-weight: 500;
                    font-size: 16px;
                    color: ${common.color6D9DC5};
                    width: 50%;
                    border: 1px solid rgba(109, 157, 197, 0.2);
                    border-radius: 50px;
                    flex: 1;
                    margin-right: 10px;
                    padding: 20px 15px;
                    &:last-of-type {
                      margin-right: 0;
                    }

                    .tab_label_container {
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      .icon_cont {
                        display: flex;
                        width: auto;
                        height: auto;
                        margin-right: 18px;
                      }
                    }
                    &.Mui-selected {
                      background-color: ${primary.main};
                      color: ${common.white};

                      border: none;
                    }
                  }
                  .MuiTabs-indicator {
                    display: none;
                  }
                }

                .MuiTabPanel-root {
                  padding: 0;
                  max-width: 386px;
                  margin: 0 auto;
                }
              }
            }
          }
        }
      }
    }
  }
`;
