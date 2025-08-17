"use client";
import React, { Suspense } from "react";

import { trpc } from "@/trpc/client";
import { ErrorBoundary } from "react-error-boundary";

import EmptyState from "@/components/global-ui/empty-state";
import Client from "../components/client";

export const ProductSection = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary
        fallback={
          <EmptyState
            title="Error loading product"
            subtitle="Please try again later."
          />
        }
      >
        <ProductSectionContent />
      </ErrorBoundary>
    </Suspense>
  );
};

const ProductSectionContent = () => {
  const [categoriesData] = trpc.categories.getAll.useSuspenseQuery();
  const [sizesData] = trpc.sizes.getAll.useSuspenseQuery();
  const sizes = sizesData.sizes;
  const categories = categoriesData.categories;

  const formattedData = {
    categories: categories.map(cat => ({
      id: cat.id,
      title: cat.title,
      value: cat.slug,
      label: cat.title
    })),
    sizes: sizes.map(size => ({
      id: size.id,
      title: size.title,
      value: size.value,
      label: `${size.title} (${size.value})`
    }))
  };

  return (
    <div>
      <Client initialData={formattedData} />
    </div>
  );
};
