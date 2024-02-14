import { Link as ApiLink} from "@apiTypes/link/content-types/link/link";
import clsx from "clsx";
import Link from "next/link";

export default function NavbarLink(props: {link: ApiLink, isActive: boolean}) {
    return (
      <Link
        className={clsx("text-nowrap", !props.isActive && "text-navLinkInactive")}
        key={props.link.attributes.text}
        href={props.link.attributes.href}
      >
        {props.link.attributes.text}
      </Link>
    );
  }
  