import { common, error, primary, secondary } from "./palette"

/**
 * Shared design tokens.
 *
 * `palette.ts` answers "which colours exist"; this file answers "what do they
 * mean and how big are things". The values are not new — they are the ones the
 * match deck, notification toast and call dialog already settled on, lifted out
 * of those components so a new surface inherits the same language instead of
 * approximating it with fresh hex codes.
 *
 * Every colour here resolves through `palette.ts`. Nothing in this file should
 * introduce a literal hex that the palette does not already own; the rgba values
 * below are tints of palette colours, not new ones.
 */

/** 4px base scale. Use these instead of arbitrary pixel values. */
export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
} as const

export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 999,
} as const

export const elevation = {
  /** Resting cards and rows. */
  raised: "0 1px 2px rgba(13, 28, 46, 0.06)",
  /** Hovered/active rows. */
  lifted: "0 8px 20px rgba(13, 28, 46, 0.10)",
  /** Toasts and popovers — matches NotificationCenterProvider. */
  overlay: "0 12px 32px rgba(13, 28, 46, 0.16)",
  /** Right-anchored drawers. */
  drawer: "-8px 0 24px rgba(13, 28, 46, 0.08)",
} as const

export const motion = {
  fast: "140ms",
  base: "200ms",
  slow: "280ms",
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const

export const typeScale = {
  /** Section and drawer titles. */
  title: { size: 16, weight: 700, line: 1.3 },
  /** Row primary text (names). */
  body: { size: 14, weight: 600, line: 1.35 },
  /** Row secondary text. */
  meta: { size: 12, weight: 400, line: 1.4 },
  /** Chips, badges, timestamps. */
  caption: { size: 11, weight: 600, line: 1.2 },
} as const

/**
 * Semantic colours for the swipe decisions. These mirror the match deck's
 * action dock exactly, so a Connect button in the shortlist drawer is the same
 * colour as the Connect button under the card.
 */
export const intent = {
  pass: {
    fg: error.main,
    border: "rgba(217, 45, 32, 0.28)",
    tint: "rgba(217, 45, 32, 0.08)",
  },
  shortlist: {
    fg: secondary.main,
    border: "rgba(48, 102, 190, 0.28)",
    tint: "rgba(48, 102, 190, 0.08)",
  },
  connect: {
    fg: common.white,
    border: "transparent",
    gradient: `linear-gradient(135deg, ${primary.main}, ${secondary.main})`,
  },
} as const

/** Neutral surface roles, so components stop reaching into `common` directly. */
export const surface = {
  page: common.white,
  sunken: common.colorF7F9FB,
  line: common.color6D9DC5,
  lineSoft: "rgba(109, 157, 197, 0.28)",
  heading: common.color0D1C2E,
  muted: common.color6D9DC5,
} as const
