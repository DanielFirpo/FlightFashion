"use server";

import { Link } from "@apiTypes/link/content-types/link/link";
import NavbarLink from "./NavbarLink";

export default async function ServerNavbarLink(props: Link) {
  return <NavbarLink link={props} isActive={false}></NavbarLink>;
}
