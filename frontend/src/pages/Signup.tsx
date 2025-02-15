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
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Required'),
  confirmPassword: Yup.string()
    .required('Required')
    .oneOf([Yup.ref('password')], 'Passwords must match')
});

export default function Signup() {
  const navigate = useNavigate();
  const { login, isAdmin } = useAuth();
  const [error, setError] = useState('');

  const checkOrganization = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3001/api/organizations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.length === 0) {
        navigate('/create-organization');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      navigate('/dashboard');
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { confirmPassword, ...signupData } = values;
        const response = await authService.signup(signupData);
        await login(response);
        if (isAdmin) {
          await checkOrganization();
        } else {
          navigate('/dashboard');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred');
      }
    },
  });

  return (
    <AuthLayout>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Sign Up
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
        <FormTextField
          formik={formik}
          name="confirmPassword"
          label="Confirm Password"
          type="password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <Link href="/login" variant="body2">
            Already have an account? Login
          </Link>
        </Box>
      </Box>
    </AuthLayout>
  );
} 