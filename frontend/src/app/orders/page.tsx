"use client";

import { Order, Order_Plain } from "@apiTypes/order/content-types/order/order";
import Link from "next/link";
import { buildStrapiRequest, fetchAPI } from "../_utils/strapiApi";
import { AuthContext } from "../_providers/AuthProvider";
import { useContext, useEffect, useState } from "react";
import { Button } from "../_components/shadcn/button";
import { Skeleton } from "@/src/app/_components/shadcn/skeleton";

export default function Orders() {
  const { authenticatedUser } = useContext(AuthContext);

  const [orders, setOrders] = useState<Order_Plain[] | undefined>(undefined);

  const priceFormatter = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  //product colors change image carosel
  //test logged out checkout
  //show correct image for variant in cart
  //cart/order items link back to product
  //add shipping info to orders
  useEffect(() => {
    async function fetchData() {
      const { requestUrl } = buildStrapiRequest("/owned-orders");
      const response: Order_Plain[] = await (
        await fetch(requestUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authenticatedUser?.userToken ? authenticatedUser?.userToken : process.env.NEXT_PUBLIC_API_TOKEN}`,
          },
        })
      ).json();
      setOrders(response);
    }
    if (authenticatedUser) {
      fetchData();
    }
  }, [authenticatedUser]);

  console.log("ORDERS!", orders);

  return (
    <div className="sm:px-12">
      <h1 className="mx-auto my-12 w-fit text-3xl font-gigabold">Orders</h1>
      <div className="w-full">
        {orders ? (
          <div className="flex min-h-96 flex-col items-center justify-center gap-3">
            {orders.map((order) => {
              return (
                <div
                  key={order.referenceId}
                  className="mx-auto flex w-full flex-col items-center justify-between rounded-lg bg-white p-3 sm:h-28 sm:max-w-[900px] sm:flex-row sm:p-12"
                >
                  <div className="mt-5 flex h-full w-full flex-col items-center justify-between gap-5 pb-6 sm:mt-0 sm:flex-row sm:gap-2 sm:pb-0">
                    <div className="flex flex-col items-center justify-between overflow-hidden sm:max-w-56">
                      <div className="line-clamp-2 break-words font-dmSans text-xl font-semibold">
                        {priceFormatter.format(order.total ?? 0)}
                      </div>
                      {/* <div className="line-clamp-1 text-xs text-subtitleText">{order.product?.description}</div> */}
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {/* TODO: let user adjust quantity in cart */}
                      <div className="mb-auto flex flex-wrap items-center justify-center gap-1 text-sm text-subtitleText">
                        Date Purchased:
                        <div className="ml-2 flex h-4 w-fit items-center justify-center border-1 border-gray-400 px-1 text-xs font-extrabold text-black">
                          {(order.createdAt as unknown as string).split("T")[0]}
                        </div>
                      </div>
                    </div>
                    <Link href={"/orders/" + order.referenceId}>
                      <Button>View</Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-96 w-full flex-col items-center justify-center gap-3">
            <Skeleton className="h-28 w-full max-w-[900px]"></Skeleton>
            <Skeleton className="h-28 w-full max-w-[900px]"></Skeleton>
            <Skeleton className="h-28 w-full max-w-[900px]"></Skeleton>
            <Skeleton className="h-28 w-full max-w-[900px]"></Skeleton>
          </div>
        )}
      </div>
    </div>
  );
}
