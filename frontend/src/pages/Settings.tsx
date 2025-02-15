import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Snackbar,
  Alert,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface OrganizationSettings {
  appointmentDuration: number;
}

export default function Settings() {
  const [settings, setSettings] = useState<OrganizationSettings>({
    appointmentDuration: 30,
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error'>('success');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { isAdmin } = useAuth();
  const { mode, toggleColorMode } = useTheme();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3001/api/organizations/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(
        'http://localhost:3001/api/organizations/settings',
        settings,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Settings saved successfully');
      setSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings');
      setSeverity('error');
      setOpenSnackbar(true);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Theme Settings
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={mode === 'dark'}
                  onChange={toggleColorMode}
                  icon={<LightModeIcon />}
                  checkedIcon={<DarkModeIcon />}
                />
              }
              label={`${mode === 'dark' ? 'Dark' : 'Light'} Mode`}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Appointment Settings
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Default Appointment Duration (minutes)"
              type="number"
              value={settings.appointmentDuration}
              onChange={(e) => setSettings({
                ...settings,
                appointmentDuration: parseInt(e.target.value)
              })}
              fullWidth
              disabled={!isAdmin}
              InputProps={{
                inputProps: { min: 15, step: 15 }
              }}
              helperText="Minimum duration is 15 minutes"
            />
          </Grid>
          <Grid item xs={12}>
            {isAdmin && (
              <Button 
                variant="contained" 
                onClick={handleSave}
                sx={{ mt: 2 }}
              >
                Save Changes
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={severity}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 