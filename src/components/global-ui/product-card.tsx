import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Product } from "./product-list";

export default function ProductCard({
  id,
  title,
  description,
  price,
  image,
  discount,
  isNew,
}: Product) {
  return (
    <div className="group h-full">
      <Link 
        href={`/products/${id}`}
        className="block h-full"
      >
        <div className="flex flex-col group h-full overflow-hidden 
        transition-all duration-300 rounded-lg border 
        group-hover:ring-2 group-hover:ring-offset-3 
        group-hover:ring-pizza-store-primary"
        >
          {/* Product Image Container */}
          <div className="relative w-full aspect-square">
            <Image 
            src={image} 
            alt={title} 
            fill 
            className="object-contain" 
            />

            <div className="flex items-center gap-2 absolute 
            top-2 right-2 z-20"
            >
              {discount > 0 && (
                <Badge className="bg-pizza-store-primary 
                text-pizza-store-primary-foreground
                text-sm
                "
                >
                  {discount}%
                </Badge>
              )}
              {isNew && (
                <Badge className="bg-pizza-store-primary text-pizza-store-primary-foreground
                text-sm"
                >
                  NEW
                </Badge>
              )}
            </div>

            {/* Overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t 
            from-black/20 via-transparent to-transparent 
            opacity-0 group-hover:opacity-100 transition-opacity 
            duration-300"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col space-y-4 justify-between p-4">
            <div>
              <h2 className="font-semibold text-lg 
              group-hover:text-pizza-store-primary 
              group-hover:underline transition-colors"
              >
                {title}
              </h2>

              <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            {/* Add to Cart Button */}
            <div className="grid gap-2">
              <p className="font-semibold">{price}</p>
              <Button
                className="bg-pizza-store-primary 
                hover:bg-pizza-store-primary/90 
                text-pizza-store-primary-foreground"
                size="sm"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
