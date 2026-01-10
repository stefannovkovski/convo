'use client';
import { Box, Typography, Card } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function SuggestionsPanel() {
  return (
    <Box sx={{ pt: 2, pr: 2 }}>
      <Card sx={{ borderRadius: 3, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TrendingUpIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>
            What's happening
          </Typography>
        </Box>

        <Box sx={{ mb: 2, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            Technology · Trending
          </Typography>
          <Typography variant="body2" fontWeight={700} sx={{ my: 0.5 }}>
            #AI
          </Typography>
          <Typography variant="caption" color="text.secondary">
            125K posts
          </Typography>
        </Box>

        <Box sx={{ mb: 2, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            Sports · Trending
          </Typography>
          <Typography variant="body2" fontWeight={700} sx={{ my: 0.5 }}>
            #WorldCup
          </Typography>
          <Typography variant="caption" color="text.secondary">
            89.2K posts
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Entertainment · Trending
          </Typography>
          <Typography variant="body2" fontWeight={700} sx={{ my: 0.5 }}>
            #NewMusic
          </Typography>
          <Typography variant="caption" color="text.secondary">
            67.5K posts
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}