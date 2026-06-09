"use client";
import React from 'react';
import { Button, styled, Box, Icon, Typography } from '@mui/material';
import { background, primary } from "@/theme/palette";
import Image from 'next/image';

interface FilterButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
}

const FilterButtonStyled = styled(Button)`
  background-color: ${background.paper};
  border: 1px solid ${primary.main};
  border-radius: 8px;
  padding: 0 11px;
  color: ${primary.main};
  text-transform: none;
  width: 100%;
  min-height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .filter-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    p {
      min-width: 80px;
      text-align: left;
      font-size: 12px;
      font-weight: 400;
    }
  }

  .filter-icon {
    width: auto;
    height: auto;
    display: flex;
  }
`;

const FilterButton: React.FC<FilterButtonProps> = ({ onClick, children = "Filter" }) => {
  return (
    <FilterButtonStyled variant="outlined" onClick={onClick}>
      <Box className="filter-content">
        <Typography variant="body1">{children}</Typography>
        <Icon className="filter-icon">
          <Image
            src="/assets/icons/table-filter-icon.svg"
            width={24}
            height={24}
            alt="filter icon"
          />
        </Icon>
      </Box>
    </FilterButtonStyled>
  );
};

export default FilterButton;
