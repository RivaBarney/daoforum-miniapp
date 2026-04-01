"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Hall" },
  { href: "/proposal?id=0", label: "Proposal" },
  { href: "/about", label: "About" }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="Main">
      {navItems.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || (item.href.startsWith("/proposal") && pathname === "/proposal");
        return (
          <Link key={item.href} href={item.href} className={`bottom-nav__item ${active ? "is-active" : ""}`}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
