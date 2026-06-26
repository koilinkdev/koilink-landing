"use client";

import React from "react";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import { common, primary } from "@/theme/palette";
import { GalleryPhoto, MAX_GALLERY_PHOTOS } from "@/lib/profileGallery";

type ProfileGallerySectionProps = {
  photos: GalleryPhoto[];
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onChooseFiles: () => void;
  onFilesSelected: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
};

const ProfileGallerySection = ({
  photos,
  fileInputRef,
  onChooseFiles,
  onFilesSelected,
  onRemove,
  onRetry,
  onReorder,
}: ProfileGallerySectionProps) => {
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [overIndex, setOverIndex] = React.useState<number | null>(null);

  const filledCount = photos.length;
  // Always render a fixed 6-slot grid (Bumble/Tinder style) so the affordance is obvious.
  const slots = Array.from({ length: MAX_GALLERY_PHOTOS }, (_, index) => photos[index] ?? null);
  const firstEmptyIndex = filledCount < MAX_GALLERY_PHOTOS ? filledCount : -1;

  const handleDragStart = (index: number) => () => setDragIndex(index);
  const handleDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
  };
  const handleDragOver = (index: number) => (event: React.DragEvent) => {
    if (dragIndex === null) return; // ignore files dragged from the OS
    event.preventDefault();
    if (index !== overIndex) setOverIndex(index);
  };
  const handleDrop = (index: number) => (event: React.DragEvent) => {
    if (dragIndex === null) return;
    event.preventDefault();
    if (dragIndex !== index && index < filledCount) onReorder(dragIndex, index);
    handleDragEnd();
  };

  return (
    <Box sx={{ maxWidth: 470, mx: "auto", textAlign: "center" }}>
      <Typography sx={{ fontSize: "17px", fontWeight: 600, color: primary.main }}>
        Profile Photos
      </Typography>
      <Typography
        sx={{
          mt: 0.5,
          mb: 2,
          fontSize: "12.5px",
          lineHeight: 1.5,
          color: common.color6D9DC5,
        }}
      >
        Add up to {MAX_GALLERY_PHOTOS} photos. Drag to reorder - your{" "}
        <Box component="span" sx={{ color: primary.main, fontWeight: 600 }}>
          first photo
        </Box>{" "}
        is your main profile picture.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1.25,
        }}
      >
        {slots.map((photo, index) => {
          const isCover = index === 0;
          const isDragTarget =
            overIndex === index && dragIndex !== null && dragIndex !== index && index < filledCount;

          // ---- Filled slot ----------------------------------------------------
          if (photo) {
            return (
              <Box
                key={photo.id}
                draggable={photo.status === "ready"}
                onDragStart={handleDragStart(index)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver(index)}
                onDrop={handleDrop(index)}
                sx={{
                  position: "relative",
                  aspectRatio: "1 / 1",
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: `${isCover ? 2 : 1}px solid ${isCover ? primary.main : common.colorE8EBEC}`,
                  backgroundColor: common.colorF8F8F8,
                  cursor: photo.status === "ready" ? "grab" : "default",
                  opacity: dragIndex === index ? 0.4 : 1,
                  outline: isDragTarget ? `2px dashed ${primary.main}` : "none",
                  outlineOffset: "2px",
                  transition: "outline 0.15s ease, opacity 0.15s ease",
                  "&:hover .gallery_drag_hint": { opacity: photo.status === "ready" ? 1 : 0 },
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.previewUrl}
                  alt={`Profile photo ${index + 1}`}
                  draggable={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    filter: photo.status === "uploading" ? "brightness(0.6)" : "none",
                  }}
                />

                {isCover && photo.status === "ready" && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      py: 0.4,
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: common.white,
                      background: `linear-gradient(to top, ${primary.main}, ${primary.main}cc)`,
                    }}
                  >
                    Main
                  </Box>
                )}

                {photo.status === "ready" && (
                  <Box
                    className="gallery_drag_hint"
                    sx={{
                      position: "absolute",
                      top: 4,
                      left: 4,
                      width: 22,
                      height: 22,
                      borderRadius: "8px",
                      display: "grid",
                      placeItems: "center",
                      color: common.white,
                      backgroundColor: "rgba(13, 28, 46, 0.45)",
                      opacity: 0,
                      transition: "opacity 0.15s ease",
                      pointerEvents: "none",
                    }}
                  >
                    <DragIndicatorRoundedIcon sx={{ fontSize: 15 }} />
                  </Box>
                )}

                {photo.status === "uploading" && (
                  <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                    <CircularProgress size={26} sx={{ color: common.white }} />
                  </Box>
                )}

                {photo.status === "error" && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.5,
                      backgroundColor: "rgba(217, 45, 32, 0.55)",
                      color: common.white,
                    }}
                  >
                    <Typography sx={{ fontSize: "10.5px", fontWeight: 600 }}>Failed</Typography>
                    <IconButton
                      size="small"
                      onClick={() => onRetry(photo.id)}
                      aria-label="Retry upload"
                      sx={{ color: common.white, p: 0.25 }}
                    >
                      <ReplayRoundedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                )}

                {photo.status !== "uploading" && (
                  <IconButton
                    size="small"
                    onClick={() => onRemove(photo.id)}
                    aria-label={`Remove photo ${index + 1}`}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      width: 24,
                      height: 24,
                      color: common.white,
                      backgroundColor: "rgba(13, 28, 46, 0.55)",
                      "&:hover": { backgroundColor: "rgba(13, 28, 46, 0.82)" },
                    }}
                  >
                    <CloseRoundedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                )}
              </Box>
            );
          }

          // ---- Empty slot -----------------------------------------------------
          const isActiveAddTile = index === firstEmptyIndex;
          return (
            <Box
              key={`empty-${index}`}
              role="button"
              tabIndex={0}
              onClick={onChooseFiles}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onChooseFiles();
                }
              }}
              sx={{
                aspectRatio: "1 / 1",
                borderRadius: "16px",
                border: `1.5px dashed ${isActiveAddTile ? primary.main : common.colorD5D7DA}`,
                backgroundColor: isActiveAddTile ? "#F1FAFA" : "#FBFCFE",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                color: isActiveAddTile ? primary.main : common.colorA7B4BF,
                cursor: "pointer",
                outline: "none",
                transition: "border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease",
                "&:hover": {
                  borderColor: primary.main,
                  color: primary.main,
                  backgroundColor: "#F1FAFA",
                },
                "&:focus-visible": {
                  borderColor: primary.main,
                  borderStyle: "solid",
                  color: primary.main,
                  backgroundColor: "#F1FAFA",
                },
              }}
            >
              <AddRoundedIcon sx={{ fontSize: isActiveAddTile ? 26 : 22 }} />
              {isActiveAddTile && (
                <Typography sx={{ fontSize: "11px", fontWeight: 600 }}>Add photo</Typography>
              )}
            </Box>
          );
        })}
      </Box>

      <Typography sx={{ mt: 1.25, fontSize: "12px", color: common.color6D9DC5 }}>
        {filledCount}/{MAX_GALLERY_PHOTOS} photos added
      </Typography>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onFilesSelected}
        style={{ display: "none" }}
      />
    </Box>
  );
};

export default ProfileGallerySection;
