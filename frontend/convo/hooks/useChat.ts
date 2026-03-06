'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  updateDoc,
  getDoc,
  setDoc,
  serverTimestamp,
  limit,
  type Unsubscribe,
} from 'firebase/firestore';
import { getFirebaseFirestore, isFirebaseConfigured } from '@/lib/firebase';
import type { ChatMessage } from '@/types/chat';

function parseMessage(docId: string, data: Record<string, unknown>): ChatMessage {
  const createdAt = data.createdAt as { seconds: number; nanoseconds: number } | undefined;
  return {
    id: docId,
    senderId: Number(data.senderId), 
    text: data.text as string,
    read: (data.read as boolean) ?? false,
    createdAt: createdAt
      ? new Date(createdAt.seconds * 1000 + createdAt.nanoseconds / 1e6)
      : new Date(),
  };
}

export function getChatId(userId1: number, userId2: number): string {
  return `${Math.min(Number(userId1), Number(userId2))}_${Math.max(Number(userId1), Number(userId2))}`;
}

interface UseChatOptions {
  chatId: string | null;
  currentUserId: number | null;
}

export function useChat({ chatId, currentUserId }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chatId || !currentUserId || !isFirebaseConfigured()) {
      setLoading(false);
      return;
    }

    const firestore = getFirebaseFirestore();
    if (!firestore) {
      setLoading(false);
      return;
    }

    const messagesRef = collection(firestore, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'), limit(100));

    const unsubscribe: Unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) =>
          parseMessage(d.id, d.data() as Record<string, unknown>)
        );
        setMessages(list);
        setLoading(false);

        snapshot.docs.forEach((d) => {
          const data = d.data();
          if (!data.read && Number(data.senderId) !== Number(currentUserId)) {
            updateDoc(d.ref, { read: true }).catch(() => {});
          }
        });
      },
      (err) => {
        setError(err.message ?? 'Failed to load messages');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [chatId, currentUserId]);

  const sendMessage = useCallback(
    async (
      text: string,
      participants: number[],
      participantDetails: Record<number, { username: string; name: string; avatar?: string }>
    ) => {
      if (!chatId || !currentUserId || !text.trim()) return;

      const firestore = getFirebaseFirestore();
      if (!firestore) return;

      const numericParticipants = participants.map(Number);

      const chatRef = doc(firestore, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          participants: numericParticipants,
          participantDetails,
          lastMessage: text.trim(),
          lastMessageAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        });
      } else {
        await updateDoc(chatRef, {
          lastMessage: text.trim(),
          lastMessageAt: serverTimestamp(),
        });
      }

      const messagesRef = collection(firestore, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        senderId: Number(currentUserId),
        text: text.trim(),
        read: false,
        createdAt: serverTimestamp(),
      });
    },
    [chatId, currentUserId]
  );

  return { messages, loading, error, sendMessage };
}