"use client";

import { Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { StoredCartItem } from "../../cart/page";

export default function RightNavbarSection() {
  const [cartItems, setCartItems] = useState<StoredCartItem[]>([]);

  function loadItems() {
    const storedItems: StoredCartItem[] = JSON.parse(localStorage.getItem("cartItems") || `[]`);
    setCartItems(storedItems);
  }

  useEffect(() => {
    loadItems();
    window.addEventListener("storage", () => {
      loadItems();
    });
  }, []);

  let cartItemCount = 0;

  cartItems.forEach((item) => {
    item.variantQuantities.forEach((varient) => {
      cartItemCount += varient.quantity;
    });
  });

  return (
    <div className="hidden items-center md:flex">
      <Link href="/cart">
        <Tooltip closeDelay={0} color="default" showArrow={true} content="My Cart">
          <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-white">
            {cartItemCount && (
              <div className="absolute z-10 mb-6 ml-6 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs">
                {cartItemCount}
              </div>
            )}
            <span className="icon-[solar--cart-4-bold] absolute size-6 cursor-pointer align-middle text-black"></span>
          </div>
        </Tooltip>
      </Link>
      <Tooltip closeDelay={0} color="default" showArrow={true} content="My Profile">
        <div
          className="flex h-10 w-32 cursor-pointer items-center justify-center rounded-full bg-white
                text-black"
        >
          <div>
            <span className="icon-[iconoir--profile-circle] size-6 align-middle"></span>
          </div>
          <div className="px-2 font-dmSans text-xs font-normal">
            {"longassusername".length > 7 ? "longassusername".substring(0, 7) + "..." : "longassusername"}
          </div>
          <div>
            <span className="icon-[teenyicons--down-outline] size-3 align-middle"></span>
          </div>
        </div>
      </Tooltip>
    </div>
  );
}
