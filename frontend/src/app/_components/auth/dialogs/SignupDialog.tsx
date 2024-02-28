import { DialogFooter } from "../../shadcn/dialog";
import { Button } from "../../shadcn/button";
import { Input } from "../../shadcn/input";
import DialogFrame from "./DialogFrame";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "../../../_components/shadcn/form";
import { useContext, useEffect, useState } from "react";
import { useToast } from "../../shadcn/use-toast";
import { AuthContext, AuthScreen } from "@/src/app/_providers/AuthProvider";
import axios from "axios";
import { buildStrapiRequest } from "@/src/app/_utils/strapiApi";

export default function SignupDialog() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupError, setSignupError] = useState<string | undefined>(undefined);

  const { setAuthScreen, setAuthenticatedUser, authenticatedUser } = useContext(AuthContext);

  useEffect(() => {
    if (authenticatedUser && !authenticatedUser.userInfo.confirmed) {
      setAuthScreen(AuthScreen.CONFIRMEMAIL);
    }
  }, [authenticatedUser, setAuthScreen]);

  const formSchema = z
    .object({
      email: z.string().email().min(4, {
        message: "Email address invalid.",
      }),
      password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
      }),
      confirmPassword: z.string().min(6, {
        message: "Password must be at least 6 characters.",
      }),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
      if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "The passwords do not match.",
          path: ["confirmPassword"],
        });
      }
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    axios
      .post(buildStrapiRequest("/auth/local/register").requestUrl, {
        username: values.email,
        email: values.email,
        password: values.password,
      })
      .then((response) => {
        setAuthenticatedUser({ userInfo: response.data.user, userToken: undefined });
        setAuthScreen(AuthScreen.CONFIRMEMAIL);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
        setSignupError(error.response.data.error.message);
      });
  }

  return (
    <DialogFrame title="Sign Up">
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
            <br></br>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <div className="flex">
                    <FormControl>
                      <Input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password..." {...field} />
                    </FormControl>
                    <div className="relative">
                      <div
                        className={`${showConfirmPassword ? "icon-[mdi--hide-outline]" : "icon-[mdi--show-outline]"} absolute right-2 mt-2.5 h-5 w-5 cursor-pointer`}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      ></div>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {signupError && <div className="w-full text-center text-red-600">Error: {signupError}</div>}
          <DialogFooter>
            <div className="flex w-full flex-col items-center">
              <Button type="submit" size="sm" variant="hightlighted" className="w-full">
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
        </form>
      </Form>
    </DialogFrame>
  );
}
