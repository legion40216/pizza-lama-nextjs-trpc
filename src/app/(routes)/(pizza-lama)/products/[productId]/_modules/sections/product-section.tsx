'use client';
import React, { Suspense } from 'react';

import Image from "next/image";
import { trpc } from '@/trpc/client';
import { formatter } from '@/utils/formatters';
import { ErrorBoundary } from 'react-error-boundary';

import EmptyState from '@/components/global-ui/empty-state';
import ProductDetails from '../components/product-details';
import { ProductIdProps } from '../views/product-view';
import { Badge } from '@/components/ui/badge';


export const ProductSection = ({ productId }: ProductIdProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={
        <EmptyState 
        title="Error loading products" 
        subtitle="Please try again later." 
        />
        }>
        <ProductSectionContent productId={productId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const ProductSectionContent = ({ productId }: ProductIdProps) => {
  const [data] = trpc.products.getById.useSuspenseQuery({productId});
  const product = data.product;

  if (!product) {
    return (
      <EmptyState 
        title="No product found"
        subtitle="The product you're looking for doesn't exist."
      /> 
    )
  }

  const formattedProduct = {
    id: product.id,
    title: product.title,
    description: product.descr,
    image: product.imgSrc,
    price: formatter.format(product.price),
    discount: product.discount,
    inStock: product.inStock,
    isNew: product.isNew,
    sizes: product.sizes.map((s) => ({
      label: s.size.title,
      priceModifier: formatter.format(s.price),
    })),
  }

  return (
    <div className="min-h-[calc(100vh-241px)] grid place-item-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Image */}
        <div className="flex items-center justify-center">
          <div className="relative aspect-square w-[70%]">
            <Image
              src={formattedProduct.image}
              alt={formattedProduct.title}
              fill
              className="object-cover"
            />
            <>
            {formattedProduct.isNew &&
            <Badge className="absolute top-2 right-2 z-20 
            bg-pizza-store-primary text-pizza-store-primary-foreground
            text-sm
            "
            >
              New!
            </Badge>
            }
            </>
          </div>
        </div>

        {/* Details */}
        <div className="flex justify-center md:items-center md:justify-start">
          <div className="space-y-4">
            {/* Title and Description */}
            <div className="space-y-2">
              <p className="text-sm text-orange-500 font-semibold uppercase">
                Pizza Store
              </p>
              <h1 className="text-4xl font-bold text-pizza-store-primary">
                {formattedProduct.title}
              </h1>
              <p className="text-muted-foreground">{formattedProduct.description}</p>
            </div>
            {/* Product Action */}
              <ProductDetails  
                id={formattedProduct.id}
                title={formattedProduct.title}
                description={formattedProduct.description}
                price={formattedProduct.price}
                image={formattedProduct.image}
                discount={formattedProduct.discount}
                inStock={formattedProduct.inStock}
                sizes={formattedProduct.sizes}
              />
          </div>
        </div>
      </div>
    </div>
  );
};
