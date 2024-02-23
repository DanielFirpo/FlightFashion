import { AuthContext, AuthScreen } from "@/src/app/_providers/AuthProvider";
import { DialogFooter, DialogHeader } from "../../shadcn/dialog";
import DialogFrame from "./DialogFrame";
import { DialogContent } from "@radix-ui/react-dialog";
import { useContext, useEffect } from "react";

export default function ConfirmEmailDialog() {
  const { authenticatedUser, setAuthScreen } = useContext(AuthContext);

  useEffect(() => {
    if (authenticatedUser?.attributes.confirmed) {
      setAuthScreen(AuthScreen.CLOSED);
    }
  }, [authenticatedUser, setAuthScreen]);

  return (
    <DialogFrame title="">
      <DialogHeader className="mx-auto text-3xl">Success! One last step.</DialogHeader>
      <DialogContent className="mx-auto aspect-square h-auto w-3/4">
        <div className="icon-[mdi--success-circle-outline] h-full w-full text-green-500"></div>
      </DialogContent>
      <DialogFooter className="text-center">
        To finish creating your account, please check your email inbox for instructions on how to verify your account.
      </DialogFooter>
    </DialogFrame>
  );
}
