import { background, common, error, primary, secondary } from "@/theme/palette"
import { Box, styled } from "@mui/material"

/**
 * Match Profile — "Match Studio" layout.
 * A focused candidate card on the left (frosted identity bar + score ring) and a
 * compact, tabbed dossier on the right (no repeated facts, no endless scroll).
 * Palette: primary #109DA4 teal, secondary #3066be blue, ink #0D1C2E, muted #6D9DC5.
 */
export const MatchProfileClientStyled = styled(Box)`
  --ink: ${common.color0D1C2E};
  --muted: ${common.color6D9DC5};
  --line: rgba(109, 157, 197, 0.16);
  --line-strong: rgba(109, 157, 197, 0.28);
  --paper: ${background.paper};
  --radius-xl: 28px;
  --radius-lg: 22px;
  --radius-md: 16px;
  --shadow-soft: 0 18px 45px rgba(13, 28, 46, 0.06);
  --shadow-card: 0 30px 60px rgba(13, 28, 46, 0.2);

  padding: 22px;
  border-radius: var(--radius-xl);
  background:
    radial-gradient(circle at top right, rgba(127, 222, 216, 0.22), transparent 32%),
    radial-gradient(circle at 12% 88%, rgba(48, 102, 190, 0.08), transparent 26%),
    linear-gradient(180deg, ${common.white} 0%, ${background.paper} 100%);

  @media (max-width: 1199px) {
    padding: 18px;
  }
  @media (max-width: 599px) {
    padding: 12px;
    border-radius: 22px;
  }

  /* ================================================================ Header */
  .matchHeader {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }

  .pageEyebrow {
    margin-bottom: 8px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${primary.main};
  }

  .pageTitle {
    margin-bottom: 8px;
    font-size: clamp(26px, 3vw, 36px);
    line-height: 1.05;
    font-weight: 700;
    color: var(--ink);
  }

  .pageSubtitle {
    max-width: 640px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--muted);
  }

  /* Slim inline stat pills instead of four big boxes */
  .statRail {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .statPill {
    display: flex;
    align-items: baseline;
    gap: 7px;
    padding: 9px 15px;
    border: 1px solid var(--line);
    border-radius: 999px;
    background-color: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(8px);

    b {
      font-size: 17px;
      font-weight: 800;
      line-height: 1;
      color: var(--ink);
    }
    span {
      font-size: 12px;
      font-weight: 600;
      color: var(--muted);
    }

    &.accent b {
      color: ${primary.main};
    }
  }

  .filterButton {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: 999px;
    border: 1px solid var(--line-strong);
    background-color: ${common.white};
    font-size: 13.5px;
    font-weight: 700;
    color: var(--ink);
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    svg {
      font-size: 18px;
      color: ${primary.main};
    }
    &:hover {
      border-color: ${primary.main};
      box-shadow: 0 10px 24px rgba(16, 157, 164, 0.14);
    }
    .filterCount {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 18px;
      height: 18px;
      padding: 0 5px;
      border-radius: 999px;
      background: ${primary.main};
      color: ${common.white};
      font-size: 11px;
      font-weight: 800;
    }
  }

  /* ============================================================== Feedback */
  .feedbackBanner {
    padding: 13px 18px;
    margin-bottom: 18px;
    border: 1px solid rgba(16, 157, 164, 0.18);
    border-radius: var(--radius-md);
    background:
      linear-gradient(145deg, rgba(127, 222, 216, 0.2), rgba(16, 157, 164, 0.08)),
      ${common.white};

    &.isWarning {
      border-color: rgba(217, 45, 32, 0.22);
      background:
        linear-gradient(145deg, rgba(255, 236, 232, 0.9), rgba(255, 244, 242, 0.96)),
        ${common.white};
    }
  }
  .feedbackBannerText {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
    color: var(--ink);
  }
  .feedbackBannerMeta {
    font-size: 12.5px;
    line-height: 1.5;
    color: var(--muted);
  }
  .feedbackBannerAction {
    padding: 8px 16px;
    border-radius: 999px;
    background-color: ${common.white};
    box-shadow: 0 8px 20px rgba(13, 28, 46, 0.1);
    color: ${primary.main};
    font-size: 13px;
    font-weight: 700;
    text-transform: none;
    white-space: nowrap;
    &:hover {
      background-color: ${common.white};
      box-shadow: 0 10px 24px rgba(13, 28, 46, 0.16);
    }
  }

  /* ================================================================= Stage */
  .studioGrid {
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
    gap: 22px;
    align-items: stretch;

    @media (max-width: 1099px) {
      grid-template-columns: 1fr;
      align-items: start;
    }
  }

  /* Stage column stretches to the dossier height; the card fills the gap */
  .stageColumn {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .dossierColumn {
    min-width: 0;
    align-self: start;
    position: sticky;
    top: 16px;
    width: 100%;

    @media (max-width: 1099px) {
      position: static;
    }
  }

  /* ============================================================ Swipe card */
  .deckStage {
    position: relative;
    flex: 1 1 auto;
    min-height: 540px;
    perspective: 1600px;

    @media (max-width: 1099px) {
      aspect-ratio: 4 / 5;
      min-height: 0;
      max-height: 600px;
    }
  }

  .deckBackCard,
  .matchDeckCard {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: var(--radius-xl);
  }

  .deckBackCard {
    box-shadow: 0 20px 50px rgba(13, 28, 46, 0.12);
    transform-origin: top center;
  }
  .backCardImage,
  .cardImage {
    position: absolute;
    inset: 0;
    img {
      object-fit: cover;
      object-position: center;
    }
  }
  .backCardScrim {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(13, 28, 46, 0.1), rgba(13, 28, 46, 0.72));
  }
  .backCardContent {
    position: absolute;
    left: 20px;
    right: 20px;
    bottom: 20px;
    z-index: 1;
    color: ${common.white};
  }
  .backCardLabel {
    margin-bottom: 5px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.72);
  }
  .backCardTitle {
    font-size: 19px;
    font-weight: 700;
    line-height: 1.15;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .backCardMeta {
    margin-top: 3px;
    font-size: 12.5px;
    color: rgba(255, 255, 255, 0.78);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .matchDeckCard {
    box-shadow: var(--shadow-card);
    cursor: grab;
    touch-action: pan-y;
    user-select: none;
    will-change: transform;
    &:active {
      cursor: grabbing;
    }
    &.isDisabled {
      cursor: default;
    }
  }

  /* Light top gradient keeps top pills legible without hiding the face */
  .cardTopScrim {
    position: absolute;
    inset: 0 0 auto 0;
    height: 120px;
    z-index: 1;
    background: linear-gradient(180deg, rgba(13, 28, 46, 0.5), transparent);
  }

  .cardTopMeta {
    position: absolute;
    top: 16px;
    left: 16px;
    right: 16px;
    z-index: 3;
  }

  .glassPill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 32px;
    padding: 0 12px;
    border: 1px solid rgba(255, 255, 255, 0.26);
    border-radius: 999px;
    background-color: rgba(13, 28, 46, 0.3);
    backdrop-filter: blur(14px);
    font-size: 12px;
    font-weight: 700;
    color: ${common.white};
    svg {
      font-size: 15px;
      color: ${primary.light};
    }
    &.muted svg {
      color: rgba(255, 255, 255, 0.85);
    }
  }

  .verifiedBadge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 32px;
    padding: 0 11px;
    border-radius: 999px;
    background-color: rgba(16, 157, 164, 0.9);
    backdrop-filter: blur(8px);
    color: ${common.white};
    font-size: 11.5px;
    font-weight: 700;
  }

  .decisionHalo {
    position: absolute;
    top: 38%;
    left: 50%;
    z-index: 4;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 132px;
    height: 132px;
    border-radius: 50%;
    opacity: 0;
    color: ${common.white};
    transform: translate(-50%, -50%) scale(0.82);
    transition: opacity 0.18s ease, transform 0.18s ease;
    svg {
      font-size: 46px;
    }
    &.isVisible {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    &.like {
      background: radial-gradient(circle, rgba(127, 222, 216, 0.52), rgba(16, 157, 164, 0.2));
      box-shadow: 0 0 70px rgba(127, 222, 216, 0.45);
    }
    &.pass {
      background: radial-gradient(circle, rgba(255, 152, 135, 0.52), rgba(217, 45, 32, 0.2));
      box-shadow: 0 0 70px rgba(217, 45, 32, 0.26);
    }
    &.save {
      background: radial-gradient(circle, rgba(48, 102, 190, 0.52), rgba(48, 102, 190, 0.18));
      box-shadow: 0 0 70px rgba(48, 102, 190, 0.3);
    }
  }
  .decisionLabel {
    font-size: 12.5px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  /* Frosted identity bar floating inside the card (card-in-card) */
  .identityBar {
    position: absolute;
    left: 14px;
    right: 14px;
    bottom: 14px;
    z-index: 3;
    padding: 16px 18px;
    border: 1px solid rgba(255, 255, 255, 0.28);
    border-radius: 20px;
    background: linear-gradient(180deg, rgba(13, 28, 46, 0.3), rgba(13, 28, 46, 0.62));
    backdrop-filter: blur(18px);
    color: ${common.white};
  }

  .identityTop {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .identityText {
    flex: 1;
    min-width: 0;
  }

  .identityName {
    font-size: clamp(20px, 2.4vw, 26px);
    font-weight: 700;
    line-height: 1.1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .identityRole {
    margin-top: 2px;
    font-size: 13.5px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.82);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .identityMeta {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 12px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.86);
    svg {
      font-size: 17px;
      flex: none;
    }
    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .identityTags {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 12px;
  }
  .identityTag {
    padding: 5px 11px;
    border: 1px solid rgba(255, 255, 255, 0.26);
    border-radius: 999px;
    background-color: rgba(255, 255, 255, 0.14);
    font-size: 11.5px;
    font-weight: 600;
  }

  .identityFooter {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }
  .identityCapital {
    font-size: 13.5px;
    font-weight: 700;
  }
  .progressDots {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    span {
      display: block;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.4);
      transition: width 0.2s ease;
      &.isActive {
        width: 20px;
        border-radius: 999px;
        background-color: ${common.white};
      }
    }
  }

  /* Score ring */
  .scoreGauge {
    position: relative;
    flex: none;
  }
  .scoreGaugeLabel {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }
  .scoreGaugeValue {
    font-size: 19px;
    font-weight: 800;
  }
  .scoreGaugeCaption {
    margin-top: 2px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .identityBar .scoreGaugeCaption {
    color: rgba(255, 255, 255, 0.72);
  }

  /* ========================================================== Action dock */
  .actionDock {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin: 20px auto 0;
    padding: 12px 22px;
    width: fit-content;
    max-width: 100%;
    border: 1px solid var(--line);
    border-radius: 999px;
    background-color: ${common.white};
    box-shadow: 0 18px 40px rgba(13, 28, 46, 0.1);
    flex-wrap: wrap;
  }
  .dockButton {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 58px;
    height: 58px;
    border: 1px solid var(--line);
    border-radius: 50%;
    background-color: ${common.white};
    transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
    cursor: pointer;
    svg {
      font-size: 27px;
    }
    &:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 14px 28px rgba(13, 28, 46, 0.16);
    }
    &:disabled {
      cursor: not-allowed;
      opacity: 0.45;
    }
    &:focus-visible {
      outline: 2px solid ${secondary.main};
      outline-offset: 3px;
    }
    &.rewind {
      width: 48px;
      height: 48px;
      color: #f5a623;
      svg {
        font-size: 22px;
      }
    }
    &.pass {
      color: ${error.main};
    }
    &.save {
      color: ${secondary.main};
    }
    &.like {
      width: 70px;
      height: 70px;
      border-color: transparent;
      color: ${common.white};
      background: linear-gradient(135deg, ${primary.main}, ${secondary.main});
      box-shadow: 0 14px 30px rgba(16, 157, 164, 0.34);
      svg {
        font-size: 32px;
      }
    }
  }
  .dockDivider {
    width: 1px;
    height: 34px;
    background-color: var(--line);
  }

  .shortcutHint {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 18px;
    flex-wrap: wrap;
    margin-top: 14px;
    font-size: 12px;
    color: var(--muted);
  }
  .shortcutHint .key {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    span {
      font-weight: 600;
    }
    kbd {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      padding: 0 5px;
      border: 1px solid var(--line-strong);
      border-bottom-width: 2px;
      border-radius: 6px;
      background-color: ${common.white};
      font-family: inherit;
      font-size: 12px;
      font-weight: 700;
      color: var(--ink);
    }
  }

  /* ============================================================ Filmstrip */
  .queueBlock {
    margin-top: 26px;
  }
  .queueHead {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }
  .queueTitle {
    font-size: 15px;
    font-weight: 700;
    color: var(--ink);
  }
  .queueBadge {
    flex: none;
    padding: 5px 12px;
    border-radius: 999px;
    background-color: ${common.colorAFECEF66};
    font-size: 11.5px;
    font-weight: 700;
    color: ${primary.dark};
  }
  .queueStrip {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding-bottom: 6px;
    scroll-snap-type: x mandatory;
    -ms-overflow-style: none;
    scrollbar-width: thin;
    &::-webkit-scrollbar {
      height: 6px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 999px;
      background-color: var(--line-strong);
    }
  }
  .queueChip {
    display: flex;
    align-items: center;
    gap: 11px;
    flex: 0 0 auto;
    width: 244px;
    max-width: 80%;
    padding: 10px;
    border: 1px solid var(--line);
    border-radius: var(--radius-md);
    background-color: ${common.white};
    scroll-snap-align: start;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 24px rgba(13, 28, 46, 0.1);
    }
  }
  .queueAvatar {
    position: relative;
    width: 52px;
    height: 52px;
    flex: none;
    border-radius: 14px;
    overflow: hidden;
    background-color: ${common.colorE5ECF6};
    img {
      object-fit: cover;
    }
  }
  .queueChipText {
    min-width: 0;
  }
  .queueChipName {
    font-size: 14px;
    font-weight: 700;
    color: var(--ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .queueChipMeta {
    margin-top: 2px;
    font-size: 12px;
    font-weight: 600;
    color: ${primary.main};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .queueEmpty {
    padding: 16px;
    border: 1px dashed var(--line-strong);
    border-radius: var(--radius-md);
    background-color: var(--paper);
    text-align: center;
    font-size: 13px;
    color: var(--muted);
  }

  /* ============================================================== Dossier */
  .dossier {
    border: 1px solid var(--line);
    border-radius: var(--radius-xl);
    background-color: ${common.white};
    box-shadow: var(--shadow-soft);
    overflow: hidden;
  }

  .dossierHead {
    padding: 22px 22px 18px;
    background:
      linear-gradient(145deg, rgba(16, 157, 164, 0.12), rgba(48, 102, 190, 0.06)),
      ${common.white};
    border-bottom: 1px solid var(--line);
  }
  .dossierEyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${primary.main};
  }
  .dossierIdentity {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 10px;
  }
  .dossierIdentityText {
    flex: 1;
    min-width: 0;
  }
  .dossierName {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.15;
    color: var(--ink);
  }
  .dossierVerified {
    display: inline-flex;
    flex: none;
  }
  .dossierRole {
    margin-top: 4px;
    font-size: 13.5px;
    line-height: 1.5;
    color: ${common.color31445A};
  }

  .dossierChips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
  }
  .dossierChip {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 9px 14px;
    border: 1px solid var(--line);
    border-radius: 14px;
    background-color: rgba(255, 255, 255, 0.7);
    small {
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--muted);
    }
    b {
      font-size: 14px;
      font-weight: 700;
      color: var(--ink);
    }
  }

  /* Segmented tabs */
  .dossierTabs {
    display: flex;
    gap: 4px;
    margin: 16px 16px 0;
    padding: 4px;
    border-radius: 14px;
    background-color: var(--paper);
  }
  .segTab {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 9px 8px;
    border: none;
    border-radius: 11px;
    background-color: transparent;
    font-size: 13px;
    font-weight: 700;
    color: var(--muted);
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
    svg {
      font-size: 17px;
    }
    &:hover {
      color: var(--ink);
    }
    &.active {
      background-color: ${common.white};
      color: ${primary.main};
      box-shadow: 0 6px 16px rgba(13, 28, 46, 0.08);
    }
  }

  .dossierBody {
    padding: 18px 22px 22px;
  }

  .tabSection {
    & + & {
      margin-top: 20px;
    }
  }
  .tabSectionTitle {
    margin-bottom: 10px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .factGrid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    border: 1px solid var(--line);
    border-radius: var(--radius-md);
    overflow: hidden;
    background-color: var(--line);
    @media (max-width: 420px) {
      grid-template-columns: 1fr;
    }
  }
  .factCell {
    padding: 13px 15px;
    background-color: ${common.white};
    small {
      display: block;
      margin-bottom: 4px;
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--muted);
    }
    b {
      font-size: 14px;
      font-weight: 700;
      color: var(--ink);
      word-break: break-word;
    }
  }

  .aboutText {
    font-size: 14px;
    line-height: 1.65;
    color: ${common.color31445A};
    white-space: pre-wrap;
  }
  .mutedText {
    font-size: 13.5px;
    line-height: 1.6;
    color: var(--muted);
  }

  .reasonRow {
    display: flex;
    align-items: flex-start;
    gap: 11px;
    & + & {
      margin-top: 11px;
    }
  }
  .reasonDot {
    width: 7px;
    height: 7px;
    margin-top: 7px;
    flex: none;
    border-radius: 50%;
    background: linear-gradient(135deg, ${primary.main}, ${secondary.main});
  }
  .reasonText {
    font-size: 13.5px;
    line-height: 1.55;
    color: ${common.color31445A};
  }

  .actionPreviewCard {
    padding: 14px 16px;
    border: 1px solid var(--line);
    border-radius: var(--radius-md);
    background-color: var(--paper);
    transition: background-color 0.2s ease, border-color 0.2s ease;
    &.like {
      border-color: rgba(16, 157, 164, 0.24);
      background: linear-gradient(145deg, rgba(127, 222, 216, 0.2), rgba(16, 157, 164, 0.08));
    }
    &.pass {
      border-color: rgba(217, 45, 32, 0.22);
      background: linear-gradient(145deg, rgba(255, 152, 135, 0.2), rgba(217, 45, 32, 0.08));
    }
    &.save {
      border-color: rgba(48, 102, 190, 0.22);
      background: linear-gradient(145deg, rgba(48, 102, 190, 0.16), rgba(48, 102, 190, 0.06));
    }
  }
  .actionPreviewLabel {
    display: block;
    margin-bottom: 6px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .actionPreviewText {
    font-size: 13.5px;
    line-height: 1.6;
    color: ${common.color31445A};
  }

  /* ------------------------------------------------ Location tab + map */
  .locationCard {
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: var(--radius-md);
    background-color: ${common.white};
  }
  .locationCardEmpty {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
  }
  .locationHeader {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
  }
  .locationHeaderText {
    flex: 1;
    min-width: 0;
  }
  .locationPinBadge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    flex: none;
    border-radius: 12px;
    color: ${primary.main};
    background: linear-gradient(145deg, rgba(127, 222, 216, 0.28), rgba(16, 157, 164, 0.12));
  }
  .locationLabel {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .locationValue {
    margin-top: 2px;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.35;
    color: var(--ink);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .locationEmptyText {
    margin-top: 2px;
    font-size: 13px;
    color: var(--muted);
  }
  .locationLink {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    flex: none;
    padding: 7px 13px;
    border-radius: 999px;
    border: 1px solid rgba(16, 157, 164, 0.28);
    background-color: rgba(16, 157, 164, 0.06);
    font-size: 12px;
    font-weight: 700;
    color: ${primary.main};
    text-decoration: none;
    transition: background-color 0.2s ease;
    svg {
      font-size: 15px;
    }
    &:hover {
      background-color: rgba(16, 157, 164, 0.12);
    }
    @media (max-width: 380px) {
      span {
        display: none;
      }
    }
  }
  .locationMapFrame {
    position: relative;
    aspect-ratio: 16 / 11;
    border-top: 1px solid var(--line);
    background-color: ${common.colorE5ECF6};
    iframe {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
  }

  /* ============================================================== Empty */
  .emptyState {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 460px;
    padding: 32px;
    border: 1px dashed var(--line-strong);
    border-radius: var(--radius-xl);
    background-color: rgba(255, 255, 255, 0.78);
    text-align: center;
  }
  .emptyStateTitle {
    margin-bottom: 10px;
    font-size: 24px;
    font-weight: 700;
    color: var(--ink);
  }
  .emptyStateText {
    max-width: 360px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--muted);
  }
  .restartButton {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 18px;
    padding: 11px 20px;
    border-radius: 999px;
    box-shadow: none;
    text-transform: none;
    font-weight: 700;
  }
  .dossierEmpty {
    padding: 40px 24px;
    text-align: center;
  }

  /* ============================================================ Skeleton */
  .deckSkeleton {
    position: absolute;
    inset: 0;
    border-radius: var(--radius-xl);
    background: linear-gradient(
      110deg,
      ${common.colorE5ECF6} 8%,
      ${common.colorECEDF2} 18%,
      ${common.colorE5ECF6} 33%
    );
    background-size: 220% 100%;
    animation: matchShimmer 1.3s ease-in-out infinite;
  }
  @keyframes matchShimmer {
    to {
      background-position: -220% 0;
    }
  }
`
