import { DialogDescription, DialogFooter } from "../../shadcn/dialog";
import { Button } from "../../shadcn/button";
import { Input } from "../../shadcn/input";
import DialogFrame from "./DialogFrame";
import { useContext, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "../../../_components/shadcn/form";
import { AuthContext, AuthScreen } from "@/src/app/_providers/AuthProvider";
import axios from "axios";
import { buildStrapiRequest } from "@/src/app/_utils/strapiApi";

export default function ForgotPasswordDialog() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [canResendEmail, setCanResendEmail] = useState(true);

  const { setAuthScreen } = useContext(AuthContext);

  const formSchema = z.object({
    email: z.string().email().min(4, {
      message: "Email address invalid.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    axios
      .post(buildStrapiRequest("/auth/forgot-password").requestUrl, {
        email: values.email,
      })
      .then(() => {
        setIsEmailSent(true);
        setCanResendEmail(false);
        setTimeout(() => setCanResendEmail(true), 10 * 1000);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  }

  return (
    <DialogFrame title="Forgot Password?">
      <DialogDescription>Enter your email and we will send you instructions on how to reset your password.</DialogDescription>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          <DialogFooter>
            <div className="flex w-full flex-col items-center">
              {isEmailSent && !canResendEmail && <div className="mb-5 text-green-600">Email sent! Check your inbox.</div>}
              <Button size="sm" variant="hightlighted" className="w-full" disabled={!canResendEmail} type="submit">
                {isEmailSent && canResendEmail ? "RESEND EMAIL" : "SEND EMAIL"}
              </Button>
              <div className="mt-4 flex gap-2 text-sm">
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
