import { fetchAPI } from "@/src/app/_utils/strapiApi";
import CategoryCarousel from "./_components/CategoryCarousel";
import ProductList from "./_components/ProductList";
import { ProductsPage } from "@apiTypes/products-page/content-types/products-page/products-page";
import { Category } from "@apiTypes/category/content-types/category/category";
import Product from "./_components/Product";
import { Product as ProductResponse } from "@apiTypes/product/content-types/product/product";
import { notFound } from "next/navigation";

export default async function Products(props: {
  params: { category: string };
}) {
  const pageData: ProductsPage = (
    await fetchAPI("/products-page", {
      populate: "filter_list_1,filter_list_2,filter_list_3",
    })
  ).data;

  const categories: Category[] = (await fetchAPI("/categories", { sort: "id" }))
    .data;

  //make sure All category is first in array
  const allCategory = categories.splice(
    categories.findIndex((cat) => cat.attributes.slug === "all"),
    1,
  );
  categories.unshift(allCategory[0]);

  const currentCategory = categories.filter(
    (cat) =>
      props.params.category.toLowerCase() ===
      cat.attributes.name.toLowerCase(),
  )[0]
  if(!currentCategory) return notFound();

  //We fetch products here and in ProductList, it's not redundant though.
  //This one is so that when the page arrives on the client's browser they
  //can instantly see the products. Later fetches are for filters additional pages
  const products: ProductResponse[] = (
    await fetchAPI("/products", {
      ...(props.params.category.toLowerCase() != "all"
        ? {
            filter: {
              category: {
                slug: {
                  $eq: props.params.category,
                },
              },
            },
          }
        : {}),
      sort: "isBestSeller",
      pagination: {
        pageSize: 19,
        page: 1,
      },
    })
  ).data;

  return (
    <>
      <ProductList
        category={currentCategory}
        pageData={pageData}
        products={products}
      >
        <CategoryCarousel
          category={props.params.category}
          categories={categories}
        ></CategoryCarousel>
        <p></p>
        {/* {products.map((product) => {
          return (
            <Product key={product.attributes.slug} product={product}></Product>
          );
        })} */}
      </ProductList>
    </>
  );
}
