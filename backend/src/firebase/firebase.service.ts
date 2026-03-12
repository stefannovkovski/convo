import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

export interface NotificationPayload {
  type: string;
  title: string;
  body: string;
  link?: string;
  actorId?: number;
  actorUsername?: string;
  actorName?: string;
}

@Injectable()
export class FirebaseService implements OnModuleInit {
  private initialized = false;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const serviceAccountJson = this.config.get<string>('FIREBASE_SERVICE_ACCOUNT');

    if (!serviceAccountJson) {
      console.warn('Firebase Admin: FIREBASE_SERVICE_ACCOUNT env variable not set, skipping init.');
      return;
    }

    try {
      const serviceAccount = JSON.parse(serviceAccountJson) as admin.ServiceAccount;
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      this.initialized = true;
    } catch (err) {
      console.warn('Firebase Admin init failed:', (err as Error).message);
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  async createCustomToken(userId: number): Promise<string> {
    if (!this.initialized) {
      throw new Error('Firebase is not configured');
    }
    return admin.auth().createCustomToken(String(userId));
  }

  async createNotification(
    userId: number,
    payload: NotificationPayload,
  ): Promise<string | null> {
    if (!this.initialized) return null;
    const db = getFirestore();
    const ref = db
      .collection('users')
      .doc(String(userId))
      .collection('notifications')
      .doc();
    await ref.set({
      ...payload,
      read: false,
      createdAt: FieldValue.serverTimestamp(),
    });
    return ref.id;
  }
}