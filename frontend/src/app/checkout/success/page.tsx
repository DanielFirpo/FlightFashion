"use client";

import { useEffect, useState } from "react";
import OrderInfo from "../../_components/OrderInfo";
import { StoredCartItem } from "../../cart/page";

export default function CheckoutSuccess({ searchParams }: { searchParams: any }) {
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify([]));
    window.dispatchEvent(new Event("storage"));
  }, []);

  return (
    <div className="sm:px-12">
      <h1 className="mx-auto my-12 w-fit text-3xl font-gigabold">Checkout Success</h1>
      <OrderInfo referenceId={searchParams.referenceId}></OrderInfo>
      <p className="mt-20 text-center text-lg">
        Thank your for your purchase! Your order will be shipped and delivered within a 14 days.
      </p>
    </div>
  );
}
