import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import ProductView from './_modules/views/product-view';

interface PageProps {
  params: Promise<{ productId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { productId } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.products.getById.queryOptions({productId})
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductView productId={productId} />
    </HydrationBoundary>
  );
}
