"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/src/app/_components/shadcn/button";

function BackButton() {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.back()}
      className="mb-5 flex h-9 items-center justify-center"
    >
      <span className="icon-[ph--arrow-left-bold] mb-0.5 mr-2 mt-0.5 size-4 align-middle"></span>
      Go Back
    </Button>
  );
}

export default BackButton;
