"use client";
import React from "react";
import {
  Box,
  Typography,
  Grid,
  SelectChangeEvent,
} from "@mui/material";
import { CustomButtonRounded } from '@/components/ui/Dashboard/CustomButtonRounded';
import CustomSelectProfile from "@/components/ui/Dashboard/CustomSelectTagProfile";
import type { AuthRole } from "@/lib/auth-session";

type OnboardingTwoData = {
  role: Exclude<AuthRole, "admin">;
  track?: "looking_to_invest" | "seeking_investment";
  selection?: string;
};

const OnboardingFlowTwo = ({
  onContinue,
  onboardingMode,
  loading = false,
  errorMessage,
}: {
  onContinue: (data: OnboardingTwoData) => Promise<void>;
  onboardingMode: "investment" | "networking";
  loading?: boolean;
  errorMessage?: string | null;
}) => {
  const [formData, setFormData] = React.useState({
    userType: onboardingMode === "networking" ? "broker" : "investor",
    tab1Selection: "",
    tab2Selection: "",
    brokerSelection: "",
  });

  const isInvestor = formData.userType === "investor";
  const isCompany = formData.userType === "company";
  const isBroker = formData.userType === "broker";

  const handleTab1SelectChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    setFormData((prev) => ({
      ...prev,
      tab1Selection: selectedValue,
    }));
  };

  const handleTab2SelectChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    setFormData((prev) => ({
      ...prev,
      tab2Selection: selectedValue,
    }));
  };

  const handleBrokerSelectChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    setFormData((prev) => ({
      ...prev,
      brokerSelection: selectedValue,
    }));
  };

  const handleSubmit = async () => {
    if (isInvestor && !formData.tab1Selection) return;
    if (isCompany && !formData.tab2Selection) return;

    await onContinue({
      role: formData.userType as Exclude<AuthRole, "admin">,
      track: isInvestor ? "looking_to_invest" : isCompany ? "seeking_investment" : undefined,
      selection: isInvestor
        ? formData.tab1Selection
        : isCompany
          ? formData.tab2Selection
          : formData.brokerSelection || undefined,
    });
  };
  // looking to invest options
  const tab1Options = [
    { value: "angel-investor", label: "Angel Investor" },
    { value: "venture-capital", label: "Venture Capital Fund" },
    { value: "private-equity", label: "Private Equity" },
    { value: "institutional", label: "Institutional Investor" },
    { value: "family-office", label: "Family Office" },
    { value: "individual", label: "High Net Worth Individual" },
  ];

  //   (Seeking Investment options)
  const tab2Options = [
    { value: "seed-stage", label: "Seed Stage Startup" },
    { value: "series-a", label: "Series A Company" },
    { value: "series-b", label: "Series B Company" },
    { value: "growth-stage", label: "Growth Stage Company" },
    { value: "pre-ipo", label: "Pre-IPO Company" },
    { value: "established", label: "Established Business" },
  ];
  const brokerOptions = [
    { value: "individual", label: "Independent Broker" },
    { value: "firm", label: "Brokerage Firm" },
    { value: "agency", label: "Agency" },
  ];

  return (
    <Box className="onboardingFormpWrap">
      <Box
        className="onboarding_common_bg left"
        sx={{
          backgroundImage: "url('/assets/icons/onboarding-left-icon.svg')",
          backgroundPosition: "bottom left"
        }}
      />
      <Box
        className="onboarding_common_bg right"
        sx={{
          backgroundImage: "url('/assets/icons/onboarding-right.svg')",
          backgroundPosition: "bottom right",
        }}
      />
      <Box
        className="onboardingTwoForm_icon_bg first"
        sx={{
          backgroundImage: "url('/assets/icons/two-stars-icon.svg')",
        }}
      />
      <Box
        className="onboardingTwoForm_icon_bg second"
        sx={{
          backgroundImage: "url('/assets/icons/group-flower-icon.svg')",
        }}
      />
      <Box
        className="onboardingTwoForm_icon_bg third"
        sx={{
          backgroundImage: "url('/assets/icons/group-stars-icon.svg')",
        }}
      />
      <form className="onboardingFormpInnerWrap">
        <Box className="onboardingFormpInnerWrap_content">
          <Grid container rowSpacing={5}>
            <Grid size={{ xs: 12 }}>
              <Box>
                <Typography variant="h4" className="onboarding_form_headerText">
                  Select your user type
                </Typography>
                <Typography
                  variant="body2"
                  className="onboarding_form_headerSubText"
                >
                  Choose the role that best matches how you will use Koilink.
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box className="onboardingTwo_tab_container">
                <Box className="select-container" sx={{ mb: 3 }}>
                  <CustomSelectProfile
                    label="User Type"
                    value={formData.userType}
                    onChange={(event) => {
                      const selectedValue = String(event.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        userType: selectedValue,
                      }));
                    }}
                    options={[
                      { value: "investor", label: "Investor" },
                      { value: "company", label: "Seeking Investment" },
                      { value: "broker", label: "Broker" },
                    ]}
                    placeholder="Select your user type"
                    showAsterisk
                  />
                </Box>

                {isInvestor && (
                  <Box className="select-container">
                    <CustomSelectProfile
                      label="Select Investor Type"
                      value={formData.tab1Selection}
                      onChange={handleTab1SelectChange}
                      options={tab1Options}
                      placeholder="What type of investor are you?"
                      showAsterisk
                    />
                  </Box>
                )}

                {isCompany && (
                  <Box className="select-container">
                    <CustomSelectProfile
                      label="Select Company Stage"
                      value={formData.tab2Selection}
                      onChange={handleTab2SelectChange}
                      options={tab2Options}
                      placeholder="What stage is your company?"
                      showAsterisk
                    />
                  </Box>
                )}

                {isBroker && (
                  <Box className="select-container">
                    <CustomSelectProfile
                      label="Broker Type"
                      value={formData.brokerSelection}
                      onChange={handleBrokerSelectChange}
                      options={brokerOptions}
                      placeholder="What type of broker are you?"
                    />
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box className="onboardingBtn_wrap">           
                  <CustomButtonRounded
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSubmit}
                  disabled={
                    loading ||
                    (isInvestor && !formData.tab1Selection) ||
                    (isCompany && !formData.tab2Selection)
                  }
                  isSubmitting={loading}
                  >
                    {loading ? "Saving..." : "Continue"}
                  </CustomButtonRounded>
                
              </Box>
              {errorMessage && (
                <Typography
                  variant="body2"
                  sx={{ color: "#d32f2f", mt: 1.5, textAlign: "center" }}
                >
                  {errorMessage}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </form>
    </Box>
  );
};

export default OnboardingFlowTwo;
