'use client';

import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Typography,
  Avatar,
  CircularProgress,
  Divider,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/navigation';
import { useChats } from '@/hooks/useChats';
import { formatDistanceToNow } from 'date-fns';

interface MessagesPanelProps {
  userId: number | null;
  expanded: boolean;
  onToggle: () => void;
  apiUrl?: string;
}

export default function MessagesPanel({ userId, expanded, onToggle, apiUrl }: MessagesPanelProps) {
  const router = useRouter();
  const { chats, loading } = useChats(userId);

  const totalUnread = chats.reduce((sum, chat) => sum + (chat.unreadCount ?? 0), 0);

  const getOtherParticipant = (chat: typeof chats[0]) => {
    if (!userId || !chat.participantDetails) return null;
    const otherId = chat.participants.find((p) => p !== userId);
    if (!otherId) return null;
    return { id: otherId, ...chat.participantDetails[otherId] };
  };

  return (
    <>
      <ListItemButton
        onClick={onToggle}
        sx={{ borderRadius: 3, mb: 0.5, '&:hover': { bgcolor: 'action.hover' } }}
      >
        <ListItemIcon sx={{ minWidth: 48 }}>
          <Badge badgeContent={totalUnread > 0 ? totalUnread : undefined} color="error" max={99}>
            <ChatBubbleOutlineIcon />
          </Badge>
        </ListItemIcon>
        <ListItemText
          primary="Messages"
          primaryTypographyProps={{ fontSize: '1.25rem', fontWeight: 500 }}
        />
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            maxHeight: 320,
            overflowY: 'auto',
            mx: 1,
            mb: 1,
            borderRadius: 2,
            bgcolor: 'action.hover',
          }}
        >
          {!userId ? (
            <Typography variant="caption" color="text.secondary" sx={{ p: 2, display: 'block' }}>
              Log in to see messages.
            </Typography>
          ) : loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={20} />
            </Box>
          ) : chats.length === 0 ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 32, color: 'text.disabled', mb: 1 }} />
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                No messages yet
              </Typography>
              <Typography variant="caption" color="text.disabled">
                Visit someone&apos;s profile to start chatting
              </Typography>
            </Box>
          ) : (
            <List dense disablePadding>
              {chats.map((chat, idx) => {
                const other = getOtherParticipant(chat);
                if (!other) return null;
                const unread = chat.unreadCount ?? 0;

                return (
                  <Box key={chat.id}>
                    <ListItemButton
                      onClick={() => router.push(`/dashboard/messages/${chat.id}`)}
                      sx={{ px: 1.5, py: 1, borderRadius: 1 }}
                    >
                      <Avatar
                        src={other.avatar ? `${apiUrl}${other.avatar}` : undefined}
                        sx={{ width: 36, height: 36, mr: 1.5, fontSize: '0.9rem' }}
                      >
                        {other.name?.[0]?.toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography
                            variant="body2"
                            fontWeight={unread > 0 ? 700 : 500}
                            noWrap
                            sx={{ maxWidth: 120 }}
                          >
                            {other.name}
                          </Typography>
                          {chat.lastMessageAt && (
                            <Typography variant="caption" color="text.disabled" sx={{ ml: 1, whiteSpace: 'nowrap' }}>
                              {formatDistanceToNow(chat.lastMessageAt, { addSuffix: false })}
                            </Typography>
                          )}
                        </Box>
                        <Typography
                          variant="caption"
                          color={unread > 0 ? 'text.primary' : 'text.secondary'}
                          fontWeight={unread > 0 ? 600 : 400}
                          noWrap
                          sx={{ display: 'block' }}
                        >
                          {chat.lastMessage ?? 'No messages yet'}
                        </Typography>
                      </Box>
                      {unread > 0 && (
                        <Badge
                          badgeContent={unread}
                          color="error"
                          max={99}
                          sx={{ ml: 1 }}
                        />
                      )}
                    </ListItemButton>
                    {idx < chats.length - 1 && <Divider sx={{ mx: 1.5 }} />}
                  </Box>
                );
              })}
            </List>
          )}
        </Box>
      </Collapse>
    </>
  );
}
