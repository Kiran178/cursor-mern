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

interface Organization {
  _id: string;
  name: string;
  description: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  description: Yup.string()
});

export default function Organization() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: ''
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const token = localStorage.getItem('accessToken');
        if (editingOrg) {
          await axios.put(
            `http://localhost:3001/api/organizations/${editingOrg._id}`,
            values,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          await axios.post(
            'http://localhost:3001/api/organizations',
            values,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
        fetchOrganizations();
        handleCloseDialog();
        resetForm();
      } catch (error) {
        console.error('Error saving organization:', error);
      }
    },
  });

  const fetchOrganizations = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3001/api/organizations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrganizations(response.data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, org: Organization) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrg(org);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedOrg(null);
  };

  const handleOpenDialog = (org?: Organization) => {
    if (org) {
      setEditingOrg(org);
      formik.setValues({
        name: org.name,
        description: org.description
      });
    } else {
      setEditingOrg(null);
      formik.resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingOrg(null);
    formik.resetForm();
  };

  const handleDelete = async (orgId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:3001/api/organizations/${orgId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrganizations();
    } catch (error) {
      console.error('Error deleting organization:', error);
    }
    handleCloseMenu();
  };

  const handleSwitch = async (orgId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(
        `http://localhost:3001/api/organizations/${orgId}/switch`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh page or update state as needed
      window.location.reload();
    } catch (error) {
      console.error('Error switching organization:', error);
    }
    handleCloseMenu();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Organizations
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Create Organization
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {organizations.map((org) => (
              <TableRow key={org._id}>
                <TableCell>{org.name}</TableCell>
                <TableCell>{org.description}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={(e) => handleOpenMenu(e, org)}>
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
          handleOpenDialog(selectedOrg!);
          handleCloseMenu();
        }}>
          <EditIcon sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => handleDelete(selectedOrg!._id)}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete
        </MenuItem>
        <MenuItem onClick={() => handleSwitch(selectedOrg!._id)}>
          Switch to this organization
        </MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            {editingOrg ? 'Edit Organization' : 'Create Organization'}
          </DialogTitle>
          <DialogContent>
            <FormTextField
              formik={formik}
              name="name"
              label="Organization Name"
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
              rows={4}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingOrg ? 'Save' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
} 