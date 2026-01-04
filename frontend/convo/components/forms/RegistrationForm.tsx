'use client';

import { useState } from 'react';
import { TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { authService } from '@/services/auth/auth.service';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      setError('');
      setSuccess('');
    };

  const validateForm = () => {
    if (Object.values(formData).some((val) => !val.trim())) {
      setError('Please fill in all fields');
      return false;
    }

    if (formData.password !== formData.repeatPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await authService.register(formData);
      setSuccess(result.message || 'Registration successful! You can now log in.');

      setFormData({
        name: '',
        username: '',
        email: '',
        password: '',
        repeatPassword: '',
      });
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        width: '100%',
      }}
    >
      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ borderRadius: 2 }}>
          {success}
        </Alert>
      )}

      <TextField label="Full Name" value={formData.name} onChange={handleChange('name')} fullWidth required disabled={loading} />
      <TextField label="Username" value={formData.username} onChange={handleChange('username')} fullWidth required disabled={loading} />
      <TextField label="Email" type="email" value={formData.email} onChange={handleChange('email')} fullWidth required disabled={loading} />

      <TextField
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleChange('password')}
        fullWidth
        required
        disabled={loading}
        helperText="Must be at least 8 characters"
      />

      <TextField
        label="Confirm Password"
        type="password"
        value={formData.repeatPassword}
        onChange={handleChange('repeatPassword')}
        fullWidth
        required
        disabled={loading}
      />

      <Button type="submit" variant="contained" size="large" disabled={loading}>
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
      </Button>
    </Box>
  );
}
