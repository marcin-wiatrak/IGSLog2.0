import { UserMenu } from '@components/UI'
import {
  CalendarMonth,
  Groups,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
  Logout,
  Menu,
  Person,
} from '@mui/icons-material'
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material'
import { signOut, useSession } from 'next-auth/react'
import { withSnackbar } from '@components/HOC/WithSnackbar'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useGetCustomersList } from '@src/hooks'

const MENU_LIST_ITEMS = [
  {
    name: 'Odbiory',
    href: '/orders',
    icon: <KeyboardDoubleArrowRight />,
  },
  {
    name: 'Zwroty',
    href: '/returns',
    icon: <KeyboardDoubleArrowLeft />,
  },
  {
    name: 'Spotkania',
    href: '/meetings',
    icon: <Groups />,
  },
  {
    name: 'Kalendarz',
    href: '/calendar',
    icon: <CalendarMonth />,
  },
]

const LayoutComponent = ({ children }) => {
  const { data } = useSession()
  const isAdmin = data?.user.role === 'ADMIN'
  const { getCustomersList } = useGetCustomersList()

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  const handleMenuOpen = () => setIsMenuOpen(true)
  const handleMenuClose = () => setIsMenuOpen(false)

  useEffect(() => {
    getCustomersList()
  }, [])

  return (
    <Box>
      <AppBar position="static">
        <Toolbar
          sx={{ display: 'flex', justifyContent: 'space-between' }}
          variant="dense"
        >
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleMenuOpen}
          >
            <Menu />
          </IconButton>
          <UserMenu />
        </Toolbar>
      </AppBar>
      <Box padding={2}>{children}</Box>
      <Drawer
        open={isMenuOpen}
        anchor="left"
        variant="temporary"
        onClose={handleMenuClose}
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="100%"
        >
          <List>
            {MENU_LIST_ITEMS.map((listElement) => (
              <Link
                href={listElement.href}
                key={listElement.name}
                style={{ textDecoration: 'none' }}
              >
                <ListItemButton sx={{ paddingRight: 10 }}>
                  <ListItemIcon>{listElement.icon}</ListItemIcon>
                  <ListItemText primaryTypographyProps={{ color: 'textPrimary' }}>{listElement.name}</ListItemText>
                </ListItemButton>
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                style={{ textDecoration: 'none' }}
              >
                <ListItemButton sx={{ paddingRight: 10 }}>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText primaryTypographyProps={{ color: 'textPrimary' }}>Admin</ListItemText>
                </ListItemButton>
              </Link>
            )}
          </List>
          <List sx={{ display: { sm: 'none' } }}>
            <ListItemButton
              sx={{ paddingRight: 10 }}
              onClick={() => signOut()}
            >
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ color: 'textPrimary' }}>Wyloguj</ListItemText>
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </Box>
  )
}

export const Layout = withSnackbar(LayoutComponent)
