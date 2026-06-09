import { background, common, primary, secondary } from "@/theme/palette"
import { Box, styled } from "@mui/material"

export const MatchProfileClientStyled = styled(Box)`
  padding: 24px;
  border-radius: 24px;
  background:
    radial-gradient(circle at top right, rgba(127, 222, 216, 0.2), transparent 28%),
    linear-gradient(180deg, ${common.white} 0%, ${background.paper} 100%);

  .matchProfileHeader {
    margin-bottom: 24px;
  }

  .feedbackBanner {
    padding: 14px 18px;
    margin-bottom: 24px;
    border: 1px solid rgba(16, 157, 164, 0.16);
    border-radius: 18px;
    background:
      linear-gradient(145deg, rgba(127, 222, 216, 0.18), rgba(16, 157, 164, 0.08)),
      ${common.white};

    &.isWarning {
      border-color: rgba(230, 108, 97, 0.2);
      background:
        linear-gradient(145deg, rgba(255, 236, 232, 0.88), rgba(255, 244, 242, 0.96)),
        ${common.white};
    }
  }

  .feedbackBannerText {
    font-size: 14px;
    line-height: 1.6;
    color: ${common.color0D1C2E};
  }

  .feedbackBannerMeta {
    font-size: 13px;
    line-height: 1.6;
    color: ${common.color6D9DC5};
  }

  .feedbackBannerAction {
    padding: 8px 14px;
    border-radius: 999px;
    background-color: ${common.white};
    box-shadow: none;
    color: ${primary.main};
    font-size: 13px;
    font-weight: 700;
    text-transform: none;

    &:hover {
      background-color: rgba(255, 255, 255, 0.88);
      box-shadow: none;
    }
  }

  .pageEyebrow {
    margin-bottom: 8px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${primary.main};
  }

  .pageTitle {
    margin-bottom: 8px;
    font-size: clamp(28px, 3vw, 38px);
    line-height: 1.05;
    font-weight: 600;
    color: ${common.color0D1C2E};
  }

  .pageSubtitle {
    max-width: 760px;
    font-size: 15px;
    line-height: 1.7;
    color: ${common.color6D9DC5};
  }

  .headerStatsGrid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    width: min(100%, 420px);

    @media (max-width: 599px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      width: 100%;
    }
  }

  .headerStatCard {
    padding: 14px 16px;
    border: 1px solid rgba(109, 157, 197, 0.18);
    border-radius: 18px;
    background-color: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(12px);
  }

  .headerStatValue {
    font-size: 24px;
    font-weight: 600;
    line-height: 1;
    color: ${common.color0D1C2E};
  }

  .headerStatLabel {
    margin-top: 6px;
    font-size: 12px;
    line-height: 1.4;
    color: ${common.color6D9DC5};
  }

  .deckShell,
  .queuePanel,
  .insightPanel {
    border: 1px solid rgba(109, 157, 197, 0.18);
    border-radius: 24px;
    background-color: rgba(255, 255, 255, 0.92);
    box-shadow: 0 18px 45px rgba(13, 28, 46, 0.06);
  }

  .deckShell {
    padding: 24px;
    margin-bottom: 20px;
  }

  .deckStage {
    position: relative;
    min-height: 620px;
    perspective: 1600px;

    @media (max-width: 899px) {
      min-height: 560px;
    }

    @media (max-width: 599px) {
      min-height: 500px;
    }
  }

  .deckBackCard,
  .matchDeckCard {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: 32px;
  }

  .deckBackCard {
    border: 1px solid rgba(255, 255, 255, 0.34);
    background: linear-gradient(180deg, rgba(13, 28, 46, 0.12), rgba(13, 28, 46, 0.6));
    box-shadow: 0 20px 50px rgba(13, 28, 46, 0.12);
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

  .backCardScrim,
  .cardScrim {
    position: absolute;
    inset: 0;
  }

  .backCardScrim {
    background: linear-gradient(180deg, rgba(13, 28, 46, 0.18), rgba(13, 28, 46, 0.75));
  }

  .backCardContent {
    position: absolute;
    left: 24px;
    right: 24px;
    bottom: 24px;
    z-index: 1;
    color: ${common.white};
  }

  .backCardLabel {
    margin-bottom: 6px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.7);
  }

  .backCardTitle {
    font-size: 24px;
    font-weight: 600;
    line-height: 1.1;
  }

  .backCardMeta {
    margin-top: 6px;
    font-size: 14px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.76);
  }

  .matchDeckCard {
    border: 1px solid rgba(255, 255, 255, 0.34);
    box-shadow: 0 30px 60px rgba(13, 28, 46, 0.18);
    cursor: grab;
    touch-action: pan-y;
    user-select: none;

    &:active {
      cursor: grabbing;
    }

    &.isDisabled {
      cursor: default;
    }
  }

  .cardScrim {
    background:
      linear-gradient(180deg, rgba(13, 28, 46, 0.08) 0%, rgba(13, 28, 46, 0.2) 38%, rgba(13, 28, 46, 0.92) 100%),
      linear-gradient(270deg, rgba(16, 157, 164, 0.08), transparent 46%);
  }

  .cardTopMeta {
    position: absolute;
    top: 24px;
    left: 24px;
    right: 24px;
    z-index: 2;
  }

  .glassPill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 38px;
    padding: 0 14px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 999px;
    background-color: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(12px);
    font-size: 13px;
    font-weight: 600;
    color: ${common.white};

    &.muted {
      font-weight: 500;
      color: rgba(255, 255, 255, 0.84);
    }
  }

  .verifiedBadge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.16);
    backdrop-filter: blur(12px);
  }

  .decisionHalo {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 136px;
    height: 136px;
    border-radius: 50%;
    opacity: 0;
    color: ${common.white};
    transform: translate(-50%, -50%) scale(0.85);
    transition: opacity 0.2s ease, transform 0.2s ease;

    &.isVisible {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }

    &.like {
      background: radial-gradient(circle, rgba(127, 222, 216, 0.48), rgba(16, 157, 164, 0.22));
      box-shadow: 0 0 70px rgba(127, 222, 216, 0.42);
    }

    &.pass {
      background: radial-gradient(circle, rgba(255, 152, 135, 0.48), rgba(217, 45, 32, 0.22));
      box-shadow: 0 0 70px rgba(217, 45, 32, 0.24);
    }

    &.save {
      background: radial-gradient(circle, rgba(48, 102, 190, 0.48), rgba(48, 102, 190, 0.18));
      box-shadow: 0 0 70px rgba(48, 102, 190, 0.28);
    }
  }

  .decisionLabel {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .cardContent {
    position: absolute;
    left: 24px;
    right: 24px;
    bottom: 24px;
    z-index: 2;
    color: ${common.white};
  }

  .cardTitle {
    margin-bottom: 8px;
    font-size: clamp(32px, 5vw, 52px);
    line-height: 0.96;
    font-weight: 600;
  }

  .cardSubtitle {
    margin-bottom: 10px;
    font-size: 18px;
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.9);
  }

  .cardMetaRow {
    margin-bottom: 14px;
    color: rgba(255, 255, 255, 0.84);
  }

  .cardMetaText {
    font-size: 15px;
    line-height: 1.6;
  }

  .cardHighlight {
    max-width: 720px;
    font-size: 16px;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.92);
  }

  .tagRow {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 18px;
  }

  .tagChip {
    padding: 8px 14px;
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 999px;
    background-color: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(12px);
    font-size: 13px;
    font-weight: 600;
    color: ${common.white};
  }

  .cardFooter {
    margin-top: 22px;
  }

  .cardFooterText {
    font-size: 15px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.88);
  }

  .progressDots {
    display: inline-flex;
    align-items: center;
    gap: 8px;

    span {
      display: block;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.4);

      &.isActive {
        width: 24px;
        border-radius: 999px;
        background-color: ${common.white};
      }
    }
  }

  .actionStrip {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 22px;
    margin-top: 24px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .actionButton {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    border: none;
    border-radius: 50%;
    background-color: ${common.white};
    box-shadow: 0 14px 30px rgba(13, 28, 46, 0.12);
    transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
    cursor: pointer;

    svg {
      font-size: 32px;
    }

    &:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 18px 34px rgba(13, 28, 46, 0.18);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    &:focus-visible {
      outline: 2px solid ${secondary.main};
      outline-offset: 4px;
    }

    &.rewindAction {
      color: #f5a623;
      width: 60px;
      height: 60px;
      svg { font-size: 26px; }
    }

    &.passAction {
      color: #e56c61;
    }

    &.saveAction {
      width: 88px;
      height: 88px;
      color: ${secondary.main};
    }

    &.likeAction {
      color: ${common.white};
      background: linear-gradient(135deg, ${primary.main}, ${secondary.main});
    }
  }

  .actionLabel {
    font-size: 13px;
    font-weight: 600;
    color: ${common.color6D9DC5};
  }

  .shortcutBar {
    padding: 14px 16px;
    border-radius: 18px;
    background-color: ${background.paper};
  }

  .shortcutItem {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 500;
    color: ${common.color6D9DC5};
  }

  .queuePanel,
  .insightPanel {
    padding: 24px;
  }

  .sectionTitle,
  .detailsTitle,
  .insightTitle {
    margin-bottom: 6px;
    font-size: 22px;
    line-height: 1.15;
    font-weight: 600;
    color: ${common.color0D1C2E};
  }

  .sectionSubtitle,
  .insightText,
  .reasonText,
  .queueCardText,
  .queueEmptyState,
  .emptyStateText {
    font-size: 14px;
    line-height: 1.7;
    color: ${common.color6D9DC5};
  }

  .sectionBadge {
    padding: 7px 14px;
    border-radius: 999px;
    background-color: ${common.colorAFECEF66};
    font-size: 12px;
    font-weight: 700;
    color: ${primary.main};
  }

  .queueGrid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;

    @media (max-width: 899px) {
      grid-template-columns: 1fr;
    }
  }

  .queueCard {
    overflow: hidden;
    border: 1px solid rgba(109, 157, 197, 0.16);
    border-radius: 20px;
    background-color: ${common.white};
  }

  .queueCardImage {
    position: relative;
    height: 180px;
    background-color: ${common.colorE5ECF6};

    img {
      object-fit: cover;
      object-position: center;
    }
  }

  .queueCardBody {
    padding: 16px;
  }

  .queueCardTitle {
    font-size: 18px;
    font-weight: 600;
    color: ${common.color0D1C2E};
  }

  .queueCardMeta {
    margin: 6px 0 10px;
    font-size: 13px;
    line-height: 1.5;
    color: ${primary.main};
  }

  .queueEmptyState {
    padding: 16px;
    border: 1px dashed rgba(109, 157, 197, 0.22);
    border-radius: 18px;
    background-color: ${background.paper};
  }

  .insightHero {
    padding: 18px;
    margin-bottom: 20px;
    border-radius: 22px;
    background:
      linear-gradient(145deg, rgba(16, 157, 164, 0.12), rgba(48, 102, 190, 0.08)),
      ${background.paper};
  }

  .insightEyebrow {
    margin-bottom: 8px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${primary.main};
  }

  .metricGrid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 20px;
  }

  .metricCard {
    padding: 16px;
    border: 1px solid rgba(109, 157, 197, 0.16);
    border-radius: 18px;
    background-color: ${common.white};
  }

  .metricLabel,
  .actionPreviewLabel {
    display: block;
    margin-bottom: 8px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${common.color6D9DC5};
  }

  .metricValue {
    font-size: 18px;
    line-height: 1.35;
    font-weight: 600;
    color: ${common.color0D1C2E};
  }

  .detailsSection {
    margin-bottom: 20px;

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  .snapshotList {
    padding: 16px;
    border: 1px solid rgba(109, 157, 197, 0.16);
    border-radius: 18px;
    background-color: ${common.white};
  }

  .snapshotRow {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(109, 157, 197, 0.14);

    &:last-child {
      padding-bottom: 0;
      border-bottom: none;
    }

    @media (max-width: 599px) {
      flex-direction: column;
      gap: 4px;
    }
  }

  .snapshotLabel {
    flex: none;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${common.color6D9DC5};
  }

  .snapshotValue {
    font-size: 14px;
    line-height: 1.7;
    font-weight: 500;
    text-align: right;
    color: ${common.color0D1C2E};

    @media (max-width: 599px) {
      text-align: left;
    }
  }

  .aboutList {
    padding: 16px;
    border: 1px solid rgba(109, 157, 197, 0.16);
    border-radius: 18px;
    background-color: ${common.white};
  }

  .aboutListItem {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .aboutListIndex {
    min-width: 20px;
    font-size: 12px;
    font-weight: 700;
    line-height: 1.7;
    color: ${primary.main};
  }

  .reasonRow {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .reasonDot {
    width: 8px;
    height: 8px;
    margin-top: 8px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${primary.main}, ${secondary.main});
    flex: none;
  }

  .actionPreviewCard {
    padding: 16px;
    border-radius: 18px;
    background-color: ${background.paper};

    &.like {
      background: linear-gradient(145deg, rgba(127, 222, 216, 0.18), rgba(16, 157, 164, 0.08));
    }

    &.pass {
      background: linear-gradient(145deg, rgba(255, 152, 135, 0.18), rgba(217, 45, 32, 0.08));
    }

    &.save {
      background: linear-gradient(145deg, rgba(48, 102, 190, 0.16), rgba(48, 102, 190, 0.06));
    }
  }

  .actionPreviewText,
  .emptyInsights {
    font-size: 14px;
    line-height: 1.7;
    color: ${common.color6D9DC5};
  }

  .emptyState {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 620px;
    padding: 32px;
    border: 1px dashed rgba(109, 157, 197, 0.28);
    border-radius: 32px;
    background-color: rgba(255, 255, 255, 0.76);
    text-align: center;

    @media (max-width: 899px) {
      min-height: 560px;
    }

    @media (max-width: 599px) {
      min-height: 500px;
    }
  }

  .emptyStateTitle {
    margin-bottom: 10px;
    font-size: 28px;
    line-height: 1.1;
    font-weight: 600;
    color: ${common.color0D1C2E};
  }

  .restartButton {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 18px;
    padding: 12px 18px;
    border-radius: 999px;
    box-shadow: none;
    text-transform: none;
    font-weight: 600;
  }

  @media (max-width: 1199px) {
    padding: 20px;

    .cardTitle {
      font-size: clamp(28px, 8vw, 42px);
    }
  }

  @media (max-width: 599px) {
    padding: 16px;

    .deckShell,
    .queuePanel,
    .insightPanel {
      padding: 18px;
      border-radius: 20px;
    }

    .matchDeckCard,
    .deckBackCard,
    .emptyState {
      border-radius: 24px;
    }

    .cardTopMeta,
    .cardContent {
      left: 18px;
      right: 18px;
    }

    .cardTopMeta {
      top: 18px;
    }

    .cardContent {
      bottom: 18px;
    }

    .cardSubtitle,
    .cardHighlight,
    .cardMetaText {
      font-size: 14px;
    }

    .metricGrid {
      grid-template-columns: 1fr;
    }
  }
`
