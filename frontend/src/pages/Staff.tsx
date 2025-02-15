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
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
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
  phone: string;
  role: 'admin' | 'staff';
  status: 'active' | 'inactive';
  services: Service[];
}

interface Service {
  _id: string;
  name: string;
}

const validationSchema = Yup.object({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  phone: Yup.string(),
  services: Yup.array().of(Yup.string()),
});

export default function Staff() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const { isAdmin } = useAuth();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'staff',
      status: 'active',
      services: [] as string[],
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const token = localStorage.getItem('accessToken');
        if (editingStaff) {
          await axios.put(
            `http://localhost:3001/api/staffs/${editingStaff._id}`,
            values,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          await axios.post(
            'http://localhost:3001/api/staffs',
            values,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
        fetchStaff();
        handleCloseDialog();
        resetForm();
      } catch (error: any) {
        console.error('Error saving staff:', error.response?.data?.message || error.message);
      }
    },
  });

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

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3001/api/services', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchServices();
  }, []);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, staff: Staff) => {
    setAnchorEl(event.currentTarget);
    setSelectedStaff(staff);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedStaff(null);
  };

  const handleOpenDialog = (staff?: Staff) => {
    if (staff) {
      setEditingStaff(staff);
      formik.setValues({
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        phone: staff.phone || '',
        role: staff.role,
        status: staff.status,
        services: staff.services.map(service => service._id),
      });
    } else {
      setEditingStaff(null);
      formik.resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStaff(null);
    formik.resetForm();
  };

  const handleDelete = async (staffId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:3001/api/staffs/${staffId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStaff();
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
    handleCloseMenu();
  };

  const handleStatusChange = async (staffId: string, newStatus: 'active' | 'inactive') => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(
        `http://localhost:3001/api/staffs/${staffId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchStaff();
    } catch (error) {
      console.error('Error updating staff status:', error);
    }
    handleCloseMenu();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Staff Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Staff
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Services</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffList.map((staff) => (
              <TableRow key={staff._id}>
                <TableCell>{`${staff.firstName} ${staff.lastName}`}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>{staff.phone}</TableCell>
                <TableCell>
                  <Chip 
                    label={staff.role}
                    color={staff.role === 'admin' ? 'primary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={staff.status}
                    color={staff.status === 'active' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {staff.services.map(service => service.name).join(', ')}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={(e) => handleOpenMenu(e, staff)}>
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
        <MenuItem onClick={() => {
          handleOpenDialog(selectedStaff!);
          handleCloseMenu();
        }}>
          <EditIcon sx={{ mr: 1 }} /> Edit
        </MenuItem>
        {isAdmin && selectedStaff?.status === 'active' && (
          <MenuItem onClick={() => handleStatusChange(selectedStaff!._id, 'inactive')}>
            Deactivate
          </MenuItem>
        )}
        {isAdmin && selectedStaff?.status === 'inactive' && (
          <MenuItem onClick={() => handleStatusChange(selectedStaff!._id, 'active')}>
            Activate
          </MenuItem>
        )}
        {isAdmin && (
          <MenuItem onClick={() => handleDelete(selectedStaff!._id)}>
            <DeleteIcon sx={{ mr: 1 }} /> Delete
          </MenuItem>
        )}
      </Menu>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            {editingStaff ? 'Edit Staff' : 'Add Staff'}
          </DialogTitle>
          <DialogContent>
            <FormTextField
              formik={formik}
              name="firstName"
              label="First Name"
              fullWidth
              margin="normal"
            />
            <FormTextField
              formik={formik}
              name="lastName"
              label="Last Name"
              fullWidth
              margin="normal"
            />
            <FormTextField
              formik={formik}
              name="email"
              label="Email"
              fullWidth
              margin="normal"
            />
            <FormTextField
              formik={formik}
              name="phone"
              label="Phone"
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="services-label">Services</InputLabel>
              <Select
                labelId="services-label"
                multiple
                value={formik.values.services}
                onChange={(e) => {
                  formik.setFieldValue('services', e.target.value);
                }}
                input={<OutlinedInput label="Services" />}
                renderValue={(selected) => {
                  const selectedServices = services.filter(service => 
                    selected.includes(service._id)
                  );
                  return selectedServices.map(service => service.name).join(', ');
                }}
              >
                {services.map((service) => (
                  <MenuItem key={service._id} value={service._id}>
                    <Checkbox 
                      checked={formik.values.services.includes(service._id)}
                    />
                    <ListItemText primary={service.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingStaff ? 'Save' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
} 