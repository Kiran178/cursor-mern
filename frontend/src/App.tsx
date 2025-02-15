import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateOrganization from './pages/CreateOrganization';
import MainLayout from './components/layouts/MainLayout';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Organization from './pages/Organization';
import Staff from './pages/Staff';
import Services from './pages/Services';
import Clients from './pages/Clients';
import Appointments from './pages/Appointments';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              }
            >
              <Route path="appointments" element={<Appointments />} />
              <Route path="create-organization" element={<CreateOrganization />} />
              <Route path="organization" element={<Organization />} />
              <Route path="staff" element={<Staff />} />
              <Route path="services" element={<Services />} />
              <Route path="clients" element={<Clients />} />
              <Route index element={<Navigate to="/appointments" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
