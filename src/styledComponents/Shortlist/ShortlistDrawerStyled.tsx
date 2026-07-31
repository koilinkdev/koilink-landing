import { Drawer, styled } from "@mui/material"
import { primary } from "@/theme/palette"
import {
  elevation,
  intent,
  motion,
  radius,
  space,
  surface,
  typeScale,
} from "@/theme/tokens"

/**
 * Shortlist drawer shell.
 *
 * Wider than NotificationDrawer's 280px because every row carries four actions;
 * at 280 the buttons wrap under the name and the row height doubles. Goes
 * full-bleed below 480px so the actions stay tappable on a phone.
 */
export const ShortlistDrawerStyled = styled(Drawer)`
  .MuiDrawer-paper {
    width: 400px;
    max-width: 100vw;
    border-left: 1px solid ${surface.line};
    box-shadow: ${elevation.drawer};
    background-color: ${surface.page};
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  @media (max-width: 480px) {
    .MuiDrawer-paper {
      width: 100vw;
    }
  }

  /* ---------- Header ---------- */
  .shortlistHeader {
    flex-shrink: 0;
    padding: ${space.xl}px ${space.xl}px ${space.md}px;
    border-bottom: 1px solid ${surface.lineSoft};
  }
  .shortlistHeaderRow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${space.sm}px;
  }
  .shortlistTitle {
    display: flex;
    align-items: center;
    gap: ${space.sm}px;
    font-size: ${typeScale.title.size}px;
    font-weight: ${typeScale.title.weight};
    line-height: ${typeScale.title.line};
    color: ${surface.heading};
    svg {
      font-size: 20px;
      color: ${intent.shortlist.fg};
    }
  }
  .shortlistCountChip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 20px;
    padding: 0 ${space.xs + 2}px;
    border-radius: ${radius.pill}px;
    background-color: ${intent.shortlist.tint};
    color: ${intent.shortlist.fg};
    font-size: ${typeScale.caption.size}px;
    font-weight: ${typeScale.caption.weight};
  }
  .shortlistSubtitle {
    margin-top: ${space.xs}px;
    font-size: ${typeScale.meta.size}px;
    line-height: ${typeScale.meta.line};
    color: ${surface.muted};
  }

  /* Capacity meter. Only rendered once the list is meaningfully full, so an
     empty shortlist is not framed as a quota to fill. */
  .capacityMeter {
    margin-top: ${space.md}px;
  }
  .capacityTrack {
    height: 4px;
    border-radius: ${radius.pill}px;
    background-color: ${surface.lineSoft};
    overflow: hidden;
  }
  .capacityFill {
    height: 100%;
    border-radius: ${radius.pill}px;
    background-color: ${intent.shortlist.fg};
    transition: width ${motion.base} ${motion.easing}, background-color ${motion.base} ${motion.easing};
    &.isFull {
      background-color: ${primary.dark};
    }
  }
  .capacityLabel {
    display: block;
    margin-top: ${space.xs + 2}px;
    font-size: ${typeScale.caption.size}px;
    font-weight: 500;
    color: ${surface.muted};
  }

  /* ---------- Body ---------- */
  .shortlistBody {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: ${space.md}px ${space.xl}px ${space.xl}px;
  }

  .shortlistBanner {
    margin-bottom: ${space.md}px;
    border-radius: ${radius.md}px;
    font-size: ${typeScale.meta.size}px;
    .MuiAlert-message {
      padding: ${space.xs}px 0;
    }
  }

  /* ---------- Row ---------- */
  .shortlistRow {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: ${space.md}px;
    padding: ${space.md}px;
    border: 1px solid ${surface.lineSoft};
    border-radius: ${radius.lg}px;
    background-color: ${surface.page};
    box-shadow: ${elevation.raised};
    transition: box-shadow ${motion.base} ${motion.easing}, opacity ${motion.base} ${motion.easing},
      border-color ${motion.base} ${motion.easing};

    & + & {
      margin-top: ${space.md}px;
    }
    &:hover {
      box-shadow: ${elevation.lifted};
    }
    /* A row mid-request is dimmed and inert rather than removed, so a failure
       can put it back without the list jumping. */
    &.isBusy {
      opacity: 0.55;
      pointer-events: none;
    }
  }

  .rowMain {
    display: flex;
    align-items: flex-start;
    gap: ${space.md}px;
    text-align: left;
    width: 100%;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
    &:focus-visible {
      outline: 2px solid ${intent.shortlist.fg};
      outline-offset: 3px;
      border-radius: ${radius.md}px;
    }
  }

  .rowAvatar {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: ${radius.md}px;
    background-color: ${surface.sunken};
    font-size: 15px;
    font-weight: 700;
    color: ${intent.shortlist.fg};
  }

  .rowContent {
    min-width: 0;
    flex: 1;
  }
  .rowNameLine {
    display: flex;
    align-items: center;
    gap: ${space.xs + 2}px;
    min-width: 0;
  }
  .rowName {
    font-size: ${typeScale.body.size}px;
    font-weight: ${typeScale.body.weight};
    line-height: ${typeScale.body.line};
    color: ${surface.heading};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .rowVerified {
    flex-shrink: 0;
    font-size: 15px;
    color: ${primary.main};
  }
  .rowMeta {
    margin-top: 2px;
    font-size: ${typeScale.meta.size}px;
    line-height: ${typeScale.meta.line};
    color: ${surface.muted};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .rowFooter {
    display: flex;
    align-items: center;
    gap: ${space.sm}px;
    margin-top: ${space.xs + 2}px;
    font-size: ${typeScale.caption.size}px;
    font-weight: 500;
    color: ${surface.muted};
  }
  .rowScore {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 1px ${space.xs + 2}px;
    border-radius: ${radius.sm}px;
    background-color: ${surface.sunken};
    color: ${primary.dark};
    font-weight: 700;
  }

  /* ---------- Row actions ---------- */
  .rowActions {
    display: flex;
    align-items: center;
    gap: ${space.sm}px;
  }
  .rowActionSpacer {
    flex: 1;
  }
  .rowAction {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid ${surface.lineSoft};
    background-color: ${surface.page};
    color: ${surface.muted};
    cursor: pointer;
    transition: transform ${motion.fast} ${motion.easing}, box-shadow ${motion.fast} ${motion.easing},
      background-color ${motion.fast} ${motion.easing}, color ${motion.fast} ${motion.easing};
    svg {
      font-size: 19px;
    }
    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: ${elevation.lifted};
    }
    &:focus-visible {
      outline: 2px solid ${intent.shortlist.fg};
      outline-offset: 2px;
    }
    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    &.remove {
      border-style: dashed;
      &:hover:not(:disabled) {
        color: ${intent.pass.fg};
        border-color: ${intent.pass.border};
      }
    }
    &.pass {
      color: ${intent.pass.fg};
      border-color: ${intent.pass.border};
    }
    &.connect {
      width: 40px;
      height: 40px;
      border-color: ${intent.connect.border};
      color: ${intent.connect.fg};
      background: ${intent.connect.gradient};
      box-shadow: 0 8px 18px rgba(16, 157, 164, 0.28);
      svg {
        font-size: 21px;
      }
    }
  }

  /* ---------- Empty / loading / error ---------- */
  .shortlistPlaceholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: ${space.sm}px;
    padding: ${space.xxl}px ${space.lg}px;
  }
  .placeholderIcon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background-color: ${intent.shortlist.tint};
    color: ${intent.shortlist.fg};
    svg {
      font-size: 26px;
    }
  }
  .placeholderTitle {
    font-size: ${typeScale.body.size}px;
    font-weight: 700;
    color: ${surface.heading};
  }
  .placeholderBody {
    font-size: ${typeScale.meta.size}px;
    line-height: 1.5;
    color: ${surface.muted};
    max-width: 280px;
  }
  .placeholderHint {
    display: inline-flex;
    align-items: center;
    gap: ${space.xs + 2}px;
    margin-top: ${space.xs}px;
    font-size: ${typeScale.caption.size}px;
    color: ${surface.muted};
    kbd {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      padding: 0 5px;
      border: 1px solid ${surface.lineSoft};
      border-radius: ${radius.sm}px;
      background-color: ${surface.sunken};
      font-family: inherit;
      font-size: 11px;
      font-weight: 700;
      color: ${surface.heading};
    }
  }

  .shortlistSkeletonRow {
    display: flex;
    gap: ${space.md}px;
    padding: ${space.md}px;
    border: 1px solid ${surface.lineSoft};
    border-radius: ${radius.lg}px;
    & + & {
      margin-top: ${space.md}px;
    }
  }

  .loadMoreButton {
    width: 100%;
    margin-top: ${space.md}px;
    padding: ${space.sm}px;
    border: 1px dashed ${surface.lineSoft};
    border-radius: ${radius.md}px;
    background: none;
    color: ${intent.shortlist.fg};
    font-family: inherit;
    font-size: ${typeScale.meta.size}px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color ${motion.fast} ${motion.easing};
    &:hover:not(:disabled) {
      background-color: ${intent.shortlist.tint};
    }
    &:disabled {
      opacity: 0.6;
      cursor: default;
    }
  }
`
