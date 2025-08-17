'use client';
import React, { Suspense } from 'react';

import { trpc } from '@/trpc/client';
import { formatter } from '@/utils/formatters';
import { ErrorBoundary } from 'react-error-boundary';

import EmptyState from '@/components/global-ui/empty-state';
import FeaturedCarsosel from '../components/featured-carousel';

export const FeaturedSection = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={
        <EmptyState 
        title="Error loading featured products" 
        subtitle="Please try again later." 
        />
        }>
        <FeaturedSectionContent />
      </ErrorBoundary>
    </Suspense>
  );
};

const FeaturedSectionContent = () => {
  const [data] = trpc.products.getAll.useSuspenseQuery();
  const products = data.products;

  if (products.length === 0) {
    return <EmptyState 
    title="No featured products found"
    subtitle="Please try again later."
    />;
  }

  //filter new from productData
  const filteredFeaturedProducts = products.filter(
    (item) => item.isFeatured === true
  );

  const formattedProducts = filteredFeaturedProducts.map((item) => {
    return {
      id: item.id,
      title: item.title,
      description: item.descr,
      price: formatter.format(item.price),
      image: item.imgSrc,
      discount: item.discount,
      isNew: item.isNew,
    };
  });

  return <FeaturedCarsosel data={formattedProducts} />;
};
