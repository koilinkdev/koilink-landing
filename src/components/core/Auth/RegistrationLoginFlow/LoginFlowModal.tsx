"use client";
import RegistrationLoginModalWrapper from "@/components/core/Auth/RegistrationLoginFlow/RegistrationLoginModalWrap";
import React, { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import LoginFormcomponent from "@/components/core/Auth/RegistrationLoginFlow/LoginFormComponent";
import VerificationFormcomponent from "@/components/core/Auth/RegistrationLoginFlow/VerificationFormComponent";
import RegistrationStepOne from "@/components/core/Auth/RegistrationLoginFlow/RegistrationStepOne";
import Image from "next/image";
import OnboardingFlowOne from "@/components/core/Auth/RegistrationLoginFlow/OnboardingFlowOne";
import OnboardingFlowTwo from "@/components/core/Auth/RegistrationLoginFlow/OnboardingFlowTwo";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
  forgotPasswordApi,
  loginApi,
  registerApi,
  resendOtpApi,
  updateOnboardingRoleApi,
  verifyRegistrationOtpApi,
  verifyResetOtpApi,
} from "@/lib/auth-api";
import { getAccessToken, saveAuthSession } from "@/lib/auth-session";

interface LoginFlowModalProps {
  open: boolean;
  handleClose: () => void;
}
type SlideContent = {
  title: string;
  subtitle?: string;
};

const loginSlides: SlideContent[] = [
  {
    title: "Welcome to the Koilink",
    subtitle: "sign in to explore",
  },
  {
    title: "Stay Connected",
    subtitle: "Collaborate with your team",
  },
  {
    title: "All in One Place",
    subtitle: "Documents, chats & tasks",
  },
  {
    title: "Secure & Reliable",
    subtitle: "Your data is safe",
  },
  {
    title: "Get Started Now",
    subtitle: "Login to explore",
  },
];

const registrationSlides: SlideContent[] = [
  {
    title: "Welcome to the Koilink",
    subtitle: "sign up to explore",
  },
  {
    title: "Collaborate Smarter",
    subtitle: "Work with your team",
  },
  {
    title: "Stay Organized",
    subtitle: "One platform for everything",
  },
  {
    title: "Unlock Insights",
    subtitle: "Analytics made simple",
  },
  {
    title: "Be Part of the Future",
    subtitle: "Sign up and explore",
  },
];
const verificationSlides: SlideContent[] = [
  {
    title: "Verify Your Account",
    subtitle: "Check your email for a code",
  },
  {
    title: "Almost There",
    subtitle: "It will expire in 10 seconds",
  },
];
type Step =
  | "login"
  | "verification"
  | "registration"
  | "onboarding1"
  | "onboarding2";

type VerificationContext = "forgot" | "registration" | null;

type VerificationTarget = {
  email?: string;
  phone?: string;
  channel: "email" | "sms";
  label: string;
};

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") return message;
  }
  return "Something went wrong. Please try again.";
}

const LoginFlowModal: React.FC<LoginFlowModalProps> = ({
  open,
  handleClose,
}) => {
  const router = useRouter();
  const [step, setStep] = useState<Step>("login");
  const [verificationContext, setVerificationContext] =
    useState<VerificationContext>(null);
  const [verificationTarget, setVerificationTarget] =
    useState<VerificationTarget | null>(null);
  const [onboardingMode, setOnboardingMode] = useState<
    "investment" | "networking"
  >("investment");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const resetFeedback = () => {
    setErrorMessage(null);
    setInfoMessage(null);
  };

  useEffect(() => {
    if (open) return;
    setStep("login");
    setVerificationContext(null);
    setVerificationTarget(null);
    setOnboardingMode("investment");
    setLoading(false);
    resetFeedback();
  }, [open]);

  const switchToLogin = () => {
    setStep("login");
    resetFeedback();
  };

  const switchToRegistration = () => {
    setStep("registration");
    resetFeedback();
  };

  const handleLoginSubmit = async (payload: {
    identifier: string;
    password: string;
    keepSignedIn: boolean;
  }) => {
    setLoading(true);
    resetFeedback();
    try {
      const response = await loginApi({
        identifier: payload.identifier,
        password: payload.password,
      });

      saveAuthSession({
        user: response.user,
        tokens: response.tokens,
      }, payload.keepSignedIn);

      handleClose();
      router.push("/dashboard");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const switchToVerificationForForgot = async (payload: {
    channel: "email" | "sms";
    email?: string;
    phone?: string;
  }) => {
    setLoading(true);
    resetFeedback();
    try {
      const response = await forgotPasswordApi(payload);
      setVerificationContext("forgot");
      setVerificationTarget({
        channel: payload.channel,
        email: payload.email,
        phone: payload.phone,
        label: response.target ?? payload.email ?? payload.phone ?? "your account",
      });
      setStep("verification");
      if (response.devOtp) {
        setInfoMessage(`Use OTP: ${response.devOtp}`);
      } else {
        setInfoMessage(response.message);
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const switchToVerificationAfterRegistration = async (payload: {
    email?: string;
    phone?: string;
    password: string;
  }) => {
    setLoading(true);
    resetFeedback();
    try {
      const response = await registerApi({
        email: payload.email,
        phone: payload.phone,
        password: payload.password,
      });

      setVerificationContext("registration");
      setVerificationTarget({
        channel: payload.email ? "email" : "sms",
        email: payload.email,
        phone: payload.phone,
        label: payload.email ?? payload.phone ?? "your account",
      });
      setStep("verification");
      if (response.devOtp) {
        setInfoMessage(`Use OTP: ${response.devOtp}`);
      } else {
        setInfoMessage(response.message ?? "Registration successful. Enter the OTP to continue.");
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (code: string) => {
    if (!verificationContext || !verificationTarget) {
      setErrorMessage("Verification context is missing. Please try again.");
      return;
    }

    setLoading(true);
    resetFeedback();
    try {
      if (verificationContext === "registration") {
        const response = await verifyRegistrationOtpApi({
          email: verificationTarget.email,
          phone: verificationTarget.phone,
          code,
        });

        if (!response.user || !response.tokens) {
          setErrorMessage("Verification succeeded, but session data is missing. Please sign in.");
          setStep("registration");
          return;
        }

        saveAuthSession({
          user: response.user,
          tokens: response.tokens,
        });
        setStep("onboarding1");
        return;
      }

      await verifyResetOtpApi({
        email: verificationTarget.email,
        phone: verificationTarget.phone,
        channel: verificationTarget.channel,
        code,
      });

      setStep("login");
      setVerificationContext(null);
      setInfoMessage("OTP verified. Please sign in to continue.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!verificationContext || !verificationTarget) {
      setErrorMessage("Unable to resend code right now.");
      return;
    }

    setLoading(true);
    resetFeedback();
    try {
      const response = await resendOtpApi({
        email: verificationTarget.email,
        phone: verificationTarget.phone,
        purpose:
          verificationContext === "registration"
            ? "registration"
            : "reset-password",
      });
      if (response.devOtp) {
        setInfoMessage(`New OTP: ${response.devOtp}`);
      } else {
        setInfoMessage(response.message);
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingOneContinue = (mode: "investment" | "networking") => {
    setOnboardingMode(mode);
    setStep("onboarding2");
    resetFeedback();
  };

  const handleOnboardingTwoContinue = async (data: {
    role: "investor" | "company" | "broker";
    track?: "looking_to_invest" | "seeking_investment";
    selection?: string;
  }) => {
    const token = getAccessToken();
    if (!token) {
      setErrorMessage("Session expired. Please sign in again.");
      return;
    }

    setLoading(true);
    resetFeedback();

    try {
      const response = await updateOnboardingRoleApi(token, data.role);

      saveAuthSession({
        user: response.user,
        tokens: response.tokens,
      });

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "koilink.onboarding.preferences",
          JSON.stringify({
            mode: onboardingMode,
            ...data,
          })
        );
      }

      handleClose();
      router.push("/dashboard");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const slides =
    step === "login"
      ? loginSlides
      : step === "registration"
        ? registrationSlides
        : step === "verification"
          ? verificationSlides
          : [];

  return (
    <RegistrationLoginModalWrapper open={open} handleClose={handleClose}>
      {(step === "login" ||
        step === "verification" ||
        step === "registration") && (
        <Stack
          className="loginModal_inner_wrap"
          direction="row"
          spacing={0.5}
          justifyContent="center"
          alignItems="center"
        >
          <Box className="login_left_cont">
            <Box className="left_image_wrap">
              <Image
                src={
                  step === "verification"
                    ? "/assets/images/login2.png"
                    : "/assets/images/login1.png"
                }
                alt="Login image"
                fill
                priority
              />
              <Box className="overlay_wrap">
                <Swiper
                  modules={[Pagination]}
                  pagination={{ clickable: true }}
                  className="dotSwiper"
                >
                  {slides.map((slide, i) => (
                    <SwiperSlide key={i}>
                      <Box className="overlay_design">
                        <Typography className="blur_text" variant="h4">
                          {slide.title}
                        </Typography>
                        <Typography className="blur_subtext" variant="body2">
                          {slide.subtitle}
                        </Typography>
                      </Box>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Box>
            </Box>
          </Box>

          <Box className="login_right_cont">
            <Box
              className="form_bg top"
              sx={{
                backgroundImage: "url('/assets/icons/login-form-bgTop.svg')",
              }}
            />
            <Box
              className="form_bg bottom"
              sx={{
                backgroundImage: "url('/assets/icons/login-formBg-bottom.svg')",
              }}
            />

            <Box className="login_right_cont_form">
              {step === "login" && (
                <LoginFormcomponent
                  onForgotPassword={switchToVerificationForForgot}
                  onRegistrationClick={switchToRegistration}
                  onSubmit={handleLoginSubmit}
                  loading={loading}
                  errorMessage={errorMessage}
                  infoMessage={infoMessage}
                />
              )}
              {step === "registration" && (
                <RegistrationStepOne
                  onLoginClick={switchToLogin}
                  onSubmitSuccess={switchToVerificationAfterRegistration}
                  loading={loading}
                  errorMessage={errorMessage}
                  infoMessage={infoMessage}
                />
              )}
              {step === "verification" && (
                <VerificationFormcomponent
                  onVerified={handleVerificationSubmit}
                  onResend={handleResendOtp}
                  targetLabel={verificationTarget?.label}
                  loading={loading}
                  errorMessage={errorMessage}
                  infoMessage={infoMessage}
                />
              )}
            </Box>
          </Box>
        </Stack>
      )}

      {(step === "onboarding1" || step === "onboarding2") && (
        <Box className="loginModal_inner_wrap">
          <Box
            className="onboardingOuterWrap"
            sx={{
              backgroundImage: "url('/assets/images/onboarding-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              height: "100%",
              width: "100%",
              display: "flex",
            }}
          >
            {step === "onboarding1" && (
              <OnboardingFlowOne onContinue={handleOnboardingOneContinue} />
            )}
            {step === "onboarding2" && (
              <OnboardingFlowTwo
                onContinue={handleOnboardingTwoContinue}
                onboardingMode={onboardingMode}
                loading={loading}
                errorMessage={errorMessage}
              />
            )}
          </Box>
        </Box>
      )}
    </RegistrationLoginModalWrapper>
  );
};

export default LoginFlowModal;
