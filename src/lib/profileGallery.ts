export const MAX_GALLERY_PHOTOS = 6;
// Per-file cap for gallery uploads. Keep in sync with any S3/CDN limits.
export const MAX_GALLERY_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const ACCEPTED_GALLERY_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export type GalleryPhotoStatus = "uploading" | "ready" | "error";

export type GalleryPhoto = {
  /** Stable client-side id so React keys + reorder/remove stay correct during uploads. */
  id: string;
  /** Persisted S3 public URL. Undefined until the upload completes. */
  url?: string;
  /** What we actually render: a local object URL (instant) or a signed-read URL. */
  previewUrl: string;
  status: GalleryPhotoStatus;
};

let galleryIdCounter = 0;
export const createGalleryId = () => {
  galleryIdCounter += 1;
  return `gallery-${Date.now()}-${galleryIdCounter}`;
};

export const isAcceptedGalleryFile = (file: File) =>
  file.type.startsWith("image/") &&
  (ACCEPTED_GALLERY_MIME.includes(file.type) || file.type === "image/jpg");

/** URLs of fully-uploaded photos, in display order — what gets persisted on save. */
export const toGalleryUrls = (photos: GalleryPhoto[]) =>
  photos.filter((photo) => photo.status === "ready" && photo.url).map((photo) => photo.url as string);
