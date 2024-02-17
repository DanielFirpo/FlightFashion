"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/app/_components/shadcn/carousel";
import { getImageURLBySize } from "@/src/app/_utils/strapiApi";
import { Media } from "@strapiTypes/schemas-to-ts/Media";
import clsx from "clsx";
import { useState } from "react";

export default function (props: any) {
  const [selectedImage, setSelectedImage] = useState<Media>(props.images[0]);

  return (
    <div className="w-full">
      <div className="flex cursor-zoom-in justify-center overflow-hidden">
        <img
          className="aspect-square max-h-96 rounded-3xl bg-imageBackground transition-all hover:scale-150"
          src={
            getImageURLBySize(selectedImage, "large") ??
            "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=jpg&quality=90&v=1530129081"
          }
        ></img>
      </div>
      <div className="mt-4 flex justify-center">
        {(props.images?.length ?? 0) > 3 ? (
          <Carousel className="w-fit">
            <CarouselContent>
              {props.images?.map((image: Media | undefined) => {
                const smallImage = getImageURLBySize(image!, "small");
                const isActiveImage =
                  smallImage === getImageURLBySize(selectedImage, "small");
                return (
                  <CarouselItem
                    key={smallImage}
                    className="basis-auto cursor-pointer"
                  >
                    <img
                      onClick={() => setSelectedImage(image!)}
                      className={clsx(
                        "rounded-xl bg-imageBackground",
                        isActiveImage && "border-2 border-highlightYellow",
                      )}
                      src={
                        smallImage ??
                        "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=jpg&quality=90&v=1530129081"
                      }
                    ></img>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <div className="flex w-full flex-nowrap gap-4">
            {props.images?.map((image: Media | undefined) => {
              return (
                <div>
                  <img
                    className="rounded-xl bg-imageBackground"
                    src={
                      getImageURLBySize(image!, "large") ??
                      "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=jpg&quality=90&v=1530129081"
                    }
                  ></img>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
