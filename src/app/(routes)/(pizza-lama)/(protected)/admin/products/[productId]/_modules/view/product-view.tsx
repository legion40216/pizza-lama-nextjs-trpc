import React from "react";

import HeadingState from "@/components/global-ui/heading-state";
import { Separator } from "@/components/ui/separator";
import { ProductSection } from "../section/product-section";

export type ProductIdProps = {
  productId: string;
};

export default function ProductView({ productId }: ProductIdProps) {
  return (
    <div className="space-y-5">
      <HeadingState
        title="Product form"
        subtitle="Update product for your application"
      />

      <Separator />

      <ProductSection productId={productId} />
    </div>
  );
}
