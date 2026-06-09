"use client"
import React from "react";
import { Box, Typography, FormControlLabel, Radio,styled } from "@mui/material";

import ChechBoxIcon from "@/components/ui/icons/ChechBoxIcon";
import CheckBoxCheckedIcon from "@/components/ui/icons/CheckBoxCheckedIcon";
import {common, primary } from "@/theme/palette";

const StyledFormControlLabel = styled(FormControlLabel)(() => ({
  margin: 0,
  height:"100%",
  width: "100%",
  border: `1px solid ${common.colorE8EBEC}`,
  borderRadius: "8px",
  padding: "16px",
  alignItems: "flex-start",
  transition: "all 0.3s ease",
  backgroundColor:  common.white,

  "&:hover": {
    borderColor: primary.light,
    boxShadow: "0 0 6px rgba(0,0,0,0.1)",
  },
   "&:has(.MuiRadio-root.Mui-checked)": {
    borderColor: primary.main,
  },

  "& .MuiRadio-root": {
    padding: 0,
    marginRight: "20px",
    alignSelf: "flex-start",
  },

  "& .MuiRadio-root.Mui-checked + .MuiTypography-root, &.Mui-checked": {
    borderColor: primary.main,
  },

  "& .label-title": {
    fontSize: "18px",
    fontWeight: 600,
    marginBottom: "14px",
    color:primary.main
  },

  "& .label-description": {
    fontSize: "14px",
    fontWeight:"400",
    color: common.color6D9DC5, 
    
  },
}));

interface StyledLabelProps {
  value: string;
  title: string;
  description: string;
}

const StyledCheckLabel: React.FC<StyledLabelProps> = ({ value, title, description }) => {
  return (
    <StyledFormControlLabel
      value={value}
      control={
        <Radio
          icon={<ChechBoxIcon />}
          checkedIcon={<CheckBoxCheckedIcon />}
        />
      }
      label={
        <Box>
          <Typography className="label-title">{title}</Typography>
          <Typography className="label-description">{description}</Typography>
        </Box>
      }
    />
  );
};

export default StyledCheckLabel;
