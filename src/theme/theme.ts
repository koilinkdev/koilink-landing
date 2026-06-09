'use client';
import { createTheme, Theme } from '@mui/material/styles';
import getPalette, { background, common, primary } from './palette';
import { typography } from './typography';


export const getAppTheme = (mode: 'light' | 'dark'): Theme =>
  createTheme({
    cssVariables: true, // Enable CSS variables for theme
    palette: getPalette(mode), // 👈 use palette from palette.ts
    typography: typography(mode), // 👈 use typography from typography.ts
    components: {
      //  MuiButton: {
      //   styleOverrides: {
      //     root: {
      //       borderRadius: '25px',
      //       textTransform: 'none',
      //     },
      //   },
      //   variants: [
      //     {
      //       props: { color: "primary", variant: "outlined" },
      //       style: {

      //       }
      //     },
      //   ]
      //  }
      MuiTable: {
        styleOverrides: {
          root: {

          }
        }
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&.MuiTableRow-root ": {
              '.MuiTableCell-root': {
                padding: '8px 12px',
                color: common.color6D9DC5,
                borderBottom: `1px solid ${common.color1C1C1C0D}`,
                fontSize: "12px",
                fontWeight: "400",
                transition: 'color 0.2s ease-in-out',

                "&.MuiTableCell-head": {
                  backgroundColor: `${background.paper}`,
                  borderBottom: `1px solid ${common.color6D9DC5}`,
                  
                },
              },
              '&.MuiTableRow-hover:hover': {
                background: common.colorAFECEF66,
                color: primary.main,
                '.MuiTableCell-root': {
                  color: primary.main
                }
              },
              '.MuiTableSortLabel-root': {
                fontSize: '12px',
                fontWeight: "500",
                color: `${primary.main}`,
                '&:hover': {
                  color: `${primary.main}`,
                },
                '&.Mui-active': {
                  color: `${primary.main}`,
                  '& .MuiTableSortLabel-icon': {
                    color: `${primary.main}`,
                  }
                },
                '& .MuiTableSortLabel-icon': {
                  color: `${primary.main}`,
                }
              },
            },

            ".MuiTablePagination-root": {
              color: primary.main
            }

          },
        },
      },
      MuiTablePagination: {
        styleOverrides: {
          root: {
            color: common.color6D9DC5   
          }
        }
      },
      MuiMenuItem:{
        styleOverrides: {
          root: {
            fontSize: '14px',
          },
        },
      }
    }
  });
