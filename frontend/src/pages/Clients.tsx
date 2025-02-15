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

interface Client {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  status: 'active' | 'inactive';
  notes: string;
  preferredStaff: Array<{
    _id: string;
    firstName: string;
    lastName: string;
  }>;
}

interface Staff {
  _id: string;
  firstName: string;
  lastName: string;
}

const validationSchema = Yup.object({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  phone: Yup.string().required('Required'),
  'address.street': Yup.string(),
  'address.city': Yup.string(),
  'address.state': Yup.string(),
  'address.pincode': Yup.string(),
  notes: Yup.string(),
  preferredStaff: Yup.array().of(Yup.string())
});

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { isAdmin } = useAuth();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: ''
      },
      notes: '',
      preferredStaff: [] as string[],
      status: 'active' as const
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const token = localStorage.getItem('accessToken');
        if (editingClient) {
          await axios.put(
            `http://localhost:3001/api/clients/${editingClient._id}`,
            values,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          await axios.post(
            'http://localhost:3001/api/clients',
            values,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
        fetchClients();
        handleCloseDialog();
        resetForm();
      } catch (error: any) {
        console.error('Error saving client:', error.response?.data?.message || error.message);
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

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3001/api/staffs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaffList(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchStaff();
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
        address: client.address,
        notes: client.notes || '',
        preferredStaff: client.preferredStaff.map(staff => staff._id),
        status: client.status
      });
    } else {
      setEditingClient(null);
      formik.resetForm();
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
              <TableCell>Address</TableCell>
              <TableCell>Preferred Staff</TableCell>
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
                  {client.address.street && (
                    <>
                      <div>{client.address.street}</div>
                      <div>{`${client.address.city}, ${client.address.state} ${client.address.pincode}`}</div>
                    </>
                  )}
                </TableCell>
                <TableCell>
                  {client.preferredStaff.map(staff => 
                    `${staff.firstName} ${staff.lastName}`
                  ).join(', ')}
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
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Address</Typography>
              </Grid>
              <Grid item xs={12}>
                <FormTextField
                  formik={formik}
                  name="address.street"
                  label="Street"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormTextField
                  formik={formik}
                  name="address.city"
                  label="City"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormTextField
                  formik={formik}
                  name="address.state"
                  label="State"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormTextField
                  formik={formik}
                  name="address.pincode"
                  label="Pincode"
                  fullWidth
                />
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
            <Button type="submit" variant="contained">
              {editingClient ? 'Save' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
} 