import React from 'react';

import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
;
import { checkAccess } from '@/utils/checkAccess';
import { UserRole } from '@/data/data';

import EmptyState from '@/components/global-ui/empty-state';
import SizeView from './_modules/view/size-view';

interface PageProps {
  params: Promise<{
    sizeId: string;
  }>;
}

export default async function EditSizePage({ params }: PageProps) {
  const { sizeId } = await params;
  
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
    trpc.sizes.getById.queryOptions({ sizeId })
  );
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SizeView sizeId={sizeId} />
    </HydrationBoundary>
  );
}