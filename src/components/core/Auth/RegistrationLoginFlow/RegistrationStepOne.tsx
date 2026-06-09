"use client";
import React from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
} from "@mui/material";
import CustomInputProfile from "@/components/ui/Dashboard/CustomInputProfile";
import ChechBoxIcon from "@/components/ui/icons/ChechBoxIcon";
import CheckBoxCheckedIcon from "@/components/ui/icons/CheckBoxCheckedIcon";
import { CustomButtonRounded } from '@/components/ui/Dashboard/CustomButtonRounded';
import Link from "next/link";
import CustomTextButton from "@/components/ui/Auth/CustomTextButton";
import { countries, type Country } from "@/data/countries";

type ContactType = "email" | "phone";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REQUIREMENTS_MESSAGE =
  "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";

interface RegistrationStepOneProps {
  onLoginClick: () => void;
  onSubmitSuccess: (payload: {
    email?: string;
    phone?: string;
    password: string;
  }) => Promise<void>;
  loading?: boolean;
  errorMessage?: string | null;
  infoMessage?: string | null;
}
const RegistrationStepOne: React.FC<RegistrationStepOneProps> = ({
  onLoginClick,
  onSubmitSuccess,
  loading = false,
  errorMessage,
  infoMessage,
}) => {
  const [contactType, setContactType] = React.useState<ContactType>("email");
  const [formData, setFormData] = React.useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
    agreeToTerms: false,
    keepSignedIn: false,
  });
  const [localError, setLocalError] = React.useState<string | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] =
    React.useState<string>("IN");
  const handleCountryChange = (country: Country) => {
    setSelectedCountryCode(country.code);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const getPhoneWithDialCode = React.useCallback(() => {
    const country = countries.find((item) => item.code === selectedCountryCode);
    const phoneNumber = formData.phone.trim().replace(/\D/g, "");
    if (!phoneNumber) return "";
    if (!country) return phoneNumber;
    return `${country.dialCode}${phoneNumber}`;
  }, [formData.phone, selectedCountryCode]);

  const handleSubmit = async () => {
    setLocalError(null);

    const email = formData.email.trim().toLowerCase();
    const phone = getPhoneWithDialCode();

    if (contactType === "email" && !email) {
      setLocalError("Email is required.");
      return;
    }

    if (contactType === "email" && !EMAIL_REGEX.test(email)) {
      setLocalError("Please enter a valid email address.");
      return;
    }

    if (contactType === "phone" && !phone) {
      setLocalError("Phone number is required.");
      return;
    }

    if (contactType === "phone" && formData.phone.trim().replace(/\D/g, "").length < 8) {
      setLocalError("Phone number must be at least 8 digits.");
      return;
    }

    const password = formData.password.trim();

    if (!password) {
      setLocalError("Password is required.");
      return;
    }

    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      setLocalError(PASSWORD_REQUIREMENTS_MESSAGE);
      return;
    }

    if (!formData.agreeToTerms) {
      setLocalError("Please agree to the Terms & Conditions and Privacy.");
      return;
    }

    await onSubmitSuccess({
      ...(contactType === "email" ? { email } : { phone }),
      password,
    });
  };
  const handleContactTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactType(e.target.value as ContactType);
  };

  return (
    <form>
      <Box className="rightSec_form_header_cont">
        <Typography variant="h4" className="rightSec_form_headerText">
          Registration
        </Typography>
        <Typography variant="body2" className="rightSec_form_headerSubtext">
          Create your account in seconds we’ll help you find your perfect match
        </Typography>
      </Box>

      <Box className="radio_group_cont">
        <RadioGroup
          value={contactType}
          onChange={handleContactTypeChange}
          name="contact-type"
        >
          <FormControlLabel value="email" control={<Radio />} label="Email" />
          <FormControlLabel value="phone" control={<Radio />} label="Phone" />
        </RadioGroup>
      </Box>

      <Box className="email_ph_input_cont">
        {contactType === "email" ? (
          <CustomInputProfile
            label="Email address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            type="email"
            showAsterisk
          />
        ) : (
          <CustomInputProfile
            label="Phone number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            type="tel"
            isPhone
            selectedCountryCode={selectedCountryCode}
            onCountryChange={handleCountryChange}
            showAsterisk
          />
        )}
      </Box>

      <Box className="password_input_cont">
        <CustomInputProfile
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          type="password"
          showAsterisk
        />
      </Box>

      <Box className="checkbox_inp_cont_wrap">
        <FormControlLabel
          className="checkbox_inp_cont"
          control={
            <Checkbox
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              color="primary"
              icon={<ChechBoxIcon width="22" height="22" />}
              checkedIcon={<CheckBoxCheckedIcon width="22" height="22" />}
            />
          }
          label={
            <Typography variant="body2" className="checkbox_text">
              I agree to the{" "}
              <Link href="#" className="checkbox_link_text">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link href="#" className="checkbox_link_text">
                Privacy
              </Link>
            </Typography>
          }
        />
      </Box>

      <Box className="btn_wrap">
        <CustomButtonRounded
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
          isSubmitting={loading}
        >
          {loading ? "Signing up..." : "Sign up"}
        </CustomButtonRounded>
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

      <Box className="footer_link_box">
        <Typography variant="body2" className="footer_link_text">
          Already have an account?{" "}
          <CustomTextButton onClick={onLoginClick}>
            Sign in
          </CustomTextButton>
        </Typography>
      </Box>
    </form>
  );
};

export default RegistrationStepOne;
