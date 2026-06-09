// styles/theme/typography.ts
import { PaletteMode, TypographyVariantsOptions } from '@mui/material';
import { Rubik } from 'next/font/google';

interface Props {
  xs: number;
  md: number;
  lg: number;
  xl: number;
}

export function remToPx(value: string) {
  return Math.round(parseFloat(value) * 16);
}

export function pxToRem(value: number) {
  return `${value / 16}rem`;
}

export function responsiveFontSizes({ xs, md, lg, xl }: Props) {
  return {
    '@media (min-width: 0px)': {
      fontSize: pxToRem(xs),
    },
    '@media (min-width:900px)': {
      fontSize: pxToRem(md),
    },
    '@media (min-width:1200px)': {
      fontSize: pxToRem(lg),
    },
    '@media (min-width:1536px)': {
      fontSize: pxToRem(xl),
    },
  
  };
}

// 👉 Use Rubik
const rubik = Rubik({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
});

export const primaryFont = rubik;

export const typography = (_mode: PaletteMode): TypographyVariantsOptions => {
  void _mode;

  return ({
  fontFamily: primaryFont.style.fontFamily,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,

  h1: {
    fontWeight: 700,
    lineHeight: 80 / 64,
    fontSize: pxToRem(40),
    ...responsiveFontSizes({ xs: 48, md: 35, lg: 50, xl: 60 }),
  },
  h2: {
    fontWeight: 700,
    lineHeight: 64 / 48,
    fontSize: pxToRem(48),
    ...responsiveFontSizes({ xs: 25, md: 32, lg: 35, xl: 48}),
    
  },
  h3: {
  fontWeight: 700,
  lineHeight: 1.4,
  fontSize: pxToRem(22),
  ...responsiveFontSizes({ xs: 24, md: 26, lg: 28, xl: 30 }),
},
h4: {
  fontWeight: 700,
  lineHeight: 1.4,
  fontSize: pxToRem(20),
  ...responsiveFontSizes({ xs: 22, md: 24, lg: 24, xl: 26 }),
},
h5: {
  fontWeight: 600,
  lineHeight: 1.4,
  fontSize: pxToRem(18),
  ...responsiveFontSizes({ xs: 19, md: 20, lg: 21, xl: 22 }),
},
h6: {
  fontWeight: 600,
  lineHeight: 1.4,
  fontSize: pxToRem(16),
  ...responsiveFontSizes({ xs: 17, md: 18, lg: 18, xl: 18 }),
},
  subtitle1: {
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontWeight: 600,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  body1: {
    lineHeight: 1.5,
    fontSize: pxToRem(17),
  },
  body2: {
    lineHeight: 22 / 14,
    fontSize: pxToRem(15),
  },
  caption: {
    lineHeight: 1.5,
    fontSize: pxToRem(12),
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    textTransform: 'uppercase',
  },
  button: {
    fontWeight: 500,
    lineHeight: 24 / 14,
    fontSize: pxToRem(14),
    textTransform: 'unset',
    fontFamily: primaryFont.style.fontFamily,
  },
  });
};
