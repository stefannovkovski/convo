'use client';

import { use, useState } from 'react';
import { Box, Avatar, Typography, IconButton, Card, Link } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import RepeatIcon from '@mui/icons-material/Repeat';
import ShareIcon from '@mui/icons-material/Share';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { PostResponseDto } from '@/types/post/PostResponseDto';
import RetweetMenu from '../retweet/RetweetMenu';
import QuotePostDialog from '../retweet/QuotePostDialog';
import CommentDialog from '../comment/CommentDialog';
import { getUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import PostOptionsMenu from './PostOptionsMenu';
import EditPostDialog from './EditPostDialog';
import DeletePostDialog from './DeletePostDialog';

interface PostCardProps {
  post: PostResponseDto;
  onToggleLike: (postId: number) => void;
  onToggleRetweet: (postId: number) => void;
  onCreate: (data: { content: string; quotedPostId?: number }) => void;
  onComment: (postId: number,  content: string ) => void;
  onEdit: (postId: number, data: { content: string }) => void;
  onDelete: (postId: number) => void;
}

export default function PostCard({ post, onToggleLike, onToggleRetweet, onCreate, onComment, onEdit, onDelete }: PostCardProps) {
  const [retweetMenuAnchor, setRetweetMenuAnchor] = useState<null | HTMLElement>(null);
  const [optionsMenuAnchor, setOptionsMenuAnchor] = useState<null | HTMLElement>(null);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const handleRetweetClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setRetweetMenuAnchor(e.currentTarget);
  };

  const handleRetweetMenuClose = () => {
    setRetweetMenuAnchor(null);
  };

  const handleSimpleRetweet = () => {
    onToggleRetweet(post.id);
  };

  const handleOpenQuoteDialog = () => {
    setQuoteDialogOpen(true);
  };

  const handleNavigate = () => {
    router.push(`/dashboard/${post.author.username}/status/${post.id}`)
  }

  const handleQuoteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleQuoteNavigate();
  }
  const handleQuoteNavigate = () => {
    router.push(`/dashboard/${post.quotedPost?.author.username}/status/${post.quotedPost?.id}`)
  }

  const handleOptionsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOptionsMenuAnchor(e.currentTarget);
  }

  const handleOptionsClose = () => {
    setOptionsMenuAnchor(null);
  }

  const handleOpenEditDialog = () => {
    setEditDialogOpen(true);
  }

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  }

  const handleDeleteConfirm = () => {
    onDelete(post.id);
  }

  return (
    
    <>
      <Box
        onClick={handleNavigate}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          p: 2,
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
    >
        {post.isRetweet && post.retweetedBy && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, ml: 6 }}>
            <RepeatIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" fontWeight={700}>
              {post.retweetedBy.name} retweeted
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Avatar 
            sx={{ width: 48, height: 48 }}
            src={`${process.env.NEXT_PUBLIC_API_URL}${post.author.avatar}`}
          />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="body2" fontWeight={700} noWrap>
                {post.author.name}
              </Typography>
              <Typography
                component={Link}
                href={`/dashboard/${post.author.username}`}
                variant="body2"
                color="text.secondary"
                noWrap
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                @{post.author.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                · {formatDate(post.createdAt)}
              </Typography>
              {getUser().username === post.author.username && !post.isRetweet && (
                <Box sx={{ ml: 'auto' }}>
                  <IconButton size="small" onClick={handleOptionsClick}>
                    <MoreHorizIcon fontSize="small" />
                  </IconButton>
                </Box>
              )
              }

            </Box>

            <Typography variant="body1" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
              {post.content}
            </Typography>

            {post.imageUrl && (
              <Box
                component="img"
                src={`${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`}
                alt="Post image"
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  mb: 1,
                  maxHeight: 500,
                  objectFit: 'cover',
                }}
              />
            )}

            {post.quotedPost && (
              <Card
                variant="outlined"
                sx={{
                  p: 1.5,
                  mb: 1,
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }} onClick={handleQuoteClick}>
                  <Avatar 
                    sx={{ width: 20, height: 20, fontSize: '0.75rem' }}
                    src={`${process.env.NEXT_PUBLIC_API_URL}${post.quotedPost.author.avatar}`}
                  >
                    {post.quotedPost.author.name.charAt(0)}
                  </Avatar>
                  <Typography variant="caption" fontWeight={700}>
                    {post.quotedPost.author.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    @{post.quotedPost.author.username}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>{post.quotedPost.content}</Typography>
                {post.quotedPost?.imageUrl && (
                  <Box
                    component="img"
                    src={`${process.env.NEXT_PUBLIC_API_URL}${post.quotedPost?.imageUrl}`}
                    alt="Post image"
                    sx={{
                      width: '100%',
                      borderRadius: 2,
                      mb: 1,
                      maxHeight: 200,
                      objectFit: 'cover',
                    }}
                  />
                )}
              </Card>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, maxWidth: 450 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton
                  size="small"
                  sx={{ color: 'text.secondary' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCommentDialogOpen(true);
                  }}
                >
                  <ChatBubbleOutlineIcon fontSize="small" />
                </IconButton>
                <Typography variant="caption" color="text.secondary">
                  {post.counts.comments}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={handleRetweetClick}
                  sx={{
                    color: post.isRetweetedByMe ? 'success.main' : 'text.secondary',
                  }}
                >
                  <RepeatIcon fontSize="small" />
                </IconButton>
                <Typography
                  variant="caption"
                  color={post.isRetweetedByMe ? 'success.main' : 'text.secondary'}
                >
                  {post.counts.retweets}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLike(post.id);
                  }}
                  sx={{
                    color: post.isLikedByMe ? 'error.main' : 'text.secondary',
                  }}
                >
                  {post.isLikedByMe ? (
                    <FavoriteIcon fontSize="small" />
                  ) : (
                    <FavoriteBorderIcon fontSize="small" />
                  )}
                </IconButton>
                <Typography
                  variant="caption"
                  color={post.isLikedByMe ? 'error.main' : 'text.secondary'}
                >
                  {post.counts.likes}
                </Typography>
              </Box>

              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <ShareIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>

      <RetweetMenu
        anchorEl={retweetMenuAnchor}
        open={Boolean(retweetMenuAnchor)}
        onClose={handleRetweetMenuClose}
        onRetweet={handleSimpleRetweet}
        onQuote={handleOpenQuoteDialog}
        isRetweeted={post.isRetweetedByMe}
      />

      <PostOptionsMenu
        anchorEl={optionsMenuAnchor}
        open={Boolean(optionsMenuAnchor)}
        onClose={handleOptionsClose}
        onEdit={handleOpenEditDialog}
        onDelete={handleOpenDeleteDialog}
      />

      <QuotePostDialog
        open={quoteDialogOpen}
        onClose={() => setQuoteDialogOpen(false)}
        post={post}
        onCreate={onCreate}
      />

      <CommentDialog
        open={commentDialogOpen}
        postId={post.id}
        onClose={() => setCommentDialogOpen(false)}
        onComment={onComment}
      />

      <EditPostDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        post={post}
        onEdit={onEdit}
      />

      <DeletePostDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}

function formatDate(date: Date): string {
  const now = new Date();
  const postDate = new Date(date);
  const diffMs = now.getTime() - postDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}