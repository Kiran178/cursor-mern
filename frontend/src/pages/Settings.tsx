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
  MenuItem,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface WeeklySchedule {
  monday: { start: string; end: string };
  tuesday: { start: string; end: string };
  wednesday: { start: string; end: string };
  thursday: { start: string; end: string };
  friday: { start: string; end: string };
  saturday: { start: string; end: string };
  sunday: { start: string; end: string };
}

interface OrganizationSettings {
  appointmentDuration: number;
  weeklySchedule: WeeklySchedule;
}

const defaultSchedule: WeeklySchedule = {
  monday: { start: '09:00', end: '17:00' },
  tuesday: { start: '09:00', end: '17:00' },
  wednesday: { start: '09:00', end: '17:00' },
  thursday: { start: '09:00', end: '17:00' },
  friday: { start: '09:00', end: '17:00' },
  saturday: { start: '09:00', end: '17:00' },
  sunday: { start: '09:00', end: '17:00' },
};

export default function Settings() {
  const [settings, setSettings] = useState<OrganizationSettings>({
    appointmentDuration: 30,
    weeklySchedule: defaultSchedule,
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error'>('success');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { isAdmin } = useAuth();
  const { mode, toggleColorMode } = useTheme();

  const days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ] as const;

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3001/api/organizations/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings({
        ...response.data,
        weeklySchedule: response.data.weeklySchedule || defaultSchedule,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setLoading(false);
    }
  };

  const handleTimeChange = (day: keyof WeeklySchedule, field: 'start' | 'end', value: string) => {
    setSettings(prev => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: {
          ...prev.weeklySchedule[day],
          [field]: value
        }
      }
    }));
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
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Weekly Schedule
          </Typography>
          <Grid container spacing={3}>
            {days.map((day) => (
              <Grid item xs={12} md={6} key={day}>
                <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, textTransform: 'capitalize' }}>
                    {day}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Start Time"
                        type="time"
                        value={settings.weeklySchedule[day].start}
                        onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                        fullWidth
                        disabled={!isAdmin}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          step: 300, // 5 minutes
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="End Time"
                        type="time"
                        value={settings.weeklySchedule[day].end}
                        onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                        fullWidth
                        disabled={!isAdmin}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          step: 300, // 5 minutes
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {isAdmin && (
          <Button 
            variant="contained" 
            onClick={handleSave}
            sx={{ mt: 4 }}
          >
            Save Changes
          </Button>
        )}
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