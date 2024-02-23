"use client";

import { useSearchParams } from "next/navigation";
import { redirect } from "next/navigation";

import { useToast } from "@/src/app/_components/shadcn/use-toast";
import { useEffect } from "react";

export default function ConfirmEmailReturn() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const code = searchParams.get("code");

  //this is the page the user was on before they started the email confirmation process
  const returnTo = searchParams.get("return-to") ?? "/";

  //TODO: send code to backend, verify on backend, set email confirmed to true

  useEffect(() => {
    toast({
      duration: 4000,
      className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
      title: "Your email has been confirmed!",
      variant: "green",
    });
    redirect(returnTo);
  }, [returnTo, toast]);
}
