"use client";
import React, { Suspense } from "react";

import { trpc } from "@/trpc/client";
import { ErrorBoundary } from "react-error-boundary";

import EmptyState from "@/components/global-ui/empty-state";
import { ProductIdProps } from "../view/product-view";
import Client from "../components/client";

export const ProductSection = ({ productId }: ProductIdProps) => {
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
        <ProductSectionContent productId={productId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const ProductSectionContent = ({ productId }: ProductIdProps) => {
  const [categoriesData] = trpc.categories.getAll.useSuspenseQuery();
  const [sizesData] = trpc.sizes.getAll.useSuspenseQuery();
  const [productData] = trpc.products.getById.useSuspenseQuery({ productId });
  
  const sizes = sizesData.sizes;
  const categories = categoriesData.categories;
  const product = productData.product;

  // Handle the null case
  if (!product) {
    return (
      <EmptyState 
        title="Product not found" 
        subtitle="The product you're looking for doesn't exist." 
      />
    );
  }

  const formattedData = {
    categories: categories.map((cat) => ({
      id: cat.id,
      title: cat.title,
      value: cat.slug,
      label: cat.title,
    })),
    sizes: sizes.map((size) => ({
      id: size.id,
      title: size.title,
      value: size.value,
      label: `${size.title} (${size.value})`,
    })),
  };

  const formattedProduct = {
    id: product.id,
    title: product.title,
    descr: product.descr,
    imgSrc: product.imgSrc,
    price: product.price.toString(),
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    isNew: product.isNew,
    inStock: product.inStock,
    discount: product.discount,
    catSlug: product.catSlug,
    stock: product.stock ?? 0,
    sizes: product.sizes.map((s) => ({
      sizeId: s.sizeId,
      price: s.price.toString(),
      stock: s.stock ?? 0,
    })),
  };

  return (
    <div>
      <Client 
        formattedData={formattedData} 
        initialData={formattedProduct} 
      />
    </div>
  );
};
