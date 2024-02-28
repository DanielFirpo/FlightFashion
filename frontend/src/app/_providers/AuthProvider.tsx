"use client";

import { ReactNode, createContext, useEffect, useState } from "react";

export enum AuthScreen {
  LOGIN = "LOGIN",
  SIGNUP = "SIGNUP",
  CONFIRMEMAIL = "CONFIRMEMAIL",
  FORGOTPASSWORD = "FORGOTPASSWORD",
  CLOSED = "CLOSED",
  RESETPASSWORD = "RESETPASSWORD",
}

export type AuthenticatedUserInfo = {
  blocked: boolean;
  confirmed: boolean;
  createdAt: string;
  email: string;
  id: number;
  provider: string;
  updatedAt: string;
  username: string;
};

export type AuthenticatedUser = {
  userInfo: AuthenticatedUserInfo;
  userToken: string | undefined;
};

export type AuthContextValue = {
  authenticatedUser: AuthenticatedUser | undefined;
  setAuthenticatedUser: (user: AuthenticatedUser | undefined) => void;
  authScreen: AuthScreen;
  setAuthScreen: (authScreen: AuthScreen) => void;
};

export const AuthContext = createContext<AuthContextValue>({
  authenticatedUser: undefined,
  setAuthenticatedUser: () => {},
  authScreen: AuthScreen.CLOSED,
  setAuthScreen: () => {},
});

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser | undefined>(undefined);
  const [authScreen, setAuthScreen] = useState<AuthScreen>(AuthScreen.CLOSED);

  function loadUser() {
    let storedUserJson = localStorage.getItem("authenticatedUser");
    if (storedUserJson === "undefined") {
      setAuthenticatedUser(undefined);
    } else {
      setAuthenticatedUser(JSON.parse(storedUserJson!));
    }
  }

  useEffect(() => {
    window.addEventListener("storage", loadUser);
    loadUser();
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  function setAuthenticatedUserWrapper(user: AuthenticatedUser | undefined) {
    console.log("setting authenticated user", user);
    localStorage.setItem("authenticatedUser", JSON.stringify(user));
    window.dispatchEvent(new Event("storage")); //make sure other tabs are aware of the new authenticatedUser state
    setAuthenticatedUser(user);
  }

  return (
    <AuthContext.Provider
      value={{ authenticatedUser, setAuthenticatedUser: setAuthenticatedUserWrapper, authScreen, setAuthScreen }}
    >
      {children}
    </AuthContext.Provider>
  );
}
