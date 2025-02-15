import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Typography,
  Button,
  Box,
  Alert,
} from '@mui/material';
import AuthLayout from '../components/layouts/AuthLayout';
import FormTextField from '../components/forms/FormTextField';
import axios from 'axios';

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  description: Yup.string()
});

export default function CreateOrganization() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
      description: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem('accessToken');
        await axios.post(
          'http://localhost:3001/api/organizations',
          values,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        navigate('/dashboard');
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred');
      }
    },
  });

  return (
    <AuthLayout>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Create Organization
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
        <FormTextField
          formik={formik}
          name="name"
          label="Organization Name"
        />
        <FormTextField
          formik={formik}
          name="description"
          label="Description"
          multiline
          rows={4}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Create Organization
        </Button>
      </Box>
    </AuthLayout>
  );
} 