import { redirect } from "next/navigation";

export default async function Category(props: { params: { category: string } }) {
  redirect(`/categories/${props.params.category}/products`);
}
