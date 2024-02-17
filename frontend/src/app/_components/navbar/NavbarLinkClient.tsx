"use client";

import { usePathname } from "next/navigation";
import NavbarLink from "./NavbarLink";
import { Link } from "@apiTypes/link/content-types/link/link";

export async function NavbarLinkClient(props: Link) {
  let pathname = usePathname();

  const firstRoute = "/" + (pathname.split("/")[1]);
  
  return (
    <NavbarLink
      link={props}
      isActive={firstRoute === props.attributes.href}
    ></NavbarLink>
  );
}
