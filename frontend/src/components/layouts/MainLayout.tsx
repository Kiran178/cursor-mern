import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Drawer,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
  ListItemButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  CalendarMonth as CalendarIcon,
  Business as BusinessIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  People as PeopleIcon,
  Spa as SpaIcon,
  Group as GroupIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { useTheme } from '../../contexts/ThemeContext';

const drawerWidth = 240;
const collapsedDrawerWidth = 64;

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [organizationName, setOrganizationName] = useState('');
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { mode, toggleColorMode } = useTheme();

  useEffect(() => {
    const fetchCurrentOrganization = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const userResponse = await axios.get('http://localhost:3001/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (userResponse.data.organization) {
          const orgResponse = await axios.get(
            `http://localhost:3001/api/organizations/${userResponse.data.organization}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setOrganizationName(orgResponse.data.name);
        }
      } catch (error) {
        console.error('Error fetching current organization:', error);
      }
    };

    fetchCurrentOrganization();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Appointments', icon: <CalendarIcon />, path: '/appointments' },
    { text: 'Staff', icon: <PeopleIcon />, path: '/staff' },
    { text: 'Services', icon: <SpaIcon />, path: '/services' },
    { text: 'Clients', icon: <GroupIcon />, path: '/clients' },
    ...(isAdmin ? [{ text: 'Organization', icon: <BusinessIcon />, path: '/organization' }] : []),
  ];

  const drawer = (
    <Box>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', pr: 1 }}>
        <Typography variant="h6" noWrap>
          Menu
        </Typography>
        <IconButton onClick={toggleDrawer}>
          {isDrawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItemButton 
            key={item.text}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            {isDrawerOpen && <ListItemText primary={item.text} />}
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { 
            xs: '100%',
            sm: `calc(100% - ${isDrawerOpen ? drawerWidth : collapsedDrawerWidth}px)` 
          },
          ml: { 
            xs: 0,
            sm: isDrawerOpen ? drawerWidth : collapsedDrawerWidth 
          },
          transition: 'width 0.2s, margin-left 0.2s',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {organizationName || 'Loading...'}
          </Typography>
          <IconButton 
            color="inherit" 
            onClick={toggleColorMode}
            sx={{ ml: 1 }}
          >
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { 
            sm: isDrawerOpen ? drawerWidth : collapsedDrawerWidth 
          },
          flexShrink: 0,
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: isDrawerOpen ? drawerWidth : collapsedDrawerWidth,
              transition: 'width 0.2s',
              overflowX: 'hidden',
              backgroundColor: 'background.paper',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: {
            xs: '100%',
            sm: `calc(100% - ${isDrawerOpen ? drawerWidth : collapsedDrawerWidth}px)`,
          },
          minHeight: '100vh',
          pt: { xs: 8, sm: 9 },
          transition: 'width 0.2s',
          backgroundColor: 'background.default',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
} 