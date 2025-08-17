import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import CategoryView from './_modules/views/category-view';

interface PageProps {
  params: Promise<{ categorySlug: string }>;
}
export const dynamic = 'force-static';
export default async function Page({ params }: PageProps) {
  const { categorySlug } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.categories.getBySlug.queryOptions({categorySlug})
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoryView categorySlug={categorySlug} />
    </HydrationBoundary>
  );
}