import { common } from "@/theme/palette";
import { Card, styled } from "@mui/material";

export const FeaturesBoxCardStyled = styled(Card)(() => ({
  borderRadius: 16,
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  border: `1px solid ${common.white}`,
  boxShadow: "none",
  padding: "32px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden", // 🔥 prevent image from bleeding out
  "@media(max-width: 599px)":{
    padding: "25px",
  },
  ".featuresCardImage_sm": {
    maxHeight: "270px",
  },

  ".featuresCardImage_sm, .featuresCardImage_lg": {
    width: "100%",
    height: "100%",
    aspectRatio: "16 / 9",
    position: "relative",
    marginTop: "auto",
    zIndex: 1, // behind content if needed
    overflow: "hidden", // 🔥 makes sure no bleed
    borderRadius: "inherit", // optional: respect card rounding

    img: {
      objectFit: "cover",
    },
  },
}));
