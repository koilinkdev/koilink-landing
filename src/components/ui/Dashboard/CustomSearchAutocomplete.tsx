"use client";

import { common } from "@/theme/palette";
import { Autocomplete, Box, Icon, InputBase, styled } from "@mui/material";
import Image from "next/image";
import React from "react";

type SearchAutocompleteOption = string | { label?: string; id?: string | number; [key: string]: unknown };

interface CustomSearchAutocompleteProps {
  options: SearchAutocompleteOption[];
  placeholder?: string;
  onChange?: (event: React.SyntheticEvent, value: SearchAutocompleteOption | null) => void;
  value?: SearchAutocompleteOption | null;
  withBorder?: boolean;
}

const CustomInputAutoComplete = styled(InputBase)(() => ({
  paddingLeft: "28px",
  backgroundColor: `${common.colorF7F9FB}`,
  borderRadius: "8px",
  width: "100%",
  input: {
    color: `${common.color6D9DC5}`,
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: 1,
    "::placeholder": {
      color: `${common.color6D9DC5}`,
      opacity: 1,
    },
  },
}));

const CustomSearchAutocomplete: React.FC<CustomSearchAutocompleteProps> = ({
  options,
  placeholder = "Search...",
  onChange,
  value,
  withBorder
}) => {
  return (
    <Box
      sx={
        withBorder
          ? {
            border: `1px solid ${common.color6D9DC5}`,
            borderRadius: "8px",
          }
          : {}
      }
    >
      <Autocomplete
        fullWidth
        disablePortal
        options={options}
        value={value}
        onChange={onChange}
        sx={{ width: "100%", position: "relative" }}
        popupIcon={null}
        slotProps={{
          paper: {
            sx: {
              fontSize: "14px",
            },
          },
        }}
        renderInput={(params) => (
          <Box sx={{ position: "relative", width: "100%" }}>
            <Icon
              sx={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Image
                src="/assets/icons/search-icon.svg"
                width={16}
                height={16}
                alt="search icon"
              />
            </Icon>
            <CustomInputAutoComplete
              ref={params.InputProps.ref}
              inputProps={params.inputProps}
              placeholder={placeholder}
            />
          </Box>
        )}
      />
    </Box>
  );

};

export default CustomSearchAutocomplete;


