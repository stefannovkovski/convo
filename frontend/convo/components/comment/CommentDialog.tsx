'use client';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CommentBox from './CommentBox';

interface CommentDialogProps {
  open: boolean;
  postId: number;
  onClose: () => void;
  onComment: (postId: number, content: string) => void;
}

export default function CommentDialog({
  open,
  postId,
  onClose,
  onComment,
}: CommentDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        Reply
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <CommentBox
          onSubmit={(content) => {
            onComment(postId, content);
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
