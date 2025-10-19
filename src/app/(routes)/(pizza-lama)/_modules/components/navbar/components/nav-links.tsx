"use client";
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavLinksProps {
  routeActive: boolean;
  routeHref: string;
  routeLabel?: string;
  children?: ReactNode;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  onClick?: () => void;
}

export default function NavLinks({
  routeActive,
  routeHref,
  routeLabel,
  children,
  className,
  activeClassName = "",
  inactiveClassName = "",
  onClick,
}: NavLinksProps) {
  return (
    <Link
      href={routeHref}
      onClick={onClick}
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
