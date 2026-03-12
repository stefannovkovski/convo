'use client';

import { useRef, useState } from 'react';
import {
  Box,
  Avatar,
  TextField,
  Button,
  IconButton,
  Alert,
  Dialog,
  Drawer,
  useTheme,
  useMediaQuery
} from '@mui/material';

import ImageIcon from '@mui/icons-material/Image';
import GifIcon from '@mui/icons-material/Gif';

import { getUser } from '@/lib/auth';

import { Grid } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY || '');

interface CreatePostBoxProps {
  onCreate: (data: { content: string; imageUrl?: string } | FormData) => void;
  mode?: 'post' | 'reply';
  placeholder?: string;
}

export default function CreatePostBox({ onCreate, mode = 'post', placeholder }: CreatePostBoxProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [gifPickerOpen, setGifPickerOpen] = useState(false);
  const [gifSearch, setGifSearch] = useState('');
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const textFieldRef = useRef<HTMLTextAreaElement>(null);

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    const el = textFieldRef.current;
    if (!el) {
      setContent((prev) => prev + emojiData.emoji);
      return;
    }
    const start = el.selectionStart ?? content.length;
    const end = el.selectionEnd ?? content.length;
    setContent(content.slice(0, start) + emojiData.emoji + content.slice(end));
    requestAnimationFrame(() => {
      el.selectionStart = start + emojiData.emoji.length;
      el.selectionEnd = start + emojiData.emoji.length;
      el.focus();
    });
    setEmojiPickerOpen(false);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    const formData = new FormData();
    formData.append('content', content);

    if (image) {
      formData.append('image', image);
    } else if (gifUrl) {
      formData.append('imageUrl', gifUrl);
    }

    onCreate(formData);

    setContent('');
    setImage(null);
    setGifUrl(null);
  };

  const gifPickerContent = (
    <Box sx={{ p: 2, width: isMobile ? '100%' : 400 }}>
      <TextField
        fullWidth
        placeholder="Search GIFs..."
        value={gifSearch}
        onChange={(e) => setGifSearch(e.target.value)}
        size="small"
        sx={{ mb: 2 }}
      />
      <Box sx={{ overflowY: 'auto', maxHeight: isMobile ? '55vh' : 400 }}>
        <Grid
          width={isMobile ? Math.min(window.innerWidth - 32, 400) : 376}
          columns={3}
          fetchGifs={(offset) =>
            gifSearch
              ? gf.search(gifSearch, { offset, limit: 9 })
              : gf.trending({ offset, limit: 9 })
          }
          key={gifSearch}
          onGifClick={(gif, e) => {
            e.preventDefault();
            setGifUrl(gif.images.original.url);
            setImage(null);
            setGifPickerOpen(false);
          }}
        />
      </Box>
    </Box>
  );

  const emojiPickerContent = (
    <Box sx={{ width: isMobile ? '100%' : 'auto' }}>
      <EmojiPicker
        onEmojiClick={handleEmojiSelect}
        theme={theme.palette.mode === 'dark' ? Theme.DARK : Theme.LIGHT}
        previewConfig={{ showPreview: false }}
        width={isMobile ? '100%' : undefined}
        style={isMobile ? { borderRadius: '16px 16px 0 0' } : undefined}
      />
    </Box>
  );

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Avatar
          sx={{ width: 48, height: 48 }}
          src={`${process.env.NEXT_PUBLIC_API_URL}${getUser().avatar}`}
        />

        <Box sx={{ flex: 1 }}>
          <TextField
            inputRef={textFieldRef}
            fullWidth
            multiline
            placeholder={placeholder ?? (mode === 'reply' ? 'Post your reply...' : "What's happening?")}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: '1.25rem',
                '& textarea': {
                  '&::placeholder': { opacity: 0.6 }
                }
              }
            }}
            sx={{ mb: 2 }}
          />

          {image && (
            <Box sx={{ mb: 2 }}>
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                style={{ maxWidth: '100%', borderRadius: 8 }}
              />
            </Box>
          )}

          {gifUrl && (
            <Box sx={{ mb: 2 }}>
              <img
                src={gifUrl}
                alt="gif preview"
                style={{ maxWidth: '100%', borderRadius: 8 }}
              />
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box>
              <IconButton
                size="small"
                color="primary"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon />
              </IconButton>

              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  setGifUrl(null);
                  setImage(e.target.files?.[0] || null);
                }}
              />

              <IconButton
                size="small"
                color="primary"
                onClick={() => setGifPickerOpen(true)}
              >
                <GifIcon />
              </IconButton>

              <IconButton
                size="small"
                color="primary"
                onClick={() => setEmojiPickerOpen(true)}
              >
                <EmojiEmotionsOutlinedIcon />
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
                px: 3
              }}
            >
              {mode === 'reply' ? 'Reply' : 'Post'}
            </Button>
          </Box>
        </Box>
      </Box>

      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={gifPickerOpen}
          onClose={() => setGifPickerOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: '16px 16px 0 0',
              maxHeight: '75vh'
            }
          }}
        >
          {gifPickerContent}
        </Drawer>
      ) : (
        <Dialog open={gifPickerOpen} onClose={() => setGifPickerOpen(false)}>
          {gifPickerContent}
        </Dialog>
      )}

      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={emojiPickerOpen}
          onClose={() => setEmojiPickerOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: '16px 16px 0 0'
            }
          }}
        >
          {emojiPickerContent}
        </Drawer>
      ) : (
        <Dialog open={emojiPickerOpen} onClose={() => setEmojiPickerOpen(false)}>
          {emojiPickerContent}
        </Dialog>
      )}
    </Box>
  );
}