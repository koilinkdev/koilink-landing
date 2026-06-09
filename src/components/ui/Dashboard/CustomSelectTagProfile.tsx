"use client";
import React, { FC } from "react";
import {
    Box,
    MenuItem,
    InputLabel,
    Select,
    SelectChangeEvent,
    styled,
    Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { common, primary, text } from "@/theme/palette";


export const StyledLabel = styled(InputLabel, {
    shouldForwardProp: (prop) => prop !== 'showAsterisk',
})<{ showAsterisk?: boolean }>(({ showAsterisk }) => ({
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: 600,
    color: primary.main,
    "&::after": showAsterisk
        ? {
            content: '" *"',
            color: "#FE6B6B",
            marginLeft: "4px",
            fontWeight: 500,
        }
        : {},
}));

const StyledSelect = styled(Select)(({}) => ({
    width: "100%",
    borderRadius: "8px",
    backgroundColor: common.white,
    fontSize: "14px",
    fontWeight: 400,
    color: text.primary,
    
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: common.colorE8EBEC,
        borderRadius: "8px",
    },
    
    "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: primary.main,
    },
    
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: primary.main,
        borderWidth: 2,
    },
    
    "& .MuiSelect-select": {
        padding: "12px 12px",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        minHeight: "unset",
        paddingRight: "40px !important",
    },
    
    "& .MuiSelect-icon": {
        color: common.color6D9DC5,
        right: "12px",
        fontSize: "16px",
    },
    
   
    "& .MuiSelect-select.MuiSelect-select": {
        "&[aria-expanded='false']": {
            "&:empty::before": {
                content: "attr(data-placeholder)",
                color: common.colorA7B4BF,
                opacity: 1,
            }
        }
    }
}));

const StyledMenuItem = styled(MenuItem)(({ }) => ({
    fontSize: "14px",
    color: text.primary,
   
}));


const PlaceholderMenuItem = styled(MenuItem)(({}) => ({
    fontSize: "14px",
    color: `${common.colorA7B4BF} !important`,
    "&:hover": {
        backgroundColor: "transparent",
    },
    "&.Mui-selected": {
        backgroundColor: "transparent",
        "&:hover": {
            backgroundColor: "transparent",
        },
    },
    cursor: "default",
    pointerEvents: "none",
}));

interface CustomSelectProfileProps {
    label?: string;
    value: string;
    onChange: (event: SelectChangeEvent<string>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    showAsterisk?: boolean;
    error?: boolean;
    helperText?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    sx?: object;
}

const CustomSelectProfile: FC<CustomSelectProfileProps> = ({
    label,
    value,
    onChange,
    onBlur,
    options,
    placeholder = "Select your preferences",
    showAsterisk = false,
    error = false,
    helperText = "",
    disabled = false,
    fullWidth = true,
    sx = {},
}) => {
    return (
        <Box sx={sx}>
            {label && (
                <StyledLabel showAsterisk={showAsterisk}>
                    {label}
                </StyledLabel>
            )}
            <StyledSelect
                value={value || ""}
                onChange={onChange as (event: SelectChangeEvent<unknown>, child: React.ReactNode) => void}
                onBlur={onBlur}
                displayEmpty
                disabled={disabled}
                fullWidth={fullWidth}
                IconComponent={KeyboardArrowDownIcon}
                error={error}
                renderValue={(selected): React.ReactNode => {
                    if (!selected || selected === "") {
                        return (
                            <Typography variant='caption' sx={{ color: common.colorA7B4BF, fontSize: "14px" }}>
                                {placeholder}
                            </Typography>
                        );
                    }
                    const selectedOption = options.find(option => option.value === selected);
                    return selectedOption ? selectedOption.label : String(selected);
                }}
            >
                
                <PlaceholderMenuItem value="" disabled style={{ display: 'none' }}>
                    {placeholder}
                </PlaceholderMenuItem>
                
                {options.map((option) => (
                    <StyledMenuItem key={option.value} value={option.value}>
                        {option.label}
                    </StyledMenuItem>
                ))}
            </StyledSelect>
            {helperText && (
                <Box 
                    sx={{ 
                        fontSize: "12px", 
                        color: error ? "error.main" : text.primary,
                        marginTop: "4px",
                        marginLeft: 0,
                    }}
                >
                    {helperText}
                </Box>
            )}
        </Box>
    );
};

export default CustomSelectProfile;