"use client";

import { common } from "@/theme/palette";
import { Autocomplete, Box, Icon, InputBase, styled } from "@mui/material";
import Image from "next/image";
import React from "react";

type ChatAutocompleteOption = string | { label?: string; id?: string | number; [key: string]: unknown };

interface ChatSecAutocompleteProps {
  options: ChatAutocompleteOption[];
  placeholder?: string;
  onChange?: (event: React.SyntheticEvent, value: ChatAutocompleteOption | null) => void;
  value?: ChatAutocompleteOption | null;
  withBorder?: boolean;
}

const ChatInputAutocomplete = styled(InputBase)(() => ({
//   paddingLeft: "28px",
  backgroundColor: `${common.colorF7F9FB}`,
  borderRadius: "8px",
  width: "100%",
  height: "36px",
  padding: "8px 28px", 
  boxSizing: "border-box", 
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

const ChatSecSearch: React.FC<ChatSecAutocompleteProps> = ({
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
        getOptionLabel={(option) => {
          if (typeof option === "string") return option
          if (option && typeof option === "object" && "label" in option && typeof option.label === "string") {
            return option.label
          }
          return ""
        }}
        isOptionEqualToValue={(option, selectedValue) => {
          if (typeof option === "string" || typeof selectedValue === "string") {
            return option === selectedValue
          }

          if (
            option &&
            selectedValue &&
            typeof option === "object" &&
            typeof selectedValue === "object" &&
            "id" in option &&
            "id" in selectedValue
          ) {
            return option.id === selectedValue.id
          }

          return option === selectedValue
        }}
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
            <ChatInputAutocomplete
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

export default ChatSecSearch;


