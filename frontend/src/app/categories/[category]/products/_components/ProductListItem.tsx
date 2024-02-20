import { Button } from "@/src/app/_components/shadcn/button";
import { getImageURLBySize } from "@/src/app/_utils/strapiApi";
import { Product } from "@apiTypes/product/content-types/product/product";
import Image from "next/image";
import Link from "next/link";
import PriceDisplay from "./PriceDisplay";

export default function Product(props: { product: Product }) {
  const noImage =
    "https://cdn.dribbble.com/users/55871/screenshots/2158022/media/8f2a4a2c9126a9f265fb9e1023b1698a.jpg?resize=400x0";

  const imageUrl = props.product.attributes.images?.data[0]
    ? getImageURLBySize(props.product.attributes.images!.data[0]!, "small")
    : noImage;

  return (
    <Link href={"/categories/all/products/" + props.product.attributes.slug}>
      <div
        className={`flex h-[32rem] w-64 cursor-pointer flex-col gap-2 text-wrap break-words rounded-3xl bg-transparent hover:bg-white`}
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
          <div className="max-h-16 overflow-hidden font-dmSans text-lg font-semibold">
            {props.product.attributes.name}
          </div>
          <div className="text-md max-h-24 overflow-hidden font-dmSans font-normal text-subtitleText">
            {props.product.attributes.description}
          </div>

          <div className="my-3 flex flex-wrap justify-between">
            <PriceDisplay
              className="justify-between w-full items-center"
              product={props.product}
              fees={0}
              quantity={1}
            ></PriceDisplay>
          </div>

          <Button variant="hightlighted">Details</Button>
        </div>
      </div>
    </Link>
  );
}
