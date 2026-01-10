'use client';

import { Box, Avatar, Typography, Button, Card, CardContent } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check';
import { useRouter } from 'next/navigation';

type UserCardProps = {
  username: string;
  name: string;
  avatar?: string;
  bio?: string;
  isFollowing: boolean;
  followersCount: number;
  onToggleFollow: () => void;
};

export default function UserCard({
  username,
  name,
  avatar,
  bio,
  isFollowing,
  followersCount,
  onToggleFollow,
}: UserCardProps) {
  const router = useRouter();

  return (
    <Card
      sx={{
        mb: 2,
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'action.hover',
        },
        transition: 'background-color 0.2s',
      }}
      onClick={() => router.push(`/dashboard/${username}`)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar
            src={avatar ? `${process.env.NEXT_PUBLIC_API_URL}${avatar}` : undefined}
            sx={{ width: 56, height: 56 }}
          >
            {name.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="h6" fontWeight={700} noWrap>
                  {name}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  @{username}
                </Typography>
              </Box>

              <Button
                variant={isFollowing ? 'outlined' : 'contained'}
                size="small"
                startIcon={isFollowing ? <CheckIcon /> : <PersonAddIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFollow();
                }}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 2,
                  minWidth: 100,
                  ml: 2,
                  flexShrink: 0,
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
            </Box>

            {bio && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {bio}
              </Typography>
            )}

            <Typography variant="caption" color="text.secondary">
              {followersCount} {followersCount === 1 ? 'follower' : 'followers'}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}