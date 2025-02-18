import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Menu,
  MenuItem,
  Grid,
  Autocomplete,
  TextField,
  Stack,
  Rating,
  Select,
  OutlinedInput,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import axios from 'axios';
import FormTextField from '../components/forms/FormTextField';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';

interface Staff {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'inactive';
}

interface Client {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  notes: string;
  preferredStaff: Staff[];
  priorityScore: number;
  preferredDays: string[];
}

const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
] as const;

const validationSchema = Yup.object({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  phone: Yup.string().required('Required'),
  notes: Yup.string(),
  preferredStaff: Yup.array().of(Yup.string()).min(1, 'At least one staff member is required').required('Required'),
  preferredDays: Yup.array().of(Yup.string().oneOf(DAYS_OF_WEEK)).min(1, 'At least one day is required').required('Required'),
});

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff[]>([]);
  const { isAdmin } = useAuth();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      notes: '',
      preferredStaff: [] as string[],
      status: 'active' as const,
      priorityScore: 10,
      preferredDays: [] as string[],
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const token = localStorage.getItem('accessToken');
        const clientData = {
          ...values,
          preferredStaff: selectedStaff.map(staff => staff._id),
          preferredDays: values.preferredDays || [],
        };

        if (editingClient) {
          await axios.put(
            `http://localhost:3001/api/clients/${editingClient._id}`,
            clientData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          await axios.post(
            'http://localhost:3001/api/clients',
            clientData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
        await fetchClients();
        handleCloseDialog();
        resetForm();
        setSelectedStaff([]);
      } catch (error: any) {
        console.error('Error saving client:', error.response?.data?.message || error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3001/api/clients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchStaffList = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3001/api/staffs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const activeStaff = response.data.filter((staff: Staff) => staff.status === 'active');
      setStaffList(activeStaff);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchStaffList();
  }, []);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, client: Client) => {
    setAnchorEl(event.currentTarget);
    setSelectedClient(client);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedClient(null);
  };

  const handleOpenDialog = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      formik.setValues({
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
        notes: client.notes || '',
        preferredStaff: client.preferredStaff.map(staff => staff._id),
        status: client.status,
        priorityScore: client.priorityScore,
        preferredDays: client.preferredDays || [],
      });
      setSelectedStaff(client.preferredStaff);
    } else {
      setEditingClient(null);
      formik.resetForm();
      setSelectedStaff([]);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingClient(null);
    formik.resetForm();
  };

  const handleDelete = async (clientId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:3001/api/clients/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
    }
    handleCloseMenu();
  };

  const handleStatusChange = async (clientId: string, newStatus: 'active' | 'inactive') => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(
        `http://localhost:3001/api/clients/${clientId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchClients();
    } catch (error) {
      console.error('Error updating client status:', error);
    }
    handleCloseMenu();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Clients
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Client
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client._id}>
                <TableCell>{`${client.firstName} ${client.lastName}`}</TableCell>
                <TableCell>
                  <div>{client.email}</div>
                  <div>{client.phone}</div>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={client.status}
                    color={client.status === 'active' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={(e) => handleOpenMenu(e, client)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {isAdmin && (
          <MenuItem onClick={() => {
            handleOpenDialog(selectedClient!);
            handleCloseMenu();
          }}>
            <EditIcon sx={{ mr: 1 }} /> Edit
          </MenuItem>
        )}
        {isAdmin && selectedClient?.status === 'active' && (
          <MenuItem onClick={() => handleStatusChange(selectedClient!._id, 'inactive')}>
            Deactivate
          </MenuItem>
        )}
        {isAdmin && selectedClient?.status === 'inactive' && (
          <MenuItem onClick={() => handleStatusChange(selectedClient!._id, 'active')}>
            Activate
          </MenuItem>
        )}
        {isAdmin && (
          <MenuItem onClick={() => handleDelete(selectedClient!._id)}>
            <DeleteIcon sx={{ mr: 1 }} /> Delete
          </MenuItem>
        )}
      </Menu>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            {editingClient ? 'Edit Client' : 'Add Client'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <FormTextField
                  formik={formik}
                  name="firstName"
                  label="First Name"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormTextField
                  formik={formik}
                  name="lastName"
                  label="Last Name"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormTextField
                  formik={formik}
                  name="email"
                  label="Email"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormTextField
                  formik={formik}
                  name="phone"
                  label="Phone"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  required
                  options={staffList}
                  value={selectedStaff}
                  onChange={(event, newValue) => {
                    setSelectedStaff(newValue);
                    formik.setFieldValue(
                      'preferredStaff', 
                      newValue.map(staff => staff._id)
                    );
                  }}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Preferred Staff"
                      variant="outlined"
                      fullWidth
                      error={formik.touched.preferredStaff && Boolean(formik.errors.preferredStaff)}
                      helperText={formik.touched.preferredStaff && formik.errors.preferredStaff}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={`${option.firstName} ${option.lastName}`}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Preferred Days
                </Typography>
                <Select
                  multiple
                  required
                  fullWidth
                  value={formik.values.preferredDays || []}
                  onChange={(e) => {
                    const value = e.target.value as string[];
                    formik.setFieldValue('preferredDays', value);
                  }}
                  input={<OutlinedInput />}
                  error={formik.touched.preferredDays && Boolean(formik.errors.preferredDays)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((day) => (
                        <Chip
                          key={day}
                          label={day.charAt(0).toUpperCase() + day.slice(1)}
                          size="small"
                        />
                      ))}
                    </Box>
                  )}
                >
                  {DAYS_OF_WEEK.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.preferredDays && formik.errors.preferredDays && (
                  <Typography color="error" variant="caption">
                    {formik.errors.preferredDays as string}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <FormTextField
                  formik={formik}
                  name="notes"
                  label="Notes"
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              type="submit"
              variant="contained"
              disabled={formik.isSubmitting}
            >
              {editingClient ? 'Save' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
} 