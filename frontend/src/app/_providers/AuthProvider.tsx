"use client";

import { ReactNode, createContext, useEffect, useState } from "react";
import { User } from "@strapiTypes/schemas-to-ts/User";

export enum AuthScreen {
  LOGIN = "LOGIN",
  SIGNUP = "SIGNUP",
  CONFIRMEMAIL = "CONFIRMEMAIL",
  FORGOTPASSWORD = "FORGOTPASSWORD",
  CLOSED = "CLOSED",
}

export type AuthContextValue = {
  authenticatedUser: User | undefined;
  setAuthenticatedUser: (user: User | undefined) => void;
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
  const [authenticatedUser, setAuthenticatedUser] = useState<User | undefined>(undefined);
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
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  function setAuthenticatedUserWrapper(user: User | undefined) {
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
