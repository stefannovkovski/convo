'use client';

import { useParams } from 'next/navigation';
import usePosts from '@/hooks/usePosts';
import PostCard from '@/components/posts/PostCard';
import { useAuth } from '@/hooks/useAuth';
import ProfileHeader from '@/components/profile/ProfileHeader';

export default function ProfilePage() {
  const { username } = useParams();

  const { posts, loading, onCreate, onToggleLike, onToggleRetweet } = usePosts(username as string);
  const { user, loading: profileLoading, toggleFollow } = useAuth(username as string);

  if (profileLoading) return null;

  return (
    <>
      <ProfileHeader
        avatarUrl={user.avatar}
        name={user.name}
        username={user.username}
        bio={user.bio}
        followersCount={user.followersCount}
        followingCount={user.followingCount}
        isFollowing={user.isFollowing}
        onToggleFollow={toggleFollow}
      />

      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onToggleLike={onToggleLike}
          onToggleRetweet={onToggleRetweet}
          onCreate={onCreate}
        />
      ))}
    </>
  );
}
