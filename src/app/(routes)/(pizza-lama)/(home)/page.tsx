import React from "react";

import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import HomeView from "./_modules/views/home-view";

export default async function Page() {
  const queryClient = getQueryClient();
  
  // Wrap in try-catch to handle build-time failures gracefully
  try {
    await queryClient.prefetchQuery(
      trpc.products.getAll.queryOptions()
    );
  } catch (error) {
    // During build time, this might fail - that's okay
    // The client-side will fetch the data when needed
    console.warn('Failed to prefetch data during build:', error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeView />
    </HydrationBoundary>
  )
}