'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  CircularProgress,
  Paper,
  InputAdornment,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '@/hooks/useUser';
import { useChat } from '@/hooks/useChat';
import { formatDistanceToNow } from 'date-fns';
import { getFirebaseFirestore, isFirebaseConfigured } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface OtherUser {
  id: number;
  username: string;
  name: string;
  avatar?: string;
}

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, loading, sendMessage } = useChat({
    chatId: chatId ?? null,
    currentUserId: user?.id ?? null,
  });

  useEffect(() => {
    if (!chatId || !user) return;
    const firestore = getFirebaseFirestore();
    if (!firestore || !isFirebaseConfigured()) return;

    getDoc(doc(firestore, 'chats', chatId)).then((snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      const participants = data.participants as number[];
      const otherId = participants.find((p) => p !== user.id);
      if (!otherId) return;
      const details = data.participantDetails?.[otherId];
      if (details) {
        setOtherUser({ id: otherId, ...details });
      }
    });
  }, [chatId, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !user || !otherUser) return;
    const participantDetails = {
      [user.id]: { username: user.username, name: user.name, avatar: user.avatar },
      [otherUser.id]: {
        username: otherUser.username,
        name: otherUser.name,
        avatar: otherUser.avatar,
      },
    };
    await sendMessage(text, [user.id, otherUser.id], participantDetails);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!user) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: 700, mx: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <IconButton onClick={() => router.back()} size="small">
          <ArrowBackIcon />
        </IconButton>
        {otherUser && (
          <>
            <Avatar
              src={otherUser.avatar ? `${process.env.NEXT_PUBLIC_API_URL}${otherUser.avatar}` : undefined}
              sx={{ width: 38, height: 38, cursor: 'pointer' }}
              onClick={() => router.push(`/dashboard/${otherUser.username}`)}
            >
              {otherUser.name?.[0]?.toUpperCase()}
            </Avatar>
            <Box
              sx={{ cursor: 'pointer' }}
              onClick={() => router.push(`/dashboard/${otherUser.username}`)}
            >
              <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
                {otherUser.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                @{otherUser.username}
              </Typography>
            </Box>
          </>
        )}
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 6, color: 'text.secondary' }}>
            <Typography variant="body1" fontWeight={600} mb={0.5}>
              No messages yet
            </Typography>
            <Typography variant="body2">
              Say hello to {otherUser?.name ?? 'them'}!
            </Typography>
          </Box>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user.id;
            return (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  justifyContent: isMe ? 'flex-end' : 'flex-start',
                }}
              >
                <Box sx={{ maxWidth: '70%' }}>
                  <Paper
                    elevation={0}
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      bgcolor: isMe ? 'primary.main' : 'action.hover',
                      color: isMe ? 'primary.contrastText' : 'text.primary',
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {msg.text}
                    </Typography>
                  </Paper>
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ display: 'block', mt: 0.25, px: 0.5, textAlign: isMe ? 'right' : 'left' }}
                  >
                    {formatDistanceToNow(msg.createdAt, { addSuffix: true })}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
        <div ref={bottomRef} />
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          position: 'sticky',
          bottom: 0,
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Type a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          size="small"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSend}
                  disabled={!text.trim()}
                  color="primary"
                  size="small"
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
}
