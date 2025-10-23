"use client";
import React, { useState, useEffect, useMemo } from "react";
import { formatter } from "@/utils/formatters";
import { Minus, Plus, X } from "lucide-react";
import useCart from "@/hooks/useCartStore";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type ProductProps = {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  discount: number;
  inStock: boolean;
  sizes: {
    label: any;
    priceModifier: string;
  }[];
};

type PizzaSize = "Small" | "Medium" | "Large";

export default function ProductDetails({
  id,
  title,
  description,
  image,
  price,
  discount,
  inStock,
  sizes,
}: ProductProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {items, addItem, getItemCount, updateItemCount, removeItem} = useCart();
  
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [cartQuantity, setCartQuantity] = useState(0);
  
  // Local state for optimistic UI updates
  const [selectedSize, setSelectedSize] = useState<PizzaSize | null>(null);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      toast.error("Quantity cannot be less than 1.");
      return;
    }

    setSelectedQuantity(newQuantity);

    if (cartQuantity > 0) {
      updateItemCount(id, activeSize, newQuantity);
    }
  };

  // Handle adding/removing items from cart
  const handleCartAction = () => {
    if (cartQuantity > 0) {
      removeItem(id, activeSize);
    } else {
      addItem(
        {
          id,
          title,
          image,
          description,
          discount,
          inStock,
          selectedSize: activeSize,
          price: finalPrice.final,
          sizes: sizes.map((size) => ({
            ...size,
            priceModifier: Number(size.priceModifier),
          })),
        },
        selectedQuantity
      );
    }
  };

  // Handle size selection with optimistic update
  const handleSizeChange = (size: PizzaSize) => {
    // Instant UI update
    setSelectedSize(size);

    // Update URL in background
    const params = new URLSearchParams(searchParams.toString());
    params.set("size", size);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Compute active size (prioritize local state for instant feedback)
  const activeSize = useMemo((): PizzaSize | null => {
    // Use local state first (optimistic update)
    if (selectedSize) return selectedSize;
    
    // Fallback to URL
    const sizeFromUrl = searchParams.get("size") as PizzaSize | null;
    
    // No sizes available
    if (sizes.length === 0) return null;
    
    // Valid URL size
    if (sizeFromUrl && sizes.some((size) => size.label === sizeFromUrl)) {
      return sizeFromUrl;
    }
    
    // Default to first size
    return sizes[0]?.label || null;
  }, [selectedSize, searchParams, sizes]);

  // Initialize URL with default size on mount
  useEffect(() => {
    if (sizes.length > 0 && !searchParams.get("size")) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("size", sizes[0].label);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [sizes, searchParams, pathname, router]);

  // Update cart quantities when activeSize changes
  useEffect(() => {
    const currentCartQuantity = getItemCount(id, activeSize);
    setCartQuantity(currentCartQuantity);
    setSelectedQuantity(currentCartQuantity > 0 ? currentCartQuantity : 1);
  }, [id, items, activeSize, getItemCount]);

  // Calculate final price based on selected size and discount
  const finalPrice = useMemo(() => {
    // Clean and parse the base price
    const cleanBasePrice = price.replace(/[^\d.]/g, "");
    const basePrice = Number(cleanBasePrice);

    let final = basePrice;
    let finalWithoutDiscount = 0;

    // Only apply size modifier if sizes exist and a size is selected
    if (sizes.length > 0 && activeSize) {
      const selectedSizeData = sizes.find(
        (size) => size.label === activeSize
      );

      if (selectedSizeData) {
        // Clean and parse the size modifier
        const cleanSizePriceModifier = selectedSizeData.priceModifier.replace(/[^\d.]/g, "");
        const sizePriceModifier = Number(cleanSizePriceModifier);
        
        if (sizePriceModifier > 0) {
          final = sizePriceModifier;
        }
      }
    }

    // Apply discount if it exists
    if (discount > 0) {
      finalWithoutDiscount = final;
      const discountAmount = (final * discount) / 100;
      final = final - discountAmount;
    }

    return {
      final,
      finalWithoutDiscount
    };
  }, [activeSize, price, discount, sizes]);

  return (
    <div>
      {/* Price and Discount */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">
            {formatter.format(finalPrice.final)}
          </span>
          {discount > 0 && (
            <Badge
              className="text-md px-2 py-0.5 
            bg-pizza-store-primary"
            >
              -{discount}%
            </Badge>
          )}
        </div>
        {discount > 0 && (
          <span className="text-sm line-through text-muted-foreground">
            {formatter.format(finalPrice.finalWithoutDiscount)}
          </span>
        )}
      </div>

      {/* Stock Status */}
      <div>
        {inStock ? (
          <p className="text-muted-foreground text-sm">In stock</p>
        ) : (
          <p className="text-red-500 text-sm">Out of stock</p>
        )}
      </div>

      {/* Size Selection - Only show if sizes exist */}
      {sizes.length > 0 && (
        <div className="flex gap-4 mt-4">
          {sizes.map((size) => (
            <Button
              key={size.label}
              disabled={activeSize === size.label}
              onClick={() => handleSizeChange(size.label as PizzaSize)}
              className={`${
                activeSize === size.label
                  ? "bg-pizza-store-primary text-white hover:bg-pizza-store-primary/90 border border-pizza-store-primary"
                  : "text-pizza-store-primary border border-pizza-store-primary hover:text-pizza-store-primary"
              }`}
              variant={activeSize === size.label ? "default" : "outline"}
              size="sm"
            >
              {size.label}
            </Button>
          ))}
        </div>
      )}

      {/* Quantity & Cart */}
      <div className="flex flex-col sm:flex-row justify-start gap-4 mt-4">
        {/* Quantity Selector */}
        <div className="flex items-center border rounded-md justify-between">
          <Button
            className="text-pizza-store-primary 
            hover:text-pizza-store-primary"
            variant="ghost"
            size="icon"
            onClick={() => handleQuantityChange(selectedQuantity - 1)}
            disabled={selectedQuantity <= 1}
          >
            <Minus className="size-4" />
          </Button>
          <span className="px-3 text-pizza-store-primary">
            {selectedQuantity}
          </span>
          <Button
            className="text-pizza-store-primary 
            hover:text-pizza-store-primary"
            variant="ghost"
            size="icon"
            onClick={() => handleQuantityChange(selectedQuantity + 1)}
          >
            <Plus className="size-4" />
          </Button>
        </div>

        {/* Add to Cart Button */}
        <Button
          className="bg-pizza-store-primary 
          hover:bg-pizza-store-primary/90 flex-1 md:max-w-[55%]"
          onClick={handleCartAction}
          disabled={!inStock}
          variant={cartQuantity > 0 ? "destructive" : "default"}
        >
          <span className="flex items-center gap-2">
            {cartQuantity > 0 ? (
              <>
                <X className="size-5" />
                Remove from cart
              </>
            ) : (
              <>Add to cart</>
            )}
          </span>
        </Button>
      </div>
    </div>
  );
}