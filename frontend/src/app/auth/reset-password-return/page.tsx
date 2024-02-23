"use client";

import { useSearchParams, useRouter } from "next/navigation";

import { useToast } from "@/src/app/_components/shadcn/use-toast";
import { Label } from "../../_components/shadcn/label";
import { Input } from "../../_components/shadcn/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../_components/shadcn/dialog";
import { Button } from "../../_components/shadcn/button";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Form } from "../../_components/shadcn/form";

export default function ResetPasswordReturn() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const code = searchParams.get("code");

  //this is the page the user was on before they started the email confirmation process
  const returnTo = searchParams.get("return-to") ?? "/";

  //TODO: send code to backend, verify on backend, set email confirmed to true

  const [isMounted, setIsMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    toast({
      duration: 4000,
      className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
      title: "Your password has been successfully changed!",
      variant: "green",
    });
    router.push(returnTo);
    console.log(values);
  }

  //need to do this to avoid hydration error
  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <Dialog open={true}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Reset Password</DialogTitle>
          </DialogHeader>
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
