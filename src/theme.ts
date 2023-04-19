import { Roboto } from '@next/font/google'
import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: React.CSSProperties['color']
    }
  }

  interface Palette {
    marcin: Palette['primary']
  }

  interface PaletteOptions {
    marcin: PaletteOptions['primary']
  }
}

export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
})

// Create a theme instance.
const theme = createTheme({
  typography: {
    fontSize: 14,
    fontFamily: roboto.style.fontFamily,
    h1: {
      fontSize: '3rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiTable: {
      styleOverrides: {
        stickyHeader: {
          padding: '20px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontSize: '10px',
          color: '#8b8b8b',
          padding: '0px 10px',
          textAlign: 'center',
        },
        body: {
          padding: '5px 10px',
          fontSize: '12px',
          textAlign: 'center',
        },
      },
    },
  },
})

export default theme
