import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Typography,
  Button,
  Box,
  Link,
  Alert,
} from '@mui/material';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/layouts/AuthLayout';
import FormTextField from '../components/forms/FormTextField';
import axios from 'axios';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string().required('Required'),
});

export default function Login() {
  const navigate = useNavigate();
  const { login, isAdmin } = useAuth();
  const [error, setError] = useState('');

  const checkOrganization = async (isSuperAdmin: boolean) => {
    try {
      console.log('Checking organization for admin:', isSuperAdmin);
      if (!isSuperAdmin) {
        navigate('/dashboard');
        return;
      }

      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3001/api/organizations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Organization response:', response.data);
      if (response.data.length === 0) {
        console.log('No organizations found, redirecting to create');
        navigate('/create-organization');
      } else {
        console.log('Organizations found, redirecting to dashboard');
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Error checking organization:', err);
      if (err.response?.status === 403) {
        navigate('/create-organization');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await authService.login(values);
        const verifyResponse = await axios.get('http://localhost:3001/api/auth/verify', {
          headers: { Authorization: `Bearer ${response.accessToken}` }
        });
        
        await login(response);
        const isSuperAdmin = verifyResponse.data.role === 'superadmin';
        console.log('Login successful, isSuperAdmin:', isSuperAdmin);
        await checkOrganization(isSuperAdmin);
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred');
      }
    },
  });

  return (
    <AuthLayout>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Login
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
        <FormTextField
          formik={formik}
          name="email"
          label="Email"
        />
        <FormTextField
          formik={formik}
          name="password"
          label="Password"
          type="password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Login
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <Link href="/signup" variant="body2">
            Don't have an account? Sign up
          </Link>
        </Box>
      </Box>
    </AuthLayout>
  );
} 