import { Product } from "@apiTypes/product/content-types/product/product";

export default function PriceDisplay(props: {
  product: Product;
  fees: number;
  quantity: number;
  className?: string;
  priceSize?: string
}) {
  const totalPrice =
    (props.product.attributes.price + props.fees) * props.quantity;

  const discountedPrice =
    totalPrice - totalPrice * (props.product.attributes.discountPercent / 100);

  const priceFormatter = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className={`flex ${props.className}`}>
      <span className={`font-dmSans text-3xl font-semibold ${props.priceSize}`}>
        {priceFormatter.format(discountedPrice)}
      </span>
      <div
        className="relative w-fit text-subtitleText before:absolute before:top-2.5
             before:w-full before:-rotate-6 before:border-t-1.5 before:border-red-600"
      >
        {priceFormatter.format(totalPrice)}
      </div>
    </div>
  );
}
