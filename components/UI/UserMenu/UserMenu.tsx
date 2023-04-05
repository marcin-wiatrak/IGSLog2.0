import PersonIcon from '@mui/icons-material/Person'
import { Avatar, IconButton, Menu, MenuItem, Stack, Tooltip, Typography } from '@mui/material'
import { useDisclose } from '@src/hooks'
import { signOut, useSession } from 'next-auth/react'
import { MouseEvent, useState } from 'react'
import { ChangePasswordModal } from '@components/UI'
import { getCurrentUserNameFromSession } from '@src/utils/textFormatter'

export const UserMenu = () => {
  const { data: sessionData } = useSession()
  const userInitials = getCurrentUserNameFromSession({ session: sessionData, initials: true })
  const [anchor, setAnchor] = useState<null | HTMLElement>(null)
  const {
    isOpen: isChangePasswordModalOpen,
    onOpen: onChangePasswordModalOpen,
    onClose: onChangePasswordModalClose,
  } = useDisclose()
  const open = Boolean(anchor)

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget)
  }

  const handleCloseMenu = () => setAnchor(null)

  return (
    <>
      <Tooltip title="Ustawienia">
        <IconButton
          size="small"
          onClick={handleOpenMenu}
        >
          <Avatar>
            <PersonIcon />
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        open={open}
        anchorEl={anchor}
        onClose={handleCloseMenu}
        onClick={handleCloseMenu}
        sx={{
          '.MuiMenu-paper': {
            padding: '10px 0px',
            width: '250px',
          },
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 20,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Stack
          spacing={1}
          justifyContent={'center'}
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>{userInitials}</Avatar>
          <Typography
            variant="subtitle1"
            sx={{ padding: '0 20px' }}
            color="primary.main"
          >
            {getCurrentUserNameFromSession({ session: sessionData })}
          </Typography>
        </Stack>

        <MenuItem
          sx={{ width: '100%', textAlign: 'center' }}
          onClick={onChangePasswordModalOpen}
        >
          Zmiana hasła
        </MenuItem>
        <MenuItem onClick={() => signOut()}>Wyloguj</MenuItem>
      </Menu>
      {isChangePasswordModalOpen && (
        <ChangePasswordModal
          isOpen={isChangePasswordModalOpen}
          onClose={onChangePasswordModalClose}
        />
      )}
    </>
  )
}
