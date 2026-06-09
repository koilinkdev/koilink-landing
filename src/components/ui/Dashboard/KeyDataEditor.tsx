"use client";

import React from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CustomInputProfile from "@/components/ui/Dashboard/CustomInputProfile";
import CustomSelectProfile, { StyledLabel } from "@/components/ui/Dashboard/CustomSelectTagProfile";
import { common, primary } from "@/theme/palette";
import { getKeyDataOptions, KEY_DATA_MAX_ITEMS, KeyDataEntry } from "@/lib/keyData";

export type KeyDataRowError = {
  field?: string;
  details?: string;
};

type KeyDataEditorProps = {
  role?: string;
  value: KeyDataEntry[];
  rowErrors?: KeyDataRowError[];
  sectionError?: string;
  showErrors?: boolean;
  onChange: (index: number, field: keyof KeyDataEntry, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onBlur: () => void;
};

const actionButtonStyles = {
  width: 44,
  height: 44,
  borderRadius: "12px",
  border: `1px solid ${common.colorE8EBEC}`,
  backgroundColor: common.white,
  color: primary.main,
  "&:hover": {
    backgroundColor: common.colorAFECEF66,
  },
};

const sectionStyles = {
  px: { xs: 1.5, sm: 2 },
  py: { xs: 1.25, sm: 1.5 },
};

const multilineFieldStyles = {
  "& .MuiOutlinedInput-root": {
    alignItems: "flex-start",
  },
  "& .MuiInputBase-inputMultiline": {
    padding: "10px 12px",
  },
  "& textarea": {
    minHeight: "64px !important",
  },
};

const KeyDataEditor = ({
  role,
  value,
  rowErrors = [],
  sectionError,
  showErrors = false,
  onChange,
  onAdd,
  onRemove,
  onBlur,
}: KeyDataEditorProps) => {
  const keyDataOptions = React.useMemo(() => getKeyDataOptions(role), [role]);

  return (
    <Box>
      <StyledLabel>Key Data</StyledLabel>

      <Stack spacing={2}>
        {value.map((item, index) => {
          const rowError = rowErrors[index];
          const canRemove = value.length > 1;
          const canAdd = index === value.length - 1 && value.length < KEY_DATA_MAX_ITEMS;

          return (
            <Box
              key={`key-data-row-${index}`}
              sx={{
                borderRadius: "18px",
                border: `1px solid ${
                  showErrors && (rowError?.field || rowError?.details)
                    ? "#d32f2f"
                    : common.colorE8EBEC
                }`,
                backgroundColor: common.white,
                overflow: "hidden",
              }}
            >
              <Box sx={sectionStyles}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  alignItems={{ xs: "stretch", sm: "flex-end" }}
                >
                  <Box sx={{ flex: 1 }}>
                    <CustomSelectProfile
                      label={`Field ${value.length > 1 ? index + 1 : ""}`.trim()}
                      value={item.field}
                      onChange={(event) => onChange(index, "field", String(event.target.value))}
                      onBlur={onBlur}
                      options={keyDataOptions}
                      placeholder="Select a field"
                      error={Boolean(showErrors && rowError?.field)}
                      helperText={showErrors ? rowError?.field : ""}
                    />
                  </Box>

                  <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
                    {canRemove && (
                      <IconButton
                        onClick={() => onRemove(index)}
                        aria-label={`Remove key data row ${index + 1}`}
                        sx={{
                          ...actionButtonStyles,
                          color: "#d32f2f",
                        }}
                      >
                        <DeleteOutlineRoundedIcon />
                      </IconButton>
                    )}
                    {canAdd && (
                      <IconButton
                        onClick={onAdd}
                        aria-label="Add another key data row"
                        sx={actionButtonStyles}
                      >
                        <AddRoundedIcon />
                      </IconButton>
                    )}
                  </Stack>
                </Stack>
              </Box>

              <Box sx={{ ...sectionStyles, borderTop: `1px solid ${common.colorE8EBEC}` }}>
                <CustomInputProfile
                  label="Investor"
                  value={item.investor}
                  onChange={(event) => onChange(index, "investor", event.target.value)}
                  onBlur={onBlur}
                  placeholder="Add the investor perspective"
                  multiline
                  rows={2}
                  sx={multilineFieldStyles}
                />
              </Box>

              <Box sx={{ ...sectionStyles, borderTop: `1px solid ${common.colorE8EBEC}` }}>
                <CustomInputProfile
                  label="Company"
                  value={item.company}
                  onChange={(event) => onChange(index, "company", event.target.value)}
                  onBlur={onBlur}
                  placeholder="Add the company perspective"
                  multiline
                  rows={2}
                  sx={multilineFieldStyles}
                />
              </Box>

              {showErrors && rowError?.details && (
                <Box sx={{ ...sectionStyles, pt: 0, borderTop: `1px solid ${common.colorE8EBEC}` }}>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      lineHeight: 1.5,
                      color: "#d32f2f",
                    }}
                  >
                    {rowError.details}
                  </Typography>
                </Box>
              )}
            </Box>
          );
        })}
      </Stack>

      <Typography
        sx={{
          mt: 1,
          fontSize: "12px",
          lineHeight: 1.5,
          color: common.color6D9DC5,
        }}
      >
        You can add up to {KEY_DATA_MAX_ITEMS} rows. Leave the section empty if you do not want to show key data yet.
      </Typography>

      {showErrors && sectionError && (
        <Typography
          sx={{
            mt: 0.5,
            fontSize: "12px",
            lineHeight: 1.5,
            color: "#d32f2f",
          }}
        >
          {sectionError}
        </Typography>
      )}
    </Box>
  );
};

export default KeyDataEditor;
