import { doc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

export async function createAdminUser(userId: string, userData: {
  email: string
  firstName: string
  lastName: string
  phone: string
}) {
  try {
    if (!db) {
      throw new Error('Firebase Firestore not initialized')
    }
    
    const adminUser = {
      uid: userId,
      email: userData.email,
      displayName: `${userData.firstName} ${userData.lastName}`.trim(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      photoURL: '',
      createdAt: new Date(),
      role: 'admin' as const,
      updatedAt: new Date()
    }

    await setDoc(doc(db, 'users', userId), adminUser)
    console.log('✅ Admin user created successfully!')
    return adminUser
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    throw error
  }
}

// Example usage:
// createAdminUser('user-id-from-firebase-auth', {
//   email: 'admin@zaara.com',
//   firstName: 'Admin',
//   lastName: 'User',
//   phone: '+966501234567'
// })
