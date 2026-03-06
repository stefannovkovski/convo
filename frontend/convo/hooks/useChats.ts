'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  type Unsubscribe,
} from 'firebase/firestore';
import { getFirebaseFirestore, isFirebaseConfigured } from '@/lib/firebase';
import type { Chat } from '@/types/chat';

function parseChat(docId: string, data: Record<string, unknown>): Chat {
  const lastMessageAt = data.lastMessageAt as { seconds: number; nanoseconds: number } | undefined;
  const createdAt = data.createdAt as { seconds: number; nanoseconds: number } | undefined;
  return {
    id: docId,
    participants: (data.participants as number[]) ?? [],
    participantDetails: (data.participantDetails as Chat['participantDetails']) ?? {},
    lastMessage: data.lastMessage as string | undefined,
    lastMessageAt: lastMessageAt
      ? new Date(lastMessageAt.seconds * 1000 + lastMessageAt.nanoseconds / 1e6)
      : undefined,
    createdAt: createdAt
      ? new Date(createdAt.seconds * 1000 + createdAt.nanoseconds / 1e6)
      : new Date(),
  };
}

export function useChats(userId: number | null) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !isFirebaseConfigured()) {
      setLoading(false);
      return;
    }

    const firestore = getFirebaseFirestore();
    if (!firestore) {
      setLoading(false);
      return;
    }

    const chatsRef = collection(firestore, 'chats');
    const q = query(
      chatsRef,
      where('participants', 'array-contains', Number(userId)),
      orderBy('lastMessageAt', 'desc')
    );

    const unsubscribe: Unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          console.log('useChats snapshot size:', snapshot.size);
          console.log('useChats userId queried:', Number(userId));
          snapshot.docs.forEach(d => console.log('chat doc:', d.id, d.data()));
      
          const list = snapshot.docs.map((d) =>
            parseChat(d.id, d.data() as Record<string, unknown>)
          );
          setChats(list);
          setLoading(false);
        },
        (err) => {
          console.error('useChats error:', err);
          setError(err.message ?? 'Failed to load chats');
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [userId]);

  return { chats, loading, error };
}