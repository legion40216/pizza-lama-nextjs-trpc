import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import MenuView from './_modules/views/menu-view';

export default async function Page() {

  const queryClient = getQueryClient();

    // Wrap in try-catch to handle build-time failures gracefully
    try {
  await queryClient.prefetchQuery(
    trpc.categories.getAll.queryOptions()
  );

    } catch (error) {
      // During build time, this might fail - that's okay
      // The client-side will fetch the data when needed
      console.warn('Failed to prefetch data during build:', error);
    }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MenuView />
    </HydrationBoundary>
  );
}
