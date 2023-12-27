"use client";

import { createContext } from "react";

type CurrentUser = {
  id: string;
  email: string;
  iat: number;
} | null;

type Authprops = {
  children: React.ReactNode;
  currentUser: CurrentUser;
};

export const userContext = createContext<CurrentUser>(null);

const AuthProvider: React.FC<Authprops> = ({ children, currentUser }) => {
  return (
    <userContext.Provider value={currentUser}>{children}</userContext.Provider>
  );
};

export default AuthProvider;
