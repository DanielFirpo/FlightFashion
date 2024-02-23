import { ReactNode, useContext } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../shadcn/dialog";
import { AuthContext, AuthScreen } from "@/src/app/_providers/AuthProvider";

export default function DialogFrame({ children, title }: { children: ReactNode[] | ReactNode; title: string }) {
  const { authScreen, setAuthScreen } = useContext(AuthContext);

  function onOpenChange(open: boolean) {
    setAuthScreen(!open ? AuthScreen.CLOSED : authScreen);
  }

  return (
    <Dialog open={authScreen !== AuthScreen.CLOSED} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
