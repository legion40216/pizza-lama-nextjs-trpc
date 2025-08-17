import React from "react";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { UserRole } from "@/data/data";
import { checkAccess } from "@/utils/checkAccess";

import EmptyState from "@/components/global-ui/empty-state";
import ProductView from "./_modules/view/product-view";

interface PageProps {
  params: Promise<{
    productId: string;
  }>;
}
export const dynamic = 'force-static';
export default async function EditProductPage({ params }: PageProps) {
  const { productId } = await params;

  const access = await checkAccess({
    allowedRoles: [UserRole.ADMIN, UserRole.MODERATOR],
  });

  if (!access.allowed) {
    return (
      <EmptyState title="Unauthorized" subtitle={access.reason} />
    );
  }

    const queryClient = getQueryClient();
    await Promise.all([
      queryClient.prefetchQuery(trpc.sizes.getAll.queryOptions()),
      queryClient.prefetchQuery(trpc.categories.getAll.queryOptions()),
      queryClient.prefetchQuery(trpc.products.getById.queryOptions({ productId }))
    ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductView productId={productId} />
    </HydrationBoundary>
  );
}
