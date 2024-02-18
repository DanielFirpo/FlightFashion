"use client";

import { Button } from "@/src/app/_components/shadcn/button";
import { ProductsPage } from "@apiTypes/products-page/content-types/products-page/products-page";
import { ReactNode, Suspense, useEffect, useState } from "react";
import { Category } from "@apiTypes/category/content-types/category/category";
import Marquee from "react-fast-marquee";
import { Product as ProductResponse } from "@apiTypes/product/content-types/product/product";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs";
import useSWR from "swr";
import { buildStrapiRequest, fetchAPIClient } from "@/src/app/_utils/strapiApi";
import Product from "./ProductListItem";
import ProductPaginationControl from "./PaginationControl";
import FilterList from "./FilterList";

export default function ProductList(props: {
  category: Category;
  products: ProductResponse[];
  children: ReactNode[];
  pageData: ProductsPage;
}) {
  const bannerTextColored = props.category.attributes.bannerText
    .split(" ")
    .map((word, index) => (
      <span
        key={word + index}
        className={`${index % 2 ? "text-highlightYellow" : "text-white"}`}
      >
        {word}&nbsp;
      </span>
    ));

  const [products, setProducts] = useState<ProductResponse[]>();
  const [searchTerm, setSearchTerm] = useQueryState<string>(
    "search",
    parseAsString.withDefault(""),
  );
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedTags, setSelectedTags] = useQueryState<string[]>(
    "tags",
    parseAsArrayOf(parseAsString),
  );

  const [page, setPage] = useQueryState<number>(
    "page",
    parseAsInteger.withDefault(1),
  );

  const [totalPages, setTotalPages] = useState<number>(1);

  let options = {
    filters: {
      ...(props.category.attributes.slug != "all"
        ? {
            category: {
              slug: {
                $eq: props.category.attributes.slug,
              },
            },
          }
        : {}),
      ...(selectedTags
        ? {
            $and: [
              ...selectedTags.map((tag) => {
                return {
                  product_tags: {
                    name: {
                      $eq: tag,
                    },
                  },
                };
              }),
            ],
          }
        : {}),
      ...(searchTerm
        ? {
            $or: [
              {
                name: {
                  $containsi: searchTerm,
                },
              },
              {
                description: {
                  $containsi: searchTerm,
                },
              },
            ],
          }
        : {}),
    },
    sort: "isBestSeller",
    pagination: {
      pageSize: 19,
      page: page,
    },
    populate: "images",
  };

  type MetaData = {
    pagination: {
      page: number;
      pageCount: number;
      pageSize: number;
      total: number;
    };
  };

  const { requestUrl, mergedOptions } = buildStrapiRequest(
    "/products",
    options,
  );

  const { data, error } = useSWR<{
    data: ProductResponse[];
    meta: MetaData;
  }>(requestUrl, (url: any) => fetchAPIClient(url, mergedOptions));

  // use SWR's caching to fetch the next page of products ahead of time.
  options.pagination.page = page + 1;
  const nextPage = buildStrapiRequest("/products", options);
  useSWR<{
    data: ProductResponse[];
    meta: MetaData;
  }>(nextPage.requestUrl, (url: any) =>
    fetchAPIClient(url, nextPage.mergedOptions),
  );

  useEffect(() => {
    setProducts(data?.data);
    if (data?.meta?.pagination?.page) {
      setPage(data.meta.pagination.page);
      setTotalPages(data.meta.pagination.pageCount);
    }
  }, [data]);

  useEffect(() => {
    setSearchInput(searchTerm + "");
  }, [searchTerm]);

  useEffect(() => {
    if (searchInput === "") {
      setSearchTerm(null);
    }
  }, [searchInput]);

  if (error)
    return (
      <div className="flex w-full items-center justify-center text-4xl font-bold">
        An Error Occurred
      </div>
    );

  return (
    <div>
      <FilterList
        pageData={props.pageData}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      ></FilterList>

      <div className="flex flex-col">
        <div className="ml-auto flex h-56 w-[calc(100%-18rem)] flex-col items-end pl-5">
          {/* Search Bar */}
          <div className="flex w-full">
            <div className="mr-4 flex w-full items-center justify-center rounded-full border-1.5 border-black">
              <span className="icon-[ion--search] ml-5 h-6 w-6"></span>
              <input
                onKeyDown={(e) => {
                  if (e.key == "Enter") setSearchTerm(searchInput);
                }}
                onChange={(e) => setSearchInput(e.target.value)}
                value={searchInput}
                placeholder="Search..."
                className="w-full bg-transparent pl-2 pr-2 focus:outline-none"
              ></input>
              <span
                onClick={() => {
                  setSearchInput("");
                  setSearchTerm(null);
                }}
                className="icon-[material-symbols-light--close] mr-5 h-7 w-7 cursor-pointer text-black"
              ></span>
            </div>
            <Button
              onClick={() => {
                setSearchTerm(searchInput);
              }}
              variant="hightlighted"
              size="lg"
              className="flex h-11 w-12 items-center justify-center rounded-full p-0"
            >
              <span className="icon-[ion--search]"></span>
            </Button>
          </div>

          {/* Categories */}
          <div className="w-full">{props.children[0]}</div>

          {/* Category Banner */}
          <div className="mb-5 mt-5 flex h-56 w-full items-center rounded-3xl bg-black pb-4 pt-4 text-white">
            <Suspense fallback={bannerTextColored}>
              <Marquee
                autoFill={true}
                className="overflow-y-clip align-middle font-alumniSans text-5xl font-gigabold"
              >
                <span>
                  {bannerTextColored}
                  <span className="px-5 text-highlightYellow">✦&nbsp;</span>
                </span>
              </Marquee>
            </Suspense>
          </div>
        </div>

        {/* Product List */}
        {products?.length ? (
          <div className="flex flex-wrap justify-center gap-5">
            <div className={`invisible h-[32rem] w-64`}></div>
            {products
              ? products.map((product) => {
                  return (
                    <Product
                      key={product.attributes.slug}
                      product={product}
                    ></Product>
                  );
                })
              : props.children.slice(1, props.children.length)}
          </div>
        ) : (
          <div className="ml-64 flex h-[28rem] items-center justify-center text-center">
            <div className="flex w-fit flex-col gap-6">
              <div className="text-2xl font-bold">Oh No!</div>
              <div className="text-large">
                No products match your search criteria...
              </div>
              <Button
                onClick={() => {
                  setSearchTerm(null);
                  setSelectedTags([]);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
      <ProductPaginationControl
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      ></ProductPaginationControl>
    </div>
  );
}
