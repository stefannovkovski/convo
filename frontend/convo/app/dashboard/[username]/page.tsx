'use client';

import { useParams, useRouter } from 'next/navigation';
import usePosts from '@/hooks/usePosts';
import PostCard from '@/components/posts/PostCard';
import { useAuth } from '@/hooks/useUser';
import ProfileHeader from '@/components/profile/ProfileHeader';

export default function ProfilePage() {
  const { username } = useParams();

  const { posts, loading, onCreate, onToggleLike, onToggleRetweet } = usePosts(username as string);
  const { user, loading: profileLoading, toggleFollow, updateProfile } = useAuth(username as string);

  if (profileLoading) return null;

  if (!user) return <div>User not found</div>;

  return (
    <>
      <ProfileHeader
        avatarUrl={user.avatar}
        name={user.name}
        username={user.username}
        bio={user.bio}
        followersCount={user.followersCount || 0}
        followingCount={user.followingCount || 0}
        postsCount={user.postsCount}
        isMe={user.isMe}
        isFollowing={user.isFollowedByMe}
        onToggleFollow={user.isMe ? undefined : toggleFollow}
        onEdit={user.isMe ? updateProfile : undefined}
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