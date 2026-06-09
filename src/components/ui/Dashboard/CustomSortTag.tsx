"use client";

import React, { FC, useState } from "react";
import {
    Box,
    Typography,
    Select,
    MenuItem,
    SelectChangeEvent,
    styled,
} from "@mui/material";
import type { SelectProps } from "@mui/material";
import { common } from "@/theme/palette";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";


const StyledSortContainer = styled(Box)(() => ({
    display: "flex",
    alignItems: "center",
    backgroundColor: common.colorF7F9FB,
    borderRadius: "8px",
    height: "32px",
    paddingLeft: "6px",
    paddingRight: "6px",
    border: `1px solid ${common.color6D9DC5}`,
}));



const BaseSelect = (props: SelectProps<string>) => <Select {...props} />;

const StyledSelect = styled(BaseSelect)(() => ({
    backgroundColor: "transparent",
    fontSize: "12px",
    fontWeight: 500,
    color: common.color6D9DC5,
    minWidth: "96px",
     width: "100px",
    height: "32px",
    display: "flex",
  alignItems: "center",
    "& .MuiSelect-select": {
        padding: 0,
        paddingRight: 0,
        paddingLeft: "9px",
        height: "32px",
    },
    '& .MuiOutlinedInput-input': {
        paddingRight: "0px",
        display: "flex",
        alignItems: "center",
        height: "32px",
        boxSizing: "border-box",
    },
     "& .MuiSelect-icon": {
    top: "50%",
    transform: "translateY(-50%)",
  },
    "& fieldset": {
        border: "none",
    },
    "&:hover fieldset": {
        border: "none",
    },
    "&.Mui-focused fieldset": {
        border: "none",
    },
    "& svg": {
        color: common.color6D9DC5,
        fontSize: "18px",
    },
}));


const sortOptions = ["Newest", "Oldest", "A-Z", "Z-A"] as const;
type SortOption = (typeof sortOptions)[number];

const CustomSortTag: FC = () => {
    const [sortBy, setSortBy] = useState<SortOption>("Newest");

    const handleChange = (event: SelectChangeEvent) => {
        const value = event.target.value as SortOption;
        setSortBy(value);
    };

    return (
        <StyledSortContainer>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                    sx={{
                        fontSize: "12px",
                        fontWeight: 400,
                        color: common.color6D9DC5,
                        whiteSpace: "nowrap",
                        lineHeight: "32px",
                    }}
                >
                    Sort by:
                </Typography>
            </Box>

            <StyledSelect
                value={sortBy}
                onChange={handleChange}
                variant="outlined"
                // disableUnderline
                size="small"
                IconComponent={KeyboardArrowDownIcon}
            // MenuProps={{
            //     PaperProps: {
            //         sx: {
            //             minWidth: "160px", 
            //         },
            //     },
            // }}
            >
                {sortOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </StyledSelect>
        </StyledSortContainer>
    );
};

export default CustomSortTag;
