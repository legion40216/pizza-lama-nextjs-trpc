import React from "react";

import HeadingState from "@/components/global-ui/heading-state";
import { Separator } from "@/components/ui/separator";
import { SizeSection } from "../section/size-section";


export type sizeIdProps = {
  sizeId: string;
};

export default function SizeView({ sizeId }: sizeIdProps) {
  return (
    <div className="space-y-5">
      <HeadingState
        title="Category form"
        subtitle="Update category for your application"
      />

      <Separator />

      <SizeSection sizeId={sizeId} />
    </div>
  );
}
