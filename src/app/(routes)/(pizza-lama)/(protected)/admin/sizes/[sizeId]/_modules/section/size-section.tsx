"use client";
import React, { Suspense } from 'react';

import { trpc } from '@/trpc/client';
import { ErrorBoundary } from 'react-error-boundary';

import EmptyState from '@/components/global-ui/empty-state';
import Client from '../components/client';
import { sizeIdProps } from '../view/size-view';

export const SizeSection = ({ sizeId }: sizeIdProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={
        <EmptyState 
          title="Error loading size" 
          subtitle="Please try again later." 
        />
      }>
        <SizeSectionContent sizeId={sizeId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const SizeSectionContent = ({ sizeId }: sizeIdProps) => {
  const [data] = trpc.sizes.getById.useSuspenseQuery({ sizeId });
  const size   = data.size;

  if (!size) {
    return (
      <EmptyState 
        title="Size not found" 
        subtitle="We couldn't find the size you're looking for." 
      />
    );
  }

  const formattedSize = {
    id: size.id,
    title: size.title,
    value: size.value,
  };

  return (
    <div>
      <Client initialData={formattedSize} />
    </div>
  );
};