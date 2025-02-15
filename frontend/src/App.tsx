import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateOrganization from './pages/CreateOrganization';
import MainLayout from './components/layouts/MainLayout';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Organization from './pages/Organization';
import Staff from './pages/Staff';
import Services from './pages/Services';
import Clients from './pages/Clients';
import Appointments from './pages/Appointments';
import { ThemeProvider } from './contexts/ThemeContext';
import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              } 
            />
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
              <Route path="settings" element={<Settings />} />
              <Route index element={<Navigate to="/appointments" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
