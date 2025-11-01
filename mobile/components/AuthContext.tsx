import { registerSchema } from "@/lib/schemas/auth-schema";
import { SessionData } from "@/types";
import { createContext } from "react";
import { z } from "zod";

export const loginSchema = registerSchema.omit({ name: true });

export type SignInSchema = z.infer<typeof loginSchema>;
export type SignUpSchema = z.infer<typeof registerSchema>;

interface AuthContectType {
  session?: SessionData;
  isLoading: boolean;
  token: string;
  setToken: (tokenVal: string) => void;
  signIn: (credentials: SignInSchema) => Promise<void>;
  signUp: (credentials: SignUpSchema) => Promise<void>;
  signOut: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContectType | undefined>(undefined);

export default AuthContext;
