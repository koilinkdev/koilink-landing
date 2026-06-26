export type ProfileDocument = {
  documentId: string;
  type: string;
  addedAt?: string;
  key?: string;
  url?: string;
  contentType?: string;
  size?: number;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};

type DocumentTypeOption = {
  value: string;
  label: string;
};

const DOCUMENT_TYPE_OPTIONS: Record<string, DocumentTypeOption[]> = {
  investor: [
    { value: "accreditation_certificate", label: "Accreditation Certificate" },
    { value: "proof_of_funds", label: "Proof of Funds" },
    { value: "tax_documents", label: "Tax Documents" },
    { value: "portfolio_statement", label: "Portfolio Statement" },
    { value: "bank_statement", label: "Bank Statement" },
    { value: "identity_document", label: "Identity Document" },
  ],
  company: [
    { value: "business_license", label: "Business License" },
    { value: "incorporation_certificate", label: "Incorporation Certificate" },
    { value: "tax_id_document", label: "Tax ID Document" },
    { value: "pitch_deck", label: "Pitch Deck" },
    { value: "business_plan", label: "Business Plan" },
    { value: "financial_statements", label: "Financial Statements" },
    { value: "cap_table", label: "Cap Table" },
    { value: "term_sheet", label: "Term Sheet" },
    { value: "founder_agreement", label: "Founder Agreement" },
    { value: "intellectual_property", label: "Intellectual Property" },
  ],
  broker: [
    { value: "broker_license", label: "Broker License" },
    { value: "certification_documents", label: "Certification Documents" },
    { value: "insurance_certificate", label: "Insurance Certificate" },
    { value: "professional_references", label: "Professional References" },
    { value: "deal_closure_proof", label: "Deals Closed Proof" },
    { value: "compliance_documents", label: "Compliance Documents" },
    { value: "background_check", label: "Background Check" },
  ],
  admin: [],
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toOptionalString = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;

const toOptionalStringValue = (value: unknown) => {
  const direct = toOptionalString(value);
  if (direct) return direct;

  if (value && typeof value === "object" && typeof (value as { toString?: () => string }).toString === "function") {
    const stringValue = (value as { toString: () => string }).toString();
    return stringValue && stringValue !== "[object Object]" ? stringValue : undefined;
  }

  return undefined;
};

const toOptionalNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

const humanize = (value?: string) => {
  if (!value) return "";
  return value
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getDocumentTypeOptions = (role?: string) =>
  DOCUMENT_TYPE_OPTIONS[role ?? ""] ?? [];

export const getDocumentTypeLabel = (value?: string) => {
  if (!value) return "Document";

  const options = Object.values(DOCUMENT_TYPE_OPTIONS).flat();
  const match = options.find((option) => option.value === value);
  return match?.label ?? humanize(value);
};

export const formatDocumentSize = (size?: number) => {
  if (!size || size <= 0) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

// Matches our generated S3 object names, e.g. "1778052781918-GWL8kQ.png"
// (`<timestamp>-<nanoid>[.ext]`). These are not human-readable, so we never
// surface them as a document title.
const GENERATED_KEY_NAME = /^\d{10,}-[A-Za-z0-9_-]{4,}(\.[A-Za-z0-9]+)?$/;

export const getProfileDocumentName = (document: ProfileDocument) => {
  const metadataName = typeof document.metadata?.fileName === "string" ? document.metadata.fileName.trim() : "";
  if (metadataName) {
    return metadataName;
  }

  const source = document.url || document.key || "";
  const lastSegment = (source.split("/").filter(Boolean).pop() || "").trim();

  // Fall back to the human document-type label (e.g. "Professional References")
  // instead of the raw S3 key when there's no original filename to show.
  if (!lastSegment || GENERATED_KEY_NAME.test(lastSegment)) {
    return getDocumentTypeLabel(document.type) || "Document";
  }

  return lastSegment;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractProfileDocuments = (profile: any, preferredRole?: string): ProfileDocument[] => {
  if (!profile || typeof profile !== "object") {
    return [];
  }

  const candidateRoles = [preferredRole, profile.roleType, "investor", "company", "broker"].filter(
    (value, index, array): value is string => Boolean(value) && array.indexOf(value) === index,
  );

  const rawDocuments =
    candidateRoles
      .map((role) => profile?.[`${role}Profile`]?.documents)
      .find((documents) => Array.isArray(documents)) ?? [];

  const documents = rawDocuments.map((rawEntry: unknown): ProfileDocument | null => {
      if (!isRecord(rawEntry)) {
        return null;
      }

      const nestedDocument = isRecord(rawEntry.documentId) ? rawEntry.documentId : undefined;
      const documentId =
        toOptionalStringValue(rawEntry.documentId) ??
        toOptionalStringValue(nestedDocument?._id) ??
        "";

      const metadata = isRecord(rawEntry.metadata)
        ? rawEntry.metadata
        : isRecord(nestedDocument?.metadata)
          ? nestedDocument.metadata
          : undefined;

      return {
        documentId,
        type: toOptionalString(rawEntry.type) ?? "document",
        addedAt: toOptionalString(rawEntry.addedAt),
        key: toOptionalString(rawEntry.key) ?? toOptionalString(nestedDocument?.key),
        url: toOptionalString(rawEntry.url) ?? toOptionalString(nestedDocument?.url),
        contentType:
          toOptionalString(rawEntry.contentType) ?? toOptionalString(nestedDocument?.contentType),
        size: toOptionalNumber(rawEntry.size) ?? toOptionalNumber(nestedDocument?.size),
        metadata,
        createdAt:
          toOptionalString(rawEntry.createdAt) ?? toOptionalString(nestedDocument?.createdAt),
        updatedAt:
          toOptionalString(rawEntry.updatedAt) ?? toOptionalString(nestedDocument?.updatedAt),
      };
    });

  return documents.filter((document): document is ProfileDocument => Boolean(document && document.documentId));
};
