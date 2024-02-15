"use server"

export default async function CategoryCarousel(props: { category: string }) {
  const categories = ["LIST", "OF", "CATEGORIES", "GOES", "HERE"];
  return (
    <div>
      {categories.map((cat) => (
        <div
          key={""}
          className={
            props.category.toLowerCase() === cat.toLowerCase()
              ? "bg-yellow-300"
              : ""
          }
        >
          {cat}
        </div>
      ))}
    </div>
  );
}
