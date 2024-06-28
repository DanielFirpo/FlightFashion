import { Product_Plain } from "@apiTypes/product/content-types/product/product";
import { fetchAPI, getImageURLBySize } from "../_utils/strapiApi";
import { Order_Plain } from "@apiTypes/order/content-types/order/order";
import Image from "next/image";
import { OrderProduct_Plain } from "../../../../backend/src/components/product/interfaces/OrderProduct";

export default async function OrderInfo({ referenceId }: { referenceId: string }) {
  const orderData: Order_Plain = await fetchAPI("/order-by-reference?referenceId=" + referenceId);

  const priceFormatter = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="px-12">
      <div className="mt-12 flex w-full justify-between">
        <div className="flex items-center gap-6">
          <div className="text-xl font-gigabold">Order #</div>
          <div className="text-sm">{referenceId}</div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-sm">Total</div>
          <div className="text-xl font-gigabold">{priceFormatter.format(orderData.total ?? 0)}</div>
        </div>
      </div>

      <div className="w-full">
        <div className="flex min-h-96 flex-col items-center justify-center gap-3">
          {orderData.purchasedVariants.map((variant) => {
            const image = variant.product?.images?.[0];
            const { discountedPrice } = getPriceAfterDiscounts(variant.product!, variant);

            return (
              <div
                key={`${variant.product_color?.id}-${variant.product_size?.id}-${variant.product?.id}`}
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
                    <div className="line-clamp-2 break-words font-dmSans text-medium font-semibold">{variant.product?.name}</div>
                    <div className="line-clamp-1 text-xs text-subtitleText">{variant.product?.description}</div>
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
                        {variant.product_color?.name}
                      </div>
                    </div>
                    <div className="mb-auto flex items-center justify-center gap-1 text-sm text-subtitleText">
                      Size
                      <div className="flex h-4 w-fit items-center justify-center border-1 border-gray-400 px-1 text-xs font-extrabold text-black">
                        {variant.product_size?.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex h-full w-full flex-row items-end justify-between sm:w-fit sm:flex-col">
                    <span className={`font-dmSans text-xl font-semibold`}>{priceFormatter.format(discountedPrice)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  function getPriceAfterDiscounts(
    product: Product_Plain,
    variant: OrderProduct_Plain,
  ): { totalPrice: number; discountedPrice: number } {
    let totalPrice = 0;

    const colorFee = variant.product_color?.fee ?? 0;
    const sizeFee = variant.product_size?.fee ?? 0;
    totalPrice += (product.price + colorFee + sizeFee) * variant.quantity;

    const discountedPrice = totalPrice - totalPrice * (product.discountPercent / 100);

    return { totalPrice, discountedPrice };
  }
}
