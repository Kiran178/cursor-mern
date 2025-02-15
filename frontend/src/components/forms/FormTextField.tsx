import { TextField, TextFieldProps } from '@mui/material';
import { useFormik } from 'formik';

interface FormTextFieldProps extends Omit<TextFieldProps, 'error' | 'helperText'> {
  formik: ReturnType<typeof useFormik<any>>;
  name: string;
}

export default function FormTextField({ formik, name, ...props }: FormTextFieldProps) {
  return (
    <TextField
      fullWidth
      margin="normal"
      {...props}
      name={name}
      value={formik.values[name]}
      onChange={formik.handleChange}
      error={formik.touched[name] && Boolean(formik.errors[name])}
      helperText={formik.touched[name] && (formik.errors[name] as string)}
    />
  );
} 