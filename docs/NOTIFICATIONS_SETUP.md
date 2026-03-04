# Notifications with Firebase

The app uses **Firebase Firestore** to store notifications and supports **Firebase Cloud Messaging (FCM)** for push notifications (optional).

## 1. Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project (or use an existing one).
2. Enable **Firestore Database** and **Authentication** (see below for custom token).
3. Under Project Settings → General, add a web app and copy the config object.

## 1b. Custom token sign-in (no extra provider to enable)

Custom tokens are created by **your backend** with the Firebase Admin SDK. You do **not** enable a “Custom” sign-in method in the Console.

1. In Firebase Console go to **Build → Authentication**.
2. Click **Get started** if Authentication isn’t enabled yet (that’s all you need for Auth).
3. You do **not** need to enable “Email/Password”, “Google”, or any other sign-in provider. Custom token sign-in works as long as Authentication is on.
4. Your backend already creates the token with the **service account** (step 3 below). When the frontend calls `signInWithCustomToken(auth, token)`, Firebase accepts it because the token was signed by that service account. No extra Console setup is required.

## 2. Frontend env (Next.js)

In `frontend/convo/.env.local` add:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## 3. Backend (NestJS) – service account

The backend needs a **service account** to create custom tokens and write to Firestore.

**Recommended: use the JSON file** (avoids OpenSSL/key parsing errors on Node 17+):

1. In Firebase Console: **Project Settings → Service accounts → Generate new private key**. Download the JSON file.
2. Save it in your backend folder as `firebase-service-account.json` (or another name; this file is gitignored).
3. In `backend/.env` set the path:

```env
FIREBASE_SERVICE_ACCOUNT_PATH=firebase-service-account.json
```

If the file is in another location, use an absolute path or a path relative to the project root.

**Alternative: env vars only**

You can instead set in `backend/.env`:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

If you get an `ERR_OSSL_UNSUPPORTED` or “DECODER routines::unsupported” error (common on Node 17+), switch to the JSON file approach above.

## 4. Firestore security rules (required – fixes “Missing or insufficient permissions”)

If the notifications tab shows **“Missing or insufficient permissions”**, Firestore rules are not deployed. The app uses `firestore.rules` in the project root.

1. Install Firebase CLI if needed: `npm install -g firebase-tools`
2. From the **project root** (where `firebase.json` and `firestore.rules` are), run:
   ```bash
   firebase login
   firebase use <your-firebase-project-id>
   firebase deploy --only firestore:rules
   ```
   Use the same project ID as in your frontend env (`NEXT_PUBLIC_FIREBASE_PROJECT_ID`).
3. After deploy, reload the app and open the notifications tab again.

## 5. Firestore index (if needed)

If you see an index error in the browser console, create the suggested composite index in Firestore (Console → Firestore → Indexes), or run the link given in the error.

## 6. Optional: push notifications (FCM)

For browser push:

1. In Firebase Console enable **Cloud Messaging** and add a web push certificate (VAPID key).
2. Frontend: request notification permission and get FCM token; send the token to your backend so you can target the user for push.
3. Backend: use Firebase Admin `messaging().send()` to send to that token when you create a notification.

Without FCM, notifications still appear in the sidebar in real time via Firestore listeners.
