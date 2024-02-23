"use client";

import LoginDialog from "./dialogs/LoginDialog";
import SignupDialog from "./dialogs/SignupDialog";
import ConfirmEmailDialog from "./dialogs/ConfirmEmailDialog";
import ForgotPasswordDialog from "./dialogs/ForgotPasswordDialog";
import { AuthContext, AuthScreen } from "../../_providers/AuthProvider";
import { useContext } from "react";

const dialogs: Map<AuthScreen, React.FC> = new Map([
  [AuthScreen.LOGIN, LoginDialog],
  [AuthScreen.SIGNUP, SignupDialog],
  [AuthScreen.CONFIRMEMAIL, ConfirmEmailDialog],
  [AuthScreen.FORGOTPASSWORD, ForgotPasswordDialog],
]);

//this component renders a different dialog depending on which step of the auth process we are in.
export default function AuthenticationDialog() {
  const { authScreen } = useContext(AuthContext);

  //   const pageData: InformationPage[] = (await fetchAPI("/information-pages", { filters: { slug: { $eq: props.params.info } } }))
  //     .data;

  if (authScreen === AuthScreen.CLOSED) return null;

  const CurrentDialog = dialogs.get(authScreen);

  return CurrentDialog ? <CurrentDialog></CurrentDialog> : null;
}
