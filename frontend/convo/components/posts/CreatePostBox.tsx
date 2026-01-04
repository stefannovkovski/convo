'use client';
import { useState } from 'react';
import { Box, Avatar, TextField, Button, IconButton, Alert } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';

interface CreatePostBoxProps {
  onCreate: (data: { content: string; imageUrl?: string }) => void;
}

export default function CreatePostBox({ onCreate }: CreatePostBoxProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      setError(null);
      onCreate({ content });
      setContent('');
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error instanceof Error ? error.message : 'Failed to create post');
    }
  };

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        p: 2,
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Avatar sx={{ width: 48, height: 48 }}>U</Avatar>

        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            multiline
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: '1.25rem',
                '& textarea': {
                  '&::placeholder': {
                    opacity: 0.6,
                  },
                },
              },
            }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton size="small" color="primary">
                <ImageIcon />
              </IconButton>
            </Box>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!content.trim()}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                px: 3,
              }}
            >
              Post
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}