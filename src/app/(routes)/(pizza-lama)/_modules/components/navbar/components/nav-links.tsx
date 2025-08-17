"use client";
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavLinksProps {
  routeActive: boolean;
  routeHref: string;
  routeLabel?: string; // optional now
  children?: ReactNode; // allow anything to be passed
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

export default function NavLinks({
  routeActive,
  routeHref,
  routeLabel,
  children,
  className,
  activeClassName = "",
  inactiveClassName = "",
}: NavLinksProps) {
  return (
    <Link
      href={routeHref}
      className={cn(
        routeActive ? activeClassName : inactiveClassName,
        "transition-colors",
        className
      )}
    >
      {children ?? routeLabel}
    </Link>
  );
}

