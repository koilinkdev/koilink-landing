"use client"
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  Paper,
  Box
} from '@mui/material';
import { primary, common, background } from '@/theme/palette';
import { getKeyDataColumnLabels, getKeyDataFieldLabel, KeyDataEntry } from '@/lib/keyData';


const StyledTableContainer = styled(Box)(({ }) => ({
  borderRadius: '8px',
  width: "100%",
  boxShadow: 'none',
  backgroundColor: background.paper,
  overflow: 'hidden',
  '& .MuiPaper-root': {
    boxShadow: 'none',
    overflow: 'hidden',
  },
  '& .MuiTable-root': {
    minWidth: 560,
    '& .MuiTableRow-root': {
      '&:first-of-type .MuiTableCell-root': {
        '&:first-of-type': {
          borderTopLeftRadius: '8px',
        },
        '&:last-of-type': {
          borderTopRightRadius: '8px',
        },
      },
      '&:last-of-type .MuiTableCell-root': {
        '&:first-of-type': {
          borderBottomLeftRadius: '8px',
        },
        '&:last-of-type': {
          borderBottomRightRadius: '8px',
        },
      },
      '& .MuiTableCell-root': {
        padding: '12px 16px',
        fontSize: '14px',
        lineHeight: 1.45,
        fontWeight: '400',
        border: `1px solid ${common.colorE8EBEC}`,
        color: common.color6D9DC5,
        verticalAlign: 'top',
        backgroundColor: common.white,
        '&.MuiTableCell-head': {
          backgroundColor: common.white,
          borderBottom: `1px solid ${common.colorE8EBEC}`,
          color: primary.main,
          fontWeight: 600,
          fontSize: '16px',
        },
        '&[component="th"]': {
          color: common.color6D9DC5,
          fontWeight: '400',
        }
      }
    }
  }
}));

type InvestorProfileTableProps = {
  role?: string;
  items: KeyDataEntry[];
  emptyMessage?: string;
};

const InvestorProfileTable = ({ role, items, emptyMessage = "No key data added yet." }: InvestorProfileTableProps) => {
  const columnLabels = getKeyDataColumnLabels(role);

  return (
    <StyledTableContainer sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", boxShadow: "none", overflow: "hidden" }}>
        <TableContainer sx={{
          borderRadius: 2,
          border: `1px solid ${common.colorE8EBEC}`,
        }}>
          <Table aria-label="investor profile table" sx={{
            borderCollapse: "collapse",
            borderStyle: "hidden",
            "& td": {
              border: 1
            }
          }}>
            <TableHead>
              <TableRow>
                <TableCell>{columnLabels.field}</TableCell>
              <TableCell align="left">{columnLabels.investor}</TableCell>
              <TableCell align="left">{columnLabels.company}</TableCell>
              </TableRow>
            </TableHead>
          <TableBody>
              {items.length > 0 ? items.map((row, index) => (
                <TableRow key={`${row.field}-${index}`}>
                  <TableCell component="th" scope="row">
                    {getKeyDataFieldLabel(row.field, role)}
                  </TableCell>
                  <TableCell align="left">{row.investor || "-"}</TableCell>
                  <TableCell align="left">{row.company || "-"}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </StyledTableContainer>
  );
}

export default InvestorProfileTable;
