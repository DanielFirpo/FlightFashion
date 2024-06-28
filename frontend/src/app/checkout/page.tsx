"use client";

import { buildStrapiRequest } from "@/src/app/_utils/strapiApi";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { useCallback, useContext, useEffect } from "react";
import { AuthContext } from "../_providers/AuthProvider";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? "");

export default function Page() {
  const { authenticatedUser } = useContext(AuthContext);

  const router = useRouter();

  const fetchClientSecret = async (): Promise<string> => {
    const { requestUrl } = buildStrapiRequest("/checkout", {}, {}, authenticatedUser?.userToken);

    const session = await fetch(requestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authenticatedUser?.userToken ? authenticatedUser?.userToken : process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      body: localStorage.getItem("cartItems"),
    });

    if (session.status !== 200) {
      //they have stuff in their cart that is sold out, clear their cart and send them back
      localStorage.setItem("cartItems", JSON.stringify([]));
      window.dispatchEvent(new Event("storage"));
      router.push("/cart");
    }

    return (await session.json()).clientSecret;
  };

  return (
    <>
      <div id="checkout" className="mx-auto mt-20 max-w-[62rem] overflow-hidden rounded-lg">
        <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </>
  );
}
