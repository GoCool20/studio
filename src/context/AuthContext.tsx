"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, firestore } from "@/lib/firebase";
import type { AuthContextType } from "./types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    login: (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass),
    logout: () => signOut(auth),
    firestore,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
