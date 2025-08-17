"use client";
import React, { Suspense } from 'react';

import { trpc } from '@/trpc/client';
import { ErrorBoundary } from 'react-error-boundary';

import EmptyState from '@/components/global-ui/empty-state';
import Client from '../components/client';
import { categoryIdProps } from '../view/category-view';

export const CategorySection = ({categoryId}: categoryIdProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={
        <EmptyState 
          title="Error loading category" 
          subtitle="Please try again later." 
        />
        }>
        <CategorySectionContent categoryId={categoryId}/>
      </ErrorBoundary>
    </Suspense>
  );
};

const CategorySectionContent = ({categoryId}: categoryIdProps) => {
  const [data] = trpc.categories.getById.useSuspenseQuery({categoryId});
  const category = data.category

  if (!category)
  return (
    <EmptyState 
    title="Category not found" 
    subtitle="We couldn't find the category you're looking for." 
    />
  );

  const formattedCategory = {
    id: category.id,
    title: category.title,
    descr: category.descr,
    imgSrc: category.imgSrc,
    slug: category.slug,
 };

  return (
    <Client 
      initialData={formattedCategory}
    />
  )
};