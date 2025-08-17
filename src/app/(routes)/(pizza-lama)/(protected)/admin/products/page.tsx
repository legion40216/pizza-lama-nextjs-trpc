import React from "react";

import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { UserRole } from "@/data/data";
import { checkAccess } from "@/utils/checkAccess";

import EmptyState from "@/components/global-ui/empty-state";
import ProductsView from "./_modules/view/products-view";

export default async function Page() {
   const access = await checkAccess({ 
     allowedRoles: [UserRole.ADMIN, UserRole.MODERATOR]
   });

  if (!access.allowed) {
    return <EmptyState title="Unauthorized" subtitle={access.reason} />;
  }

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.products.getAll.queryOptions()
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsView />
    </HydrationBoundary>
  )
}