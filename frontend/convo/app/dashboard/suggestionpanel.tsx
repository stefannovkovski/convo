'use client';
import { Box, Typography, Card, Skeleton, Avatar, Button, Stack } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useTrending } from '@/hooks/useTrending';
import { useSuggestedUser } from '@/hooks/useSuggestedUser';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/services/Api';
import { useTopNews } from '@/hooks/useTopNews';
import NewspaperIcon from '@mui/icons-material/Newspaper';

export default function SuggestionsPanel() {
    const { trending, loading: trendingLoading } = useTrending();
    const { suggestedUsers, loading: usersLoading } = useSuggestedUser();
    const { articles, loading: newsLoading } = useTopNews('technology');

    const router = useRouter();

    const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());

    const handleToggleFollow = async (username: string) => {
        const isFollowing = followingIds.has(username);
        try {
            if (isFollowing) {
                await api.post(`/users/${username}/follow`);
                setFollowingIds(prev => { const next = new Set(prev); next.delete(username); return next; });
            } else {
                await api.post(`/users/${username}/follow`);
                setFollowingIds(prev => new Set(prev).add(username));
            }
        } catch (err) {
            console.error('Failed to toggle follow:', err);
        }
    };

    return (
        <Box sx={{ pt: 2, pr: 2 }}>
            <Card sx={{ borderRadius: 3, p: 2, mt: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <NewspaperIcon color="primary" />
                    <Typography variant="h6" fontWeight={700}>
                        Top News
                    </Typography>
                </Box>

                {newsLoading ? (
                    [1, 2, 3].map(i => (
                        <Box key={i} sx={{ mb: 2 }}>
                            <Skeleton width="80%" height={16} />
                            <Skeleton width="40%" height={14} sx={{ mt: 0.5 }} />
                        </Box>
                    ))
                ) : articles.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">No news available</Typography>
                ) : (
                    articles.map((article, index) => (
                        <Box
                            key={index}
                            component="a"
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                display: 'block',
                                pb: 2,
                                borderBottom: index < articles.length - 1 ? 1 : 0,
                                borderColor: 'divider',
                                textDecoration: 'none',
                                color: 'inherit',
                                borderRadius: 1,
                                transition: 'background-color 0.2s ease',
                                '&:hover': { bgcolor: 'action.hover' },
                            }}
                        >
                            <Typography variant="caption" color="text.secondary">
                                {article.source.name} · {new Date(article.publishedAt).toLocaleDateString()}
                            </Typography>
                            <Typography
                                variant="body2"
                                fontWeight={600}
                                sx={{ mt: 0.5, lineHeight: 1.4,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}
                            >
                                {article.title}
                            </Typography>
                        </Box>
                    ))
                )}
            </Card>
            <Card sx={{ borderRadius: 3, p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <TrendingUpIcon color="primary" />
                    <Typography variant="h6" fontWeight={700}>
                        What's happening
                    </Typography>
                </Box>

                {trendingLoading ? (
                    [1, 2, 3].map(i => (
                        <Box key={i} sx={{ mb: 2, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
                            <Skeleton width="40%" height={16} />
                            <Skeleton width="60%" height={20} sx={{ my: 0.5 }} />
                            <Skeleton width="30%" height={16} />
                        </Box>
                    ))
                ) : trending.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        No trending hashtags yet
                    </Typography>
                ) : (
                    trending.map((item, index) => (
                        <Box
                            key={item.tag}
                            onClick={() =>
                                router.push(`/dashboard/hashtag/${encodeURIComponent(item.tag.replace(/^#/, ''))}`)
                            }
                            sx={{
                                pb: 2,
                                pt:1,
                                borderBottom: index < trending.length - 1 ? 1 : 0,
                                borderColor: 'divider',
                                cursor: 'pointer',
                                borderRadius: 1,
                                transition: 'background-color 0.2s ease',
                                '&:hover': { bgcolor: 'action.hover' },
                            }}
                        >
                            <Typography variant="caption" color="text.secondary">
                                Trending
                            </Typography>
                            <Typography variant="body1" fontWeight={600} sx={{ my: 0.5 }}>
                                {item.tag}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {item.count} {item.count === 1 ? 'post' : 'posts'}
                            </Typography>
                        </Box>
                    ))
                )}
            </Card>

            <Card sx={{ borderRadius: 3, p: 2, mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PersonAddIcon color="primary" />
                    <Typography variant="h6" fontWeight={700}>
                        Who to follow
                    </Typography>
                </Box>

                {usersLoading ? (
                    [1, 2, 3].map(i => (
                        <Box key={i} 
                        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <Skeleton variant="circular" width={40} height={40} />
                            <Box sx={{ flex: 1 }}>
                                <Skeleton width="50%" height={16} />
                                <Skeleton width="35%" height={14} sx={{ mt: 0.5 }} />
                            </Box>
                            <Skeleton variant="rounded" width={72} height={30} />
                        </Box>
                    ))
                ) : suggestedUsers.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        No suggestions right now
                    </Typography>
                ) : (
                    suggestedUsers.map((user, index) => {
                        const isFollowing = followingIds.has(user.username);
                        return (
                            <Box
                                key={user.id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    mb: 1.5,
                                    pb: 1.5,
                                    borderBottom: index < suggestedUsers.length - 1 ? 1 : 0,
                                    borderColor: 'divider',
                                }}
                            >
                                <Avatar
                                    src={`${process.env.NEXT_PUBLIC_API_URL}${user.avatar}`}
                                    alt={user.name}
                                    sx={{ width: 40, height: 40, cursor: 'pointer', flexShrink: 0 }}
                                    onClick={() =>
                                      router.push(`/dashboard/${user.username}`)
                                  }
                                />

                                <Stack
                                    sx={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                                    onClick={() =>
                                      router.push(`/dashboard/${user.username}`)
                                    }>
                                    <Typography
                                        variant="body2"
                                        fontWeight={700}
                                        noWrap
                                        sx={{
                                            '&:hover': { textDecoration: 'underline' },
                                        }}
                                    >
                                        {user.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" noWrap>
                                        @{user.username}
                                    </Typography>
                                </Stack>

                                <Button
                                    size="small"
                                    variant={isFollowing ? 'outlined' : 'contained'}
                                    disableElevation
                                    onClick={() => handleToggleFollow(user.username)}
                                    sx={{
                                        borderRadius: 5,
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                        px: 1.5,
                                        flexShrink: 0,
                                        minWidth: 80,
                                    }}
                                >
                                    {isFollowing ? 'Following' : 'Follow'}
                                </Button>
                            </Box>
                        );
                    })
                )}
            </Card>
        </Box>
    );
}
