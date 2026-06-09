import { Button, styled, ButtonProps } from '@mui/material';

const CustomOutlinedButton = styled((props: ButtonProps) => (
  <Button {...props} variant="outlined" />
))(({ theme }) => ({
  borderRadius: 25,
  padding: '8px 24px',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  borderWidth: 2,

  '&:hover': {
    boxShadow: theme.shadows[2],
  },

  '&:disabled': {
    opacity: 0.5,
    pointerEvents: 'none',
  },
}));

export default CustomOutlinedButton;
