'use client';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CreatePostBox from './CreatePostBox';

interface CreatePostDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { content: string; imageUrl?: string }) => void;
}

export default function CreatePostDialog({ open, onClose, onCreate }: CreatePostDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        Create Post
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <CreatePostBox 
          onCreate={(data) => {
            onCreate(data);
            onClose();
          }} 
        />
      </DialogContent>
    </Dialog>
  );
}