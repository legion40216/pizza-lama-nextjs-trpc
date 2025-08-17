import React from "react";

import Link from "next/link";

import HeadingState from "@/components/global-ui/heading-state";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CategoriesSection } from "../sections/categories-section";

export default function CategoriesView() {
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <HeadingState title="Categories" subtitle="Manage categories" />

        <Button asChild> 
          <Link href="/admin/categories/new">Add new</Link>
        </Button>
      </div>

      <Separator />
    
      <CategoriesSection />
    </div>
  );
}
