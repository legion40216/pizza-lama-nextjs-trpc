import React from "react";

import HeadingState from "@/components/global-ui/heading-state";
import { Separator } from "@/components/ui/separator";
import { ProductSection } from "../section/product-section";

export default function ProductView() {
  return (
    <div className="space-y-5">
      <HeadingState
        title="Product form"
        subtitle="Create product for your application"
      />

      <Separator />

      <ProductSection />
    </div>
  );
}

