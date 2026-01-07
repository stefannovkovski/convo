'use client';
import { Box, Avatar, Typography, IconButton, Divider } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { getUser } from "@/lib/auth";

interface Comment {
  id: number;
  content: string;
  createdAt: string | Date;
  user: { id: number; name: string; username: string; avatar: string };
}

interface CommentsListProps {
  comments: Comment[];
  postId: number;
  onDelete: (commentId: number, postId: number) => void;
}

export default function CommentsList({ comments, postId, onDelete }: CommentsListProps) {
  const currentUser = getUser();

  if (!comments.length) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">No comments yet</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {comments.map((comment, index) => (
        <Box key={comment.id}>
          <Box sx={{ p: 2, display: 'flex', gap: 1.5 }}>
            <Avatar src={`${process.env.NEXT_PUBLIC_API_URL}${comment.user.avatar}`} sx={{ width: 40, height: 40 }} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography fontWeight={700} variant="body2">
                  {comment.user.name}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  @{comment.user.username}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  · {new Date(comment.createdAt).toLocaleDateString()}
                </Typography>
                {currentUser.id === comment.user.id && (
                  <IconButton
                    size="small"
                    sx={{ ml: 'auto', p: 0.5 }}
                    onClick={() => onDelete(comment.id, postId)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Typography variant="body2">{comment.content}</Typography>
            </Box>
          </Box>
          {index < comments.length - 1 && <Divider />}
        </Box>
      ))}
    </Box>
  );
}