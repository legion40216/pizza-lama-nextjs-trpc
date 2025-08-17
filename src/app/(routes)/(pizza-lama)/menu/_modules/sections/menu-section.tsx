'use client';
import React, { Suspense } from 'react';
import { trpc } from '@/trpc/client';
import { ErrorBoundary } from 'react-error-boundary';
import Link from 'next/link';

import EmptyState from '@/components/global-ui/empty-state';
import { Button } from '@/components/ui/button';

export const MenuSection = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={
        <EmptyState 
        title="Error loading menus" 
        subtitle="Please try again later." 
        />
        }>
        <MenuSectionContent />
      </ErrorBoundary>
    </Suspense>
  );
};

const MenuSectionContent = () => {
  const [data] = trpc.categories.getAll.useSuspenseQuery();
  const categories = data.categories;

  const formattedCategories = categories.map((item) => ({
    id: item.id,
    title: item.title,
    discription: item.descr,
    bgImage: item.imgSrc,
    slug: item.slug,
  }));

  return (
    <div className="grid md:place-items-center md:h-[calc(100vh-241px)]">
      {/*Menu*/}
      <div className="grid grid-cols-1 md:grid-cols-3
       h-1/2 w-full"
      >
        {formattedCategories.map((item) => (
          <Link key={item.id} href={`/categories/${item.slug}`}>
            <div
              className="p-4 bg-cover h-full flex flex-col justify-between"
              style={{ backgroundImage: `url(${item.bgImage})` }}
            >
              <div>
                <h1 className="text-2xl font-bold">{item.title}</h1>
                <p className="max-w-[200px] truncate">{item.discription}</p>
              </div>
              <div>
                <Button
                  className="bg-pizza-store-primary
                  hover:bg-pizza-store-primary/90 text-white
                  flex items-center justify-center gap-2 text-xs"
                  size={"sm"}
                >
                  <span>Explore</span>
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
