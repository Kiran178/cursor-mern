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

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  status: 'active' | 'inactive';
}

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  description: Yup.string(),
  price: Yup.number().required('Required').min(0, 'Must be positive'),
  duration: Yup.number().required('Required').min(1, 'Must be at least 1 minute'),
});

// Add a helper function for price formatting
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: 0,
      duration: 30,
      status: 'active' as const
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const token = localStorage.getItem('accessToken');
        if (editingService) {
          await axios.put(
            `http://localhost:3001/api/services/${editingService._id}`,
            values,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          await axios.post(
            'http://localhost:3001/api/services',
            values,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
        fetchServices();
        handleCloseDialog();
        resetForm();
      } catch (error: any) {
        console.error('Error saving service:', error.response?.data?.message || error.message);
      }
    },
  });

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
    fetchServices();
  }, []);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, service: Service) => {
    setAnchorEl(event.currentTarget);
    setSelectedService(service);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedService(null);
  };

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      formik.setValues({
        name: service.name,
        description: service.description || '',
        price: service.price,
        duration: service.duration,
        status: service.status
      });
    } else {
      setEditingService(null);
      formik.resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingService(null);
    formik.resetForm();
  };

  const handleDelete = async (serviceId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:3001/api/services/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
    handleCloseMenu();
  };

  const handleStatusChange = async (serviceId: string, newStatus: 'active' | 'inactive') => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(
        `http://localhost:3001/api/services/${serviceId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchServices();
    } catch (error) {
      console.error('Error updating service status:', error);
    }
    handleCloseMenu();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Services
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Service
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service._id}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>{formatPrice(service.price)}</TableCell>
                <TableCell>{service.duration} mins</TableCell>
                <TableCell>
                  <Chip 
                    label={service.status}
                    color={service.status === 'active' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={(e) => handleOpenMenu(e, service)}>
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
          handleOpenDialog(selectedService!);
          handleCloseMenu();
        }}>
          <EditIcon sx={{ mr: 1 }} /> Edit
        </MenuItem>
        {selectedService?.status === 'active' && (
          <MenuItem onClick={() => handleStatusChange(selectedService!._id, 'inactive')}>
            Deactivate
          </MenuItem>
        )}
        {selectedService?.status === 'inactive' && (
          <MenuItem onClick={() => handleStatusChange(selectedService!._id, 'active')}>
            Activate
          </MenuItem>
        )}
        <MenuItem onClick={() => handleDelete(selectedService!._id)}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            {editingService ? 'Edit Service' : 'Add Service'}
          </DialogTitle>
          <DialogContent>
            <FormTextField
              formik={formik}
              name="name"
              label="Service Name"
              fullWidth
              margin="normal"
            />
            <FormTextField
              formik={formik}
              name="description"
              label="Description"
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />
            <FormTextField
              formik={formik}
              name="price"
              label="Price"
              type="number"
              fullWidth
              margin="normal"
            />
            <FormTextField
              formik={formik}
              name="duration"
              label="Duration (minutes)"
              type="number"
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingService ? 'Save' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
} 