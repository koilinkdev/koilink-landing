import { styled, Menu } from "@mui/material";
import { primary,common } from "@/theme/palette";

export const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "transparent",
    boxShadow: "none",
    
    
    "& .MuiList-root": {
      marginBottom: "10px",
      "& .MuiMenuItem-root": {
        borderRadius: "50%",
        marginBottom: "11px",
        width: "auto",
        height: "auto",
        padding:"8px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color:common.white,
        backgroundColor:primary.main,

        "&:last-of-type": {
          marginBottom: "0",
        },

        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
          transform: "translateY(-1px)",
        },
      },
    },
  },
}));



