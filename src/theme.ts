import { Roboto } from '@next/font/google'
import { createTheme } from '@mui/material/styles'

export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
})

// Create a theme instance.
const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  components: {
    MuiTable: {
      styleOverrides: {
        stickyHeader: {
          padding: '20px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontSize: '10px',
          color: '#8b8b8b',
          padding: '0px 10px',
          textAlign: 'right',
        },
        body: {
          padding: '5px 10px',
          fontSize: '12px',
          textAlign: 'right',
        },
      },
    },
  },
})

export default theme
