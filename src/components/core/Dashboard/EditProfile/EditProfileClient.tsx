"use client";
import React from "react";
import { Box, Grid, SelectChangeEvent, IconButton, Dialog, DialogContent, Stack, Typography, CircularProgress, Snackbar } from "@mui/material";
import Image from "next/image";
import * as Yup from "yup";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import PhotoLibraryRoundedIcon from "@mui/icons-material/PhotoLibraryRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CameraswitchRoundedIcon from "@mui/icons-material/CameraswitchRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FormatBoldRoundedIcon from "@mui/icons-material/FormatBoldRounded";
import FormatItalicRoundedIcon from "@mui/icons-material/FormatItalicRounded";
import FormatUnderlinedRoundedIcon from "@mui/icons-material/FormatUnderlinedRounded";
import StrikethroughSRoundedIcon from "@mui/icons-material/StrikethroughSRounded";
import FormatAlignLeftRoundedIcon from "@mui/icons-material/FormatAlignLeftRounded";
import FormatAlignCenterRoundedIcon from "@mui/icons-material/FormatAlignCenterRounded";
import FormatAlignRightRoundedIcon from "@mui/icons-material/FormatAlignRightRounded";
import CustomInputProfile from "@/components/ui/Dashboard/CustomInputProfile";
import CustomSelectProfile from "@/components/ui/Dashboard/CustomSelectTagProfile";
import { StyledLabel } from "@/components/ui/Dashboard/CustomSelectTagProfile";
import KeyDataEditor, { KeyDataRowError } from "@/components/ui/Dashboard/KeyDataEditor";
import ProfileDocumentsSection from "@/components/ui/Dashboard/ProfileDocumentsSection";
import { CustomButtonRounded } from "@/components/ui/Dashboard/CustomButtonRounded";
import { CustomButtonTransparent } from "@/components/ui/Dashboard/CustomButtonTransparent";
import { AboutEditProfileClientStyled } from "@/styledComponents/EditProfile/EditProfileStyled";
import { countries, Country } from "@/data/countries";
import { API_BASE_URL, updatePasswordApi } from "@/lib/auth-api";
import { getAccessToken, getAuthSession, saveAuthSession } from "@/lib/auth-session";
import { createEmptyKeyDataEntry, KeyDataEntry, serializeKeyData, parseKeyData } from "@/lib/keyData";
import {
  extractProfileDocuments,
  getDocumentTypeOptions,
  ProfileDocument,
} from "@/lib/profileDocuments";

type FormData = {
  fullName: string;
  email: string;
  currentPassword: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  dob: string;
  location: string;
  companyName: string;
  fundingPreferences: string;
  ticketSizeMin: string;
  ticketSizeMax: string;
  portfolioSize: string;
  sectorsOfInterest: string;
  amountSeeking: string;
  businessStage: string;
  industrySector: string;
  revenueStatus: string;
  annualRevenue: string;
  teamSize: string;
  useOfFunds: string;
  websiteUrl: string;
  licenseRegistrationNumber: string;
  dealTypeHandled: string;
  commissionStructure: string;
  dealsClosed: string;
  facebookProfile: string;
  xProfile: string;
  instagramProfile: string;
  linkedinProfile: string;
  keyData: KeyDataEntry[];
  about: string;
};

type Errors = Partial<Record<keyof FormData, string>>;
type Touched = Partial<Record<keyof FormData, boolean>>;
type TextFieldKey = Exclude<keyof FormData, "keyData">;

type ProfileApiResponse = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile?: any;
  user?: {
    id?: string;
    email?: string;
    phone?: string;
    role?: string;
  };
  message?: string;
  error?: unknown;
};

type SignUploadResponse = {
  url: string;
  key: string;
  documentId: string;
  publicUrl?: string;
};

type CompleteUploadResponse = {
  document?: {
    _id: string;
    url?: string;
    key: string;
  };
};

type SignReadUploadResponse = {
  url?: string;
  key?: string;
  error?: string;
};

type AddProfileDocumentResponse = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile?: any;
  document?: {
    id?: string;
    key?: string;
    url?: string;
    type?: string;
    contentType?: string;
    size?: number;
    metadata?: Record<string, unknown>;
  };
  error?: string;
};

type ToastVariant = "success" | "error" | "info";

type ToastState = {
  open: boolean;
  message: string;
  variant: ToastVariant;
};

const KEY_DATA_STORAGE_MAX_LENGTH = 5000;
const BUSINESS_STAGE_OPTIONS = [
  { value: "idea", label: "Idea" },
  { value: "mvp", label: "MVP" },
  { value: "pre_revenue", label: "Pre-revenue" },
  { value: "revenue_generating", label: "Revenue-generating" },
];
const FUNDING_PREFERENCE_OPTIONS = [
  { value: "seed", label: "Seed Funding" },
  { value: "series-a", label: "Series A" },
  { value: "series-b", label: "Series B" },
  { value: "growth", label: "Growth Capital" },
];
const DEAL_TYPE_OPTIONS = [
  { value: "ma", label: "M&A" },
  { value: "vc", label: "VC" },
  { value: "pe", label: "PE" },
  { value: "debt", label: "Debt Deals" },
];
const REVENUE_STATUS_OPTIONS = [
  { value: "revenue_generating", label: "Revenue-generating" },
  { value: "pre_revenue", label: "Pre-revenue" },
];

const isNumericString = (value?: string | null) => !value || /^\d+(\.\d{1,2})?$/.test(value);
const PASSWORD_RULE_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function flattenValidationMessages(value: unknown): string[] {
  if (!value || typeof value !== "object") {
    return [];
  }

  const nextMessages: string[] = [];
  const recordValue = value as Record<string, unknown>;

  if (Array.isArray(recordValue.formErrors)) {
    nextMessages.push(
      ...recordValue.formErrors.filter(
        (item): item is string => typeof item === "string" && item.trim().length > 0,
      ),
    );
  }

  if (recordValue.fieldErrors && typeof recordValue.fieldErrors === "object") {
    for (const fieldValue of Object.values(recordValue.fieldErrors as Record<string, unknown>)) {
      if (Array.isArray(fieldValue)) {
        nextMessages.push(
          ...fieldValue.filter(
            (item): item is string => typeof item === "string" && item.trim().length > 0,
          ),
        );
      }
    }
  }

  return nextMessages;
}

function extractApiErrorMessage(errorValue: unknown, fallback: string) {
  if (typeof errorValue === "string" && errorValue.trim().length > 0) {
    return errorValue;
  }

  const validationMessages = flattenValidationMessages(errorValue);
  if (validationMessages.length > 0) {
    return validationMessages[0];
  }

  return fallback;
}

const buildValidationSchema = (role: string) => {
  const isInvestor = role === "investor";
  const isCompany = role === "company";
  const isBroker = role === "broker";

  return Yup.object({
    fullName: Yup.string().required("Full name is required").min(2).max(100),
    email: Yup.string().required("Email address is required").email("Please enter a valid email address"),
    currentPassword: Yup.string()
      .notRequired()
      .test("current-password-required", "Current password is required", function (value) {
        const { password } = this.parent;
        if (!password) return true;
        if (!value) return this.createError({ message: "Current password is required to set a new one" });
        return true;
      }),
    password: Yup.string()
      .notRequired()
      .test("password-strength", "Password must be at least 8 characters with uppercase, lowercase, number, and special character", (value) => {
        if (!value) return true;
        return PASSWORD_RULE_REGEX.test(value);
      }),
    confirmPassword: Yup.string()
      .notRequired()
      .test("password-match", "Passwords must match", function (value) {
        const { password } = this.parent;
        if (!password) return true;
        if (!value) return this.createError({ message: "Please confirm your new password" });
        if (!PASSWORD_RULE_REGEX.test(password)) return true;
        return password === value ? true : this.createError({ message: "Passwords do not match" });
      }),
    phoneNumber: Yup.string().required("Phone number is required").matches(/^\d{8,15}$/, "Phone number must be 8 to 15 digits"),
    dob: Yup.string().notRequired(),
    location: Yup.string().required("Location is required").min(2),
    companyName: Yup.string().notRequired().max(100),
    fundingPreferences: Yup.string().notRequired(),
    ticketSizeMin: Yup.string()
      .notRequired()
      .test("ticket-min", "Please enter a valid amount", (value) => !isInvestor || isNumericString(value)),
    ticketSizeMax: Yup.string()
      .notRequired()
      .test("ticket-max", "Please enter a valid amount", (value) => !isInvestor || isNumericString(value)),
    portfolioSize: Yup.string()
      .notRequired()
      .test("portfolio-size", "Please enter a valid amount", (value) => !isInvestor || isNumericString(value)),
    sectorsOfInterest: Yup.string().notRequired().max(500),
    amountSeeking: Yup.string()
      .notRequired()
      .test("amount-seeking", "Please enter a valid amount", (value) => !isCompany || isNumericString(value)),
    businessStage: Yup.string().notRequired(),
    industrySector: Yup.string().notRequired().max(200),
    revenueStatus: Yup.string().notRequired(),
    annualRevenue: Yup.string()
      .notRequired()
      .test("annual-revenue", "Please enter a valid amount", (value) => !isCompany || isNumericString(value)),
    teamSize: Yup.string()
      .notRequired()
      .test("team-size", "Please enter a valid number", (value) => !isCompany || !value || /^\d+$/.test(value)),
    useOfFunds: Yup.string().notRequired().max(2000),
    websiteUrl: Yup.string().notRequired().test("website-url", "Please enter a valid website URL", (value) => !value || /^https?:\/\//i.test(value)),
    licenseRegistrationNumber: Yup.string().notRequired().max(100),
    dealTypeHandled: Yup.string().notRequired(),
    commissionStructure: Yup.string().notRequired().max(100),
    dealsClosed: Yup.string()
      .notRequired()
      .test("deals-closed", "Please enter a valid number", (value) => !isBroker || !value || /^\d+$/.test(value)),
    facebookProfile: Yup.string()
      .notRequired()
      .test("fb-url", "Please enter a valid Facebook URL", (value) => !value || /^https?:\/\/(www\.)?facebook\.com\//i.test(value)),
    xProfile: Yup.string()
      .notRequired()
      .test("x-url", "Please enter a valid X (Twitter) URL", (value) => !value || /^https?:\/\/(www\.)?(twitter\.com|x\.com)\//i.test(value)),
    instagramProfile: Yup.string()
      .notRequired()
      .test("insta-url", "Please enter a valid Instagram URL", (value) => !value || /^https?:\/\/(www\.)?instagram\.com\//i.test(value)),
    linkedinProfile: Yup.string()
      .required("LinkedIn profile is required")
      .test("linkedin-url", "Please enter a valid LinkedIn URL", (value) => !!value && /^https?:\/\/(www\.)?linkedin\.com\//i.test(value)),
    keyData: Yup.mixed<KeyDataEntry[]>().notRequired(),
    about: Yup.string().notRequired().max(5000, "About is too long"),
  }).test("ticket-range-order", "Maximum ticket size must be greater than or equal to minimum ticket size", function (value) {
    if (!isInvestor) return true;
    const min = Number(value?.ticketSizeMin || 0);
    const max = Number(value?.ticketSizeMax || 0);
    if (!value?.ticketSizeMin || !value?.ticketSizeMax) return true;
    if (Number.isNaN(min) || Number.isNaN(max) || min <= max) return true;
    return this.createError({ path: "ticketSizeMax", message: "Maximum ticket size must be greater than or equal to minimum ticket size" });
  });
};

const getAllTouched = (): Touched => ({
  fullName: true,
  email: true,
  currentPassword: true,
  password: true,
  confirmPassword: true,
  phoneNumber: true,
  dob: true,
  location: true,
  companyName: true,
  fundingPreferences: true,
  ticketSizeMin: true,
  ticketSizeMax: true,
  portfolioSize: true,
  sectorsOfInterest: true,
  amountSeeking: true,
  businessStage: true,
  industrySector: true,
  revenueStatus: true,
  annualRevenue: true,
  teamSize: true,
  useOfFunds: true,
  websiteUrl: true,
  licenseRegistrationNumber: true,
  dealTypeHandled: true,
  commissionStructure: true,
  dealsClosed: true,
  facebookProfile: true,
  xProfile: true,
  instagramProfile: true,
  linkedinProfile: true,
  keyData: true,
  about: true,
});

const getEmptyTextErrors = (): Errors => ({
  fullName: "",
  email: "",
  currentPassword: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  dob: "",
  location: "",
  companyName: "",
  fundingPreferences: "",
  ticketSizeMin: "",
  ticketSizeMax: "",
  portfolioSize: "",
  sectorsOfInterest: "",
  amountSeeking: "",
  businessStage: "",
  industrySector: "",
  revenueStatus: "",
  annualRevenue: "",
  teamSize: "",
  useOfFunds: "",
  websiteUrl: "",
  licenseRegistrationNumber: "",
  dealTypeHandled: "",
  commissionStructure: "",
  dealsClosed: "",
  facebookProfile: "",
  xProfile: "",
  instagramProfile: "",
  linkedinProfile: "",
  about: "",
});

type RichTextPanelProps = {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: () => void;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
};

const RichTextPanel = ({ label, value, onChange, onBlur, error, helperText, placeholder }: RichTextPanelProps) => {
  return (
    <Box className="editor_panel_wrap">
      <StyledLabel>{label}</StyledLabel>
      <Box className={`editor_panel ${error ? "has_error" : ""}`}>
        <Box className="editor_toolbar">
          <Typography className="tool_text">14</Typography>
          <IconButton size="small" className="tool_btn"><FormatBoldRoundedIcon fontSize="small" /></IconButton>
          <IconButton size="small" className="tool_btn"><FormatItalicRoundedIcon fontSize="small" /></IconButton>
          <IconButton size="small" className="tool_btn"><FormatUnderlinedRoundedIcon fontSize="small" /></IconButton>
          <IconButton size="small" className="tool_btn"><StrikethroughSRoundedIcon fontSize="small" /></IconButton>
          <Box className="tool_dot" />
          <IconButton size="small" className="tool_btn"><FormatAlignLeftRoundedIcon fontSize="small" /></IconButton>
          <IconButton size="small" className="tool_btn"><FormatAlignCenterRoundedIcon fontSize="small" /></IconButton>
          <IconButton size="small" className="tool_btn"><FormatAlignRightRoundedIcon fontSize="small" /></IconButton>
        </Box>
        <textarea
          className="editor_textarea"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
        />
      </Box>
      {helperText && <Typography className={`editor_helper ${error ? "error" : ""}`}>{helperText}</Typography>}
    </Box>
  );
};

const EditProfileClient = () => {
  const [locationCoords, setLocationCoords] = React.useState<{ latitude: number; longitude: number; state?: string; country?: string } | null>(null)
  const [isLocating, setIsLocating] = React.useState(false)

  const handleGetLocation = React.useCallback(() => {
    if (!navigator.geolocation) {
      return
    }
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        let city = ""
        let state = ""
        let country = ""
        let exactAddress = ""
        try {
          // Nominatim reverse geocoding — free, no API key required
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "en" } },
          )
          if (response.ok) {
            const data = await response.json()
            const addr = data.address || {}
            city = addr.city || addr.town || addr.village || addr.hamlet || addr.county || ""
            state = addr.state || addr.region || ""
            country = addr.country || ""
            exactAddress =
              data.display_name ||
              [
                [addr.house_number, addr.road].filter(Boolean).join(" "),
                addr.suburb,
                city,
                state,
                addr.postcode,
                country,
              ]
                .filter(Boolean)
                .join(", ")
          }
        } catch {
          // Reverse geocoding failed — still store coordinates
        }
        setLocationCoords({ latitude, longitude, state: state || undefined, country: country || undefined })
        if (exactAddress || city) {
          setFormData((prev) => ({ ...prev, location: exactAddress || city }))
        }
        setIsLocating(false)
      },
      () => {
        setIsLocating(false)
      },
      { timeout: 10000, enableHighAccuracy: true },
    )
  }, [])

  const [formData, setFormData] = React.useState<FormData>({
    fullName: "",
    email: "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    dob: "",
    location: "",
    companyName: "",
    fundingPreferences: "",
    ticketSizeMin: "",
    ticketSizeMax: "",
    portfolioSize: "",
    sectorsOfInterest: "",
    amountSeeking: "",
    businessStage: "",
    industrySector: "",
    revenueStatus: "",
    annualRevenue: "",
    teamSize: "",
    useOfFunds: "",
    websiteUrl: "",
    licenseRegistrationNumber: "",
    dealTypeHandled: "",
    commissionStructure: "",
    dealsClosed: "",
    facebookProfile: "",
    xProfile: "",
    instagramProfile: "",
    linkedinProfile: "",
    keyData: [createEmptyKeyDataEntry()],
    about: "",
  });

  const [errors, setErrors] = React.useState<Errors>({});
  const [touched, setTouched] = React.useState<Touched>({});
  const [keyDataRowErrors, setKeyDataRowErrors] = React.useState<KeyDataRowError[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = React.useState(true);
  const [hasProfile, setHasProfile] = React.useState(false);
  const [profileRole, setProfileRole] = React.useState<string>("");
  const isInvestor = profileRole === "investor";
  const isCompany = profileRole === "company";
  const isBroker = profileRole === "broker";
  const validationSchema = React.useMemo(() => buildValidationSchema(profileRole), [profileRole]);
  const [selectedCountryCode, setSelectedCountryCode] = React.useState<string>("IN");
  const [avatarSrc, setAvatarSrc] = React.useState<string>("/assets/icons/User-image-edit-profile.svg");
  const [selectedAvatarFile, setSelectedAvatarFile] = React.useState<File | null>(null);
  const [persistedProfilePhotoUrl, setPersistedProfilePhotoUrl] = React.useState<string | undefined>(undefined);
  const [documents, setDocuments] = React.useState<ProfileDocument[]>([]);
  const [selectedDocumentType, setSelectedDocumentType] = React.useState<string>("");
  const [selectedDocumentFile, setSelectedDocumentFile] = React.useState<File | null>(null);
  const [isUploadingDocument, setIsUploadingDocument] = React.useState(false);
  const [openingDocumentId, setOpeningDocumentId] = React.useState<string | null>(null);
  const [removingDocumentId, setRemovingDocumentId] = React.useState<string | null>(null);
  const [isPhotoSourceModalOpen, setIsPhotoSourceModalOpen] = React.useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = React.useState(false);
  const [isStartingCamera, setIsStartingCamera] = React.useState(false);
  const [cameraError, setCameraError] = React.useState<string>("");
  const [cameraFacingMode, setCameraFacingMode] = React.useState<"user" | "environment">("user");
  const [toast, setToast] = React.useState<ToastState>({
    open: false,
    message: "",
    variant: "info",
  });
  const countriesByDialCodeDesc = React.useMemo(
    () => [...countries].sort((a, b) => b.dialCode.length - a.dialCode.length),
    [],
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const documentInputRef = React.useRef<HTMLInputElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const cameraStreamRef = React.useRef<MediaStream | null>(null);
  const documentTypeOptions = React.useMemo(() => getDocumentTypeOptions(profileRole), [profileRole]);

  const getPhoneWithDialCode = React.useCallback(
    (localPhone: string) => {
      const onlyDigits = localPhone.trim().replace(/\D/g, "");
      if (!onlyDigits) return "";
      const country = countries.find((item) => item.code === selectedCountryCode);
      if (!country) return onlyDigits;
      return `${country.dialCode}${onlyDigits}`;
    },
    [selectedCountryCode],
  );

  const toStageForForm = (value?: string) => {
    if (!value) return "";
    return value.replace(/_/g, "-");
  };

  const sanitizeUrlField = (value: string) => {
    const v = value.trim();
    return v.length > 0 ? v : undefined;
  };

  const sanitizeListField = (value: string) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    return items.length > 0 ? items.join(", ") : undefined;
  };

    const numberOrUndefined = (value: string) => {
      const normalized = value.trim();
      if (!normalized) return undefined;
      const parsed = Number(normalized);
      return Number.isFinite(parsed) ? parsed : undefined;
    };

    const dateStringForApi = (value: string) => {
      const normalized = value.trim();
      if (!normalized) return undefined;

      const dayMonthYearMatch = normalized.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (dayMonthYearMatch) {
        const [, day, month, year] = dayMonthYearMatch;
        return `${year}-${month}-${day}`;
      }

      return normalized;
    };

  const validateKeyData = React.useCallback((entries: KeyDataEntry[]) => {
    const rowErrors = entries.map((entry) => {
      const field = entry.field.trim();
      const investor = entry.investor.trim();
      const company = entry.company.trim();
      const hasField = Boolean(field);
      const hasDetails = Boolean(investor || company);

      if (!hasField && !hasDetails) {
        return {};
      }

      return {
        field: hasField ? undefined : "Select a field for this row.",
        details: hasDetails ? undefined : "Add details for this row.",
      };
    });

    const sectionError =
      serializeKeyData(entries).length > KEY_DATA_STORAGE_MAX_LENGTH
        ? "Key data is too long."
        : "";

    setKeyDataRowErrors(rowErrors);
    setErrors((prev) => ({
      ...prev,
      keyData: sectionError,
    }));

    return (
      !sectionError &&
      rowErrors.every((rowError) => !rowError.field && !rowError.details)
    );
  }, []);

  const splitPhoneByDialCode = React.useCallback(
    (rawPhone?: string) => {
      const raw = (rawPhone ?? "").trim();
      if (!raw) {
        return { countryCode: "IN", localPhone: "" };
      }

      const normalized = raw.replace(/[^\d+]/g, "");
      if (!normalized.startsWith("+")) {
        return { countryCode: "IN", localPhone: normalized.replace(/\D/g, "") };
      }

      const matchedCountry = countriesByDialCodeDesc.find((country) => normalized.startsWith(country.dialCode));
      if (!matchedCountry) {
        return { countryCode: "IN", localPhone: normalized.replace(/\D/g, "") };
      }

      return {
        countryCode: matchedCountry.code,
        localPhone: normalized.slice(matchedCountry.dialCode.length).replace(/\D/g, ""),
      };
    },
    [countriesByDialCodeDesc],
  );

  const showToast = React.useCallback((message: string, variant: ToastVariant = "info") => {
    setToast({
      open: true,
      message,
      variant,
    });
  }, []);

  const handleToastClose = React.useCallback(() => {
    setToast((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  const previewAvatarFile = React.useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        setAvatarSrc(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const getSignedReadableUploadUrl = React.useCallback(async (token: string, source: { key?: string; url?: string }) => {
    const response = await fetch(`${API_BASE_URL}/uploads/sign-read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...source, expiresIn: 1800 }),
    });

    const data = (await response.json().catch(() => ({}))) as SignReadUploadResponse;
    if (!response.ok || !data.url) {
      throw new Error(data.error || "Failed to generate signed read url");
    }

    return data.url;
  }, []);

  const loadProfile = React.useCallback(async () => {
    setIsLoadingProfile(true);
    try {
      const token = getAccessToken();
      const session = getAuthSession();

      if (!token) {
        setIsLoadingProfile(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/profiles/getme`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let data: ProfileApiResponse = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      const profile = data.profile;
      if (profile) {
        setHasProfile(true);
        const resolvedRole = profile.roleType ?? data.user?.role ?? session?.user?.role ?? "";
        const firstName = profile.firstName ?? "";
        const lastName = profile.lastName ?? "";
        const displayName = profile.displayName ?? `${firstName} ${lastName}`.trim();
        const companyProfile = profile.companyProfile ?? {};
        const investorProfile = profile.investorProfile ?? {};
        const brokerProfile = profile.brokerProfile ?? {};

        const serverUser = data.user;
        const resolvedEmail = serverUser?.email ?? session?.user?.email ?? "";
        const resolvedPhone = serverUser?.phone ?? session?.user?.phone ?? "";
        const parsedPhone = splitPhoneByDialCode(resolvedPhone);
        setSelectedCountryCode(parsedPhone.countryCode);
        setProfileRole(resolvedRole);
        setDocuments(extractProfileDocuments(profile, resolvedRole));

        // Restore stored GPS coords so saving again doesn't lose them
        if (
          Array.isArray(profile.location?.coordinates) &&
          profile.location.coordinates.length === 2
        ) {
          const [lng, lat] = profile.location.coordinates as [number, number]
          setLocationCoords({
            latitude: lat,
            longitude: lng,
            state: profile.state ?? undefined,
            country: profile.country ?? undefined,
          })
        }

        setFormData((prev) => ({
          ...prev,
          fullName: displayName,
          email: resolvedEmail,
          phoneNumber: parsedPhone.localPhone,
          dob: profile.dateOfBirth ? String(profile.dateOfBirth).slice(0, 10) : "",
          location: profile.city ?? "",
          companyName: profile.companyName ?? companyProfile.companyName ?? brokerProfile.firmName ?? "",
          fundingPreferences: profile.fundingPreferences
            ? toStageForForm(profile.fundingPreferences)
            : toStageForForm(investorProfile.preferredStages?.[0]),
          ticketSizeMin: String(investorProfile.investmentRange?.min ?? ""),
          ticketSizeMax: String(investorProfile.investmentRange?.max ?? ""),
          portfolioSize: String(investorProfile.portfolioSize ?? ""),
          sectorsOfInterest:
            resolvedRole === "broker"
              ? (brokerProfile.specializations ?? []).join(", ")
              : (investorProfile.preferredIndustries ?? []).join(", "),
          amountSeeking: String(profile.fundingRequired ?? companyProfile.fundingAmount ?? ""),
          businessStage: companyProfile.companyStage ?? "",
          industrySector: companyProfile.industry ?? companyProfile.sector ?? "",
          revenueStatus: companyProfile.preRevenue ? "pre_revenue" : companyProfile.annualRevenue ? "revenue_generating" : "",
          annualRevenue: String(companyProfile.annualRevenue ?? ""),
          teamSize: String(companyProfile.teamSize ?? ""),
          useOfFunds: companyProfile.useOfFunds ?? "",
          websiteUrl: companyProfile.website ?? "",
          licenseRegistrationNumber: brokerProfile.licenseNumber ?? "",
          dealTypeHandled: brokerProfile.dealTypesHandled?.[0] ?? "",
          commissionStructure:
            brokerProfile.commissionStructure ??
            (brokerProfile.commissionRate !== undefined && brokerProfile.commissionRate !== null
              ? `${brokerProfile.commissionRate}%`
              : ""),
          dealsClosed: String(brokerProfile.dealsCompleted ?? ""),
          facebookProfile: profile.facebookProfile ?? companyProfile.facebookUrl ?? "",
          xProfile: profile.xProfile ?? companyProfile.twitterUrl ?? "",
          instagramProfile: profile.instagramProfile ?? "",
          linkedinProfile: profile.linkedinProfile ?? companyProfile.linkedinUrl ?? profile.appleProfile ?? "",
          keyData: (() => {
            const parsedKeyData = parseKeyData(profile.keyData);
            return parsedKeyData.length > 0 ? parsedKeyData : [createEmptyKeyDataEntry()];
          })(),
          about: profile.bio ?? "",
        }));

        if (profile.profilePhoto) {
          setPersistedProfilePhotoUrl(profile.profilePhoto);
          try {
            const signedReadUrl = await getSignedReadableUploadUrl(token, { url: profile.profilePhoto });
            setAvatarSrc(signedReadUrl);
          } catch {
            setAvatarSrc(profile.profilePhoto);
          }
        }
      } else {
        setHasProfile(false);
        setPersistedProfilePhotoUrl(undefined);
        setProfileRole(data.user?.role ?? session?.user?.role ?? "");
        setDocuments([]);
        const fallbackPhone = data.user?.phone ?? session?.user?.phone ?? "";
        const parsedPhone = splitPhoneByDialCode(fallbackPhone);
        setSelectedCountryCode(parsedPhone.countryCode);
        setFormData((prev) => ({
          ...prev,
          email: data.user?.email ?? session?.user?.email ?? prev.email,
          phoneNumber: parsedPhone.localPhone,
        }));
      }
    } catch {
      showToast("Failed to load profile. Please refresh and try again.", "error");
    } finally {
      setIsLoadingProfile(false);
    }
  }, [getSignedReadableUploadUrl, showToast, splitPhoneByDialCode]);

  React.useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  React.useEffect(() => {
    if (documentTypeOptions.some((option) => option.value === selectedDocumentType)) {
      return;
    }

    setSelectedDocumentType(documentTypeOptions[0]?.value ?? "");
  }, [documentTypeOptions, selectedDocumentType]);

  const stopCameraStream = React.useCallback(() => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCameraStream = React.useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera is not supported on this device/browser.");
      return;
    }

    setIsStartingCamera(true);
    setCameraError("");
    stopCameraStream();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: cameraFacingMode } },
        audio: false,
      });

      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }
    } catch {
      setCameraError("Unable to access camera. Please allow camera permission or upload from device.");
    } finally {
      setIsStartingCamera(false);
    }
  }, [cameraFacingMode, stopCameraStream]);

  React.useEffect(() => {
    if (isCameraModalOpen) {
      startCameraStream();
      return;
    }
    stopCameraStream();
    setCameraError("");
  }, [isCameraModalOpen, startCameraStream, stopCameraStream]);

  React.useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, [stopCameraStream]);

  const openPhotoSourceModal = () => {
    setIsPhotoSourceModalOpen(true);
  };

  const closePhotoSourceModal = () => {
    setIsPhotoSourceModalOpen(false);
  };

  const closeCameraModal = () => {
    setIsCameraModalOpen(false);
  };

  const handleOpenCamera = () => {
    closePhotoSourceModal();
    setCameraFacingMode("user");
    setIsCameraModalOpen(true);
  };

  const handleOpenFilePicker = () => {
    closePhotoSourceModal();
    setIsCameraModalOpen(false);
    fileInputRef.current?.click();
  };

  const handleCapturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.videoWidth === 0 || video.videoHeight === 0) {
      setCameraError("Camera is still loading. Please try again.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      setCameraError("Could not capture image. Please try again.");
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError("Could not capture image. Please try again.");
          return;
        }

        const capturedFile = new File([blob], `profile-${Date.now()}.jpg`, { type: "image/jpeg" });
        setSelectedAvatarFile(capturedFile);
        previewAvatarFile(capturedFile);
        setIsCameraModalOpen(false);
      },
      "image/jpeg",
      0.92,
    );
  };

  const handleSwitchCamera = () => {
    setCameraFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedAvatarFile(file);
        previewAvatarFile(file);
      } else {
        showToast("Please select an image file.", "error");
      }
    }
    event.target.value = "";
  };

  const uploadProfileImageToS3 = async (token: string) => {
    if (!selectedAvatarFile) {
      return persistedProfilePhotoUrl;
    }

    const signResponse = await fetch(`${API_BASE_URL}/uploads/sign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        contentType: selectedAvatarFile.type,
        kind: "profile",
        prefix: "profiles",
      }),
    });

    const signData = (await signResponse.json().catch(() => ({}))) as SignUploadResponse & { error?: string };
    if (!signResponse.ok || !signData.url || !signData.documentId) {
      throw new Error(signData.error || "Failed to initialize image upload");
    }

    const putResponse = await fetch(signData.url, {
      method: "PUT",
      headers: {
        "Content-Type": selectedAvatarFile.type,
      },
      body: selectedAvatarFile,
    });

    if (!putResponse.ok) {
      throw new Error("Failed to upload image to S3");
    }

    const completeBody = {
      documentId: signData.documentId,
      size: selectedAvatarFile.size,
      publicUrl: signData.publicUrl,
      metadata: { source: "dashboard-profile-edit", kind: "profile" },
    };

    const completeResponse = await fetch(`${API_BASE_URL}/uploads/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(completeBody),
    });

    const completeData = (await completeResponse.json().catch(() => ({}))) as CompleteUploadResponse & { error?: string };
    if (!completeResponse.ok) {
      throw new Error(completeData.error || "Failed to finalize image upload");
    }

    const resolvedUrl = signData.publicUrl || completeData.document?.url;
    if (!resolvedUrl) {
      throw new Error("Uploaded image URL could not be resolved");
    }

    setSelectedAvatarFile(null);
    setPersistedProfilePhotoUrl(resolvedUrl);
    try {
      const signedReadUrl = await getSignedReadableUploadUrl(token, { url: resolvedUrl });
      setAvatarSrc(signedReadUrl);
    } catch {
      setAvatarSrc(resolvedUrl);
    }
    return resolvedUrl;
  };

  const uploadDocumentFileToS3 = async (token: string, file: File) => {
    const signResponse = await fetch(`${API_BASE_URL}/uploads/sign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        contentType: file.type || "application/octet-stream",
        kind: "profile",
        prefix: "profile-documents",
      }),
    });

    const signData = (await signResponse.json().catch(() => ({}))) as SignUploadResponse & { error?: string };
    if (!signResponse.ok || !signData.url || !signData.documentId) {
      throw new Error(signData.error || "Failed to initialize document upload");
    }

    const putResponse = await fetch(signData.url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
      body: file,
    });

    if (!putResponse.ok) {
      throw new Error("Failed to upload document");
    }

    const metadata = {
      source: "dashboard-profile-edit",
      kind: "profile-document",
      fileName: file.name,
      documentType: selectedDocumentType,
    };

    const completeResponse = await fetch(`${API_BASE_URL}/uploads/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        documentId: signData.documentId,
        size: file.size,
        publicUrl: signData.publicUrl,
        metadata,
      }),
    });

    const completeData = (await completeResponse.json().catch(() => ({}))) as CompleteUploadResponse & { error?: string };
    if (!completeResponse.ok) {
      throw new Error(completeData.error || "Failed to finalize document upload");
    }

    return {
      documentId: signData.documentId,
      key: completeData.document?.key || signData.key,
      url: signData.publicUrl || completeData.document?.url,
      contentType: file.type || "application/octet-stream",
      size: file.size,
      metadata,
    };
  };

  const handlePencilClick = (): void => {
    openPhotoSourceModal();
  };

  const handleDocumentTypeChange = (value: string) => {
    setSelectedDocumentType(value);
  };

  const handleOpenDocumentPicker = () => {
    documentInputRef.current?.click();
  };

  const handleDocumentFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedDocumentFile(file);
    }
    event.target.value = "";
  };

  const handleUploadDocument = async () => {
    if (!hasProfile) {
      showToast("Save your profile once before uploading documents.", "info");
      return;
    }

    if (!selectedDocumentType) {
      showToast("Select a document type first.", "info");
      return;
    }

    if (!selectedDocumentFile) {
      showToast("Choose a document to upload.", "info");
      return;
    }

    const token = getAccessToken();
    if (!token) {
      showToast("Session expired. Please login again.", "error");
      return;
    }

    setIsUploadingDocument(true);

    try {
      const uploadedDocument = await uploadDocumentFileToS3(token, selectedDocumentFile);
      const attachResponse = await fetch(`${API_BASE_URL}/profiles/me/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          documentId: uploadedDocument.documentId,
          documentType: selectedDocumentType,
        }),
      });

      const attachData = (await attachResponse.json().catch(() => ({}))) as AddProfileDocumentResponse;
      if (!attachResponse.ok) {
        throw new Error(attachData.error || "Failed to attach document to profile");
      }

      const nextDocument: ProfileDocument = {
        documentId: String(attachData.document?.id ?? uploadedDocument.documentId),
        type: attachData.document?.type ?? selectedDocumentType,
        key: attachData.document?.key ?? uploadedDocument.key,
        url: attachData.document?.url ?? uploadedDocument.url,
        contentType: attachData.document?.contentType ?? uploadedDocument.contentType,
        size: attachData.document?.size ?? uploadedDocument.size,
        metadata: attachData.document?.metadata ?? uploadedDocument.metadata,
        addedAt: new Date().toISOString(),
      };

      setDocuments((prev) => [nextDocument, ...prev.filter((item) => item.documentId !== nextDocument.documentId)]);
      setSelectedDocumentFile(null);
      showToast("Document added successfully.", "success");
    } catch (error: unknown) {
      showToast((error as Error)?.message || "Failed to upload document.", "error");
    } finally {
      setIsUploadingDocument(false);
    }
  };

  const handleOpenDocument = async (document: ProfileDocument) => {
    const token = getAccessToken();
    if (!token) {
      showToast("Session expired. Please login again.", "error");
      return;
    }

    if (!document.url && !document.key) {
      showToast("This document is missing its file link.", "error");
      return;
    }

    setOpeningDocumentId(document.documentId);

    try {
      const signedUrl = await getSignedReadableUploadUrl(token, document.url ? { url: document.url } : { key: document.key });
      window.open(signedUrl, "_blank", "noopener,noreferrer");
    } catch (error: unknown) {
      showToast((error as Error)?.message || "Failed to open document.", "error");
    } finally {
      setOpeningDocumentId(null);
    }
  };

  const handleRemoveDocument = async (document: ProfileDocument) => {
    const token = getAccessToken();
    if (!token) {
      showToast("Session expired. Please login again.", "error");
      return;
    }

    if (!document.documentId) {
      showToast("This document cannot be removed right now.", "error");
      return;
    }

    setRemovingDocumentId(document.documentId);

    try {
      const response = await fetch(`${API_BASE_URL}/profiles/me/documents/${encodeURIComponent(document.documentId)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = (await response.json().catch(() => ({}))) as ProfileApiResponse;
      if (!response.ok) {
        throw new Error((data.error as string) || "Failed to remove document");
      }

      setDocuments((prev) => prev.filter((item) => item.documentId !== document.documentId));
      showToast("Document removed.", "success");
    } catch (error: unknown) {
      showToast((error as Error)?.message || "Failed to remove document.", "error");
    } finally {
      setRemovingDocumentId(null);
    }
  };

  const handleChange = (field: TextFieldKey) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSelectChange = (field: TextFieldKey) => (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleCountryChange = (country: Country) => {
    setSelectedCountryCode(country.code);
  };

  const handleBlur = (field: TextFieldKey) => () => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    validateField(field, formData[field]);
  };

  const handleKeyDataBlur = () => {
    setTouched((prev) => ({
      ...prev,
      keyData: true,
    }));

    validateKeyData(formData.keyData);
  };

  const handleKeyDataChange = (index: number, field: keyof KeyDataEntry, value: string) => {
    let nextKeyData: KeyDataEntry[] = [];

    setFormData((prev) => {
      nextKeyData = prev.keyData.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      );

      return {
        ...prev,
        keyData: nextKeyData,
      };
    });

    if (touched.keyData) {
      validateKeyData(nextKeyData);
    }
  };

  const handleAddKeyDataRow = () => {
    let nextKeyData: KeyDataEntry[] = [];

    setFormData((prev) => {
      nextKeyData = [...prev.keyData, createEmptyKeyDataEntry()];

      return {
        ...prev,
        keyData: nextKeyData,
      };
    });

    if (touched.keyData) {
      validateKeyData(nextKeyData);
    }
  };

  const handleRemoveKeyDataRow = (index: number) => {
    let nextKeyData: KeyDataEntry[] = [];

    setFormData((prev) => {
      nextKeyData = prev.keyData.filter((_, itemIndex) => itemIndex !== index);
      if (nextKeyData.length === 0) {
        nextKeyData = [createEmptyKeyDataEntry()];
      }

      return {
        ...prev,
        keyData: nextKeyData,
      };
    });

    if (touched.keyData) {
      validateKeyData(nextKeyData);
    }
  };

  const validateField = async (fieldName: TextFieldKey, value: string) => {
    try {
      await validationSchema.validateAt(fieldName, { ...formData, [fieldName]: value });
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    } catch (error: unknown) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: (error as Error).message,
      }));
    }
  };

  const validateForm = async () => {
    setTouched(getAllTouched());

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors((prev) => ({
        ...prev,
        ...getEmptyTextErrors(),
      }));
      return validateKeyData(formData.keyData);
    } catch (error: unknown) {
      const newErrors = getEmptyTextErrors();
      if (error instanceof Yup.ValidationError && error.inner) {
        error.inner.forEach((err: Yup.ValidationError) => {
          if (err.path) newErrors[err.path as keyof FormData] = err.message;
        });
      }
      setErrors((prev) => ({
        ...prev,
        ...newErrors,
      }));
      validateKeyData(formData.keyData);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isValid = await validateForm();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      const token = getAccessToken();
      if (!token) {
        showToast("Session expired. Please login again.", "error");
        setIsSubmitting(false);
        return;
      }

      const phoneWithCode = getPhoneWithDialCode(formData.phoneNumber);
      const uploadedProfilePhotoUrl = await uploadProfileImageToS3(token);
      const hasPasswordChange = Boolean(formData.password.trim());

        const payload = {
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phoneNumber: phoneWithCode || undefined,
          dob: dateStringForApi(formData.dob),
          location: formData.location.trim(),
          latitude: locationCoords?.latitude,
          longitude: locationCoords?.longitude,
          state: locationCoords?.state,
        country: locationCoords?.country,
        companyName: formData.companyName.trim() || undefined,
        fundingPreferences: isInvestor ? formData.fundingPreferences || undefined : undefined,
        ticketSizeMin: isInvestor ? numberOrUndefined(formData.ticketSizeMin) : undefined,
        ticketSizeMax: isInvestor ? numberOrUndefined(formData.ticketSizeMax) : undefined,
        portfolioSize: isInvestor ? numberOrUndefined(formData.portfolioSize) : undefined,
        sectorsOfInterest: isInvestor || isBroker ? sanitizeListField(formData.sectorsOfInterest) : undefined,
        amountSeeking: isCompany ? numberOrUndefined(formData.amountSeeking) : undefined,
        businessStage: isCompany ? formData.businessStage || undefined : undefined,
        industrySector: isCompany ? formData.industrySector.trim() || undefined : undefined,
        revenueStatus: isCompany ? formData.revenueStatus || undefined : undefined,
        annualRevenue: isCompany ? numberOrUndefined(formData.annualRevenue) : undefined,
        teamSize: isCompany ? numberOrUndefined(formData.teamSize) : undefined,
        useOfFunds: isCompany ? formData.useOfFunds.trim() || undefined : undefined,
        websiteUrl: isCompany ? sanitizeUrlField(formData.websiteUrl) : undefined,
        licenseRegistrationNumber: isBroker ? formData.licenseRegistrationNumber.trim() || undefined : undefined,
        dealTypeHandled: isBroker ? formData.dealTypeHandled || undefined : undefined,
        commissionStructure: isBroker ? formData.commissionStructure.trim() || undefined : undefined,
        dealsClosed: isBroker ? numberOrUndefined(formData.dealsClosed) : undefined,
        facebookProfile: sanitizeUrlField(formData.facebookProfile),
        xProfile: sanitizeUrlField(formData.xProfile),
        instagramProfile: sanitizeUrlField(formData.instagramProfile),
        linkedinProfile: sanitizeUrlField(formData.linkedinProfile),
        keyData: serializeKeyData(formData.keyData),
        about: formData.about.trim(),
        profilePhoto: uploadedProfilePhotoUrl || persistedProfilePhotoUrl,
      };

      const endpoint = hasProfile ? "/profiles/me/update" : "/profiles/create-profile";
      const method = hasProfile ? "PATCH" : "POST";

      let response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok && method === "PATCH" && response.status === 404) {
        response = await fetch(`${API_BASE_URL}/profiles/create-profile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

        const data: ProfileApiResponse = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(extractApiErrorMessage(data.error, "Error updating profile. Please try again."));
        }

      if (hasPasswordChange) {
        await updatePasswordApi(token, {
          currentPassword: formData.currentPassword.trim(),
          newPassword: formData.password.trim(),
        });
      }

      setHasProfile(true);

      const session = getAuthSession();
      if (session) {
        saveAuthSession({
          ...session,
          user: {
            ...session.user,
            email: formData.email.trim().toLowerCase() || session.user.email,
            phone: phoneWithCode || session.user.phone,
          },
        });
      }

      if (hasPasswordChange) {
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          password: "",
          confirmPassword: "",
        }));
      }

      showToast(
        hasPasswordChange
          ? `${(data.message as string) || "Profile updated successfully!"} Password updated successfully.`
          : (data.message as string) || "Profile updated successfully!",
        "success",
      );
    } catch (error: unknown) {
      showToast((error as Error)?.message || "Error updating profile. Please try again.", "error");
    }

    setIsSubmitting(false);
  };

  const isExternalAvatar = /^(https?:)?\/\//.test(avatarSrc) || avatarSrc.startsWith("blob:") || avatarSrc.startsWith("data:");

  return (
    <AboutEditProfileClientStyled>
      <Box className="avatar_wrap_main_cont">
        <Box className="avatar_wrap">
          <Box className="avatar_fig">
            <Image
              src={avatarSrc}
              alt="user image"
              width={108}
              height={108}
              unoptimized={isExternalAvatar}
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
          </Box>
          <IconButton className="pencil_cont" onClick={handlePencilClick}>
            <Image src="/assets/icons/pencil-icon-editsvg.svg" alt="edit image" width={24} height={24} />
          </IconButton>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            style={{ display: "none" }}
          />
        </Box>
      </Box>
      <Dialog
        open={isPhotoSourceModalOpen}
        onClose={closePhotoSourceModal}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            padding: "20px 20px 16px",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#31445A", textAlign: "center", mb: 2 }}>
            Update profile picture
          </Typography>
          <Stack spacing={1.5}>
            <CustomButtonRounded fullWidth variant="contained" color="primary" onClick={handleOpenCamera} startIcon={<CameraAltRoundedIcon />}>
              Use Camera
            </CustomButtonRounded>
            <CustomButtonTransparent fullWidth onClick={handleOpenFilePicker} startIcon={<PhotoLibraryRoundedIcon />}>
              Upload from Device
            </CustomButtonTransparent>
          </Stack>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isCameraModalOpen}
        onClose={closeCameraModal}
        maxWidth={false}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            overflow: "hidden",
            backgroundColor: "#eef3f8",
            width: { xs: "calc(100vw - 16px)", sm: "min(94vw, 980px)" },
            height: { xs: "min(92dvh, 820px)", sm: "min(88dvh, 760px)" },
            margin: { xs: "8px", sm: "16px" },
          },
        }}
      >
        <DialogContent sx={{ p: 0, height: "100%", overflow: "hidden !important" }}>
          <Box sx={{ position: "relative", width: "100%", height: "100%", bgcolor: "#dbe7f2" }}>
            <IconButton
              onClick={closeCameraModal}
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                zIndex: 3,
                width: 54,
                height: 54,
                bgcolor: "#6D9DC5",
                color: "#fff",
                "&:hover": { bgcolor: "#5b8db7" },
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
            <IconButton
              onClick={handleSwitchCamera}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 3,
                width: 54,
                height: 54,
                bgcolor: "#6D9DC5",
                color: "#fff",
                "&:hover": { bgcolor: "#5b8db7" },
              }}
            >
              <CameraswitchRoundedIcon />
            </IconButton>
            {isStartingCamera && (
              <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", zIndex: 2 }}>
                <CircularProgress />
              </Box>
            )}
            <video ref={videoRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <Box
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                pt: 6,
                pb: "max(16px, env(safe-area-inset-bottom))",
                px: 2,
                background: "linear-gradient(to top, rgba(0,0,0,0.42), rgba(0,0,0,0))",
              }}
            >
            <Typography
              sx={{
                color: "#cfe2f8",
                fontSize: { xs: "16px", md: "18px" },
                fontWeight: 500,
                textAlign: "center",
                mb: 1.2,
              }}
            >
              Press or tap for capturing a photo.
            </Typography>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <IconButton
                  onClick={handleCapturePhoto}
                  disabled={isStartingCamera || Boolean(cameraError)}
                  sx={{
                    zIndex: 3,
                    width: 88,
                    height: 88,
                    border: "4px solid rgba(255,255,255,0.85)",
                    bgcolor: "#6D9DC5",
                    color: "#fff",
                    "&:hover": { bgcolor: "#5b8db7" },
                  }}
                >
                  <CameraAltRoundedIcon sx={{ fontSize: 38 }} />
                </IconButton>
              </Box>
            </Box>
            {cameraError && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor: "rgba(255,255,255,0.88)",
                  zIndex: 4,
                  display: "grid",
                  placeItems: "center",
                  px: 2,
                }}
              >
                <Stack spacing={1.5} sx={{ maxWidth: 420, textAlign: "center" }}>
                  <Typography sx={{ color: "#31445A", fontWeight: 600 }}>{cameraError}</Typography>
                  <CustomButtonRounded variant="contained" color="primary" onClick={startCameraStream}>
                    Retry Camera
                  </CustomButtonRounded>
                  <CustomButtonTransparent onClick={handleOpenFilePicker}>Upload from Device</CustomButtonTransparent>
                </Stack>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={toast.open}
        onClose={handleToastClose}
        autoHideDuration={3200}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{ zIndex: 1600 }}
      >
        <Box
          sx={{
            minWidth: { xs: "88vw", sm: 320 },
            maxWidth: 420,
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #E5ECF6",
            boxShadow: "0px 8px 24px rgba(28, 28, 28, 0.12)",
            px: 1.5,
            py: 1.2,
            color: "#31445A",
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
          }}
          onClick={handleToastClose}
        >
          {toast.variant === "success" ? (
            <CheckCircleRoundedIcon sx={{ color: "#22c55e", fontSize: 20, flexShrink: 0 }} />
          ) : toast.variant === "error" ? (
            <ErrorOutlineRoundedIcon sx={{ color: "#ef4444", fontSize: 20, flexShrink: 0 }} />
          ) : (
            <InfoOutlinedIcon sx={{ color: "#93c5fd", fontSize: 20, flexShrink: 0 }} />
          )}
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: 1.35,
              color: "#31445A",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {toast.message}
          </Typography>
        </Box>
      </Snackbar>
      <Box className="form_wrap">
        <form onSubmit={handleSubmit} autoComplete="off">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomInputProfile
                label="Full Name"
                value={formData.fullName}
                onChange={handleChange("fullName")}
                onBlur={handleBlur("fullName")}
                placeholder="Enter your full name"
                showAsterisk
                error={Boolean(touched.fullName && errors.fullName)}
                helperText={touched.fullName ? errors.fullName : ""}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomInputProfile
                label="Email address"
                value={formData.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                placeholder="Enter your email address"
                type="email"
                showAsterisk
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email ? errors.email : ""}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomInputProfile
                label="Current password"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange("currentPassword")}
                onBlur={handleBlur("currentPassword")}
                placeholder="Enter your current password"
                name="current-password"
                autoComplete="current-password"
                error={Boolean(touched.currentPassword && errors.currentPassword)}
                helperText={touched.currentPassword ? errors.currentPassword : ""}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomInputProfile
                label="New password"
                type="password"
                value={formData.password}
                onChange={handleChange("password")}
                onBlur={handleBlur("password")}
                placeholder="Enter a new password"
                name="new-password"
                autoComplete="new-password"
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password ? errors.password : ""}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomInputProfile
                label="Confirm new password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                placeholder="Confirm your new password"
                name="confirm-new-password"
                autoComplete="new-password"
                error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                helperText={touched.confirmPassword ? errors.confirmPassword : ""}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomInputProfile
                label="Phone number"
                value={formData.phoneNumber}
                onChange={handleChange("phoneNumber")}
                onBlur={handleBlur("phoneNumber")}
                placeholder="99 99 88 77 66"
                type="tel"
                isPhone
                selectedCountryCode={selectedCountryCode}
                onCountryChange={handleCountryChange}
                showAsterisk
                error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                helperText={touched.phoneNumber ? errors.phoneNumber : ""}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomInputProfile
                label="Date of birth"
                value={formData.dob}
                onChange={handleChange("dob")}
                onBlur={handleBlur("dob")}
                placeholder="dd/mm/yyyy"
                isDate
                error={Boolean(touched.dob && errors.dob)}
                helperText={touched.dob ? errors.dob : ""}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomInputProfile
                label="Company name"
                value={formData.companyName}
                onChange={handleChange("companyName")}
                onBlur={handleBlur("companyName")}
                placeholder={isBroker ? "Enter your brokerage or firm name" : "Enter your company name"}
                error={Boolean(touched.companyName && errors.companyName)}
                helperText={touched.companyName ? errors.companyName : ""}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomInputProfile
                label={isLocating ? "Detecting location…" : "Current location"}
                value={formData.location}
                onChange={handleChange("location")}
                onBlur={handleBlur("location")}
                placeholder={isLocating ? "Fetching from GPS…" : "Locate yourself or tap the pin"}
                isLocation
                showAsterisk
                disabled={isLocating}
                onLocationClick={handleGetLocation}
                error={Boolean(touched.location && errors.location)}
                helperText={
                  touched.location && errors.location
                    ? errors.location
                    : locationCoords
                      ? `Exact location captured (${locationCoords.latitude.toFixed(4)}, ${locationCoords.longitude.toFixed(4)})`
                      : ""
                }
              />
            </Grid>
            {isInvestor && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomSelectProfile
                    label="Funding preferences"
                    value={formData.fundingPreferences}
                    onChange={handleSelectChange("fundingPreferences")}
                    onBlur={handleBlur("fundingPreferences")}
                    options={FUNDING_PREFERENCE_OPTIONS}
                    placeholder="Select your preferences"
                    error={Boolean(touched.fundingPreferences && errors.fundingPreferences)}
                    helperText={touched.fundingPreferences ? errors.fundingPreferences : ""}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomInputProfile
                    label="Ticket Size Min"
                    value={formData.ticketSizeMin}
                    onChange={handleChange("ticketSizeMin")}
                    onBlur={handleBlur("ticketSizeMin")}
                    placeholder="Enter minimum investment range"
                    error={Boolean(touched.ticketSizeMin && errors.ticketSizeMin)}
                    helperText={touched.ticketSizeMin ? errors.ticketSizeMin : ""}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomInputProfile
                    label="Ticket Size Max"
                    value={formData.ticketSizeMax}
                    onChange={handleChange("ticketSizeMax")}
                    onBlur={handleBlur("ticketSizeMax")}
                    placeholder="Enter maximum investment range"
                    error={Boolean(touched.ticketSizeMax && errors.ticketSizeMax)}
                    helperText={touched.ticketSizeMax ? errors.ticketSizeMax : ""}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomInputProfile
                    label="Portfolio Size / AUM"
                    value={formData.portfolioSize}
                    onChange={handleChange("portfolioSize")}
                    onBlur={handleBlur("portfolioSize")}
                    placeholder="Enter portfolio size or AUM"
                    error={Boolean(touched.portfolioSize && errors.portfolioSize)}
                    helperText={touched.portfolioSize ? errors.portfolioSize : ""}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomInputProfile
                    label="Sectors of Interest"
                    value={formData.sectorsOfInterest}
                    onChange={handleChange("sectorsOfInterest")}
                    onBlur={handleBlur("sectorsOfInterest")}
                    placeholder="SaaS, FinTech, CleanTech"
                    error={Boolean(touched.sectorsOfInterest && errors.sectorsOfInterest)}
                    helperText={touched.sectorsOfInterest ? errors.sectorsOfInterest : ""}
                  />
                </Grid>
              </>
            )}
            {isCompany && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomInputProfile
                    label="Amount Seeking"
                    value={formData.amountSeeking}
                    onChange={handleChange("amountSeeking")}
                    onBlur={handleBlur("amountSeeking")}
                    placeholder="Enter amount seeking"
                    error={Boolean(touched.amountSeeking && errors.amountSeeking)}
                    helperText={touched.amountSeeking ? errors.amountSeeking : ""}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomSelectProfile
                    label="Business Stage"
                    value={formData.businessStage}
                    onChange={handleSelectChange("businessStage")}
                    onBlur={handleBlur("businessStage")}
                    options={BUSINESS_STAGE_OPTIONS}
                    placeholder="Select business stage"
                    error={Boolean(touched.businessStage && errors.businessStage)}
                    helperText={touched.businessStage ? errors.businessStage : ""}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomInputProfile
                    label="Industry / Sector"
                    value={formData.industrySector}
                    onChange={handleChange("industrySector")}
                    onBlur={handleBlur("industrySector")}
                    placeholder="Enter your industry or sector"
                    error={Boolean(touched.industrySector && errors.industrySector)}
                    helperText={touched.industrySector ? errors.industrySector : ""}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomSelectProfile
                    label="Revenue Status"
                    value={formData.revenueStatus}
                    onChange={handleSelectChange("revenueStatus")}
                    onBlur={handleBlur("revenueStatus")}
                    options={REVENUE_STATUS_OPTIONS}
                    placeholder="Select revenue status"
                    error={Boolean(touched.revenueStatus && errors.revenueStatus)}
                    helperText={touched.revenueStatus ? errors.revenueStatus : ""}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomInputProfile
                    label="Annual Revenue"
                    value={formData.annualRevenue}
                    onChange={handleChange("annualRevenue")}
                    onBlur={handleBlur("annualRevenue")}
                    placeholder="Enter annual revenue"
                    error={Boolean(touched.annualRevenue && errors.annualRevenue)}
                    helperText={touched.annualRevenue ? errors.annualRevenue : ""}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomInputProfile
                    label="Team Size"
                    value={formData.teamSize}
                    onChange={handleChange("teamSize")}
                    onBlur={handleBlur("teamSize")}
                    placeholder="Enter team size"
                    error={Boolean(touched.teamSize && errors.teamSize)}
                    helperText={touched.teamSize ? errors.teamSize : ""}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomInputProfile
                    label="Website URL"
                    value={formData.websiteUrl}
                    onChange={handleChange("websiteUrl")}
                    onBlur={handleBlur("websiteUrl")}
                    placeholder="https://yourcompany.com"
                    error={Boolean(touched.websiteUrl && errors.websiteUrl)}
                    helperText={touched.websiteUrl ? errors.websiteUrl : ""}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <CustomInputProfile
                    label="Use of Funds"
                    value={formData.useOfFunds}
                    onChange={handleChange("useOfFunds")}
                    onBlur={handleBlur("useOfFunds")}
                    placeholder="Product development, hiring, marketing..."
                    multiline
                    rows={4}
                    error={Boolean(touched.useOfFunds && errors.useOfFunds)}
                    helperText={touched.useOfFunds ? errors.useOfFunds : ""}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        alignItems: "flex-start",
                      },
                      "& textarea": {
                        minHeight: "96px !important",
                      },
                    }}
                  />
                </Grid>
              </>
            )}
            {isBroker && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomInputProfile
                    label="License / Registration No."
                    value={formData.licenseRegistrationNumber}
                    onChange={handleChange("licenseRegistrationNumber")}
                    onBlur={handleBlur("licenseRegistrationNumber")}
                    placeholder="Enter your license or registration number"
                    error={Boolean(touched.licenseRegistrationNumber && errors.licenseRegistrationNumber)}
                    helperText={touched.licenseRegistrationNumber ? errors.licenseRegistrationNumber : ""}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomSelectProfile
                    label="Deal Types Handled"
                    value={formData.dealTypeHandled}
                    onChange={handleSelectChange("dealTypeHandled")}
                    onBlur={handleBlur("dealTypeHandled")}
                    options={DEAL_TYPE_OPTIONS}
                    placeholder="Select deal type"
                    error={Boolean(touched.dealTypeHandled && errors.dealTypeHandled)}
                    helperText={touched.dealTypeHandled ? errors.dealTypeHandled : ""}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomInputProfile
                    label="Sectors of Interest"
                    value={formData.sectorsOfInterest}
                    onChange={handleChange("sectorsOfInterest")}
                    onBlur={handleBlur("sectorsOfInterest")}
                    placeholder="SaaS, FinTech, CleanTech"
                    error={Boolean(touched.sectorsOfInterest && errors.sectorsOfInterest)}
                    helperText={touched.sectorsOfInterest ? errors.sectorsOfInterest : ""}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomInputProfile
                    label="Commission Structure"
                    value={formData.commissionStructure}
                    onChange={handleChange("commissionStructure")}
                    onBlur={handleBlur("commissionStructure")}
                    placeholder="e.g. 2% or fixed fee"
                    error={Boolean(touched.commissionStructure && errors.commissionStructure)}
                    helperText={touched.commissionStructure ? errors.commissionStructure : ""}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomInputProfile
                    label="Deals Closed"
                    value={formData.dealsClosed}
                    onChange={handleChange("dealsClosed")}
                    onBlur={handleBlur("dealsClosed")}
                    placeholder="Enter total deals closed"
                    error={Boolean(touched.dealsClosed && errors.dealsClosed)}
                    helperText={touched.dealsClosed ? errors.dealsClosed : ""}
                  />
                </Grid>
              </>
            )}
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomInputProfile
                label="LinkedIn profile"
                value={formData.linkedinProfile}
                onChange={handleChange("linkedinProfile")}
                onBlur={handleBlur("linkedinProfile")}
                placeholder="Enter LinkedIn profile link"
                showAsterisk
                error={Boolean(touched.linkedinProfile && errors.linkedinProfile)}
                helperText={touched.linkedinProfile ? errors.linkedinProfile : ""}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomInputProfile
                label="Facebook profile"
                value={formData.facebookProfile}
                onChange={handleChange("facebookProfile")}
                onBlur={handleBlur("facebookProfile")}
                placeholder="Enter Facebook profile link"
                error={Boolean(touched.facebookProfile && errors.facebookProfile)}
                helperText={touched.facebookProfile ? errors.facebookProfile : ""}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomInputProfile
                label="X profile"
                value={formData.xProfile}
                onChange={handleChange("xProfile")}
                onBlur={handleBlur("xProfile")}
                placeholder="Enter X profile link"
                error={Boolean(touched.xProfile && errors.xProfile)}
                helperText={touched.xProfile ? errors.xProfile : ""}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomInputProfile
                label="Instagram profile"
                value={formData.instagramProfile}
                onChange={handleChange("instagramProfile")}
                onBlur={handleBlur("instagramProfile")}
                placeholder="Enter Instagram profile link"
                error={Boolean(touched.instagramProfile && errors.instagramProfile)}
                helperText={touched.instagramProfile ? errors.instagramProfile : ""}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RichTextPanel
                label="About"
                value={formData.about}
                onChange={handleChange("about")}
                onBlur={handleBlur("about")}
                placeholder="Write a short summary about yourself or your business..."
                error={Boolean(touched.about && errors.about)}
                helperText={touched.about ? errors.about : ""}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ProfileDocumentsSection
                role={profileRole}
                documents={documents}
                selectedDocumentType={selectedDocumentType}
                selectedFileName={selectedDocumentFile?.name}
                isProfileReady={hasProfile}
                isUploading={isUploadingDocument}
                openingDocumentId={openingDocumentId}
                removingDocumentId={removingDocumentId}
                fileInputRef={documentInputRef}
                onDocumentTypeChange={handleDocumentTypeChange}
                onChooseFile={handleOpenDocumentPicker}
                onFileChange={handleDocumentFileChange}
                onUpload={handleUploadDocument}
                onOpen={handleOpenDocument}
                onRemove={handleRemoveDocument}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <KeyDataEditor
                role={profileRole}
                value={formData.keyData}
                rowErrors={keyDataRowErrors}
                sectionError={errors.keyData}
                showErrors={Boolean(touched.keyData)}
                onChange={handleKeyDataChange}
                onAdd={handleAddKeyDataRow}
                onRemove={handleRemoveKeyDataRow}
                onBlur={handleKeyDataBlur}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box className="update_btn_cont">
                <CustomButtonRounded
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                  isSubmitting={isSubmitting || isLoadingProfile}
                  className="update_btn"
                  disabled={isSubmitting || isLoadingProfile}
                >
                  {isSubmitting ? "Updating..." : isLoadingProfile ? "Loading..." : "Update"}
                </CustomButtonRounded>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </AboutEditProfileClientStyled>
  );
};

export default EditProfileClient;
