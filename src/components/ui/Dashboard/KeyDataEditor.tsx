"use client";

import React from "react";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CustomInputProfile from "@/components/ui/Dashboard/CustomInputProfile";
import CustomSelectProfile, { StyledLabel } from "@/components/ui/Dashboard/CustomSelectTagProfile";
import { common, primary } from "@/theme/palette";
import {
  getKeyDataColumnLabels,
  getKeyDataOptions,
  KEY_DATA_MAX_ITEMS,
  KeyDataEntry,
} from "@/lib/keyData";

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
  width: 40,
  height: 40,
  borderRadius: "10px",
  border: `1px solid ${common.colorE8EBEC}`,
  backgroundColor: common.white,
  color: primary.main,
  "&:hover": {
    backgroundColor: common.colorAFECEF66,
  },
  "&.Mui-disabled": {
    borderColor: common.colorE5ECF6,
    color: common.colorA7B4BF,
  },
};

// Auto-grow textareas: start at two rows and expand with content instead of
// rendering a fixed, mostly-empty tall box for short one-line answers.
const multilineFieldStyles = {
  "& .MuiOutlinedInput-root": {
    alignItems: "flex-start",
  },
  "& .MuiInputBase-inputMultiline": {
    padding: "10px 12px",
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
  const columnLabels = React.useMemo(() => getKeyDataColumnLabels(role), [role]);
  const canAddMore = value.length < KEY_DATA_MAX_ITEMS;

  return (
    <Box>
      <StyledLabel>Key Data</StyledLabel>
      <Typography
        sx={{
          mt: -0.25,
          mb: 1.5,
          fontSize: "12px",
          lineHeight: 1.5,
          color: common.color6D9DC5,
        }}
      >
        Add quick snapshots that appear as a table on your profile. Pair each field with the
        investor and company perspective. You can add up to {KEY_DATA_MAX_ITEMS} rows.
      </Typography>

      <Stack spacing={1.5}>
        {value.map((item, index) => {
          const rowError = rowErrors[index];
          const hasRowError = Boolean(showErrors && (rowError?.field || rowError?.details));
          const canRemove = value.length > 1;

          return (
            <Box
              key={`key-data-row-${index}`}
              sx={{
                borderRadius: "16px",
                border: `1px solid ${hasRowError ? "#d32f2f" : common.colorE8EBEC}`,
                backgroundColor: common.white,
                p: { xs: 1.5, sm: 2 },
              }}
            >
              <Stack direction="row" spacing={1} alignItems="flex-end">
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <CustomSelectProfile
                    label={`Field ${index + 1}`}
                    value={item.field}
                    onChange={(event) => onChange(index, "field", String(event.target.value))}
                    onBlur={onBlur}
                    options={keyDataOptions}
                    placeholder="Select a field"
                    error={Boolean(showErrors && rowError?.field)}
                    helperText={showErrors ? rowError?.field : ""}
                  />
                </Box>

                <Tooltip title={canRemove ? "Remove row" : "Keep at least one row"}>
                  <span>
                    <IconButton
                      onClick={() => onRemove(index)}
                      disabled={!canRemove}
                      aria-label={`Remove key data row ${index + 1}`}
                      sx={{ ...actionButtonStyles, color: canRemove ? "#d32f2f" : common.colorA7B4BF }}
                    >
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ mt: 1.5 }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <CustomInputProfile
                    label={columnLabels.investor}
                    value={item.investor}
                    onChange={(event) => onChange(index, "investor", event.target.value)}
                    onBlur={onBlur}
                    placeholder="Add the investor perspective"
                    multiline
                    minRows={2}
                    maxRows={6}
                    sx={multilineFieldStyles}
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <CustomInputProfile
                    label={columnLabels.company}
                    value={item.company}
                    onChange={(event) => onChange(index, "company", event.target.value)}
                    onBlur={onBlur}
                    placeholder="Add the company perspective"
                    multiline
                    minRows={2}
                    maxRows={6}
                    sx={multilineFieldStyles}
                  />
                </Box>
              </Stack>

              {showErrors && rowError?.details && (
                <Typography sx={{ mt: 1, fontSize: "12px", lineHeight: 1.5, color: "#d32f2f" }}>
                  {rowError.details}
                </Typography>
              )}
            </Box>
          );
        })}
      </Stack>

      <Box sx={{ mt: 1.5 }}>
        <IconButton
          onClick={onAdd}
          disabled={!canAddMore}
          aria-label="Add another key data row"
          sx={{
            ...actionButtonStyles,
            width: "auto",
            px: 1.5,
            borderRadius: "10px",
            gap: 0.5,
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          <AddRoundedIcon fontSize="small" />
          <Box component="span" sx={{ fontSize: "14px" }}>Add row</Box>
        </IconButton>
      </Box>

      {showErrors && sectionError && (
        <Typography sx={{ mt: 1, fontSize: "12px", lineHeight: 1.5, color: "#d32f2f" }}>
          {sectionError}
        </Typography>
      )}
    </Box>
  );
};

export default KeyDataEditor;
