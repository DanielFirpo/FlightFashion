"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/app/_components/shadcn/carousel";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/src/app/_components/shadcn/dialog";
import { getImageURLBySize } from "@/src/app/_utils/strapiApi";
import { Media } from "@strapiTypes/schemas-to-ts/Media";
import clsx from "clsx";
import { useState } from "react";

export default function ProductImages(props: any) {
  const [selectedImage, setSelectedImage] = useState<Media>(props.images[0]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex w-[30rem] justify-center overflow-hidden">
        <Dialog>
          <DialogTrigger>
            <img
              className="aspect-square cursor-zoom-in rounded-3xl bg-imageBackground transition-all hover:scale-125"
              src={
                getImageURLBySize(selectedImage, "large") ??
                "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=jpg&quality=90&v=1530129081"
              }
            ></img>
          </DialogTrigger>
          {/* TODO: fix UI shift on dialog open */}
          <DialogContent className="h-[100vh-10rem] min-w-fit">
            <img
              className="mx-auto aspect-square h-full rounded-3xl bg-imageBackground"
              src={
                getImageURLBySize(selectedImage, "large") ??
                "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=jpg&quality=90&v=1530129081"
              }
            ></img>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-4 flex max-w-[30rem] justify-center">
        {(props.images?.length ?? 0) > 3 ? (
          <Carousel className="w-fit">
            <CarouselContent>
              {props.images?.map((image: Media | undefined) => {
                const smallImage = getImageURLBySize(image!, "thumbnail");
                const isActiveImage =
                  smallImage === getImageURLBySize(selectedImage, "thumbnail");
                return (
                  <CarouselItem
                    key={smallImage}
                    className="max-w-40 basis-auto cursor-pointer"
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
            {props.images?.map((image: Media) => {
              return (
                <div key={image.attributes.hash}>
                  <img
                    alt={
                      image.attributes.alternativeText
                        ? image.attributes.alternativeText
                        : ""
                    }
                    className="max-w-40 rounded-xl bg-imageBackground"
                    src={
                      getImageURLBySize(image!, "small") ??
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
