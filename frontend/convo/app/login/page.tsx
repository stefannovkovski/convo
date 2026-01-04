'use client';

import { Container, Paper, Typography, Box, Divider, Link as MuiLink, useTheme, IconButton } from '@mui/material';
import Link from 'next/link';
import LoginForm from '@/components/forms/LoginForm';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '@/theme/themeContext';

export default function LoginPage() {
    const { toggleTheme, mode } = useThemeContext();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <IconButton
        onClick={toggleTheme}
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s ease',
          width: 48,
          height: 48,
        }}
        aria-label="toggle theme"
      >
        {isDark ? (
          <Brightness7Icon sx={{ color: '#FDB813' }} />
        ) : (
          <Brightness4Icon sx={{ color: '#1976d2' }} />
        )}
      </IconButton>
        <Paper
          elevation={3}
          sx={{ p: { xs: 3, sm: 5 }, width: '100%', borderRadius: 3 }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Sign In
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back! Please login to your account
            </Typography>
          </Box>

          <LoginForm />

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <MuiLink
                component={Link}
                href="/register"
                underline="hover"
                sx={{ fontWeight: 600 }}
              >
                Register
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
