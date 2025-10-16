'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { User } from '@/types/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, profileData: { firstName: string; lastName: string; phone: string }) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (profileData: Partial<User>) => Promise<void>
  loginWithGoogle: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          setUser({ ...userDoc.data(), uid: firebaseUser.uid } as User)
        } else {
          // Create user document if it doesn't exist
          const newUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
            createdAt: new Date(),
            role: 'user'
          }
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser)
          setUser(newUser)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const register = async (email: string, password: string, profileData: { firstName: string; lastName: string; phone: string }) => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)
    
    // Update Firebase Auth profile
    await updateProfile(firebaseUser, {
      displayName: `${profileData.firstName} ${profileData.lastName}`.trim()
    })
    
    const newUser: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: `${profileData.firstName} ${profileData.lastName}`.trim(),
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      phone: profileData.phone,
      photoURL: '',
      createdAt: new Date(),
      role: 'user'
    }
    
    await setDoc(doc(db, 'users', firebaseUser.uid), newUser)
  }

  const logout = async () => {
    await signOut(auth)
  }

  const updateUserProfile = async (profileData: Partial<User>) => {
    if (!user) throw new Error('No user logged in')

    try {
      const updatedData = {
        ...profileData,
        updatedAt: new Date(),
      }

      // Update Firestore
      await setDoc(doc(db, 'users', user.uid), updatedData, { merge: true })

      // Update Firebase Auth profile
      if (profileData.firstName || profileData.lastName) {
        await updateProfile(auth.currentUser!, {
          displayName: `${profileData.firstName || user.firstName} ${profileData.lastName || user.lastName}`.trim()
        })
      }

      // Update local state
      setUser(prev => prev ? { ...prev, ...updatedData } : null)
    } catch (error: unknown) {
      throw error
    }
  }

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const { user: firebaseUser } = await signInWithPopup(auth, provider)
      
      // Check if user profile exists
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      if (!userDoc.exists()) {
        // Create user profile
        const newUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || '',
          firstName: firebaseUser.displayName?.split(' ')[0] || '',
          lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
          photoURL: firebaseUser.photoURL || '',
          createdAt: new Date(),
          role: 'user'
        }
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser)
      }
    } catch (error: unknown) {
      throw error
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile: updateUserProfile,
    loginWithGoogle
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
