"use client";
import React, { Suspense } from 'react';

import { trpc } from '@/trpc/client';
import { ErrorBoundary } from 'react-error-boundary';

import EmptyState from '@/components/global-ui/empty-state';
import Client from '../components/client';
import { formatter } from '@/utils/formatters';
import { format } from "date-fns";

export const ProductsSection = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={
        <EmptyState 
          title="Error loading accounts" 
          subtitle="Please try again later." 
        />
        }>
        <ProductsSectionContent />
      </ErrorBoundary>
    </Suspense>
  );
};

const ProductsSectionContent = () => {
  const [data] = trpc.products.getAll.useSuspenseQuery();
  const products = data.products

  const formattedProducts = products.map((item) => {
    return {
      id: item.id,
      title: item.title,
      price: formatter.format(item.price),
      descr: item.descr,
      discount: item.discount,
      category: item.category.title,
      isFeatured: item.isFeatured,
      isArchived: item.isArchived,
      isNew: item.isNew,
      inStock: item.inStock,
      createdAt: format(new Date(item.createdAt), "MMMM do, yyyy"),
    };
  });

  return (
    <Client 
      initialData={formattedProducts}
    />
  )
};
