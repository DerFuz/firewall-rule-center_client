import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Container,
} from '@mui/material';
import { createSvgIcon } from '@mui/material/utils';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const pages = [
  {
    'name': 'Rules',
    'url': '/rules'
  },
  {
    'name': 'RuleSetRequest',
    'url': '/rulesetrequest'
  }
];

export default function MenuAppBar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('refresh');
    localStorage.removeItem('access');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const FRCShieldIcon = createSvgIcon(
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 169.39 192.29' fill='currentColor'>
      <path d='m169.2,72.78c0,12.12-.49,24.27.12,36.36.85,17.08-5.71,30.82-17.17,42.8-12.76,13.35-27.9,23.4-44.34,31.52-6.47,3.2-13.27,5.76-20.04,8.29-1.82.68-4.29.71-6.12.07-25.72-9.04-48.69-22.48-67.15-42.89-6.44-7.12-11.41-15.21-13.43-24.73-.77-3.63-.96-7.44-.97-11.16C0,85.68.01,58.31,0,30.94c0-5.84.53-6.37,6.12-8.04,18.66-5.57,37.29-11.23,55.93-16.86,5.62-1.7,11.25-3.34,16.84-5.13,3.82-1.22,7.49-1.22,11.37,0,11.07,3.5,22.21,6.75,33.33,10.09,13.39,4.03,26.77,8.04,40.16,12.07,5.11,1.54,5.51,2.05,5.51,7.33,0,14.12,0,28.25,0,42.37h-.06Zm-80.25-18.91s-.07,0-.1,0c0-9.5.01-19-.01-28.5,0-1.62-.02-3.26-.26-4.86-.52-3.39-2.56-4.74-5.88-3.88-2.05.53-4.02,1.36-6.06,1.97-18.66,5.57-37.32,11.1-55.97,16.68-3.79,1.14-4.55,2.17-4.59,6.22-.15,16-.27,31.99-.33,47.99-.02,5.42,1.57,6.98,6.89,7.01,7.37.04,14.75.02,22.12.02,10.75,0,21.5.02,32.25-.01,2.05,0,3.64.07,3.61,2.9-.19,17.74-.27,35.49-.36,53.23-.03,6-.25,12.01.06,17.99.27,5.22,2.74,6.55,7.54,4.69,10.87-4.22,21.2-9.5,30.87-16.01,11.57-7.79,22.26-16.54,29.84-28.51,3.07-4.85,4.85-10.12,4.89-15.89.04-6.5.02-13-.02-19.5-.04-6.08-1.19-7.24-7.21-7.25-17.62-.01-35.25,0-52.87,0-4.39,0-4.41-.02-4.42-4.29-.02-10,0-20,0-30Z' />
    </svg>,
    'FRCShield',
  );

  return (
    <AppBar position='static' sx={{ marginBottom: 1 }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <FRCShieldIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />

          <Typography
            variant='h6'
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: '',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            FRC
          </Typography>


          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={() => navigate(page.url)}>
                  <Typography textAlign='center'>{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <FRCShieldIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant='h5'
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            FRC
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => navigate(page.url)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {localStorage.getItem('username') ? (
            <Box sx={{ flexGrow: 0 }}>
              <IconButton
                size='large'
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleOpenUserMenu}
                color='inherit'
              >
                <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <AccountCircle />
                  <Typography variant='h6'>
                    {localStorage.getItem('username')}
                  </Typography>
                </Box>
              </IconButton>
              <Menu
                sx={{ mt: '45px' }}
                id='menu-appbar'
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          ) : (<Button color='inherit' onClick={() => navigate('/login')}>Login</Button>)}
        </Toolbar>
      </Container>
    </AppBar>
  );
}