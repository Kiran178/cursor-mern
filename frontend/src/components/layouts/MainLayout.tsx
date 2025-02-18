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
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const drawerWidth = 280;

export default function MainLayout() {
  const [organizationName, setOrganizationName] = useState('');
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrganization();
  }, []);

  const fetchOrganization = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3001/api/organizations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.length > 0) {
        setOrganizationName(response.data[0].name);
      }
    } catch (error) {
      console.error('Error fetching organization:', error);
    }
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
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" noWrap component="div" sx={{ mb: 1 }}>
            {organizationName}
          </Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem 
              key={item.text}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {bottomMenuItems.map((item) => (
            <ListItem 
              key={item.text}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          maxWidth: `calc(100% - ${drawerWidth}px)`,
          overflow: 'auto'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
} 