import { Product as ProductType } from "@apiTypes/product/content-types/product/product";
import { fetchAPI } from "@/src/app/_utils/strapiApi";
import ProductImages from "./_components/ProductImages";
import ProductForm from "./_components/ProductForm";
import { notFound } from "next/navigation";
import BackButton from "./_components/BackButton";

export default async function Product(props: { params: { product: string } }) {
  console.log("filters", { filters: { slug: { eq: props.params.product } } });

  let productData: any = await fetchAPI(
    `/products?populate=*,images,product_sizes,product_colors&filters[slug][$eq]=${props.params.product}`,
  );

  console.log(JSON.stringify(productData));

  productData = productData.data[0];

  if (!productData) return notFound();

  return (
    <>
      <BackButton></BackButton>
      <div className="flex flex-col items-center gap-14 lg:flex-row lg:items-start">
        {/* Right Half Images */}
        <ProductImages images={productData.attributes?.images?.data}></ProductImages>

        {/* Left Half Title, Description, Form */}
        <div className="flex w-full flex-col overflow-hidden break-words">
          {productData.attributes.isBestSeller ? <div className="text-medium text-subtitleText">Best Seller</div> : null}

          <div className="mb-6 line-clamp-2 font-alumniSans text-6xl font-gigabold">{productData.attributes.name}</div>

          <div className="line-clamp-4 h-20 text-sm text-subtitleText">{productData.attributes.description}</div>

          <ProductForm productData={productData}></ProductForm>
        </div>
      </div>
    </>
  );
}
