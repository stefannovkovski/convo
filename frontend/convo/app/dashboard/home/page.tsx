'use client';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import PostCard from '@/components/posts/PostCard';
import CreatePostBox from '@/components/posts/CreatePostBox';
import  usePosts  from '@/hooks/usePosts';

export default function HomePage() {
  const { posts, loading, error, onCreate, onToggleLike, onToggleRetweet, clearError } = usePosts();


  if (loading && posts.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          borderBottom: 1,
          borderColor: 'divider',
          p: 2,
          backdropFilter: 'blur(10px)',
          zIndex: 10,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Home
        </Typography>
      </Box>

      {error && (
        <Box sx={{ p: 2 }}>
          <Alert severity="error" onClose={clearError}>
            {error}
          </Alert>
        </Box>
      )}

      <CreatePostBox onCreate={onCreate} />

      <Box>
        {posts.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">No posts yet</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Be the first to post something!
            </Typography>
          </Box>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onToggleLike={onToggleLike}
              onToggleRetweet={onToggleRetweet}
              onCreate={onCreate}
            />
          ))
        )}
      </Box>
    </Box>
  );
}