import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  CalendarMonth as CalendarIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Spa as SpaIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const drawerWidth = 280;
const collapsedDrawerWidth = 73; // Width when collapsed

export default function MainLayout() {
  const [organizationName, setOrganizationName] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrganization();
  }, []);

  const fetchOrganization = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3001/api/organizations/current', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data) {
        setOrganizationName(response.data.name);
      }
    } catch (error) {
      console.error('Error fetching organization:', error);
    }
  };

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const menuItems = [
    { text: 'Appointments', icon: <CalendarIcon />, path: '/appointments' },
    { text: 'Staff', icon: <PeopleIcon />, path: '/staff' },
    { text: 'Services', icon: <SpaIcon />, path: '/services' },
    { text: 'Clients', icon: <GroupIcon />, path: '/clients' },
    ...(isAdmin ? [{ text: 'Organization', icon: <BusinessIcon />, path: '/organization' }] : []),
  ];

  const bottomMenuItems = [
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: isDrawerOpen ? drawerWidth : collapsedDrawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isDrawerOpen ? drawerWidth : collapsedDrawerWidth,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            transition: theme => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isDrawerOpen ? 'space-between' : 'center' 
        }}>
          {isDrawerOpen && (
            <Typography variant="h6" noWrap component="div">
              {organizationName}
            </Typography>
          )}
          <IconButton onClick={handleDrawerToggle}>
            {isDrawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem 
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{ 
                justifyContent: isDrawerOpen ? 'flex-start' : 'center',
                px: isDrawerOpen ? 2 : 1
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: isDrawerOpen ? 40 : 'auto',
                mr: isDrawerOpen ? 2 : 0
              }}>
                {item.icon}
              </ListItemIcon>
              {isDrawerOpen && <ListItemText primary={item.text} />}
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {bottomMenuItems.map((item) => (
            <ListItem 
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{ 
                justifyContent: isDrawerOpen ? 'flex-start' : 'center',
                px: isDrawerOpen ? 2 : 1
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: isDrawerOpen ? 40 : 'auto',
                mr: isDrawerOpen ? 2 : 0
              }}>
                {item.icon}
              </ListItemIcon>
              {isDrawerOpen && <ListItemText primary={item.text} />}
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${isDrawerOpen ? drawerWidth : collapsedDrawerWidth}px)`,
          maxWidth: `calc(100% - ${isDrawerOpen ? drawerWidth : collapsedDrawerWidth}px)`,
          overflow: 'auto',
          transition: theme => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
} 