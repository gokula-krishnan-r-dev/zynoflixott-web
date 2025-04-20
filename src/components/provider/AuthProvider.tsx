"use client";
import { userId } from "@/lib/user";
import { createContext, useContext, ReactNode } from "react";
interface AuthContextProps {
  isLogin: any;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const isLogin = userId ? true : false;

  return (
    <AuthContext.Provider value={{ isLogin }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
