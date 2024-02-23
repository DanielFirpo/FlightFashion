import { DialogFooter } from "../../shadcn/dialog";
import { Button } from "../../shadcn/button";
import { Input } from "../../shadcn/input";
import DialogFrame from "./DialogFrame";
import { useContext, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "../../../_components/shadcn/form";
import { useToast } from "../../shadcn/use-toast";
import { AuthContext, AuthScreen } from "@/src/app/_providers/AuthProvider";

export default function LoginDialog() {
  const [showPassword, setShowPassword] = useState(false);

  const { setAuthScreen } = useContext(AuthContext);

  const { toast } = useToast();

  const formSchema = z.object({
    email: z.string().email().min(4, {
      message: "Email address invalid.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      duration: 4000,
      className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
      title: "You have logged in successfully.",
      variant: "green",
    });
    setAuthScreen(AuthScreen.CLOSED);
  }

  return (
    <DialogFrame title="Login">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Email..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <br></br>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="flex">
                    <FormControl>
                      <Input type={showPassword ? "text" : "password"} placeholder="Password..." {...field} />
                    </FormControl>
                    <div className="relative">
                      <div
                        className={`${showPassword ? "icon-[mdi--hide-outline]" : "icon-[mdi--show-outline]"} absolute right-2 mt-2.5 h-5 w-5 cursor-pointer`}
                        onClick={() => setShowPassword(!showPassword)}
                      ></div>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <div className="flex w-full flex-col items-center">
              <Button type="submit" size="sm" variant="hightlighted" className="w-full">
                LOG IN
              </Button>
              <div
                className="mt-4 cursor-pointer text-sm text-cyan-500"
                onClick={(e) => {
                  e.preventDefault();
                  setAuthScreen(AuthScreen.FORGOTPASSWORD);
                }}
              >
                Forgot Password?
              </div>
              <div className="flex gap-2 text-sm">
                Don&apos;t have an account?
                <span
                  className="cursor-pointer text-cyan-500"
                  onClick={(e) => {
                    e.preventDefault();
                    setAuthScreen(AuthScreen.SIGNUP);
                  }}
                >
                  Sign up.
                </span>
              </div>
            </div>
          </DialogFooter>
        </form>
      </Form>
    </DialogFrame>
  );
}
