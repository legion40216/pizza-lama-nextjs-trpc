import React from 'react'

import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { checkAccess } from '@/utils/checkAccess';
import { UserRole } from '@/data/data';
import EmptyState from '@/components/global-ui/empty-state';
import CategoryView from './_modules/view/category-view';

interface PageProps {
  params: Promise<{
    categoryId: string;
  }>;
}
export const dynamic = 'force-static';
export default async function Page({ params }: PageProps) {
    const { categoryId } = await params;
    
    const access = await checkAccess({ 
      allowedRoles: [UserRole.ADMIN, UserRole.MODERATOR] 
    });
  
    if (!access.allowed) {
      return <EmptyState 
        title="Unauthorized" 
        subtitle={access.reason} 
      />;
    }

    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(
      trpc.categories.getById.queryOptions({categoryId})
    );
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoryView categoryId={categoryId}/>
    </HydrationBoundary>
  )
}
