'use client';

import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import useUserSearch from '@/hooks/useUserSearch';
import UserCard from '@/components/profile/UserCard';
import { Alert, Box, CircularProgress, InputAdornment, TextField, Typography } from '@mui/material';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { users, loading, error, searchUsers, toggleFollow, clearError } = useUserSearch();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim().length > 0) {
      searchUsers(value);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
          Explore
        </Typography>
        
        <TextField
          fullWidth
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'action.hover',
              '& fieldset': {
                border: 'none',
              },
              '&:hover fieldset': {
                border: 'none',
              },
              '&.Mui-focused fieldset': {
                border: '2px solid',
                borderColor: 'primary.main',
              },
            },
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && searchQuery && users.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No users found for "{searchQuery}"
          </Typography>
        </Box>
      )}

      {!loading && searchQuery === '' && users.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Search for users by name or username
          </Typography>
        </Box>
      )}

      <Box>
        {users.map((user) => (
          <UserCard
            key={user.id}
            username={user.username}
            name={user.name}
            avatar={user.avatar}
            bio={user.bio}
            isFollowing={user.isFollowedByMe}
            followersCount={user.followersCount}
            onToggleFollow={() => toggleFollow(user.username)}
          />
        ))}
      </Box>
    </Box>
  );
}