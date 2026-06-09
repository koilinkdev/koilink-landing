"use client"
import React from 'react'
import { Box, Typography, FormControlLabel, RadioGroup, Radio, Checkbox, Stack } from "@mui/material";
import CustomInputProfile from '@/components/ui/Dashboard/CustomInputProfile';
import { countries, type Country } from '@/data/countries';
import ChechBoxIcon from '@/components/ui/icons/ChechBoxIcon'
import CheckBoxCheckedIcon from '@/components/ui/icons/CheckBoxCheckedIcon'
import { CustomButtonRounded } from '@/components/ui/Dashboard/CustomButtonRounded';
import CustomTextButton from '@/components/ui/Auth/CustomTextButton'
interface LoginFormProps {
    onForgotPassword: (payload: { channel: "email" | "sms"; email?: string; phone?: string }) => Promise<void>;
    onRegistrationClick: () => void;
    onSubmit: (payload: { identifier: string; password: string; keepSignedIn: boolean }) => Promise<void>;
    loading?: boolean;
    errorMessage?: string | null;
    infoMessage?: string | null;
}
type ContactType = 'email' | 'phone';

const LoginFormcomponent: React.FC<LoginFormProps> = ({
    onForgotPassword,
    onRegistrationClick,
    onSubmit,
    loading = false,
    errorMessage,
    infoMessage,
}) => {
    const [contactType, setContactType] = React.useState<ContactType>('email');
    const [formData, setFormData] = React.useState({
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        verificationCode: "",
        agreeToTerms: false,
        keepSignedIn: false
    });
    const [localError, setLocalError] = React.useState<string | null>(null);
    const [selectedCountryCode, setSelectedCountryCode] = React.useState<string>('IN');
    const handleCountryChange = (country: Country) => {
        setSelectedCountryCode(country.code);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
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

        const identifier =
            contactType === "email"
                ? formData.email.trim().toLowerCase()
                : getPhoneWithDialCode();

        if (!identifier) {
            setLocalError(contactType === "email" ? "Email is required." : "Phone number is required.");
            return;
        }
        if (!formData.password.trim()) {
            setLocalError("Password is required.");
            return;
        }

        await onSubmit({
            identifier,
            password: formData.password,
            keepSignedIn: formData.keepSignedIn,
        });
    }

    const handleForgotPasswordClick = async () => {
        setLocalError(null);
        if (contactType === "email") {
            const email = formData.email.trim().toLowerCase();
            if (!email) {
                setLocalError("Enter your email first to continue.");
                return;
            }
            await onForgotPassword({ channel: "email", email });
            return;
        }

        const phone = getPhoneWithDialCode();
        if (!phone) {
            setLocalError("Enter your phone number first to continue.");
            return;
        }
        await onForgotPassword({ channel: "sms", phone });
    };

    const handleContactTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContactType(e.target.value as ContactType);
    };

    return (
        <form>
            <Box className="rightSec_form_header_cont">
                <Typography variant="h4" className='rightSec_form_headerText'>
                    Login
                </Typography>
                <Typography variant="body2" className='rightSec_form_headerSubtext'>
                    Welcome back! Log in to continue your journey and find your perfect match.
                </Typography>
            </Box>

            <Box className="radio_group_cont">
                <RadioGroup
                    value={contactType}
                    onChange={handleContactTypeChange}
                    name="contact-type"
                >
                    <FormControlLabel
                        value="email"
                        control={<Radio />}
                        label="Email"
                    />
                    <FormControlLabel
                        value="phone"
                        control={<Radio />}
                        label="Phone"
                    />
                </RadioGroup>
            </Box>

            <Box className="email_ph_input_cont">
                {contactType === 'email' ? (
                    <CustomInputProfile
                        label='Email address'
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='Enter your email address'
                        type="email"
                        showAsterisk
                    />
                ) : (
                    <CustomInputProfile
                        label='Phone number'
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder='Enter your phone number'
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
                    placeholder='Enter your password'
                    type="password"
                    showAsterisk
                />
            </Box>
            <Box className="checkbox_inp_cont_wrap">
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <FormControlLabel
                        className="checkbox_inp_cont"
                        control={
                            <Checkbox
                                name="keepSignedIn"
                                checked={formData.keepSignedIn}
                                onChange={handleChange}
                                color="primary"
                                icon={<ChechBoxIcon width="22" height="22" />}
                                checkedIcon={<CheckBoxCheckedIcon width="22" height="22" />}
                            />
                        }
                        label={
                            <Typography variant="body2" className='checkbox_text'>
                                Keep me signed in
                            </Typography>
                        }
                    />
                    <CustomTextButton onClick={handleForgotPasswordClick}>
                        Forgot Password?
                    </CustomTextButton>
                </Stack>
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
                    {loading ? "Signing in..." : "Sign in"}
                </CustomButtonRounded>
            </Box>

            <Box className="footer_link_box">
                <Typography variant="body2" className='footer_link_text'>
                    New Here?{" "}
                    <CustomTextButton onClick={onRegistrationClick}>
                        Create an account
                    </CustomTextButton>
                </Typography>
            </Box>

        </form>
    )
}

export default LoginFormcomponent
