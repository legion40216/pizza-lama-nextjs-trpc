import React from "react";

import Link from "next/link";

import HeadingState from "@/components/global-ui/heading-state";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductsSection } from "../sections/products-section";

export default function ProductsView() {
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <HeadingState title="Products" subtitle="Manage products" />

        <Button asChild> 
          <Link href="/admin/products/new">Add new</Link>
        </Button>
      </div>

      <Separator />

      <ProductsSection />
    </div>
  );
}
