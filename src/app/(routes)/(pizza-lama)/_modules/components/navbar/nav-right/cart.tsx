"use client";
import { useEffect, useState } from "react";

import { ShoppingBasket } from "lucide-react";
import useCart from "@/hooks/useCartStore";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Cart() {
  const { items, getTotalCount} = useCart();
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    setTotalCount(getTotalCount());
  }, [getTotalCount, items]);

  return (
    <Button className="relative
    text-[var(--pizza_store-primary)] 
    hover:text-[var(--pizza_store-primary)]"
    variant="outline"
    size={"icon"}
    asChild
    >
      <Link href="/checkout" className="block">
      <Badge className="absolute -top-2 -right-2 
      bg-[var(--pizza_store-secondary)]"
      >
        {totalCount}
      </Badge>
      <ShoppingBasket className="size-6" />
      </Link>
    </Button>
  );
}
