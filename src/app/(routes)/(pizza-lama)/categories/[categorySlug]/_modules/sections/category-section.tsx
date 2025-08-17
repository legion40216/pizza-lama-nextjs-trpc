'use client';
import React, { Suspense } from 'react';
import { trpc } from '@/trpc/client';
import { ErrorBoundary } from 'react-error-boundary';
import Link from 'next/link';
import { formatter } from '@/utils/formatters';
import Image from 'next/image';

import EmptyState from '@/components/global-ui/empty-state';
import { Button } from '@/components/ui/button';
import { categorySlugProps } from '../views/category-view';

export const CategorySection = ({categorySlug}: categorySlugProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={
        <EmptyState 
        title="Error loading category" 
        subtitle="Please try again later." 
        />
        }>
        <CategorySectionContent categorySlug = {categorySlug}/>
      </ErrorBoundary>
    </Suspense>
  );
};

const CategorySectionContent = ({categorySlug}: categorySlugProps) => {
  const [data] = trpc.categories.getBySlug.useSuspenseQuery({categorySlug});
  const category = data.category;
  
  if (!category) {
    return (
      <EmptyState 
      title="Category not found" 
      subtitle="We couldn't find the category you're looking for." 
      />
    );
  }

  const formattedProducts = category.products.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.descr,  
    image: item.imgSrc,       
    price: formatter.format(item.price)
,
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
    lg:grid-cols-4"
    >
      {formattedProducts.map((item) => (
        <div
          key={item.id}
          className="border-2
          border-pizza-store-primary p-4 no-underline"
        >
          <div className="flex flex-col 
          justify-between h-full space-y-4"
          >
            {/* Product Image and Details */}
            <div className="space-y-4 group">
              {/* Product Image Container */}
              <Link 
              href={`/products/${item.id}`} 
              className="block"
              >
                <div className="relative w-full aspect-square">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>

              {/* Product Details */}
              <div className="space-y-1">
                <Link 
                href={`/product/${item.id}`} 
                className="block"
                >
                  <h2 className="font-semibold text-lg 
                  group-hover:text-pizza-store-primary 
                  group-hover:underline transition-colors"
                  >
                    {item.title}
                  </h2>
                </Link>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Product Price and Add to Cart Button */}
            <div className="flex items-center justify-between">
              <p className="font-semibold">{item.price}</p>

              <Button className="bg-pizza-store-primary 
              hover:bg-pizza-store-primary/90 text-white"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
