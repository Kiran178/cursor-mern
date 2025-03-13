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

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  status: 'active' | 'inactive';
}

interface PreferredDayService {
  day: string;
  services: Service[];
}

interface MonthlySlotAllocation {
  service: Service;
  slots: number;
}

interface Client {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  status: 'active' | 'inactive';
  notes: string;
  preferredStaff: Staff[];
  priorityScore: number;
  preferredDays: string[];
  preferredServices: Service[];
  preferredDaysServices: PreferredDayService[];
  monthlySlotAllocation: MonthlySlotAllocation[];
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
  lastName: Yup.string(),
  email: Yup.string().email('Invalid email format if provided'),
  phone: Yup.string().required('Required'),
  notes: Yup.string(),
  preferredStaff: Yup.array().of(Yup.string()).min(1, 'At least one staff member is required').required('Required'),
  priorityScore: Yup.number().min(1).max(10),
  preferredDaysServices: Yup.array().of(
    Yup.object().shape({
      day: Yup.string().oneOf(DAYS_OF_WEEK).required('Day is required'),
      services: Yup.array().of(Yup.string()).min(1, 'At least one service is required').required('Required')
    })
  ),
  monthlySlotAllocation: Yup.array().of(
    Yup.object().shape({
      service: Yup.string().required('Service is required'),
      slots: Yup.number().min(1, 'Minimum 1 slot required').required('Required')
    })
  )
});

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [preferredDaysServices, setPreferredDaysServices] = useState<PreferredDayService[]>([]);
  const [monthlySlotAllocation, setMonthlySlotAllocation] = useState<MonthlySlotAllocation[]>([]);
  const { isAdmin } = useAuth();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      notes: '',
      preferredStaff: [] as string[],
      status: 'active' as 'active' | 'inactive',
      priorityScore: 10,
      preferredDays: [] as string[],
      preferredServices: [] as string[],
      preferredDaysServices: [] as PreferredDayService[],
      monthlySlotAllocation: [] as MonthlySlotAllocation[]
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const token = localStorage.getItem('accessToken');
        
        const clientData: any = {
          ...values,
          preferredStaff: selectedStaff.map(staff => staff._id),
          preferredDays: values.preferredDays || [],
          preferredServices: selectedServices.map(service => service._id),
          preferredDaysServices: preferredDaysServices.map(pds => ({
            day: pds.day,
            services: pds.services.map(service => service._id)
          })),
          monthlySlotAllocation: monthlySlotAllocation.map(msa => ({
            service: msa.service._id,
            slots: msa.slots
          })),
          priorityScore: 10
        };
        
        if (!clientData.email || clientData.email.trim() === '') {
          delete clientData.email;
        }

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
        setSelectedServices([]);
        setPreferredDaysServices([]);
        setMonthlySlotAllocation([]);
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
    fetchClients();
    fetchStaffList();
    fetchServices();
  }, []);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, client: Client) => {
    setAnchorEl(event.currentTarget);
    setSelectedClient(client);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedClient(null);
  };

  const handleEditClick = () => {
    if (selectedClient) {
      handleOpenDialog(selectedClient);
    }
    handleCloseMenu();
  };

  const handleDeleteClick = () => {
    if (selectedClient) {
      handleDelete(selectedClient._id);
    }
    handleCloseMenu();
  };

  const handleOpenDialog = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setSelectedStaff(client.preferredStaff || []);
      setSelectedServices(client.preferredServices || []);
      setPreferredDaysServices(client.preferredDaysServices || []);
      setMonthlySlotAllocation(client.monthlySlotAllocation || []);
      
      formik.setValues({
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email || '',
        phone: client.phone,
        notes: client.notes || '',
        preferredStaff: client.preferredStaff.map(staff => staff._id),
        status: client.status as 'active' | 'inactive',
        priorityScore: 10,
        preferredDays: client.preferredDays || [],
        preferredServices: client.preferredServices.map(service => service._id),
        preferredDaysServices: client.preferredDaysServices || [],
        monthlySlotAllocation: client.monthlySlotAllocation || []
      });
      
      setOpenDialog(true);
    } else {
      setEditingClient(null);
      formik.resetForm();
      setSelectedStaff([]);
      setSelectedServices([]);
      setPreferredDaysServices([]);
      setMonthlySlotAllocation([]);
      setOpenDialog(true);
    }
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

  const handleAddDayServiceMapping = () => {
    setPreferredDaysServices([
      ...preferredDaysServices,
      { day: '', services: [] }
    ]);
  };

  const handleRemoveDayServiceMapping = (index: number) => {
    const newMappings = [...preferredDaysServices];
    newMappings.splice(index, 1);
    setPreferredDaysServices(newMappings);
  };

  const handleDayChange = (index: number, day: string) => {
    const newMappings = [...preferredDaysServices];
    newMappings[index].day = day;
    setPreferredDaysServices(newMappings);
  };

  const handleServicesChange = (index: number, selectedServices: Service[]) => {
    const newMappings = [...preferredDaysServices];
    newMappings[index].services = selectedServices;
    setPreferredDaysServices(newMappings);
  };

  const handleAddSlotAllocation = () => {
    setMonthlySlotAllocation([
      ...monthlySlotAllocation,
      { service: {} as Service, slots: 10 }
    ]);
  };

  const handleRemoveSlotAllocation = (index: number) => {
    const newAllocations = [...monthlySlotAllocation];
    newAllocations.splice(index, 1);
    setMonthlySlotAllocation(newAllocations);
  };

  const handleServiceChange = (index: number, service: Service) => {
    const newAllocations = [...monthlySlotAllocation];
    newAllocations[index].service = service;
    setMonthlySlotAllocation(newAllocations);
  };

  const handleSlotsChange = (index: number, slots: number) => {
    const newAllocations = [...monthlySlotAllocation];
    newAllocations[index].slots = slots;
    setMonthlySlotAllocation(newAllocations);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Clients
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingClient(null);
              formik.resetForm();
              setSelectedStaff([]);
              setSelectedServices([]);
              setPreferredDaysServices([]);
              setMonthlySlotAllocation([]);
              setOpenDialog(true);
            }}
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
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Preferred Staff</TableCell>
              <TableCell>Day-Service Mappings</TableCell>
              <TableCell>Monthly Slots</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client._id}>
                <TableCell>{`${client.firstName} ${client.lastName}`}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>
                  {client.preferredStaff?.map((staff) => (
                    <Chip
                      key={staff._id}
                      label={`${staff.firstName} ${staff.lastName}`}
                      size="small"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  {client.preferredDaysServices?.length > 0 ? (
                    <Box>
                      {client.preferredDaysServices.map((pds, index) => (
                        <Chip
                          key={index}
                          label={`${pds.day.charAt(0).toUpperCase() + pds.day.slice(1)}: ${pds.services.length} services`}
                          size="small"
                          sx={{ m: 0.5 }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      None
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {client.monthlySlotAllocation?.length > 0 ? (
                    <Box>
                      {client.monthlySlotAllocation.map((msa, index) => (
                        <Chip
                          key={index}
                          label={`${msa.service.name}: ${msa.slots} slots`}
                          size="small"
                          sx={{ m: 0.5 }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      None
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={client.status}
                    color={client.status === 'active' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    aria-label="more"
                    onClick={(event) => {
                      setAnchorEl(event.currentTarget);
                      setSelectedClient(client);
                    }}
                  >
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
        <MenuItem onClick={handleEditClick}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        {isAdmin && (
          <MenuItem onClick={handleDeleteClick}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
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
                  label="Email (Optional)"
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
                  Preferred Days Mapped to Services
                </Typography>
                {preferredDaysServices.map((mapping, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <Select
                          fullWidth
                          value={mapping.day}
                          onChange={(e) => handleDayChange(index, e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value="" disabled>Select Day</MenuItem>
                          {DAYS_OF_WEEK.map((day) => (
                            <MenuItem key={day} value={day}>
                              {day.charAt(0).toUpperCase() + day.slice(1)}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid item xs={12} sm={7}>
                        <Autocomplete
                          multiple
                          options={services}
                          value={mapping.services}
                          onChange={(event, newValue) => handleServicesChange(index, newValue)}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Services"
                              variant="outlined"
                              fullWidth
                            />
                          )}
                          renderTags={(value, getTagProps) =>
                            value.map((option, idx) => (
                              <Chip
                                label={option.name}
                                {...getTagProps({ index: idx })}
                              />
                            ))
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <IconButton onClick={() => handleRemoveDayServiceMapping(index)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />} 
                  onClick={handleAddDayServiceMapping}
                  sx={{ mt: 1 }}
                >
                  Add Day-Service Mapping
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Monthly Appointment Slot Allocation
                </Typography>
                {monthlySlotAllocation.map((allocation, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={6}>
                        <Autocomplete
                          options={services}
                          value={allocation.service}
                          onChange={(event, newValue) => handleServiceChange(index, newValue as Service)}
                          getOptionLabel={(option) => option.name || ''}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Service"
                              variant="outlined"
                              fullWidth
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <TextField
                          type="number"
                          label="Slots"
                          value={allocation.slots}
                          onChange={(e) => handleSlotsChange(index, parseInt(e.target.value))}
                          InputProps={{ inputProps: { min: 1 } }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <IconButton onClick={() => handleRemoveSlotAllocation(index)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />} 
                  onClick={handleAddSlotAllocation}
                  sx={{ mt: 1 }}
                >
                  Add Slot Allocation
                </Button>
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