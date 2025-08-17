import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import MenuView from './_modules/views/menu-view';

export default async function Page() {

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.categories.getAll.queryOptions()
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MenuView />
    </HydrationBoundary>
  );
}
