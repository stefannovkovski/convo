'use client';

import { Box, Avatar, Typography, Button } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import UpdateProfileDialog from './UpdateProfileDialog';

type ProfileHeaderProps = {
  avatarUrl?: string;
  name: string;
  username: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  postsCount?: number;
  isMe?: boolean;
  isFollowing?: boolean;
  onToggleFollow?: () => void;
  onEdit?: (data) => void;
};

export default function ProfileHeader({
  avatarUrl,
  name,
  username,
  bio,
  followersCount,
  followingCount,
  postsCount,
  isMe,
  isFollowing,
  onToggleFollow,
  onEdit,
}: ProfileHeaderProps) {

  const [editOpen, setEditOpen] = useState(false);
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Box
        sx={{
          height: 100,
          background: 'linear-gradient(135deg, #bfc0c7ff 0%, #070409ff 100%)',
        }}
      />

      <Box sx={{ px: 2, pb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            mb: 2,
          }}
        >
          <Avatar
            src={`${process.env.NEXT_PUBLIC_API_URL}${avatarUrl}`}
            alt={name}
            sx={{
              width: 134,
              height: 134,
              border: 4,
              borderColor: 'background.paper',
              mt: -8,
            }}
          >
          </Avatar>

          {isMe ? (
            <>
              <Button
              variant="outlined"
              size="large"
              startIcon={<EditIcon />}
              onClick={() => setEditOpen(true)}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                px: 3,
                minWidth: 120,
              }}
            >
              Edit Profile
            </Button>

              <UpdateProfileDialog
                open={editOpen}
                onClose={() => setEditOpen(false)}
                initialData={{
                  name,
                  bio,
                  avatarUrl,
                }}
                onSave={(data) => {
                  onEdit?.(data);
                }}
              >
              </UpdateProfileDialog>
            </>
          ) : onToggleFollow ? (
            <Button
              key={isFollowing ? 'following' : 'follow'} 
              variant={isFollowing ? 'outlined' : 'contained'}
              size="large"
              startIcon={isFollowing ? <CheckIcon /> : <PersonAddIcon />}
              onClick={onToggleFollow}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                px: 3,
                minWidth: 120,
                ...(isFollowing && {
                  '&:hover': {
                    borderColor: 'error.main',
                    color: 'error.main',
                    '& .MuiButton-startIcon': {
                      display: 'none',
                    },
                    '&::after': {
                      content: '"Unfollow"',
                    },
                  },
                }),
              }}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          ) : null}
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography variant="h5" fontWeight={800}>
            {name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            @{username}
          </Typography>
        </Box>

        {bio && (
          <Typography
            variant="body1"
            sx={{ mb: 2, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}
          >
            {bio}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              cursor: 'pointer',
              '&:hover': {
                '& .count': {
                  textDecoration: 'underline',
                },
              },
            }}
          >
            <Typography variant="body2" fontWeight={700} className="count">
              {followingCount || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Following
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              cursor: 'pointer',
              '&:hover': {
                '& .count': {
                  textDecoration: 'underline',
                },
              },
            }}
          >
            <Typography variant="body2" fontWeight={700} className="count">
              {followersCount || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Followers
            </Typography>
          </Box>

          {postsCount !== undefined && (
            <Box
              sx={{
                display: 'flex',
                gap: 0.5,
                cursor: 'pointer',
                '&:hover': {
                  '& .count': {
                    textDecoration: 'underline',
                  },
                },
              }}
            >
              <Typography variant="body2" fontWeight={700} className="count">
                {postsCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Posts
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}