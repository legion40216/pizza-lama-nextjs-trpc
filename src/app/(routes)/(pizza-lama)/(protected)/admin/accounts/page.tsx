import React from "react";

import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { UserRole } from "@/data/data";
import { checkAccess } from "@/utils/checkAccess";

import EmptyState from "@/components/global-ui/empty-state";
import AccountsView from "./_modules/view/accounts-view";
export const dynamic = 'force-static';
export default async function Page() {
  const access = await checkAccess({ allowedRoles: [UserRole.ADMIN] });

  if (!access.allowed) {
    return <EmptyState title="Unauthorized" subtitle={access.reason} />;
  }

  const queryClient = getQueryClient();
  
  // Prefetch both queries in parallel
  await Promise.all([
    queryClient.prefetchQuery(trpc.users.getAll.queryOptions()),
    queryClient.prefetchQuery(trpc.users.getCurrentById.queryOptions())
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AccountsView/>
    </HydrationBoundary>
  )
}

