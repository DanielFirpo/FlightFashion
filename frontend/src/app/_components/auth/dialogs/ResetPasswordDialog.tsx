import { DialogFooter } from "../../shadcn/dialog";
import { Button } from "../../shadcn/button";
import { Input } from "../../shadcn/input";
import { Label } from "../../shadcn/label";
import DialogFrame from "./DialogFrame";
import { AuthContext, AuthScreen } from "@/src/app/_providers/AuthProvider";
import { useContext } from "react";

export default function ReserPasswordDialog() {
  const { setAuthScreen } = useContext(AuthContext);

  return (
    <DialogFrame title="Sign Up">
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input id="email" value="" placeholder="Email..." className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password" className="text-right">
            Password
          </Label>
          <Input id="password" value="" placeholder="Password..." className="col-span-3" />
          <Label htmlFor="confirm-password" className="text-right">
            Confirm Password
          </Label>
          <Input id="confirm-password" value="" placeholder="Confirm Password..." className="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <div className="flex w-full flex-col items-center">
          <Button
            size="sm"
            variant="hightlighted"
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              setAuthScreen(AuthScreen.SIGNUP);
            }}
          >
            SIGN UP
          </Button>
          <div className="mt-3 flex gap-2 text-sm">
            Already have an account?
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
        </div>
      </DialogFooter>
    </DialogFrame>
  );
}
