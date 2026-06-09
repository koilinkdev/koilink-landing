"use client";

import React from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { common, primary } from "@/theme/palette";
import {
  formatDocumentSize,
  getDocumentTypeLabel,
  getProfileDocumentName,
  ProfileDocument,
} from "@/lib/profileDocuments";

type ProfileDocumentsDisplayProps = {
  documents: ProfileDocument[];
  emptyMessage?: string;
  openingDocumentId?: string | null;
  onOpen?: (document: ProfileDocument) => void;
};

const ProfileDocumentsDisplay = ({
  documents,
  emptyMessage = "No documents added yet.",
  openingDocumentId,
  onOpen,
}: ProfileDocumentsDisplayProps) => {
  if (documents.length === 0) {
    return (
      <Typography variant="caption" sx={{ color: common.color6D9DC5 }}>
        {emptyMessage}
      </Typography>
    );
  }

  return (
    <Stack spacing={1}>
      {documents.map((document) => {
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
              backgroundColor: common.white,
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

              {onOpen && (
                <IconButton
                  onClick={() => onOpen(document)}
                  disabled={openingDocumentId === document.documentId}
                  aria-label={`Open ${getProfileDocumentName(document)}`}
                  sx={{ color: primary.main, flexShrink: 0 }}
                >
                  <OpenInNewRoundedIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
};

export default ProfileDocumentsDisplay;
