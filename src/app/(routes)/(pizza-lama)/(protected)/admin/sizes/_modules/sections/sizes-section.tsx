"use client";
import React, { Suspense } from 'react';

import { format } from "date-fns";

import { trpc } from '@/trpc/client';
import { ErrorBoundary } from 'react-error-boundary';

import EmptyState from '@/components/global-ui/empty-state';
import Client from '../components/client';

export const SizesSection = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={
        <EmptyState 
          title="Error loading sizes" 
          subtitle="Please try again later." 
        />
        }>
        <SizesSectionContent />
      </ErrorBoundary>
    </Suspense>
  );
};

const SizesSectionContent = () => {
  const [data] = trpc.sizes.getAll.useSuspenseQuery();
  const sizes = data.sizes

  const formattedSizes = sizes.map((item) => {
    return {
      id: item.id,
      title: item.title,
      value: item.value,
      createdAt: format(new Date(item.createdAt), "dd/MM/yyyy"),
    };
  });

  return (
    <Client 
      initialData={formattedSizes}
    />
  )
};
