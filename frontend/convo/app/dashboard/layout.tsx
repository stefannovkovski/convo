'use client';
import { useState } from 'react';
import { Box, Drawer, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './sidebar';
import SuggestionsPanel from './suggestionpanel';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenMenu = () => setMobileMenuOpen(true);
  const handleCloseMenu = () => setMobileMenuOpen(false);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', maxWidth: 1300 }}>
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            position: 'sticky',
            top: 0,
            zIndex: 1200,
            px: 1.5,
            py: 1,
            alignItems: 'center',
            gap: 1,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            backdropFilter: 'blur(10px)',
          }}
        >
          <IconButton aria-label="open menu" onClick={handleOpenMenu}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700}>
            Convo
          </Typography>
        </Box>

        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={handleCloseMenu}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: 285,
              bgcolor: 'background.paper',
            },
          }}
        >
          <Sidebar onNavigate={handleCloseMenu} compact />
        </Drawer>

        <Box sx={{ display: 'flex', width: '100%' }}>
        <Box
          component="aside"
          sx={{
            width: 275,
            flexShrink: 0,
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflowY: 'auto',
            display: { xs: 'none', md: 'block' },
            borderRight: 1,
            borderColor: 'divider',
          }}
        >
          <Sidebar />
        </Box>

        <Box
          component="main"
          sx={{
            flex: 1,
            minHeight: '100vh',
            borderRight: { xs: 0, lg: 1 },
            borderColor: 'divider',
          }}
        >
          {children}
        </Box>

        <Box
          component="aside"
          sx={{
            width: 350,
            flexShrink: 0,
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflowY: 'auto',
            display: { xs: 'none', lg: 'block' },
            pl:5,
          }}
        >
          <SuggestionsPanel />
        </Box>
        </Box>
      </Box>
    </Box>
  );
}