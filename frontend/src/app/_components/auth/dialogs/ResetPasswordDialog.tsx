"use client";

import { useSearchParams } from "next/navigation";

import { useToast } from "@/src/app/_components/shadcn/use-toast";
import { Input } from "@/src/app/_components/shadcn/input";
import { DialogFooter } from "@/src/app/_components/shadcn/dialog";
import { Button } from "@/src/app/_components/shadcn/button";
import { useContext, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/src/app/_components/shadcn/form";
import axios from "axios";
import { AuthContext, AuthScreen } from "@/src/app/_providers/AuthProvider";
import DialogFrame from "./DialogFrame";

export default function ResetPasswordDialog() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const code = searchParams.get("code");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { setAuthenticatedUser, setAuthScreen } = useContext(AuthContext);

  const formSchema = z
    .object({
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
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    axios
      .post(process.env.NEXT_PUBLIC_API_URL + "api/auth/reset-password", {
        code: code,
        password: values.password,
        passwordConfirmation: values.confirmPassword,
      })
      .then((response) => {
        console.log("Your user's password has been reset.", response);
        toast({
          duration: 4000,
          className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
          title: "Your password has been successfully changed!",
          variant: "green",
        });
        setAuthenticatedUser({ userInfo: response.data.user, userToken: response.data.jwt });
        setAuthScreen(AuthScreen.CLOSED);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
        setAuthScreen(AuthScreen.FORGOTPASSWORD);
        toast({
          duration: 4000,
          className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
          title: "An error occured. Please re-attempt the process.",
          variant: "destructive",
        });
      });
  }

  return (
    <DialogFrame title="Reset Password">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col">
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
          <DialogFooter>
            <div className="flex w-full flex-col items-center">
              <Button type="submit" size="sm" variant="hightlighted" className="w-full">
                CHANGE PASSWORD
              </Button>
            </div>
          </DialogFooter>
        </form>
      </Form>
    </DialogFrame>
  );
}
