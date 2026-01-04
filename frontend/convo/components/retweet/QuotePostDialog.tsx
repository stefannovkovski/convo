'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Avatar,
  TextField,
  Button,
  Card,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PostResponseDto } from '@/types/post/PostResponseDto';

interface QuotePostDialogProps {
  open: boolean;
  onClose: () => void;
  post: PostResponseDto;
  onCreate: (data: { content: string; quotedPostId: number }) => void;
}

export default function QuotePostDialog({ open, onClose, post, onCreate, }: QuotePostDialogProps) 
{
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (!content.trim()) return;

    onCreate({
      content,
      quotedPostId: post.id,
    });
    setContent('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        Quote Post
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
          <Avatar sx={{ width: 48, height: 48 }} src="/default-avatar.png"></Avatar>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Add a comment"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: '1.1rem',
                },
              }}
            />
          </Box>
        </Box>

        <Card
          variant="outlined"
          sx={{
            p: 1.5,
            mb: 2,
            borderRadius: 2,
            bgcolor: 'action.hover',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Avatar sx={{ width: 20, height: 20, fontSize: '0.75rem' }} src="/default-avatar.png">
              {post.author.name.charAt(0)}
            </Avatar>
            <Typography variant="caption" fontWeight={700}>
              {post.author.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              @{post.author.username}
            </Typography>
          </Box>
          <Typography variant="body2">{post.content}</Typography>
          {post.imageUrl && (
            <Box
              component="img"
              src={post.imageUrl}
              alt="Post image"
              sx={{
                width: '100%',
                borderRadius: 1,
                mt: 1,
                maxHeight: 200,
                objectFit: 'cover',
              }}
            />
          )}
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
            Quote
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}