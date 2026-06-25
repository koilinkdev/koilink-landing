"use client";
import React, { FC, useState } from 'react';
import {
    TextField,
    Box,
    styled,
    InputLabel,
    IconButton,
    InputAdornment,
    Typography,
    Select,
    SelectChangeEvent,
    MenuItem
} from '@mui/material';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import type { TextFieldProps } from '@mui/material';
import { common, primary, text } from '@/theme/palette';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { countries, Country } from '@/data/countries';

const StyledInputContainer = styled(Box)(() => ({}));

const StyledCountrySelect = styled(Select)(() => ({
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
    '& .MuiSelect-select': {
        padding: '8px 8px',
        paddingRight: '24px !important',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '14px',
        fontWeight: 600,
        color: primary.main,
        minWidth: '60px',
        // maxWidth: '80px',
    },
    '& .MuiSelect-icon': {
        fontSize: '14px',
        color: common.color6D9DC5,
        right: '4px',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
}));

const StyledLabel = styled(InputLabel, {
    shouldForwardProp: (prop) => prop !== 'showAsterisk',
})<{ showAsterisk?: boolean }>(({ showAsterisk }) => ({
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: 600,
    color: primary.main,
    '&::after': showAsterisk
        ? {
            content: '" *"',
            color: '#FE6B6B',
            marginLeft: "4px",
            fontWeight: 500,
        }
        : {},
}));


const BaseTextField = (props: TextFieldProps & { areAllSectionsEmpty?: boolean }) => (
    <TextField {...props} />
);

const StyledTextField = styled(BaseTextField, {
    shouldForwardProp: (prop) => prop !== 'error' &&
        prop !== 'isLocation' &&
        prop !== 'isPhone' &&
        prop !== 'isPasswordField' &&
        prop !== 'showPassword' &&
        prop !== 'sectionListRef' &&
        prop !== 'areAllSectionsEmpty'
})(({ error, theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: common.white,
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
        padding: '12px 12px',
        fontSize: '14px',
        lineHeight:1,
    },
    '& .MuiInputBase-inputMultiline': {
        padding: '12px 12px',
        fontSize: '14px',
    },
    '& input::placeholder': {
        fontSize: '14px',
        opacity: 1,
        color: common.colorA7B4BF
    },
    '& textarea::placeholder': {
        fontSize: '14px',
        opacity: 1,
        color: common.colorA7B4BF
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
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
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
    minRows?: number;
    maxRows?: number;
    sx?: object;
    showAsterisk?: boolean;
    isPhone?: boolean;
    isLocation?: boolean;
    isDate?: boolean;
    onLocationClick?: () => void;
    onCountryChange?: (country: Country) => void;
    selectedCountryCode?: string;
    [key: string]: unknown;
}

const CustomInputProfile: FC<CustomInputProps> = ({
    label,
    value,
    onChange,
    onBlur,
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
    minRows,
    maxRows,
    sx = {},
    isPhone = false,
    isLocation = false,
    isDate = false,
    onLocationClick,
    onCountryChange,
    selectedCountryCode = 'IN',
    ...otherProps

}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === 'password';
    
    // Initialize selected country based on the provided country code
    const [selectedCountry, setSelectedCountry] = useState<Country>(() => {
        return countries.find(c => c.code === selectedCountryCode) || countries[0];
    });
    
    const [dateValue, setDateValue] = useState<Dayjs | null>(() => {
        if (value) {
            // Try parsing different date formats
            const parsed = dayjs(value, ['DD/MM/YYYY', 'YYYY-MM-DD', 'DD MMMM YYYY'], true);
            return parsed.isValid() ? parsed : null;
        }
        return null;
    });

    // Sync dateValue with external value changes
    React.useEffect(() => {
        if (value) {
            const parsed = dayjs(value, ['DD/MM/YYYY', 'YYYY-MM-DD', 'DD MMMM YYYY'], true);
            if (parsed.isValid() && !dateValue?.isSame(parsed, 'day')) {
                setDateValue(parsed);
            }
        } else if (!value && dateValue) {
            setDateValue(null);
        }
    }, [value, dateValue]);

    const handleTogglePassword = React.useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numbersOnly = e.target.value.replace(/\D/g, "");

        const syntheticEvent = {
            target: {
                name: e.target.name,
                value: numbersOnly,
                type: e.target.type,
                checked: e.target.checked,
            },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(syntheticEvent);
    };

    const handleCountryChange = React.useCallback((event: SelectChangeEvent<unknown>) => {
        const countryCode = event.target.value as string;
        const country = countries.find(c => c.code === countryCode);
        if (country) {
            setSelectedCountry(country);
            // Call the parent's onCountryChange if provided
            if (onCountryChange) {
                onCountryChange(country);
            }
        }
    }, [onCountryChange]);



    const inputProps = React.useMemo(() => {
        const props: { startAdornment?: React.ReactNode; endAdornment?: React.ReactNode } = {};
        if (isPhone) {
            props.startAdornment = (
                <InputAdornment position="start" sx={{marginRight: 0}}>
                    <Box sx={{ display: 'flex', alignItems: 'center', borderRight: `1px solid ${common.colorE8EBEC}`, paddingRight: '12px',  }}>
                        <StyledCountrySelect
                            value={selectedCountry.code}
                            onChange={handleCountryChange}
                            variant="standard"
                            disableUnderline
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 300,
                                        overflowY: 'auto'
                                    }
                                }
                            }}
                        >
                            {countries.map((country) => (
                                <MenuItem key={country.code} value={country.code}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Typography sx={{ fontSize: '16px' }}>{country.flag}</Typography>
                                        <Typography sx={{ fontSize: '14px', fontWeight: 600, color: primary.main }}>
                                            {country.dialCode}
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            ))}
                        </StyledCountrySelect>
                    </Box>
                </InputAdornment>
            );
        }

        if (isPasswordField) {
            props.endAdornment = (
                <InputAdornment position="end">
                    <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                        size="small"
                        disableRipple
                        sx={{ p: 0 }}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <VisibilityOffOutlinedIcon sx={{ fontSize: 16, color: common.color6D9DC5 }} />
                        ) : (
                            <RemoveRedEyeOutlinedIcon sx={{ fontSize: 16, color: common.color6D9DC5 }} />
                        )}
                    </IconButton>
                </InputAdornment>
            );
        }
        if (isLocation) {
            props.endAdornment = (
                <InputAdornment position="end">
                    <IconButton
                        size="small"
                        onClick={onLocationClick}
                        disabled={!onLocationClick}
                        aria-label="Detect my location"
                        sx={{ p: 0.25 }}
                    >
                        <PlaceOutlinedIcon
                            sx={{
                                fontSize: 16,
                                color: onLocationClick ? primary.main : common.color6D9DC5,
                                cursor: onLocationClick ? "pointer" : "default",
                            }}
                        />
                    </IconButton>
                </InputAdornment>
            );
        }
        return Object.keys(props).length > 0 ? props : undefined;
    }, [isPhone, isPasswordField, showPassword, isLocation, onLocationClick, handleTogglePassword, selectedCountry, handleCountryChange]);


    return (
        <StyledInputContainer sx={sx}>
            {label && (
                <StyledLabel showAsterisk={showAsterisk}>
                    {label}
                </StyledLabel>
            )}

            {isDate ? (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={dateValue}
                        enableAccessibleFieldDOMStructure={false}
                        format="DD/MM/YYYY"
                        onChange={(newValue) => {
                            setDateValue(newValue);
                            onChange({
                                target: {
                                    value: newValue ? newValue.format('DD/MM/YYYY') : '',
                                }
                            } as React.ChangeEvent<HTMLInputElement>);
                        }}
                        slots={{
                            textField: (params) => (
                                <StyledTextField
                                    {...params}
                                    fullWidth={fullWidth}
                                    error={error}
                                    helperText={helperText}
                                    placeholder={placeholder}
                                />
                            ),
                            openPickerIcon: () => (
                                <CalendarTodayIcon
                                    sx={{
                                        fontSize: 16,
                                        color: common.color6D9DC5,
                                        p: 0,
                                    }}
                                />
                            )
                        }}
                        slotProps={{
                            popper: {
                                sx: {
                                    zIndex: 1300,
                                    '& .MuiPaper-root': {
                                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
                                        marginTop: '4px',
                                        borderRadius: '8px',
                                    },
                                },
                                placement: 'bottom-start',
                                modifiers: [
                                    {
                                        name: 'preventOverflow',
                                        enabled: true,
                                        options: {
                                            altAxis: true,
                                            altBoundary: true,
                                            tether: true,
                                            rootBoundary: 'viewport',
                                        },
                                    },
                                    {
                                        name: 'flip',
                                        enabled: true,
                                        options: {
                                            altBoundary: true,
                                            rootBoundary: 'viewport',
                                            padding: 8,
                                        },
                                    },
                                ],
                            },
                            textField: {
                                fullWidth: fullWidth,
                                variant: variant,
                                size: size,
                                disabled: disabled,
                                onBlur: onBlur,
                            },
                        }}
                    />
                </LocalizationProvider>
            ) : (
                <StyledTextField
                    value={value}
                    onChange={isPhone ? handlePhoneChange : onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    type={isPasswordField ? (showPassword ? 'text' : 'password') : type}
                    required={required}
                    error={error}
                    helperText={helperText}
                    fullWidth={fullWidth}
                    variant={variant}
                    size={size}
                    disabled={disabled}
                    multiline={multiline}
                    {...(multiline
                        ? (minRows != null || maxRows != null
                            ? { minRows, maxRows }
                            : { rows })
                        : {})}
                    slotProps={{
                        input: inputProps
                    }}
                    {...otherProps}
                />
            )}
        </StyledInputContainer>
    );
};

export default CustomInputProfile;
