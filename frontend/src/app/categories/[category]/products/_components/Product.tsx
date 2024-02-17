import { Button } from "@/src/app/_components/shadcn/button";
import { getImageURLBySize } from "@/src/app/_utils/strapiApi";
import { Product } from "@apiTypes/product/content-types/product/product";
import Image from "next/image";

export default function Product(props: { product: Product }) {
  const noImage =
    "https://cdn.dribbble.com/users/55871/screenshots/2158022/media/8f2a4a2c9126a9f265fb9e1023b1698a.jpg?resize=400x0";

  const imageUrl = props.product.attributes.images?.data[0]
    ? getImageURLBySize(props.product.attributes.images!.data[0]!, "small")
    : noImage;

  const shortenedName =
    props.product.attributes.name.length > 27
      ? props.product.attributes.name.substring(0, 27) + "..."
      : props.product.attributes.name;

  const shortenedDesc =
    (props.product.attributes.description + "asdasdasdasdasdasdasdasdasdas")
      .length > 100
      ? (
          props.product.attributes.description + "asdasdasdasdasdsadasdasda"
        ).substring(0, 100) + "..."
      : props.product.attributes.description;

  const totalPrice = props.product.attributes.price;

  const discountedPrice =
    totalPrice - totalPrice * (props.product.attributes.discountPercent / 100);

  const priceFormatter = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div
      className={`flex h-[32rem] w-64 cursor-pointer flex-col gap-2 rounded-3xl bg-transparent hover:bg-white`}
    >
      <div className="flex w-full justify-center">
        <Image
          width={400}
          height={300}
          style={{ objectFit: "cover" }}
          className="max-h-56 w-full rounded-3xl bg-imageBackground"
          alt={props.product.attributes.name}
          src={imageUrl ? imageUrl : noImage}
        ></Image>
      </div>
      <div className="items-left flex flex-col px-4 py-2">
        <div className="font-dmSans text-lg font-semibold">{shortenedName}</div>
        <div className="text-md font-dmSans font-normal text-subtitleText">
          {shortenedDesc}
        </div>

        <div className="my-3 flex flex-wrap justify-between">
          <div className="flex w-full justify-between">
            <span className="font-dmSans text-2xl font-semibold">
              {priceFormatter.format(discountedPrice)}
            </span>
            <div
              className="relative ml-3 mt-3 text-subtitleText before:absolute before:top-2.5
                     before:w-full before:-rotate-6 before:border-t-1.5 before:border-red-600"
            >
              {priceFormatter.format(totalPrice)}
            </div>
          </div>
        </div>

        <Button variant="hightlighted">Details</Button>
      </div>
    </div>
  );
}
