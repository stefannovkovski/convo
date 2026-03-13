'use client';
import { Button, Box, IconButton, useMediaQuery } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@mui/material/styles';
import { useThemeContext } from '@/theme/themeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function HomePage() {
  const { toggleTheme, mode } = useThemeContext();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isMobile ? 4 : 16,
        px: { xs: 4, md: 8, lg: 12 },
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Theme toggle */}
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

      {/* Logo */}
      <Box>
        <Image
          src={isDark ? '/convo-logo-dark.jpg' : '/convo-logo-light.jpg'}
          alt="Logo"
          width={isMobile ? 200 : 700}
          height={isMobile ? 200 : 700}
          priority
        />
      </Box>

      {/* Buttons */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: isMobile ? '100%' : 'auto',
          minWidth: isMobile ? 'unset' : '300px',
        }}
      >
        <Link href="/login" style={{ textDecoration: 'none' }}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Login
          </Button>
        </Link>

        <Link href="/register" style={{ textDecoration: 'none' }}>
          <Button
            variant="outlined"
            size="large"
            fullWidth
            sx={{
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              borderWidth: 2,
            }}
          >
            Register
          </Button>
        </Link>
      </Box>
    </Box>
  );
}