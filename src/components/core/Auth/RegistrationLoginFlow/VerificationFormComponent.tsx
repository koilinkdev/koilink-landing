"use client";
import React, { useState, useEffect } from "react";
import { Box,Typography } from "@mui/material";
import OtpInput from "@/components/ui/Auth/OtpInput/OtpInput";
import CustomTextButton from "@/components/ui/Auth/CustomTextButton";
import { CustomButtonRounded } from '@/components/ui/Dashboard/CustomButtonRounded';
interface VerificationFormProps {
  onVerified: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  targetLabel?: string;
  loading?: boolean;
  errorMessage?: string | null;
  infoMessage?: string | null;
}

const VerificationFormcomponent: React.FC<VerificationFormProps> = ({
  onVerified,
  onResend,
  targetLabel,
  loading = false,
  errorMessage,
  infoMessage,
}) => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [showResend, setShowResend] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowResend(true);
    }
  }, [timeLeft]);

  const handleSubmit = async () => {
    setLocalError(null);
    if (otpCode.length < 6) {
      setLocalError("Please enter the 6-digit OTP.");
      return;
    }
    await onVerified(otpCode);
  };

  const handleResend = async () => {
    setLocalError(null);
    await onResend();
    setTimeLeft(10);
    setShowResend(false);
  };

  return (
    <form>
      <Box className="rightSec_form_header_cont">
        <Typography variant="h4" className="rightSec_form_headerText">
          Verification Code
        </Typography>
        <Typography variant="body2" className="rightSec_form_headerSubtext">
          Please enter code we just sent to {targetLabel ?? "your registered contact"}
        </Typography>
      </Box>

      <Box>
        <OtpInput value={otpCode} onChange={setOtpCode} />
      </Box>

      {(localError || errorMessage) && (
        <Typography variant="body2" sx={{ color: "#d32f2f", mt: 1, textAlign: "left" }}>
          {localError || errorMessage}
        </Typography>
      )}

      {infoMessage && (
        <Typography variant="body2" sx={{ color: "#2e7d32", mt: 1, textAlign: "left" }}>
          {infoMessage}
        </Typography>
      )}

      <Box className="btn_wrap">
        <CustomButtonRounded
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
          isSubmitting={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </CustomButtonRounded>
      </Box>

      <Box className="footer_link_box">
        <Typography
          variant="body2"
          className="footer_link_text"
          sx={{ mr: 0.5 }}
        >
          Didn’t receive OTP?
        </Typography>

        {showResend ? (
          <CustomTextButton onClick={handleResend}>Resend</CustomTextButton>
        ) : (
          <Typography variant="body2" className="footer_link_text green">
            0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </Typography>
        )}
      </Box>
    </form>
  );
};

export default VerificationFormcomponent;
