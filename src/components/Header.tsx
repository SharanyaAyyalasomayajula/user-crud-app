import { AppBar, Toolbar, Typography, Button } from '@mui/material'

type Props = {
  onShowForm: () => void
  onShowList: () => void
}

function Header({ onShowForm, onShowList }: Props) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          User Management
        </Typography>

        <Button color="inherit" onClick={onShowForm}>
          Add User
        </Button>
        <Button color="inherit" onClick={onShowList}>
          User List
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Header
