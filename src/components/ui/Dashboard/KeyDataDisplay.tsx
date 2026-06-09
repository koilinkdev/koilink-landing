"use client";

import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { common, primary } from "@/theme/palette";
import { getKeyDataColumnLabels, getKeyDataFieldLabel, KeyDataEntry } from "@/lib/keyData";

type KeyDataDisplayProps = {
  role?: string;
  items: KeyDataEntry[];
  emptyMessage?: string;
};

const KeyDataDisplay = ({
  role,
  items,
  emptyMessage = "No key data added yet.",
}: KeyDataDisplayProps) => {
  const columnLabels = getKeyDataColumnLabels(role);

  if (items.length === 0) {
    return (
      <Typography variant="caption" sx={{ color: common.color6D9DC5 }}>
        {emptyMessage}
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5}>
      {items.map((item, index) => {
        const sections = [
          { label: columnLabels.investor, value: item.investor },
          { label: columnLabels.company, value: item.company },
        ].filter((section) => section.value.trim().length > 0);

        return (
          <Box
            key={`${item.field || "general"}-${index}`}
            sx={{
              p: { xs: 1.5, sm: 2 },
              borderRadius: "16px",
              border: `1px solid ${common.colorE8EBEC}`,
              backgroundColor: common.white,
            }}
          >
            <Typography
              sx={{
                mb: 1.25,
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: primary.main,
              }}
            >
              {getKeyDataFieldLabel(item.field, role)}
            </Typography>

            <Stack spacing={1.25}>
              {sections.map((section) => (
                <Box key={section.label}>
                  <Typography
                    sx={{
                      mb: 0.4,
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: common.color6D9DC5,
                    }}
                  >
                    {section.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      lineHeight: 1.6,
                      color: common.color31445A,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {section.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
};

export default KeyDataDisplay;
