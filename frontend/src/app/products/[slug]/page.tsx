import { Product } from "@apiTypes/product/content-types/product/product";
import { fetchAPI } from "@/src/app/_utils/strapiApi";
import ProductImages from "./_components/ProductImages";
import ProductForm from "./_components/ProductForm";

export default async function Product(params: { params: { slug: string } }) {
  "use server";

  const productData: Product = (
    await fetchAPI("/products", {
      filters: { slug: params.params.slug },
      populate: "images,product_sizes,product_colors",
    })
  ).data[0];

  return (
    <div className="flex flex-col md:flex-row">
      {/* Right Half Images */}
      <ProductImages
        images={productData.attributes?.images?.data}
      ></ProductImages>

      {/* Left Half Title, Description */}
      <div className="ml-0 mt-4 md:mt-0 md:ml-14 flex w-full flex-col">
        {productData.attributes.isBestSeller ? (
          <div className="text-medium text-subtitleText">Best Seller</div>
        ) : null}

        <div className="font-alumniSans font-gigabold mb-6 text-6xl">
          {productData.attributes.name}
        </div>

        <div className="text-sm text-subtitleText">
          {productData.attributes.description}
        </div>

        <ProductForm productData={productData}></ProductForm>
      </div>
    </div>
  );
}
