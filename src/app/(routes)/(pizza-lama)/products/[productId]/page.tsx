import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import ProductView from './_modules/views/product-view';

interface PageProps {
  params: Promise<{ productId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { productId } = await params;
  
  const queryClient = getQueryClient();
  
  // Wrap in try-catch to handle build-time failures gracefully
  try {
  await queryClient.prefetchQuery(
    trpc.products.getById.queryOptions({productId})
  );
  } catch (error) {
    // During build time, this might fail - that's okay
    // The client-side will fetch the data when needed
    console.warn('Failed to prefetch data during build:', error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductView productId={productId} />
    </HydrationBoundary>
  );
}
