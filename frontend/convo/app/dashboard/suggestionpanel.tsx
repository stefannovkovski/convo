'use client';
import { Box, Typography, Card, Skeleton } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useTrending } from '@/hooks/useTrending';
import { useRouter } from 'next/navigation';

export default function SuggestionsPanel() {
    const { trending, loading } = useTrending();
    const router = useRouter();

    return (
        <Box sx={{ pt: 2, pr: 2 }}>
            <Card sx={{ borderRadius: 3, p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <TrendingUpIcon color="primary" />
                    <Typography variant="h6" fontWeight={700}>
                        What's happening
                    </Typography>
                </Box>

                {loading ? (
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
                                mb: 2,
                                pb: 2,
                                borderBottom: index < trending.length - 1 ? 1 : 0,
                                borderColor: 'divider',
                                cursor: 'pointer',
                                borderRadius: 1,
                                transition: 'background-color 0.2s ease',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                },
                            }}
                        >
                            <Typography variant="caption" color="text.secondary">
                                Trending
                            </Typography>
                            <Typography variant="body2" fontWeight={700} sx={{ my: 0.5 }}>
                                {item.tag}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {item.count} {item.count === 1 ? 'post' : 'posts'}
                            </Typography>
                        </Box>
                    ))
                )}
            </Card>
        </Box>
    );
}