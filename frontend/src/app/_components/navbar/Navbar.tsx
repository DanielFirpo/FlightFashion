import Link from "next/link";
import { Tooltip } from "@nextui-org/react";
import { fetchAPI } from "@/src/app/_utils/strapiApi";
import { Navbar } from "@apiTypes/navbar/content-types/navbar/navbar";
import { Suspense } from "react";
import { NavbarLinkClient } from "./NavbarLinkClient";
import NavbarLinkServer from "./NavbarLinkServer";
import { Link as ApiLink } from "@apiTypes/link/content-types/link/link";

export default async function Navbar() {
  "use server";

  const pageData: Navbar = (await fetchAPI("/navbar", { populate: "links" }))
    .data;

  return (
    <div className="w-full">
      <div
        className="mb-5 flex h-14 items-center justify-between rounded-full bg-customBlack
          px-2 align-middle text-white"
      >
        <Link href={"/"}>
          <div
            className="font-alumniSans font-bold w-fit md:w-44 pl-2 text-3xl"
          >
            {pageData.attributes.title}
          </div>
        </Link>
        <div className="hidden md:inline-block font-dmSans font-normal text-sm [&>a]:mx-2">
          {pageData.attributes.links.data.map((link: ApiLink) => (
            <Suspense
              key={link.attributes.href}
              fallback={<NavbarLinkServer {...link}></NavbarLinkServer>}
            >
              <NavbarLinkClient
                key={link.attributes.href}
                {...link}
              ></NavbarLinkClient>
            </Suspense>
          ))}
        </div>
        <div className="hidden md:flex items-center">
          <Tooltip
            closeDelay={0}
            color="default"
            showArrow={true}
            content="My Cart"
          >
            <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-white">
              <span className="icon-[solar--cart-4-bold] size-6 cursor-pointer align-middle text-black"></span>
            </div>
          </Tooltip>
          <Tooltip
            closeDelay={0}
            color="default"
            showArrow={true}
            content="My Profile"
          >
            <div
              className="flex h-10 w-32 cursor-pointer items-center justify-center rounded-full bg-white
                text-black"
            >
              <div>
                <span className="icon-[iconoir--profile-circle] size-6 align-middle"></span>
              </div>
              <div className="font-dmSans font-normal px-2 text-xs">
                {"longassusername".length > 7
                  ? "longassusername".substring(0, 7) + "..."
                  : "longassusername"}
              </div>
              <div>
                <span className="icon-[teenyicons--down-outline] size-3 align-middle"></span>
              </div>
            </div>
          </Tooltip>
        </div>

        {/* Hamburger and Mobile Nav */}
        <div className="icon-[charm--menu-hamburger] text-white h-10 w-10 min-h-10 min-w-10 md:hidden mr-3 cursor-pointer"></div>
      </div>
    </div>
  );
}
