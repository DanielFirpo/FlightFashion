import Link from "next/link";
import { Tooltip } from "@nextui-org/react";
import { fetchAPI } from "@/src/app/_utils/strapiApi";
import { Navbar as NavbarType } from "@apiTypes/navbar/content-types/navbar/navbar";
import { Suspense } from "react";
import NavbarLink from "@/src/app/_components/navbar/NavbarLink";
import { Link as ApiLink } from "@apiTypes/link/content-types/link/link";
import RightNavbarSection from "@/src/app/_components/navbar/RightNavbarSection";

export default async function Navbar() {
  const pageData: NavbarType = (await fetchAPI("/navbar", { populate: "links" })).data;

  return (
    <div className="w-full">
      <div
        className="mb-5 flex h-14 items-center justify-between rounded-full bg-customBlack
          px-2 align-middle text-white"
      >
        <Link href={"/"}>
          <div className="w-fit pl-2 font-alumniSans text-3xl font-bold md:w-44">{pageData.attributes.title}</div>
        </Link>
        <div className="hidden font-dmSans text-sm font-normal md:inline-block [&>a]:mx-2">
          {pageData.attributes.links.data.map((link: ApiLink) => (
            <NavbarLink key={link.id} link={link}></NavbarLink>
          ))}
        </div>

        <RightNavbarSection></RightNavbarSection>

        {/* Hamburger and Mobile Nav */}
        <div className="icon-[charm--menu-hamburger] mr-3 h-10 min-h-10 w-10 min-w-10 cursor-pointer text-white md:hidden"></div>
      </div>
    </div>
  );
}
