export type KeyDataEntry = {
  field: string;
  investor: string;
  company: string;
};

export type KeyDataOption = {
  value: string;
  label: string;
};

export type KeyDataRole = "investor" | "company" | "broker";

type KeyDataColumnLabels = {
  field: string;
  investor: string;
  company: string;
};

type KeyDataRoleConfig = {
  options: KeyDataOption[];
  columnLabels: KeyDataColumnLabels;
};

export const KEY_DATA_MAX_ITEMS = 8;

const KEY_DATA_ROLE_CONFIG: Record<KeyDataRole, KeyDataRoleConfig> = {
  investor: {
    options: [
      { value: "focus-areas", label: "Focus Areas" },
      { value: "ticket-size", label: "Ticket Size" },
      { value: "portfolio-size", label: "Portfolio Size / AUM" },
      { value: "sector-interest", label: "Sectors of Interest" },
    ],
    columnLabels: {
      field: "Field",
      investor: "Investor",
      company: "Company",
    },
  },
  company: {
    options: [
      { value: "traction", label: "Traction" },
      { value: "funding-readiness", label: "Funding Readiness" },
      { value: "business-model", label: "Business Model" },
      { value: "company-strength", label: "Company Strength" },
    ],
    columnLabels: {
      field: "Startup Metrics",
      investor: "Investor Fit",
      company: "Company Stats",
    },
  },
  broker: {
    options: [
      { value: "deal-flow", label: "Deal Flow" },
      { value: "sector-coverage", label: "Sector Coverage" },
      { value: "client-network", label: "Client Network" },
      { value: "execution-track-record", label: "Execution Track Record" },
    ],
    columnLabels: {
      field: "Broker Stats",
      investor: "Avg. Deal Size",
      company: "Success Rate",
    },
  },
};

export const KEY_DATA_OPTIONS: KeyDataOption[] = KEY_DATA_ROLE_CONFIG.investor.options;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toTrimmedString = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const normalizeKeyDataField = (value: unknown) => toTrimmedString(value);

const resolveKeyDataRole = (role?: string): KeyDataRole =>
  role === "company" || role === "broker" ? role : "investor";

export const getKeyDataOptions = (role?: string) =>
  KEY_DATA_ROLE_CONFIG[resolveKeyDataRole(role)].options;

export const getKeyDataColumnLabels = (role?: string) =>
  KEY_DATA_ROLE_CONFIG[resolveKeyDataRole(role)].columnLabels;

export const createEmptyKeyDataEntry = (): KeyDataEntry => ({
  field: "",
  investor: "",
  company: "",
});

export const hasKeyDataContent = (entry: KeyDataEntry) =>
  Boolean(entry.field.trim() || entry.investor.trim() || entry.company.trim());

const normalizeKeyDataEntry = (value: unknown): KeyDataEntry => {
  if (!isRecord(value)) {
    return createEmptyKeyDataEntry();
  }

  return {
    field: normalizeKeyDataField(value.field),
    investor: toTrimmedString(value.investor),
    company: toTrimmedString(value.company),
  };
};

const normalizeKeyDataArray = (value: unknown[]) =>
  value
    .map(normalizeKeyDataEntry)
    .filter(hasKeyDataContent);

export const parseKeyData = (value: unknown): KeyDataEntry[] => {
  if (Array.isArray(value)) {
    return normalizeKeyDataArray(value);
  }

  if (typeof value !== "string") {
    return [];
  }

  const raw = value.trim();
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return normalizeKeyDataArray(parsed);
    }
  } catch {
    // Keep supporting older plain-text values already stored in profiles.
  }

  return [
    {
      field: "focus-areas",
      investor: raw,
      company: "",
    },
  ];
};

export const serializeKeyData = (value: KeyDataEntry[]) => {
  const normalized = value
    .map((entry) => ({
      field: normalizeKeyDataField(entry.field),
      investor: entry.investor.trim(),
      company: entry.company.trim(),
    }))
    .filter(hasKeyDataContent);

  return normalized.length > 0 ? JSON.stringify(normalized) : "";
};

export const getKeyDataFieldLabel = (value?: string, role?: string) => {
  const options = getKeyDataOptions(role);

  if (!value) {
    return options[0]?.label ?? "Focus Areas";
  }

  const normalizedValue = normalizeKeyDataField(value);
  const match =
    options.find((option) => option.value === normalizedValue) ??
    Object.values(KEY_DATA_ROLE_CONFIG)
      .flatMap((config) => config.options)
      .find((option) => option.value === normalizedValue);

  if (match) {
    return match.label;
  }

  return normalizedValue
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
