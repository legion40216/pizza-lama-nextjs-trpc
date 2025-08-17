import React from "react";

import HeadingState from "@/components/global-ui/heading-state";

import { Separator } from "@/components/ui/separator";
import { OrdersSection } from "../sections/orders-section";

export default function OrdersView() {
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <HeadingState title="Orders" subtitle="Track orders" />

      </div>

      <Separator />

      <OrdersSection />
    </div>
  );
}
