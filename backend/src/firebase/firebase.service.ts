import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

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
    const serviceAccountPath =
      this.config.get<string>('FIREBASE_SERVICE_ACCOUNT_PATH') ||
      this.config.get<string>('GOOGLE_APPLICATION_CREDENTIALS');
    const absolutePath = serviceAccountPath
      ? path.isAbsolute(serviceAccountPath)
        ? serviceAccountPath
        : path.resolve(process.cwd(), serviceAccountPath)
      : null;

    if (absolutePath && fs.existsSync(absolutePath)) {
      try {
        const serviceAccount = JSON.parse(
          fs.readFileSync(absolutePath, 'utf8'),
        ) as admin.ServiceAccount;
        admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
        this.initialized = true;
      } catch (err) {
        console.warn('Firebase Admin init failed (file):', (err as Error).message);
      }
      return;
    }

    const projectId = this.config.get<string>('FIREBASE_PROJECT_ID');
    const clientEmail = this.config.get<string>('FIREBASE_CLIENT_EMAIL');
    const privateKey = this.config.get<string>('FIREBASE_PRIVATE_KEY');
    if (!projectId || !privateKey || !clientEmail) {
      return;
    }
    const privateKeyParsed = privateKey.replace(/\\n/g, '\n').replace(/\r/g, '').trim();
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKeyParsed,
        }),
      });
      this.initialized = true;
    } catch (err) {
      console.warn(
        'Firebase Admin init failed (env). Use FIREBASE_SERVICE_ACCOUNT_PATH pointing to your service account JSON file to avoid OpenSSL key parsing issues:',
        (err as Error).message,
      );
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
