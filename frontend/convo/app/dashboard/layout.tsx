'use client';
import { Box, Container } from '@mui/material';
import Sidebar from './sidebar';
import SuggestionsPanel from './suggestionpanel';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        component="aside"
        sx={{
          width: 300,
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
          borderRight: 1,
          borderColor: 'divider',
          display: { xs: 'none', md: 'block' },
        }}
      >
        <Sidebar />
      </Box>

      <Box
        component="main"
        sx={{
          flex: 1,
          ml: { xs: 0, md: '275px' },
          mr: { xs: 0, lg: '350px' },
          minHeight: '100vh',
        }}
      >
        <Container
          maxWidth="sm"
          disableGutters
          sx={{
            borderLeft: { xs: 0, md: 1 },
            borderRight: { xs: 0, lg: 1 },
            borderColor: 'divider',
            minHeight: '100vh',
          }}
        >
          {children}
        </Container>
      </Box>

      <Box
        component="aside"
        sx={{
          width: 350,
          position: 'fixed',
          right: 0,
          height: '100vh',
          overflowY: 'auto',
          display: { xs: 'none', lg: 'block' },
          pl: 2,
        }}
      >
        <SuggestionsPanel />
      </Box>
    </Box>
  );
}