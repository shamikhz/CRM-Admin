'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { onAuthChange, getCurrentUserProfile } from '@/firebase/auth';
import { useAuthStore } from '@/store';

interface AuthContextType {
  isReady: boolean;
}

const AuthContext = createContext<AuthContextType>({ isReady: false });

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, setLoading, isLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getCurrentUserProfile(firebaseUser.uid);
        setUser(profile);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [setUser, setLoading]);

  return (
    <AuthContext.Provider value={{ isReady: !isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
