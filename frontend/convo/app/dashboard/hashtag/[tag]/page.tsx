'use client';

import { useParams } from 'next/navigation';
import FeedPageContent from '@/components/posts/FeedPageContent';

export default function HashtagPage() {
  const { tag } = useParams<{ tag: string }>();
  const normalizedTag = decodeURIComponent(tag ?? '').replace(/^#/, '').toLowerCase();
  const displayTag = normalizedTag ? `#${normalizedTag}` : '#';

  return <FeedPageContent title={displayTag} hashtag={normalizedTag} />;
}
