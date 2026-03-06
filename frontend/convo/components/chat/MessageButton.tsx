'use client';

import { Button } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useRouter } from 'next/navigation';
import { getChatId } from '@/hooks/useChat';
import { getFirebaseFirestore, isFirebaseConfigured } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface MessageButtonProps {
  currentUserId: number;
  currentUserUsername: string;
  currentUserName: string;
  currentUserAvatar?: string;
  targetUserId: number;
  targetUsername: string;
  targetName: string;
  targetAvatar?: string;
}

export default function MessageButton({
  currentUserId,
  currentUserUsername,
  currentUserName,
  currentUserAvatar,
  targetUserId,
  targetUsername,
  targetName,
  targetAvatar,
}: MessageButtonProps) {
  const router = useRouter();

  const handleClick = async () => {
    const uid1 = Number(currentUserId);
    const uid2 = Number(targetUserId);
    const chatId = getChatId(uid1, uid2);

    if (isFirebaseConfigured()) {
      const firestore = getFirebaseFirestore();
      if (firestore) {
        const chatRef = doc(firestore, 'chats', chatId);
        const snap = await getDoc(chatRef);

        if (!snap.exists()) {
          await setDoc(chatRef, {
            participants: [uid1, uid2], 
            participantDetails: {
              [uid1]: {
                username: currentUserUsername,
                name: currentUserName,
                avatar: currentUserAvatar ?? null,
              },
              [uid2]: {
                username: targetUsername,
                name: targetName,
                avatar: targetAvatar ?? null,
              },
            },
            lastMessage: null,
            lastMessageAt: serverTimestamp(),
            createdAt: serverTimestamp(),
          });
        }
      }
    }

    router.push(`/dashboard/messages/${chatId}`);
  };

  return (
    <Button
      variant="outlined"
      startIcon={<ChatBubbleOutlineIcon />}
      onClick={handleClick}
      sx={{
        borderRadius: 3,
        textTransform: 'none',
        fontWeight: 600,
      }}
    >
      Message
    </Button>
  );
}