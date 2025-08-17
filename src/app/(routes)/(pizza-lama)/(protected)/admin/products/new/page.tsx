import React from 'react'

import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { checkAccess } from '@/utils/checkAccess';
import { UserRole } from '@/data/data';

import EmptyState from '@/components/global-ui/empty-state';
import ProductView from './_modules/view/product-view';

export default async function Page() {
    const access = await checkAccess({ 
      allowedRoles: [UserRole.ADMIN, UserRole.MODERATOR] 
    });
  
    if (!access.allowed) {
      return <EmptyState title="Unauthorized" subtitle={access.reason} />;
    }

    const queryClient = getQueryClient();
    await Promise.all([
      queryClient.prefetchQuery(trpc.sizes.getAll.queryOptions()),
      queryClient.prefetchQuery(trpc.categories.getAll.queryOptions())
    ]);
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductView />
    </HydrationBoundary>
  )
}
