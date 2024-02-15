import CategoryCarousel from "./_components/CategoryCarousel";
import ProductList from "./_components/ProductList";

export default async function Products(props: {
  params: { category: string };
}) {
  const categories = ["LIST", "OF", "CATEGORIES", "GOES", "HERE"];
  return (
    <ProductList category={props.params.category}>
      <CategoryCarousel category={props.params.category}></CategoryCarousel>
    </ProductList>
  );
}
