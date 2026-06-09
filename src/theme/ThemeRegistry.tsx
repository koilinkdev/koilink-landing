"use client";
import React, { createContext, useContext, useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getAppTheme } from "./theme";

const ThemeToggleContext = createContext({
  toggleColorMode: () => {},
  mode: "light" as "light" | "dark",
});

export const useThemeToggle = () => useContext(ThemeToggleContext);

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  // ------ use toogle theme mode ------
  // const [mode, setMode] = useState<'light' | 'dark'>('light');

  // const toggleColorMode = () => {
  //   setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  // };

  // ------ use single theme mode ------
  const mode = "light" as const; // force light mode
  const toggleColorMode = () => {}; // no-op

  const theme = useMemo(() => getAppTheme(mode), [mode]);


  return (
    <ThemeToggleContext.Provider value={{ toggleColorMode, mode }}>
      {/* <StyledEngineProvider injectFirst> */}
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      {/* </StyledEngineProvider> */}
    </ThemeToggleContext.Provider>
  );
}
