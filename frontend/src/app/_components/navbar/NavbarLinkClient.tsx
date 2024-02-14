"use client";

import { usePathname } from "next/navigation";
import NavbarLink from "./NavbarLink";
import { Link } from "@apiTypes/link/content-types/link/link";

export async function NavbarLinkClient(props: Link) {
  let pathname = usePathname();

  if (pathname.includes("products")) {
    pathname = "/products";
  }

  return (
    <NavbarLink
      link={props}
      isActive={pathname === props.attributes.href}
    ></NavbarLink>
  );
}
