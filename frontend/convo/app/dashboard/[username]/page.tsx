'use client';

import { useParams, useRouter } from 'next/navigation';
import usePosts from '@/hooks/usePosts';
import PostCard from '@/components/posts/PostCard';
import { useAuth } from '@/hooks/useAuth';
import ProfileHeader from '@/components/profile/ProfileHeader';

export default function ProfilePage() {
  const { username } = useParams();
  const router = useRouter();

  const { posts, loading, onCreate, onToggleLike, onToggleRetweet } = usePosts(username as string);
  const { user, loading: profileLoading, toggleFollow } = useAuth(username as string);

  const handleEdit = () => {
    router.push('/settings/profile');
  };

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
        onEdit={user.isMe ? handleEdit : undefined}
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