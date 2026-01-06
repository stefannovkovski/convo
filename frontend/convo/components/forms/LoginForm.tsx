'use client';

import { TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const { login, loading, error } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    router.push('/dashboard/home');
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
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
      />

      <Button
        type="submit"
        variant="outlined"
        disabled={loading}
        sx={{
          borderRadius: 3,
          fontWeight: 700,
          py: 1.2,
          textTransform: 'none',
        }}
      >
        {loading ? <CircularProgress size={22} /> : 'Login'}
      </Button>
    </Box>
  );
}
