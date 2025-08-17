"use client";
import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import ProductCard from "@/components/global-ui/product-card";

interface FeaturedCarsoselProps {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  discount: number;
  isNew: boolean;
}

export function FeaturedCarsosel({
  data,
}: {
  data: FeaturedCarsoselProps[];
}) {
  return (
    <div className="-ml-3">
      <Carousel className="max-w-screen w-full">
        <CarouselContent className="p-2">
          {data.map((item, index) => (
            <CarouselItem
              key={index}
              className="basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <ProductCard
                id={item.id}
                title={item.title}
                description={item.description}
                price={item.price}
                image={item.image}
                discount={item.discount}
                isNew={item.isNew}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <>
          <CarouselPrevious className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2" />
          <CarouselNext className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2" />
        </>
      </Carousel>
    </div>
  );
}

export default FeaturedCarsosel;
