"use client";

import { useContext, useEffect } from "react";
import { AuthContext, AuthScreen } from "../../_providers/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResetPassword() {
  // const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const { setAuthScreen } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    setAuthScreen(AuthScreen.RESETPASSWORD);
    router.push("/?code=" + code);
  }, [code, router, setAuthScreen]);

  return <></>;
}

export default function ResetPasswordReturn() {
  return (
    <Suspense>
      <ResetPassword></ResetPassword>
    </Suspense>
  );
}
