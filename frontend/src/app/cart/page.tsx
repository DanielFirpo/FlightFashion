"use client";

import { buildStrapiRequest, fetchAPIClient, getImageURLBySize } from "@/src/app/_utils/strapiApi";
import { useCallback, useEffect, useState } from "react";
import { Product } from "@apiTypes/product/content-types/product/product";
import useSWR from "swr";
import Image from "next/image";
import { Button } from "../_components/shadcn/button";
import Link from "next/link";
import { Skeleton } from "../_components/shadcn/skeleton";

export type ItemVariant = {
  colorId: number | undefined;
  sizeId: number | undefined;
  quantity: number;
  variantId: string;
};

export type StoredCartItem = {
  id: number;
  variantQuantities: ItemVariant[];
};

export default function Page() {
  const priceFormatter = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  // Set the value received from the local storage to a local state
  const [cartItems, setCartItems] = useState<StoredCartItem[]>([]);

  useEffect(() => {
    const storedItems: StoredCartItem[] = JSON.parse(localStorage.getItem("cartItems") || `[]`);
    setCartItems(storedItems);
  }, []);

  const { requestUrl, mergedOptions } = buildStrapiRequest("/products", {
    filters: {
      ...(cartItems.length > 0
        ? {
            id: {
              $in: cartItems.map((item) => item.id.toString()),
            },
          }
        : {
            id: { $eq: -1 },
          }),
    },
    populate: "images,product_colors,product_sizes",
  });

  const { data, error, isLoading } = useSWR<{
    data: Product[];
  }>(requestUrl, (url: any) => fetchAPIClient(url, mergedOptions));

  const getColorById = (product: Product, colorId: number | undefined) =>
    product.attributes.product_colors?.data.find((color) => color.id === colorId);

  const getSizeById = (product: Product, sizeId: number | undefined) =>
    product.attributes.product_sizes?.data.find((size) => size.id === sizeId);

  let cartTotal = 0;

  //calc cart total
  data?.data.forEach((product) => {
    const cartItem = cartItems.find((item) => item.id === product.id);
    cartItem?.variantQuantities.forEach((variant) => {
      cartTotal += getPriceAfterDiscounts(product, variant).discountedPrice;
    });
  });

  if (error)
    return (
      <div className="flex w-full items-center justify-center text-4xl font-bold">
        An Error Occurred{" "}
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    );

  let cartItemCount = 0;

  cartItems.forEach((item) => {
    item.variantQuantities.forEach((varient) => {
      cartItemCount += varient.quantity;
    });
  });

  return (
    <div className="sm:px-12">
      <div className="mb-5 mt-12 flex w-full flex-wrap justify-center gap-5 sm:justify-between">
        <div className="flex items-center gap-6">
          <div className="text-xl font-gigabold">Your Cart</div>
          <div className="text-sm">{cartItemCount} Items</div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-sm">Total</div>
          <div className="text-xl font-gigabold">{priceFormatter.format(cartTotal)}</div>
        </div>
      </div>

      {!isLoading ? (
        <div className="flex min-h-96 flex-col justify-center gap-3">
          {data?.data.map((product) => {
            const image = product.attributes.images?.data?.[0];

            const cartItem = cartItems.find((item) => item.id === product.id);

            return cartItem?.variantQuantities.map((variant) => {
              const { discountedPrice } = getPriceAfterDiscounts(product, variant);

              return (
                <div
                  key={`${variant.colorId}-${variant.sizeId}-${product.id}`}
                  className="mx-auto flex w-full max-w-[900px] flex-col items-center justify-between rounded-lg bg-white p-5 sm:h-28 sm:flex-row"
                >
                  <div>
                    {image && (
                      <Image
                        width={image.attributes.width}
                        height={image.attributes.height}
                        alt={image.attributes.alternativeText ?? ""}
                        className="max-w-24 rounded-xl bg-imageBackground"
                        src={getImageURLBySize(image!, "thumbnail") ?? ""}
                      ></Image>
                    )}
                  </div>
                  <div className="mt-5 flex h-full w-full flex-col items-center justify-between gap-5 sm:ml-5 sm:mt-0 sm:flex-row sm:gap-2">
                    <div className="flex h-full w-full flex-col justify-between overflow-hidden sm:max-w-56">
                      <div className="line-clamp-2 break-words font-dmSans text-medium font-semibold">
                        {product.attributes.name}
                      </div>
                      <div className="line-clamp-1 text-xs text-subtitleText">{product.attributes.description}</div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {/* TODO: let user adjust quantity in cart */}
                      <div className="mb-auto flex items-center justify-center gap-1 text-sm text-subtitleText">
                        Quantity
                        <div className="flex h-4 w-fit items-center justify-center border-1 border-gray-400 px-1 text-xs font-extrabold text-black">
                          {variant.quantity}
                        </div>
                      </div>
                      <div className="mb-auto flex items-center justify-center gap-1 text-sm text-subtitleText">
                        Color
                        <div className="flex h-4 w-fit items-center justify-center border-1 border-gray-400 px-1 text-xs font-extrabold text-black">
                          {getColorById(product, variant.colorId)?.attributes.name ?? "Default"}
                        </div>
                      </div>
                      <div className="mb-auto flex items-center justify-center gap-1 text-sm text-subtitleText">
                        Size
                        <div className="flex h-4 w-fit items-center justify-center border-1 border-gray-400 px-1 text-xs font-extrabold text-black">
                          {getSizeById(product, variant.sizeId)?.attributes.name ?? "Default"}
                        </div>
                      </div>
                    </div>
                    <div className="flex h-full w-full flex-row items-end justify-between sm:w-fit sm:flex-col">
                      <span className={`font-dmSans text-xl font-semibold`}>{priceFormatter.format(discountedPrice)}</span>
                      <div
                        className="icon-[material-symbols-light--close] h-6 w-6 cursor-pointer"
                        onClick={() => {
                          cartItem.variantQuantities = cartItem?.variantQuantities.filter(
                            (v) => !(v.colorId == variant.colorId && v.sizeId == variant.sizeId),
                          );
                          localStorage.setItem("cartItems", JSON.stringify(cartItems));
                          window.dispatchEvent(new Event("storage"));
                          //force re-render
                          setCartItems(structuredClone(cartItems));
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            });
          })}
        </div>
      ) : (
        <div className="flex min-h-96 w-full flex-col items-center justify-center gap-3">
          <Skeleton className="h-28 w-full max-w-[900px]"></Skeleton>
          <Skeleton className="h-28 w-full max-w-[900px]"></Skeleton>
        </div>
      )}

      <div className="mt-12 flex w-full flex-wrap justify-center gap-8 sm:justify-between">
        <Link href="/categories/all/products">
          <Button size="sm">
            <span className="icon-[ph--arrow-left-bold] mb-0.5 mr-2 mt-0.5 size-4 align-middle"></span>Continue Shopping
          </Button>
        </Link>
        <Link href="/checkout">
          <Button variant="hightlighted" disabled={cartItemCount < 1}>
            Proceed to Checkout<span className="icon-[ph--arrow-right-bold] mb-0.5 ml-2 mt-0.5 size-4 align-middle"></span>
          </Button>
        </Link>
      </div>
    </div>
  );

  function getPriceAfterDiscounts(product: Product, variant: ItemVariant): { totalPrice: number; discountedPrice: number } {
    let totalPrice = 0;

    const colorFee = getColorById(product, variant.colorId)?.attributes.fee ?? 0;
    const sizeFee = getSizeById(product, variant.sizeId)?.attributes.fee ?? 0;
    totalPrice += (product.attributes.price + colorFee + sizeFee) * variant.quantity;

    const discountedPrice = totalPrice - totalPrice * (product.attributes.discountPercent / 100);

    return { totalPrice, discountedPrice };
  }
}
