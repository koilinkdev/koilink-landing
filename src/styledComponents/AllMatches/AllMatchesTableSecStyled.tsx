"use client"

import { Box, styled } from "@mui/material";
import { background, common, primary, text } from "@/theme/palette";

const toolbarActionHeight = "40px";
const toolbarControlHeight = toolbarActionHeight;
const compactFontSize = "12px";
const toolbarInputBorderColor = primary.main;
const toolbarPlaceholderColor = primary.main;
const toolbarLabelColor = primary.main;
const toolbarValueColor = primary.main;

export const AllMatchesTableSecStyled = styled(Box)`
  width: 100%;
  background-color: ${background.paper};
  padding: 20px 0 0;
  border-radius: 16px;
  overflow: hidden;

  .table_inp_btn_cont {
    padding: 0 24px;
    margin-bottom: 24px;
    gap: 20px;

    .searchbar_wrapper {
      flex: 0 0 226px;
      width: 226px;
      min-width: 226px;
      max-width: 226px;

      .MuiOutlinedInput-root {
        height: ${toolbarControlHeight};
        border-radius: 8px;
        background-color: ${background.paper};
        color: ${toolbarValueColor};
        font-size: ${compactFontSize};

        fieldset {
          border-color: ${toolbarInputBorderColor};
        }

        &:hover fieldset,
        &.Mui-focused fieldset {
          border-color: ${toolbarInputBorderColor};
          border-width: 1px;
        }
      }

      .MuiInputBase-input {
        height: ${toolbarControlHeight};
        padding-top: 0;
        padding-bottom: 0;
        font-size: ${compactFontSize};
        font-weight: 400;
        line-height: ${toolbarControlHeight};
        color: ${toolbarValueColor};

        &::placeholder {
          color: ${toolbarPlaceholderColor};
          opacity: 1;
        }
      }

      .MuiInputAdornment-root {
        margin-left: 4px;
        margin-right: 8px;
        color: ${toolbarLabelColor};

        .MuiSvgIcon-root {
          font-size: 20px;
        }
      }
    }

    .sort_select_wrapper {
      flex: 0 0 202px;
      width: 202px;
      min-width: 202px;
      max-width: 202px;

      .MuiInputLabel-root {
        padding: 0 4px;
        background-color: ${background.paper};
        color: ${toolbarLabelColor};
        font-size: ${compactFontSize};
        font-weight: 400;
        line-height: 1;
        transform: translate(14px, -7px) scale(1);

        &.Mui-focused {
          color: ${toolbarLabelColor};
        }
      }

      .MuiOutlinedInput-root {
        height: ${toolbarControlHeight};
        border-radius: 8px;
        background-color: ${background.paper};
        color: ${toolbarValueColor};
        font-size: ${compactFontSize};
        font-weight: 400;

        fieldset {
          border-color: ${toolbarInputBorderColor};
        }

        &:hover fieldset,
        &.Mui-focused fieldset {
          border-color: ${toolbarInputBorderColor};
          border-width: 1px;
        }
      }

      .MuiSelect-select {
        display: flex;
        align-items: center;
        height: ${toolbarControlHeight};
        min-height: ${toolbarControlHeight};
        padding: 0 40px 0 16px !important;
        color: ${toolbarValueColor};
        font-size: ${compactFontSize};
        font-weight: 400;
        line-height: ${toolbarControlHeight};
        box-sizing: border-box;
      }

      .MuiSelect-icon {
        color: ${toolbarLabelColor};
        font-size: 20px;
        right: 12px;
      }
    }

    .filter_button_wrapper {
      position: relative;
      flex: 0 0 154px;
      width: 154px;
      min-width: 154px;
      max-width: 154px;
      display: flex;
      align-items: center;

      .MuiButton-root {
        height: ${toolbarActionHeight};
        min-height: ${toolbarActionHeight};
        padding: 0 11px;
        border-color: ${primary.main};
        border-radius: 8px;
        color: ${primary.main};
        background-color: ${background.paper};
        font-size: ${compactFontSize};
        font-weight: 400;

        &:hover {
          border-color: ${primary.main};
          background-color: ${background.paper};
        }
      }

      .filter-content {
        height: ${toolbarActionHeight};
        align-items: center;

        p {
          min-width: 80px;
          font-size: ${compactFontSize};
          font-weight: 400;
          line-height: ${toolbarActionHeight};
          color: ${primary.main};
        }

        img {
          width: 20px;
          height: 20px;
        }
      }
    }

    .active_filter_badge {
      position: absolute;
      top: -6px;
      right: -6px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background-color: ${primary.main};
      color: ${common.white};
      font-size: 10px;
      font-weight: 700;
      pointer-events: none;
    }
  }

  .table_shell {
    width: 100%;
  }

  .table_paper {
    width: 100%;
    margin-bottom: 16px;
    box-shadow: none;
    background-color: ${background.paper};
  }

  .table_container {
    max-height: 600px;
  }

  .matches_table {
    width: 100%;
    table-layout: fixed;

    .column_id {
      width: 11%;
    }

    .column_name {
      width: 17%;
    }

    .column_companyName {
      width: 17%;
    }

    .column_address {
      width: 31%;
    }

    .column_userType {
      width: 10%;
    }

    .action_column {
      width: 14%;
    }

    .MuiTableHead-root {
      .MuiTableCell-root {
        padding: 14px 24px;
        border-bottom: 1px solid ${common.color6D9DC58F};
        background-color: ${background.paper};
        color: ${primary.main};
        font-size: ${compactFontSize};
        font-weight: 700;
        line-height: 18px;
        letter-spacing: 0.06em;
      }

      .MuiTableSortLabel-root {
        font-size: ${compactFontSize};
        color: ${primary.main};

        &:hover,
        &.Mui-active {
          color: ${primary.main};
        }

        .MuiTableSortLabel-icon {
          font-size: 16px;
          color: ${primary.main} !important;
        }
      }
    }

    .MuiTableBody-root {
      .MuiTableCell-root {
        padding: 15px 24px;
        border-bottom: 1px solid ${common.colorE8EBEC};
        color: ${common.color6D9DC5};
        font-size: ${compactFontSize};
        font-weight: 400;
        line-height: 18px;
      }
    }
  }

  .MuiTablePagination-root {
    color: ${common.color6D9DC5};

    .MuiTablePagination-toolbar,
    .MuiTablePagination-selectLabel,
    .MuiTablePagination-displayedRows,
    .MuiTablePagination-select {
      font-size: ${compactFontSize};
      color: ${common.color6D9DC5};
    }

    .MuiTablePagination-actions {
      .MuiIconButton-root {
        color: ${common.colorA7B4BF};
      }
    }
  }

  .match_table_row {
    transition: background-color 0.2s ease;

    &:hover {
      background-color: rgba(175, 236, 239, 0.14);

      .copy-icon {
        visibility: visible;
      }
    }
  }

  .loading_cell {
    padding-top: 40px !important;
    padding-bottom: 40px !important;
  }

  .empty_state_text {
    padding: 32px 16px;
    text-align: center;
    color: rgba(109, 157, 197, 0.92);

    &.is_error {
      color: ${common.colorA41010};
    }
  }

  .match_id_text {
    font-family: monospace;
    font-size: ${compactFontSize};
    color: ${common.color6D9DC5};
  }

  .candidate_info,
  .location_info {
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .candidate_avatar {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    font-size: 10px;
    font-weight: 600;
    color: ${common.white};

    &.fallback_avatar {
      background-color: ${primary.main};
    }
  }

  .copy-icon {
    margin-left: 8px;
    padding: 0;
    color: inherit;
    visibility: hidden;
    border-radius: 0;
    background-color: transparent;

    &:hover {
      background-color: transparent;
      color: ${primary.main};
    }

    .MuiSvgIcon-root {
      font-size: 14px;
    }
  }

  .show_more_button {
    min-width: 90px;
    height: 30px;
    border-radius: 8px;
    border-color: ${primary.main};
    color: ${primary.main};
    background-color: ${background.paper};
    font-size: 12px;
    font-weight: 400;
    letter-spacing: normal;
    text-transform: none;

    &:hover {
      border-color: ${primary.main};
      color: ${primary.main};
      background-color: ${background.paper};
    }
  }

  @media (max-width: 899px) {
    .table_inp_btn_cont {
      padding: 0 20px;

      .searchbar_wrapper,
      .sort_select_wrapper,
      .filter_button_wrapper {
        flex-basis: auto;
        max-width: none;
        width: 100%;
        min-width: 0;
      }
    }

    .matches_table {
      .MuiTableHead-root .MuiTableCell-root,
      .MuiTableBody-root .MuiTableCell-root {
        padding-left: 18px;
        padding-right: 18px;
      }
    }
  }
`

export const MatchedCandidateFilterFormStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;

  .matched_filter_modal_content {
    padding-top: 8px;
    overflow-y: auto;
    flex: 1;
    min-height: 0;
  }

  .matched_filter_modal_actions {
    padding: 20px 30px;
  }

  .filter_chip_row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  }

  .MuiInputLabel-root {
    font-size: 12px;
    line-height: 18px;
  }

  .MuiChip-root {
    height: 28px;
    font-size: 12px;
    border-color: ${common.colorD5D7DA};

    &.MuiChip-colorPrimary {
      border-color: ${primary.main};
    }
  }

  .filter_helper_text {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    line-height: 18px;
    color: ${text.secondary};
  }

  .filter_switch_title {
    font-size: 12px;
    line-height: 18px;
    font-weight: 700;
    color: ${text.primary};
  }

  .location_grid {
    margin-top: 4px;

    .MuiOutlinedInput-root {
      height: 40px;
      border-radius: 8px;
      font-size: 12px;

      fieldset {
        border-color: ${common.colorD5D7DA};
      }

      &:hover fieldset,
      &.Mui-focused fieldset {
        border-color: ${primary.main};
        border-width: 1px;
      }
    }

    .MuiInputBase-input {
      font-size: 12px;
      line-height: 18px;
    }
  }

  .matched_filter_modal_actions {
    .MuiButton-root {
      min-height: 40px;
      max-height: 40px;
      padding: 8px 20px;
      font-size: 12px;
      line-height: 18px;
    }
  }
`

