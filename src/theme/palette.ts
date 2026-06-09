import { PaletteOptions } from '@mui/material/styles';


export const primary = {
  main: '#109DA4',
  light: '#7FDED8',
  dark: '#0B6B73',
};

export const secondary = {
  main: '#3066be',
};

export const error = {
  main: '#D92D20',
};

export const background = {
  default: '#ffffff',
  paper: '#F7F9FB',
};

export const text = {
  primary: '#363D4D',
  secondary: '#747884',
};

export const common = {
  white: '#ffffff',
  black: '#000000',
  colorFAFAFC: '#FAFAFC',
  color31445A: "#31445A",
  colorAFECEF66: '#AFECEF66',
  color6D9DC5: '#6D9DC5',
  colorF7F9FB:'#F7F9FB',
  color6D9DC58F: '#6D9DC58F',
  color1C1C1C0D:'#1C1C1C0D',
  colorAFECEF:'#AFECEF',
  color1C1C1C1A:'#1C1C1C1A',
  colorE5ECF6:'#E5ECF6',
  colorE3F5FF:'#E3F5FF',
  colorE8EBEC:'#E8EBEC',
  color6979F8:'#6979F8',
  colorA41010:'#A41010',
  colordc6060ff:'#dc6060ff',
  color515978:'#515978',
  colorECEDF2:'#ECEDF2',
  colorA7B4BF:'#A7B4BF',
  colorD5D7DA:'#D5D7DA',
  color0D1C2E:'#0D1C2E',
  color2A8BF2:'#2A8BF2',
  color707c97:'#707c97',
  colorF8F8F8:'#F8F8F8'

};


const getPalette = (mode: 'light' | 'dark'): PaletteOptions => ({
  mode,
  primary,
  secondary,
  error,
  background,
  text,
  common,
  // custom
});

export default getPalette;
