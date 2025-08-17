"use client";
import React, { Suspense } from 'react';

import { trpc } from '@/trpc/client';
import { ErrorBoundary } from 'react-error-boundary';

import EmptyState from '@/components/global-ui/empty-state';
import Client from '../components/client';
import { format } from "date-fns";

export const CategoriesSection = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={
        <EmptyState 
          title="Error loading categories" 
          subtitle="Please try again later." 
        />
        }>
        <CategoriesSectionContent />
      </ErrorBoundary>
    </Suspense>
  );
};

const CategoriesSectionContent = () => {
  const [data] = trpc.categories.getAll.useSuspenseQuery();
  const categories = data.categories

  const formattedCategories = categories.map((item) => {
    return {
      id: item.id,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
      updatedAt: format(item.updatedAt, "MMMM do, yyyy"),
      title: item.title,
      descr: item.descr,
      imgSrc: item.imgSrc,
      slug: item.slug,
    };
  });

  return (
    <Client 
      initialData={formattedCategories}
    />
  )
};
