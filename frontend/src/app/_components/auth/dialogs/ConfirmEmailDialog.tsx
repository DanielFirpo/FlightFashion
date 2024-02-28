import { AuthContext, AuthScreen } from "@/src/app/_providers/AuthProvider";
import { DialogFooter, DialogHeader } from "../../shadcn/dialog";
import DialogFrame from "./DialogFrame";
import { DialogContent } from "@radix-ui/react-dialog";
import { useContext, useEffect } from "react";

export default function ConfirmEmailDialog() {
  const { authenticatedUser, setAuthScreen, setAuthenticatedUser } = useContext(AuthContext);

  useEffect(() => {
    if (authenticatedUser?.userInfo.confirmed) {
      setAuthScreen(AuthScreen.CLOSED);
    }
  }, [authenticatedUser, setAuthScreen]);

  return (
    <DialogFrame title="">
      <DialogHeader className="mx-auto text-3xl">Success! One last step.</DialogHeader>
      <DialogContent className="mx-auto flex aspect-square h-auto w-3/4 items-center justify-center">
        <div className="icon-[streamline--mail-send-email-message] h-44 w-44 border-none"></div>
      </DialogContent>
      <DialogFooter className="text-center">
        To finish creating your account, please check your email inbox for instructions on how to verify your account.
      </DialogFooter>
      <div className="mx-auto mt-3 flex gap-2 text-sm">
        Already did this step?
        <span
          className="cursor-pointer text-cyan-500"
          onClick={(e) => {
            e.preventDefault();
            setAuthScreen(AuthScreen.LOGIN);
          }}
        >
          Log in.
        </span>
      </div>

      <div className="mx-auto flex gap-2 text-sm">
        You can also
        <span
          className="cursor-pointer text-cyan-500"
          onClick={(e) => {
            e.preventDefault();
            setAuthenticatedUser(undefined);
            setAuthScreen(AuthScreen.SIGNUP);
          }}
        >
          sign up with a different email.
        </span>
      </div>
    </DialogFrame>
  );
}
