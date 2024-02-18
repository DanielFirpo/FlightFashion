import { fetchAPI } from "../../_utils/strapiApi";
import { Footer } from "@apiTypes/footer/content-types/footer/footer";
import { Link as ApiLink } from "@apiTypes/link/content-types/link/link";
import Link from "next/link";

export default async function Navbar() {
  "use server";

  const pageData: Footer = (
    await fetchAPI("/footer", {
      populate: "column_1_links,column_2_links,column_3_links",
    })
  ).data;

  return (
    <div className="flex justify-evenly items-center sm:items-start text-center gap-5 mt-40 flex-col sm:flex-row sm:text-left w-full">
      {/* Title/Slogan */}
      <div className="flex max-w-72 flex-col">
        <span className={"font-alumniSans font-gigabold mb-4 text-7xl"}>
          {pageData.attributes.title}<span className="align-top ml-2 mt-3 icon-[fluent-emoji-flat--copyright] h-4 w-4 text-black"></span>
        </span>
        <span className="text-sm">{pageData.attributes.slogan}</span>
      </div>
      {/* Column 1 */}
      <div className="flex flex-col">
        <span className="font-dmSans font-semibold mb-4 text-xl">
          {pageData.attributes.column1Title}
        </span>
        {pageData.attributes.column_1_links.data.map((link: ApiLink) => {
          return (
            <Link
              className="mb-2 text-sm"
              key={link.attributes.href}
              href={link.attributes.href}
            >
              {link.attributes.text}
            </Link>
          );
        })}
      </div>
      {/* Column 2 */}
      <div className="flex flex-col">
        <span className="font-dmSans font-semibold mb-4 text-xl">
          {pageData.attributes.column2Title}
        </span>
        {pageData.attributes.column_2_links.data.map((link: ApiLink) => {
          return (
            <Link
              className="mb-2 text-sm"
              key={link.attributes.href}
              href={link.attributes.href}
            >
              {link.attributes.text}
            </Link>
          );
        })}
      </div>
      {/* Column 3 */}
      <div className="flex flex-col">
        <span className="font-dmSans font-semibold mb-4 text-xl">
          {pageData.attributes.column3Title}
        </span>
        {pageData.attributes.column_3_links.data.map((link: ApiLink) => {
          return (
            <Link
              className="mb-2 text-sm"
              key={link.attributes.href}
              href={link.attributes.href}
            >
              {link.attributes.text}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
