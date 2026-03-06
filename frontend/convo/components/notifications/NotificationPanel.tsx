'use client';

import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Badge,
  IconButton,
  CircularProgress,
  useTheme,
  Collapse,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/hooks/useNotifications';
import type { Notification } from '@/types/notification';

function formatTime(date: Date | { seconds: number; nanoseconds: number }): string {
  const d = date instanceof Date ? date : new Date(date.seconds * 1000 + date.nanoseconds / 1e6);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}

interface NotificationPanelProps {
  userId: number | null;
  expanded: boolean;
  onToggle: () => void;
  maxHeight?: number;
}

export default function NotificationPanel({
  userId,
  expanded,
  onToggle,
  maxHeight = 280,
}: NotificationPanelProps) {
  const theme = useTheme();
  const router = useRouter();
  const {
    notifications,
    loading,
    error,
    firebaseReady,
    unreadCount,
    markAsRead,
  } = useNotifications(userId);

  const handleNotificationClick = (n: Notification) => {
    if (!n.read) markAsRead(n.id);
    if (n.link) router.push(n.link);
  };

  if (!userId) return null;

  return (
    <Box sx={{ width: '100%', mb: 1 }}>
      <ListItemButton
        onClick={onToggle}
        sx={{
          borderRadius: 3,
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <Badge badgeContent={unreadCount} color="primary" sx={{ mr: 1 }}>
          <NotificationsIcon />
        </Badge>
        <ListItemText
          primary="Notifications"
          primaryTypographyProps={{ fontSize: '1.25rem', fontWeight: 500 , ml: 2 }}
        />
        {expanded ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            maxHeight,
            overflowY: 'auto',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
            mt: 0.5,
          }}
        >
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={28} />
            </Box>
          )}
          {error && (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              {error}
            </Typography>
          )}
          {!loading && !error && !firebaseReady && (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              Set up Firebase to enable notifications
            </Typography>
          )}
          {!loading && !error && firebaseReady && notifications.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              No notifications yet
            </Typography>
          )}
          {!loading && !error && notifications.length > 0 && (
            <List dense disablePadding>
              {notifications.map((n) => (
                <ListItemButton
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  sx={{
                    py: 1,
                    px: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                    bgcolor: n.read ? 'transparent' : 'action.selected',
                    '&:last-child': { borderBottom: 0 },
                  }}
                >
                  <ListItemText
                    primary={n.title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.secondary">
                          {n.body}
                        </Typography>
                        <Typography component="span" variant="caption" display="block" color="text.secondary">
                          {formatTime(n.createdAt)}
                        </Typography>
                      </>
                    }
                    primaryTypographyProps={{
                      fontWeight: n.read ? 400 : 600,
                      fontSize: '0.95rem',
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}
