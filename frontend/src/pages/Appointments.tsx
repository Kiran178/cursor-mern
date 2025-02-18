import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Tabs,
  Tab,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Popover,
  ButtonBase,
  Stack,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface Staff {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: "active" | "inactive";
}

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

export default function Appointments() {
  const [tabValue, setTabValue] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const [settings, setSettings] = useState<OrganizationSettings | null>(null);

  useEffect(() => {
    fetchStaffList();
    fetchSettings();
  }, []);

  const fetchStaffList = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:3001/api/staffs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const activeStaff = response.data.filter(
        (staff: Staff) => staff.status === "active"
      );
      setStaffList(activeStaff);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching staff:", error);
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3001/api/organizations/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  // Generate time slots based on settings and selected date
  const generateTimeSlots = () => {
    if (!settings || !selectedDate) return [];

    const dayOfWeek = selectedDate.format('dddd').toLowerCase() as keyof WeeklySchedule;
    const { start, end } = settings.weeklySchedule[dayOfWeek];
    const duration = settings.appointmentDuration;

    const slots = [];
    let currentTime = dayjs(selectedDate)
      .set('hour', parseInt(start.split(':')[0]))
      .set('minute', parseInt(start.split(':')[1]));
    
    const endTime = dayjs(selectedDate)
      .set('hour', parseInt(end.split(':')[0]))
      .set('minute', parseInt(end.split(':')[1]));

    while (currentTime.isBefore(endTime)) {
      slots.push(currentTime);
      currentTime = currentTime.add(duration, 'minute');
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCalendarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCalendarClose = () => {
    setAnchorEl(null);
  };

  const handleDateSelect = (newDate: Dayjs | null) => {
    setSelectedDate(newDate);
    handleCalendarClose();
  };

  return (
    <Box>
      <Typography variant='h4' component='h1' gutterBottom>
        Book Appointment
      </Typography>

      <Paper sx={{ mt: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label='Available Slots' />
          <Tab label='Custom Time' />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Calendar Dropdown Button */}
            <Grid
              item
              xs={12}
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <ButtonBase
                onClick={handleCalendarClick}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 1.5,
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <Stack direction='row' spacing={1} alignItems='center'>
                  <CalendarIcon color='primary' />
                  <Typography>
                    {selectedDate
                      ? selectedDate.format("MMMM D, YYYY")
                      : "Select Date"}
                  </Typography>
                </Stack>
              </ButtonBase>

              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleCalendarClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                sx={{
                  mt: 1,
                  "& .MuiPopover-paper": {
                    borderRadius: 2,
                    boxShadow: 3,
                  },
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    value={selectedDate}
                    onChange={handleDateSelect}
                    sx={{
                      width: "100%",
                      "& .MuiPickersDay-root.Mui-selected": {
                        backgroundColor: "primary.main",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Popover>
            </Grid>

            {/* Left side content */}
            <Grid item xs={12}>
              {/* Staff Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography variant='h6' gutterBottom>
                  Select Staff
                </Typography>
                {loading ? (
                  <Typography>Loading staff members...</Typography>
                ) : staffList.length === 0 ? (
                  <Typography>No staff members available</Typography>
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      overflow: "auto",
                      "&::-webkit-scrollbar": {
                        height: 8,
                      },
                      "&::-webkit-scrollbar-track": {
                        backgroundColor: "action.hover",
                        borderRadius: 4,
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "primary.main",
                        borderRadius: 4,
                      },
                    }}
                  >
                    <List
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 2,
                        p: 1,
                        minWidth: "min-content", // Ensures items don't shrink
                      }}
                    >
                      {staffList.map((staff) => (
                        <ListItem
                          key={staff._id}
                          sx={{
                            width: "auto",
                            minWidth: 160, // Fixed width for each item
                            border: "1px solid",
                            borderColor:
                              selectedStaff === staff._id
                                ? "primary.main"
                                : "divider",
                            borderRadius: 2,
                            cursor: "pointer",
                            p: 1,
                            "&:hover": {
                              borderColor: "primary.main",
                              bgcolor: "action.hover",
                            },
                            flex: "none", // Prevents items from growing/shrinking
                          }}
                          onClick={() => setSelectedStaff(staff._id)}
                        >
                          <ListItemAvatar sx={{ minWidth: 45 }}>
                            <Avatar
                              sx={{
                                bgcolor:
                                  selectedStaff === staff._id
                                    ? "primary.main"
                                    : "grey.400",
                                width: 35,
                                height: 35,
                              }}
                            >
                              {staff.firstName[0]}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={staff.firstName}
                            sx={{ margin: 0, px: 1 }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>

              {/* Time Slots */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Available Time Slots
                </Typography>
                {!settings ? (
                  <Typography>Loading time slots...</Typography>
                ) : timeSlots.length === 0 ? (
                  <Typography>No time slots available for selected date</Typography>
                ) : (
                  <Grid container spacing={2}>
                    {timeSlots.map((time) => (
                      <Grid item xs={6} sm={6} md={4} lg={3} key={time.format('HH:mm')}>
                        <Button
                          variant="outlined"
                          fullWidth
                          sx={{
                            justifyContent: 'center',
                            height: '48px',
                            borderRadius: 2,
                            color: 'primary.main',
                            borderColor: 'divider',
                            '&:hover': {
                              borderColor: 'primary.main',
                              bgcolor: 'action.hover',
                            },
                            '&.Mui-selected': {
                              bgcolor: 'primary.main',
                              color: 'primary.contrastText',
                              '&:hover': {
                                bgcolor: 'primary.dark',
                              },
                            },
                          }}
                        >
                          {time.format('hh:mm A')}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography>Custom time selection coming soon...</Typography>
        </TabPanel>
      </Paper>
    </Box>
  );
}
