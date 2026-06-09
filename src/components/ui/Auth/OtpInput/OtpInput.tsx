"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { OutlinedInput, styled, Stack, Box } from "@mui/material";
import { primary, common } from "@/theme/palette";



const OtpInput = styled(OutlinedInput, {
  shouldForwardProp: (prop) => prop !== "hasValue",
})<{ hasValue?: boolean }>(({ theme, hasValue }) => ({
  width: 50,
  height: 50,
  minWidth:50,
  borderRadius: "50%",
  textAlign: "center",
  fontSize: "16px",
  fontWeight: 600,
  padding: "13px",
  color: hasValue ? primary.main : theme.palette.text.primary,
  backgroundColor: common.white,
  position: "relative",
  boxShadow: hasValue ? "none" : "0px 0px 4px rgba(109, 157, 197, 0.25)",
  
  "& .MuiOutlinedInput-input": {
    textAlign: "center",
    padding: 0,
    "&::placeholder": {
      color:primary.main,
      opacity:1,
      lineHeight:2,
      fontSize:"15px",
     
    },
  },
  "& fieldset": {
   borderColor: hasValue ? "transparent" : common.colorA7B4BF,
  borderWidth: hasValue ? 0 : 1.5,
  },
  "&:hover fieldset": {
    borderColor: hasValue ? common.white : primary.main,
    borderWidth: hasValue ? 0 : 1.5,
  },
  "&.Mui-focused fieldset": {
    borderColor: hasValue ? "none" : primary.main,
    borderWidth: hasValue ? 0 : 2,
  },
  "&:hover": {
    backgroundColor: hasValue ? common.white : undefined,
  },
  "&.Mui-focused": {
    backgroundColor: hasValue ? common.white : undefined,
  },

   [theme.breakpoints.down("lg")]: {
    width: 40,
    height: 40,
    minWidth: 40,
    padding: "8px", 
    fontSize: "14px",
  },
}));

const DashSeparator = styled(Box)(({  }) => ({
  width: 11,
  height: 2,
  borderRadius:5,
  backgroundColor: common.color6D9DC5,
  alignSelf: "center",
  margin: "0 8px",
}));

type OtpFieldProps = {
  value?: string;
  onChange?: (value: string) => void;
  length?: number;
};

export default function OtpField({ value, onChange, length = 6 }: OtpFieldProps) {
  const isControlled = typeof value === "string";
  const normalizedValue = useMemo(() => (value ?? "").slice(0, length), [length, value]);

  const [internalOtp, setInternalOtp] = useState<string[]>(() =>
    Array.from({ length }, () => "")
  );

  const otp = isControlled
    ? Array.from({ length }, (_, index) => normalizedValue[index] ?? "")
    : internalOtp;

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isControlled && internalOtp.length !== length) {
      setInternalOtp(Array.from({ length }, () => ""));
    }
  }, [internalOtp.length, isControlled, length]);

  const syncOtp = (nextOtp: string[]) => {
    if (!isControlled) {
      setInternalOtp(nextOtp);
    }
    if (onChange) {
      onChange(nextOtp.join(""));
    }
  };

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/[^0-9]/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    syncOtp(newOtp);

    if (digit && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        syncOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        syncOtp(newOtp);
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");

    if (pasteData) {
      const newOtp = [...otp];
      const startIndex = inputsRef.current.findIndex(ref => ref === e.target);

      for (let i = 0; i < Math.min(pasteData.length, otp.length - startIndex); i++) {
        newOtp[startIndex + i] = pasteData[i];
      }

      syncOtp(newOtp);

      const nextIndex = Math.min(startIndex + pasteData.length, otp.length - 1);
      inputsRef.current[nextIndex]?.focus();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} py={2.5}>
      {otp.map((digit, index) => (
        <React.Fragment key={index}>
          <OtpInput
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            onFocus={handleFocus}
            hasValue={digit !== ""}
            placeholder="-"
            inputRef={(el) => (inputsRef.current[index] = el)}
            inputProps={{
              maxLength: 1,
              inputMode: "numeric",
              pattern: "[0-9]*"
            }}
          />
          {index === 2 && <DashSeparator />}
        </React.Fragment>
      ))}
    </Stack>
  );
}

