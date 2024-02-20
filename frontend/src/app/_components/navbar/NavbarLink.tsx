"use client";

import { Link as ApiLink } from "@apiTypes/link/content-types/link/link";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavbarLink(props: { link: ApiLink }) {
  let pathname = usePathname();

  const firstRoute = "/" + pathname.split("/")[1];

  const isActive = firstRoute === props.link.attributes.href;

  return (
    <Link
      className={clsx("text-nowrap", !isActive && "text-navLinkInactive")}
      key={props.link.attributes.text}
      href={props.link.attributes.href}
    >
      {props.link.attributes.text}
    </Link>
  );
}
