'use client';
import { Box } from '@mui/material';
import Sidebar from './sidebar';
import SuggestionsPanel from './suggestionpanel';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', width: '100%', maxWidth: 1300 }}>
        
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
            pr: 1,
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
  );
}