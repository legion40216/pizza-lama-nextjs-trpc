"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  dataId: string;
  dataLabel: string;
}

export default function CellLinks({ 
  dataId, 
  dataLabel, 
}: Props) {

  const pathName = usePathname();

  return (
    <Button 
    className="font-semibold" 
    variant="link"
    asChild
    >
      <Link href={`${pathName}/${dataId}`}>
        {dataLabel}
      </Link>
    </Button>
  );
}
