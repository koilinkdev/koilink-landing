import { background, common, primary } from '@/theme/palette'
import { Box, styled } from '@mui/material'

export const ProfileClientStyled = styled(Box)`
  padding: 20px;
  background-color: ${background.paper};
  border-radius: 20px;

  /* ------------------------------------------------------------------ */
  /* Left column                                                         */
  /* ------------------------------------------------------------------ */
  .profileLeft {
    /* Keep the photo + actions in view while the long right column
       scrolls, so we never leave a tall empty gutter on the left. */
    @media (min-width: 900px) {
      position: sticky;
      top: 20px;
    }

    .profileLeftImgWrap {
      width: 100%;
      aspect-ratio: 1 / 1;
      margin: 0 0 18px;
      line-height: 0;
      overflow: hidden;
      border-radius: 24px;
      background-color: ${common.white};
      border: 1px solid ${common.colorE8EBEC};
      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
    }

    .profileSocialLinks {
      display: inline-flex;
      img {
        transition: 0.3s all ease;
      }
      &:hover img {
        transform: scale(1.12);
      }
    }

    .logout_modal_inner_wrap {
      .logout_icon_wrap {
        display: flex;
        width: 48px;
        height: 48px;
      }
      .logout_text {
        color: ${common.color515978};
        font-size: 15px;
        font-weight: 500;
      }
      .checkbox_inp_cont {
        .MuiSvgIcon-root {
          font-size: 28px;
        }
        .MuiFormControlLabel-label {
          color: ${common.color6D9DC5} !important;
          font-size: 14px;
          font-weight: 500;
        }
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /* Right column                                                        */
  /* ------------------------------------------------------------------ */
  .profileRight {
    display: flex;
    flex-direction: column;
    gap: 26px;

    /* --- Identity header --- */
    .profileIdentity {
      .identityName {
        font-size: 22px;
        font-weight: 600;
        line-height: 1.25;
        color: ${primary.main};
      }
      .identityRole {
        display: inline-block;
        margin-top: 2px;
        font-size: 14px;
        font-weight: 400;
        color: ${common.color6D9DC5};
      }
    }

    .banner_list_company {
      display: flex;
      flex-wrap: wrap;
      margin: 10px -7px 8px;
      li {
        width: auto;
        position: relative;
        padding: 0 7px;
        font-size: 14px;
        color: ${common.color6D9DC5};
        &::after {
          content: "\\2022";
          position: relative;
          right: -7px;
        }
        &:last-of-type::after {
          display: none;
        }
      }
    }

    .profile_rightSec_address_cont {
      align-items: flex-start;
      .banner_list_address li {
        width: auto;
        font-size: 14px;
        color: ${common.color6D9DC5};
        line-height: 1.5;
      }
    }

    /* --- Generic section --- */
    .profileSection {
      .sectionHeader {
        font-size: 16px;
        font-weight: 600;
        color: ${primary.main};
        margin-bottom: 12px;
      }
    }

    /* --- Stat cards grid (short scalar fields) --- */
    .statGrid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: 12px;
    }
    .statCard {
      padding: 14px 16px;
      border-radius: 14px;
      border: 1px solid ${common.colorE8EBEC};
      background-color: ${common.white};
      display: flex;
      flex-direction: column;
      gap: 4px;
      .statLabel {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: ${common.color6D9DC5};
      }
      .statValue {
        font-size: 14px;
        line-height: 1.45;
        font-weight: 500;
        color: ${common.color31445A};
        word-break: break-word;
      }
    }

    /* --- Full width panels (links + long-form fields) --- */
    .panelStack {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 12px;
    }
    .fieldPanel {
      padding: 14px 16px;
      border-radius: 14px;
      border: 1px solid ${common.colorE8EBEC};
      background-color: ${common.white};
      .panelLabel {
        display: block;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: ${common.color6D9DC5};
        margin-bottom: 6px;
      }
      .panelLink {
        font-size: 14px;
        font-weight: 500;
        color: ${primary.main};
        word-break: break-all;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
      .panelText {
        font-size: 13.5px;
        line-height: 1.6;
        color: ${common.color31445A};
        white-space: pre-line;
        word-break: break-word;
      }
    }

    /* --- About --- */
    .aboutList {
      max-width: 680px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      .aboutItem {
        display: flex;
        gap: 8px;
        align-items: flex-start;
        .aboutIndex {
          flex-shrink: 0;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.65;
          color: ${primary.main};
        }
        .aboutText {
          font-size: 13.5px;
          line-height: 1.65;
          font-weight: 400;
          color: ${common.color6D9DC5};
        }
      }
    }

    .emptyHint {
      font-size: 13px;
      color: ${common.color6D9DC5};
    }
  }
`
