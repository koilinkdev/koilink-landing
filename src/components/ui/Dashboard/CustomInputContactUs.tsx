
"use client";
import React, { FC } from 'react';
import {
  TextField,
  Box,
  styled,
  InputLabel
} from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import { common, primary, text} from '@/theme/palette';


const StyledInputContainer = styled(Box)(() => ({

}));


const StyledLabel = styled(InputLabel, {
  shouldForwardProp: (prop) => prop !== 'showAsterisk',
})<{ showAsterisk?: boolean }>(({ showAsterisk }) => ({
  display: "block",
  marginBottom: "10px",
  fontSize: "14px",
  fontWeight: 600,
  color: primary.main,
  '&::after': showAsterisk
    ? {
      content: '" *"',
      color: '#FE6B6B',
      marginLeft: "4px",
      fontWeight:500,
    }
    : {},
}));

const BaseTextField = (props: TextFieldProps) => <TextField {...props} />;

const StyledTextField = styled(BaseTextField, {
  shouldForwardProp: (prop) => prop !== 'error',
})(({ error, theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& fieldset': {
      borderColor: error ? theme.palette.error.main : common.colorE8EBEC,
    },
    '&:hover fieldset': {
      borderColor: error ? theme.palette.error.main : primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: error ? theme.palette.error.main : primary.main,
      borderWidth: 2,
    },
  },
  '& .MuiInputBase-input': {
    padding: '8px 8px 8px 12px',
    //  fontSize: '14px',
  },
  '& .MuiInputBase-inputMultiline': {
    padding: '8px 8px 8px 12px',
    //  fontSize: '14px',
  },
  '& input:-webkit-autofill': {
    boxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset !important`,
    WebkitTextFillColor: text.primary,
    transition: 'background-color 5000s ease-in-out 0s',
  },
  '& .MuiFormHelperText-root': {
    color: error ? theme.palette.error.main : text.primary,
    fontSize: '12px',
    marginLeft: 0,
    marginTop: '4px',
  },
}));


interface CustomInputProps {
  label?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium';
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  showAsterisk?: boolean;
  sx?: object;
  [key: string]: unknown;
}

const CustomInputContactUs: FC<CustomInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  error = false,
  helperText = '',
  fullWidth = true,
  variant = 'outlined',
  size = 'medium',
  disabled = false,
  multiline = false,
  showAsterisk = false,
  rows = 1,
  sx = {},
  ...otherProps
}) => {
  return (
    <StyledInputContainer sx={sx}>
      {label && (
        <StyledLabel
          showAsterisk={showAsterisk}
        >
          {label}
        </StyledLabel>
      )}
      <StyledTextField
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        required={required}
        error={error}
        helperText={helperText}
        fullWidth={fullWidth}
        variant={variant}
        size={size}
        disabled={disabled}
        multiline={multiline}
        rows={multiline ? rows : undefined}
        {...otherProps}
      />
    </StyledInputContainer>
  );
};

export default CustomInputContactUs;