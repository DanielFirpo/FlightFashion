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
import Image from "next/image";

export default function ProductImages(props: any) {
  const [selectedImage, setSelectedImage] = useState<Media>(props.images[0]);

  const noImage =
    "https://cdn.dribbble.com/users/55871/screenshots/2158022/media/8f2a4a2c9126a9f265fb9e1023b1698a.jpg?resize=400x0";

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex w-full justify-center overflow-hidden md:w-[30rem]">
        <Dialog>
          <DialogTrigger>
            <div>
              <Image
                width={selectedImage.attributes.width}
                height={selectedImage.attributes.height}
                alt={selectedImage.attributes.alternativeText ?? ""}
                className="aspect-square cursor-zoom-in rounded-3xl bg-imageBackground transition-all hover:scale-125"
                src={getImageURLBySize(selectedImage, "large") ?? noImage}
              ></Image>
            </div>
          </DialogTrigger>
          {/* TODO: fix UI shift on dialog open */}
          <DialogContent className="h-[100vh-10rem] min-w-fit">
            <Image
              width={selectedImage.attributes.width}
              height={selectedImage.attributes.height}
              alt={selectedImage.attributes.alternativeText ?? ""}
              className="mx-auto aspect-square h-full rounded-3xl bg-imageBackground"
              src={getImageURLBySize(selectedImage, "large") ?? noImage}
            ></Image>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-4 flex max-w-[30rem] justify-center">
        {(props.images?.length ?? 0) > 3 ? (
          <Carousel className="w-fit">
            <CarouselContent>
              {props.images?.map((image: Media) => {
                const smallImage = getImageURLBySize(image!, "thumbnail");
                const isActiveImage =
                  smallImage === getImageURLBySize(selectedImage, "thumbnail");
                return (
                  <CarouselItem
                    key={smallImage}
                    className="max-w-40 basis-auto cursor-pointer"
                  >
                    <Image
                      width={image.attributes.width}
                      height={image.attributes.height}
                      alt={image.attributes.alternativeText ?? ""}
                      onClick={() => setSelectedImage(image)}
                      className={clsx(
                        "rounded-xl bg-imageBackground",
                        isActiveImage && "border-2 border-highlightYellow",
                      )}
                      src={smallImage ?? noImage}
                    ></Image>
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
                  <Image
                    width={image.attributes.width}
                    height={image.attributes.height}
                    alt={image.attributes.alternativeText ?? ""}
                    className="max-w-40 rounded-xl bg-imageBackground"
                    src={getImageURLBySize(image!, "small") ?? noImage}
                  ></Image>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
