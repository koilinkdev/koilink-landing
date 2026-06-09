import React, { useState, useEffect } from 'react';
import { Box, Slider, TextField, styled, Stack } from '@mui/material';
import { common, primary } from "@/theme/palette";

interface InvestmentSizeSliderProps {
    min?: number;
    max?: number;
    step?: number;
    value: [number, number];
    onChange?: (value: [number, number]) => void;
}

const StyledSlider = styled(Slider)(() => ({
    color: primary.main,
    height: 8,
    '& .MuiSlider-track': {
        border: 'none',
        backgroundColor: primary.main,
        height: 10,
    },
    '& .MuiSlider-rail': {
        backgroundColor: "rgba(109, 157, 197, 0.2)",
        height: 10,
        border: 'none',
    },
    '& .MuiSlider-thumb': {
        height: 24,
        width: 24,
        backgroundColor: primary.main,
        border: `4px solid ${common.white}`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    '& .MuiSlider-valueLabel': {
        lineHeight: 1.2,
        padding: '4px 8px',
        backgroundColor: primary.main,
        borderRadius: '4px',
    },
}));

const StyledTextField = styled(TextField)(() => ({
    width: '70px',
    '& .MuiOutlinedInput-root': {
        borderRadius: 8,
        height: 40,
        fontSize: "16px",
        fontWeight: 600,
        color: common.color6D9DC5,
        '& fieldset': {
            borderColor: common.color6D9DC5,
        },
        '&:hover fieldset': {
            borderColor: primary.main,
        },
        '&.Mui-focused fieldset': {
            borderColor: primary.main,
            borderWidth: 2,
        },
    },
    '& .MuiOutlinedInput-input': {
        fontSize: 14,
        textAlign: 'center',
        padding: '8px 4px',
    },
}));

export const CustomRangeSlider: React.FC<InvestmentSizeSliderProps> = ({
    min = 0,
    max = 100,
    step = 1,
    value,
    onChange,
}) => {
    const [inputValues, setInputValues] = useState<[string, string]>([
        (value[0] / 1_000_000).toString(),
        (value[1] / 1_000_000).toString()
    ]);

    const [isTyping, setIsTyping] = useState<[boolean, boolean]>([false, false]);

    useEffect(() => {
        if (!isTyping[0] && !isTyping[1]) {
            setInputValues([
                (value[0] / 1_000_000).toString(),
                (value[1] / 1_000_000).toString()
            ]);
        }
    }, [value, isTyping]);

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        void event;
        const newRange = newValue as [number, number];

        if (!isTyping[0] && !isTyping[1]) {
            setInputValues([
                (newRange[0] / 1_000_000).toString(),
                (newRange[1] / 1_000_000).toString()
            ]);
        }

        onChange?.(newRange);
    };

    const handleInputChange = (index: number) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const inputValue = event.target.value;
        
       
        if (inputValue.startsWith('-')) {
            return;
        }

        const newInputValues: [string, string] = [...inputValues];
        newInputValues[index] = inputValue;
        setInputValues(newInputValues);

        const newIsTyping: [boolean, boolean] = [...isTyping];
        newIsTyping[index] = true;
        setIsTyping(newIsTyping);

        const numericValue = parseFloat(inputValue);
        
       
        if (!isNaN(numericValue) && numericValue >= 0) {
            const newSliderValue = numericValue * 1_000_000;
            const newRange: [number, number] = [...value];

            if (index === 0) {
                
                newRange[0] = Math.max(min, Math.min(newSliderValue, value[1]));
            } else {
                
                newRange[1] = Math.min(max, Math.max(value[0], newSliderValue));
            }

            onChange?.(newRange);
        }
    };

    const handleInputBlur = (index: number) => () => {
        const newIsTyping: [boolean, boolean] = [...isTyping];
        newIsTyping[index] = false;
        setIsTyping(newIsTyping);

        const inputValue = inputValues[index];
        const numericValue = parseFloat(inputValue);

       
        if (isNaN(numericValue) || numericValue < 0 || inputValue === '' || inputValue.trim() === '') {
            const newInputValues: [string, string] = [...inputValues];
            newInputValues[index] = (value[index] / 1_000_000).toString();
            setInputValues(newInputValues);
        } else {
            
            let validatedValue = numericValue;
            const minInMillions = min / 1_000_000;
            const maxInMillions = max / 1_000_000;
            
            if (index === 0) {
                validatedValue = Math.max(minInMillions, Math.min(validatedValue, value[1] / 1_000_000));
            } else {
                validatedValue = Math.min(maxInMillions, Math.max(value[0] / 1_000_000, validatedValue));
            }

            const newInputValues: [string, string] = [...inputValues];
            newInputValues[index] = validatedValue.toString();
            setInputValues(newInputValues);
            
            
            if (validatedValue !== numericValue) {
                const newRange: [number, number] = [...value];
                newRange[index] = validatedValue * 1_000_000;
                onChange?.(newRange);
            }
        }
    };

    const handleInputFocus = (index: number) => () => {
        const newIsTyping: [boolean, boolean] = [...isTyping];
        newIsTyping[index] = true;
        setIsTyping(newIsTyping);
    };

    return (
        <Box sx={{ width: '100%', p: "0 12px" }}>
            <StyledSlider
                value={value}
                onChange={handleSliderChange}
                min={min}
                max={max}
                step={step}
                valueLabelDisplay="auto"
                valueLabelFormat={(val) =>
                    val >= 1_000_000 ? `$${(val / 1_000_000).toFixed(1)}M`
                        : val >= 1_000 ? `$${(val / 1000).toFixed(0)}K`
                            : `$${val.toString()}`
                }
            />

            <Stack direction="row" spacing={1.2} alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
                <StyledTextField
                    value={inputValues[0]}
                    onChange={handleInputChange(0)}
                    onBlur={handleInputBlur(0)}
                    onFocus={handleInputFocus(0)}
                    slotProps={{
                        input: {
                            inputProps: {
                                step: step / 1_000_000,
                                min: min / 1_000_000,
                                max: value[1] / 1_000_000,
                            }
                        },
                    }}
                    type="number"
                />
                <Box sx={{ width: '46px', height: '2px', backgroundColor: common.color6D9DC5, flexShrink: 0 }} />
                <StyledTextField
                    value={inputValues[1]}
                    onChange={handleInputChange(1)}
                    onBlur={handleInputBlur(1)}
                    onFocus={handleInputFocus(1)}
                    slotProps={{
                        input: {
                            inputProps: {
                                step: step / 1_000_000,
                                min: value[0] / 1_000_000,
                                max: max / 1_000_000,
                            }
                        },
                    }}
                    type="number"
                />
            </Stack>
        </Box>
    );
};
