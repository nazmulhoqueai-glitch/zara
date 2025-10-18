import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin
let app: App
if (getApps().length === 0) {
  app = initializeApp({
    credential: cert({
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    } as any),
  })
} else {
  app = getApps()[0]
}

// Initialize Firebase Admin services
export const adminAuth = getAuth(app)
export const adminDb = getFirestore(app)

export default app
