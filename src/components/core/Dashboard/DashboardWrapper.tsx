"use client";

import { DashboardWrapperStyled } from "@/styledComponents/Dashboard/DashboardWrapperStyled";
import { Box } from "@mui/material";
import DashboardSidebar from "./DashboardSidebar";
import { useState } from "react";
import DashboardHeader from "./DashboardHeader";

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => setOpen((prev) => !prev);
  const closeDrawer = () => setOpen(false);

  return (
    <DashboardWrapperStyled>
      <Box className="dasboardMain">
        <DashboardHeader toggleDrawer={toggleDrawer} />
        <DashboardSidebar open={open} onClose={closeDrawer} />
        <Box className="dashboardContent">{children}</Box>
      </Box>
    </DashboardWrapperStyled>
  );
};

export default DashboardWrapper;
