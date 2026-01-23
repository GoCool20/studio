import type { User, AuthError } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  firestore: Firestore;
};
