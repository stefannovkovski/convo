'use client';

import { useEffect, useState } from 'react';
import { signInWithCustomToken } from 'firebase/auth';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
  limit,
  type Unsubscribe,
} from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseFirestore, isFirebaseConfigured } from '@/lib/firebase';
import { api } from '@/services/Api';
import type { Notification } from '@/types/notification';

function parseNotification(docId: string, data: Record<string, unknown>): Notification {
  const createdAt = data.createdAt as { seconds: number; nanoseconds: number } | undefined;
  return {
    id: docId,
    type: (data.type as Notification['type']) ?? 'general',
    title: (data.title as string) ?? '',
    body: (data.body as string) ?? '',
    read: (data.read as boolean) ?? false,
    createdAt: createdAt
      ? new Date(createdAt.seconds * 1000 + createdAt.nanoseconds / 1e6)
      : new Date(),
    link: data.link as string | undefined,
    actorId: data.actorId as number | undefined,
    actorUsername: data.actorUsername as string | undefined,
    actorName: data.actorName as string | undefined,
  };
}

export function useNotifications(userId: number | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    if (!userId || !isFirebaseConfigured()) {
      setLoading(false);
      setFirebaseReady(false);
      return;
    }

    const firebaseAuth = getFirebaseAuth();
    const firestore = getFirebaseFirestore();
    if (!firebaseAuth || !firestore) {
      setLoading(false);
      setFirebaseReady(false);
      return;
    }

    let unsubscribe: Unsubscribe | null = null;

    const init = async () => {
      try {
        setError(null);
        const { data } = await api.get<{ token: string }>('/auth/firebase-token');
        const customToken = data?.token;
        if (!customToken) {
          setLoading(false);
          setFirebaseReady(false);
          return;
        }
        await signInWithCustomToken(firebaseAuth, customToken);
        setFirebaseReady(true);

        const notificationsRef = collection(
          firestore,
          'users',
          String(userId),
          'notifications'
        );
        const q = query(
          notificationsRef,
          orderBy('createdAt', 'desc'),
          limit(50)
        );
        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const list = snapshot.docs.map((d) =>
              parseNotification(d.id, d.data() as Record<string, unknown>)
            );
            setNotifications(list);
            setLoading(false);
          },
          (err) => {
            setError(err.message ?? 'Failed to load notifications');
            setLoading(false);
          }
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect notifications');
        setLoading(false);
      }
    };

    init();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId]);

  const markAsRead = async (notificationId: string) => {
    if (!userId) return;
    const firestore = getFirebaseFirestore();
    if (!firestore) return;
    const ref = doc(firestore, 'users', String(userId), 'notifications', notificationId);
    await updateDoc(ref, { read: true });
  };

  const markAllAsRead = async () => {
    if (!userId || !firebaseReady) return;
    const firestore = getFirebaseFirestore();
    if (!firestore) return;
    const unread = notifications.filter((n) => !n.read);
    await Promise.all(
      unread.map((n) =>
        updateDoc(
          doc(firestore, 'users', String(userId), 'notifications', n.id),
          { read: true }
        )
      )
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    loading,
    error,
    firebaseReady,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}
