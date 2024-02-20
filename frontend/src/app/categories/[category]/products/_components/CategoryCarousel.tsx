import { Button } from "@/src/app/_components/shadcn/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/src/app/_components/shadcn/carousel";
import { Category } from "@apiTypes/category/content-types/category/category";
import Link from "next/link";

export default async function CategoryCarousel(props: {
  category: string;
  categories: Category[];
}) {
  return (
    <Carousel className="mt-5 w-full">
      <CarouselContent>
        {props.categories.map((cat: Category) => {
          return (
            <Link key={cat.attributes.slug} href={`/categories/${cat.attributes.slug}/products`}>
              <CarouselItem
                className="basis-auto cursor-pointer"
              >
                {props.category.toLowerCase() ===
                cat.attributes.name.toLowerCase() ? (
                  <Button variant="hightlighted" className={`rounded-full`}>
                    {cat.attributes.name}
                  </Button>
                ) : (
                  <Button variant="regular" className={`rounded-full`}>
                    {cat.attributes.name}
                  </Button>
                )}
              </CarouselItem>
            </Link>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
