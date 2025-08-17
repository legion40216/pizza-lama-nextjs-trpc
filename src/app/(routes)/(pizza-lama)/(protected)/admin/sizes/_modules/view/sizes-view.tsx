import React from "react";

import Link from "next/link";

import HeadingState from "@/components/global-ui/heading-state";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SizesSection } from "../sections/sizes-section";

export default function SizesView() {
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <HeadingState title="Sizes" subtitle="Manage sizes" />

        <Button asChild> 
          <Link href="/admin/sizes/new">Add new</Link>
        </Button>
      </div>

      <Separator />

      <SizesSection/>
    </div>
  );
}
