import React from "react";

import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import HomeView from "./_modules/views/home-view";
export const dynamic = 'force-static';
export default async function Page() {

    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(
      trpc.products.getAll.queryOptions()
    );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeView />
    </HydrationBoundary>
  )
}