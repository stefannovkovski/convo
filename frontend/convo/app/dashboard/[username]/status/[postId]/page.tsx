'use client';

import CommentBox from "@/components/comment/CommentBox";
import CommentsList from "@/components/comment/CommentList";
import PostCard from "@/components/posts/PostCard";
import usePosts from "@/hooks/usePosts";
import { Alert, Box, CircularProgress, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useRouter } from "next/navigation";

export default function PostDetailsPage() {
    const router = useRouter();
    const { postId } = useParams();
    const { posts, loading, error, onComment, onDeleteComment, onToggleLike, onToggleRetweet, onCreate} = usePosts({ postId: Number(postId)});

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
          onComment={onComment}
        />
      </Box>

      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <CommentBox
          onSubmit={(content) => {
            onComment(Number(postId), content);
          }}
        />
      </Box>

      <CommentsList
        comments={'comments' in posts[0] ? posts[0].comments : []}
        postId={posts[0].id}
        onDelete={onDeleteComment}
      />
    </Box>
    )
}