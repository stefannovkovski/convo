'use client';

import CommentBox from "@/components/comment/CommentBox";
import PostCard from "@/components/posts/PostCard";
import usePosts from "@/hooks/usePosts";
import { Alert, Box, CircularProgress, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useRouter } from "next/navigation";
import CreatePostBox from "@/components/posts/CreatePostBox";

export default function PostDetailsPage() {
    const router = useRouter();
    const { postId } = useParams();
    const { posts, loading, error, onComment, onToggleLike, onToggleRetweet, onCreate, onEdit, onDelete} = usePosts({ postId: Number(postId)});

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress/>
        </Box>
    );
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!posts.length) return null;

    return(
    <Box sx={{ maxWidth: 600, mx: 'auto', minHeight: '100vh', bgcolor: 'background.paper' }}>
      <Box sx={{ 
        position: 'sticky', 
        top: 0, 
        bgcolor: 'background.paper', 
        borderBottom: 1, 
        borderColor: 'divider',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        px: 2,
        py: 1.5
      }}>
        <IconButton onClick={() => router.back()} sx={{ mr: 3 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={700}>
          Post
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <PostCard
          post={posts[0]}
          onToggleLike={onToggleLike}
          onToggleRetweet={onToggleRetweet}
          onCreate={onCreate}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <CreatePostBox
          mode="reply"
          onCreate={(data) => {
            if (data instanceof FormData) {
              onComment(Number(postId), data);
            } else {
              onComment(Number(postId), { content: data.content });
            }
          }}
        />
      </Box>

      {'replies' in posts[0] && posts[0].replies.length > 0 && (
        <Box>
          {posts[0].replies.map((reply) => (
            <PostCard
              key={reply.id}
              post={reply}
              onToggleLike={onToggleLike}
              onToggleRetweet={onToggleRetweet}
              onCreate={onCreate}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </Box>
      )}
    </Box>
    )
}