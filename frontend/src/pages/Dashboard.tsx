import { Box, Typography, Paper, Grid } from '@mui/material';

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Welcome</Typography>
            <Typography>This is your dashboard content.</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 