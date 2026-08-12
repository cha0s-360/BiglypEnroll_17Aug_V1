import { createTheme } from '@mui/material/styles';

// MUI theme aligned to Biglyp brand tokens. Tailwind still drives most page
// visuals (kept for pixel-perfect parity); this theme powers MUI defaults.
export const theme = createTheme({
  cssVariables: false,
  palette: {
    mode: 'light',
    primary: { main: '#5548D1', dark: '#3F35A8', light: '#7C6FF5', contrastText: '#ffffff' },
    secondary: { main: '#0F1A5B', contrastText: '#ffffff' },
    warning: { main: '#FBBF24' },
    background: { default: '#ffffff', paper: '#ffffff' },
  },
  typography: {
    fontFamily: 'Figtree, -apple-system, BlinkMacSystemFont, sans-serif',
    h1: { fontFamily: 'Outfit, sans-serif' },
    h2: { fontFamily: 'Outfit, sans-serif' },
    h3: { fontFamily: 'Outfit, sans-serif' },
    h4: { fontFamily: 'Outfit, sans-serif' },
    h5: { fontFamily: 'Outfit, sans-serif' },
    h6: { fontFamily: 'Outfit, sans-serif' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButtonBase: { defaultProps: { disableRipple: true } },
    MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { textTransform: 'none', minWidth: 0 } } },
  },
});

export default theme;
