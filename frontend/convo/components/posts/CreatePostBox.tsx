'use client';
import { useRef, useState } from 'react';
import { Box, Avatar, TextField, Button, IconButton, Alert } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { getUser } from '@/lib/auth';

interface CreatePostBoxProps {
  onCreate: (data: { content: string;} | FormData) => void;
}

export default function CreatePostBox({ onCreate }: CreatePostBoxProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    if (image) {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('image', image);
      onCreate(formData);
    } else {
      onCreate({ content }); 
    }
    setContent('');
    setImage(null);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2,}}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Avatar sx={{ width: 48, height: 48 }}src={`${process.env.NEXT_PUBLIC_API_URL}${getUser().avatar}`}>U</Avatar>

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

          {image && (
            <Box sx={{ mb: 2 }}>
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                style={{ maxWidth: '100%', borderRadius: 8}}
              />
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <IconButton size="small" color="primary" onClick={() => fileInputRef.current?.click()}>
                <ImageIcon />
              </IconButton>

              <input
                ref={fileInputRef}
                type='file'
                hidden
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />

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