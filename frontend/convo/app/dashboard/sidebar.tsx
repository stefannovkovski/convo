'use client';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Avatar, Button, Typography, IconButton, useTheme, Skeleton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import { useRouter } from 'next/navigation';
import { useThemeContext } from '@/theme/themeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Image from 'next/image';
import { useState } from 'react';
import CreatePostDialog from '@/components/posts/CreatePostDialog';
import { useAuth } from '@/hooks/useUser';
import { logout } from '@/lib/auth';
import LogoutIcon from '@mui/icons-material/Logout';
import usePosts from '@/hooks/usePosts';



export default function Sidebar() {
  const router = useRouter();
  const [postOpen, setPostOpen] = useState(false);
  const { user, loading } = useAuth();
  const { onCreate } = usePosts(); 

  const { toggleTheme, mode } = useThemeContext();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handlePostCreated = () => {
    setPostOpen(false);
    window.location.reload(); 
  };

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { icon: <HomeIcon />, label: 'Home', path: '/dashboard/home' },
    { icon: <SearchIcon />, label: 'Explore', path: '/explore' },
    { icon: <NotificationsIcon />, label: 'Notifications', path: '/notifications' },
    { icon: <PersonIcon />, label: 'Profile',   path: user ? `/dashboard/${user.username}` : '/login', },
  ];

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
      <Box sx={{ mb: 2, px: 2 }}>
        <Image 
         src={isDark ? '/convo-logo-dark.jpg' : '/convo-logo-light.jpg'}
         alt="Logo"
         width={130}     
         height={130}    
        />
      </Box>


      <IconButton
        onClick={toggleTheme}
        sx={{
          bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s ease',
          width: 48,
          height: 48,
          mb : 2,
        }}
        aria-label="toggle theme"
      >
        {isDark ? (
          <Brightness7Icon sx={{ color: '#ffffffff' }} />
        ) : (
          <Brightness4Icon sx={{ color: '#000000ff' }} />
        )}
      </IconButton>

      <List sx={{ flex: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.label}
            onClick={() => router.push(item.path)}
            sx={{
              borderRadius: 3,
              mb: 0.5,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 48 }}>{item.icon}</ListItemIcon>
            <ListItemText 
              primary={item.label} 
              primaryTypographyProps={{ fontSize: '1.25rem', fontWeight: 500 }}
            />
          </ListItemButton>
        ))}
      </List>

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick = {() => setPostOpen(true)}
        sx={{
          borderRadius: 3,
          py: 1.5,
          mb: 2,
          textTransform: 'none',
          fontSize: '1.1rem',
          fontWeight: 700,
        }}
      >
        Post
      </Button>

      <CreatePostDialog
            open={postOpen}
            onClose={() => setPostOpen(false)}
            onCreate={(data) => {
            onCreate(data);
            handlePostCreated();
          }}
      />

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 1.5,
          borderRadius: 3,
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
 {loading ? (
          <>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="60%" />
              <Skeleton width="40%" />
            </Box>
          </>
        ) : user ? (
          <>
            <Avatar 
              src={`${process.env.NEXT_PUBLIC_API_URL}${user.avatar}`}
              sx={{ width: 40, height: 40, bgcolor: 'primary.main' }} 
            >

            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={700} noWrap>
                {user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                @{user.username}
              </Typography>
            </Box>
            <IconButton size="small" onClick={handleLogout} title="Logout">
              <LogoutIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <>
            <Avatar sx={{ width: 40, height: 40 }}>?</Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight={700}>Guest</Typography>
              <Typography variant="caption" color="text.secondary">Not logged in</Typography>
            </Box>
          </>
        )}

      </Box>
    </Box>
  );
}