"use client";

import React from "react";
import {
  Box,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CustomSelectProfile, { StyledLabel } from "@/components/ui/Dashboard/CustomSelectTagProfile";
import { CustomButtonRounded } from "@/components/ui/Dashboard/CustomButtonRounded";
import { CustomButtonTransparent } from "@/components/ui/Dashboard/CustomButtonTransparent";
import { common, primary } from "@/theme/palette";
import {
  formatDocumentSize,
  getDocumentTypeLabel,
  getDocumentTypeOptions,
  getProfileDocumentName,
  ProfileDocument,
} from "@/lib/profileDocuments";

type ProfileDocumentsSectionProps = {
  role?: string;
  documents: ProfileDocument[];
  selectedDocumentType: string;
  selectedFileName?: string;
  isProfileReady: boolean;
  isUploading: boolean;
  openingDocumentId?: string | null;
  removingDocumentId?: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onDocumentTypeChange: (value: string) => void;
  onChooseFile: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  onOpen: (document: ProfileDocument) => void;
  onRemove: (document: ProfileDocument) => void;
};

const ProfileDocumentsSection = ({
  role,
  documents,
  selectedDocumentType,
  selectedFileName,
  isProfileReady,
  isUploading,
  openingDocumentId,
  removingDocumentId,
  fileInputRef,
  onDocumentTypeChange,
  onChooseFile,
  onFileChange,
  onUpload,
  onOpen,
  onRemove,
}: ProfileDocumentsSectionProps) => {
  const documentTypeOptions = React.useMemo(() => getDocumentTypeOptions(role), [role]);
  const canUpload = isProfileReady && Boolean(selectedDocumentType) && Boolean(selectedFileName) && !isUploading;
  const actionButtonStyles = {
    flex: 1,
    minWidth: 0,
    minHeight: 50,
    maxHeight: "none",
    px: 2,
    fontSize: "15px",
    lineHeight: 1.2,
    whiteSpace: "nowrap",
    textTransform: "none",
    "& .MuiButton-startIcon": {
      marginLeft: 0,
      marginRight: "8px",
    },
  } as const;

  return (
    <Box>
      <StyledLabel>Documents</StyledLabel>
      <Typography
        sx={{
          mb: 1.5,
          fontSize: "12px",
          lineHeight: 1.5,
          color: common.color6D9DC5,
        }}
      >
        Upload supporting files like decks, licenses, statements, or plans so your profile stays ready to share.
      </Typography>

      <Stack spacing={1.5}>
        <Box>
          <CustomSelectProfile
            label="Document Type"
            value={selectedDocumentType}
            onChange={(event) => onDocumentTypeChange(String(event.target.value))}
            options={documentTypeOptions}
            placeholder={documentTypeOptions.length > 0 ? "Select document type" : "No document types available"}
            disabled={documentTypeOptions.length === 0}
          />
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} alignItems="stretch">
          <CustomButtonTransparent
            onClick={onChooseFile}
            disabled={!isProfileReady}
            startIcon={<UploadFileRoundedIcon />}
            sx={{
              ...actionButtonStyles,
              borderColor: common.colorD5D7DA,
              "&.Mui-disabled": {
                backgroundColor: "#FBFCFE",
                borderColor: common.colorE5ECF6,
                color: common.colorA7B4BF,
              },
            }}
          >
            Choose File
          </CustomButtonTransparent>

          <CustomButtonRounded
            variant="contained"
            color="primary"
            onClick={onUpload}
            disabled={!canUpload}
            sx={{
              ...actionButtonStyles,
              "&.Mui-disabled": {
                backgroundColor: "#DCEAF7",
                color: "#7EA7CB",
              },
            }}
          >
            {isUploading ? "Uploading..." : "Add Document"}
          </CustomButtonRounded>
        </Stack>

        <input
          ref={fileInputRef}
          type="file"
          onChange={onFileChange}
          style={{ display: "none" }}
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,image/*"
        />

        {selectedFileName && (
          <Box
            sx={{
              px: 1.5,
              py: 1.25,
              borderRadius: "14px",
              border: `1px dashed ${common.colorD5D7DA}`,
              backgroundColor: backgroundTint,
            }}
          >
            <Typography sx={{ fontSize: "13px", color: common.color31445A }}>
              Ready to upload: {selectedFileName}
            </Typography>
          </Box>
        )}

        {!isProfileReady && (
          <Typography sx={{ fontSize: "12px", lineHeight: 1.5, color: common.color6D9DC5 }}>
            Save your profile once, then you can start adding documents here.
          </Typography>
        )}

        <Stack spacing={1}>
          {documents.length > 0 ? documents.map((document) => {
            const metaLine = [
              getDocumentTypeLabel(document.type),
              formatDocumentSize(document.size),
            ].filter(Boolean).join(" • ");

            return (
              <Box
                key={document.documentId}
                sx={{
                  px: 1.5,
                  py: 1.25,
                  borderRadius: "14px",
                  border: `1px solid ${common.colorE8EBEC}`,
                  backgroundColor: "#FBFCFE",
                }}
              >
                <Stack direction="row" spacing={1.25} alignItems="flex-start" justifyContent="space-between">
                  <Stack direction="row" spacing={1.25} alignItems="flex-start" sx={{ minWidth: 0, flex: 1 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "12px",
                        display: "grid",
                        placeItems: "center",
                        backgroundColor: "#EAF7F7",
                        color: primary.main,
                        flexShrink: 0,
                      }}
                    >
                      <InsertDriveFileOutlinedIcon fontSize="small" />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 600,
                          lineHeight: 1.4,
                          color: common.color31445A,
                          wordBreak: "break-word",
                        }}
                      >
                        {getProfileDocumentName(document)}
                      </Typography>
                      {metaLine && (
                        <Typography sx={{ mt: 0.25, fontSize: "12px", color: common.color6D9DC5 }}>
                          {metaLine}
                        </Typography>
                      )}
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                    <IconButton
                      onClick={() => onOpen(document)}
                      disabled={openingDocumentId === document.documentId}
                      aria-label={`Open ${getProfileDocumentName(document)}`}
                      sx={{
                        color: primary.main,
                      }}
                    >
                      <OpenInNewRoundedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => onRemove(document)}
                      disabled={removingDocumentId === document.documentId}
                      aria-label={`Remove ${getProfileDocumentName(document)}`}
                      sx={{
                        color: "#d32f2f",
                      }}
                    >
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
              </Box>
            );
          }) : (
            <Box
              sx={{
                px: 1.5,
                py: 2,
                borderRadius: "14px",
                border: `1px dashed ${common.colorD5D7DA}`,
                backgroundColor: "#FBFCFE",
                textAlign: "center",
              }}
            >
              <Typography sx={{ fontSize: "13px", color: common.color6D9DC5 }}>
                No documents added yet.
              </Typography>
            </Box>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

const backgroundTint = "#F8FBFD";

export default ProfileDocumentsSection;
