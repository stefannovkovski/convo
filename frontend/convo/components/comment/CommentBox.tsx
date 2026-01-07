'use client';
import { useState } from 'react';
import { Box, Avatar, TextField, Button } from '@mui/material';
import { getUser } from '@/lib/auth';

interface CommentBoxProps {
  onSubmit: (content: string) => void;
}

export default function CommentBox({ onSubmit }: CommentBoxProps) {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content);
    setContent('');
  };

  return (
    <Box sx={{ p: 2, borderBottom:0.5, borderTop:0.5, borderColor: 'lightgray', borderRadius:4 }}>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Avatar
          sx={{ width: 40, height: 40 }}
          src={`${process.env.NEXT_PUBLIC_API_URL}${getUser().avatar}`}
        />

        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            multiline
            placeholder="Post your reply"
            variant="standard"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            InputProps={{ disableUnderline: true }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              disabled={!content.trim()}
              onClick={handleSubmit}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                px: 3,
              }}
            >
              Reply
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
