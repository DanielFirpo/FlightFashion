import { redirect } from "next/navigation";

export default async function Categories(params: { params: { slug: string } }) {
  redirect("/categories/all/products");
}
