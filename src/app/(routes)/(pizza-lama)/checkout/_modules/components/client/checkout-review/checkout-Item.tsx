"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { formatter } from "@/utils/formatters";
import useCart from "@/hooks/useCartStore";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type CheckoutItemProps = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  size: "Small" | "Medium" | "Large" | null;
  count: number;
};

export default function CheckoutItem({
  id,
  title,
  description,
  price,
  image,
  size,
  count,
}: CheckoutItemProps) {
  const { removeItem, updateItemCount } = useCart();
  const [cartQuantity, setCartQuantity] = useState<number>(count);

  const handleRemove = () => {
    removeItem(id, size);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      toast.error("Quantity cannot be less than 1.");
      return;
    }

    setCartQuantity(newQuantity);

    if (cartQuantity > 0) {
      updateItemCount(id, size, newQuantity);
    }
  };

  return (
    <li className="flex gap-2 group">
      {/* PRODUCT IMAGE */}
      <Link
        href={`/products/${id}`}
        className="group-hover block relative overflow-hidden rounded-md border
        border-gray-200 aspect-square w-[28%]"
      >
        <Image 
        src={image} 
        alt={title} 
        fill 
        className="object-cover" 
        />
      </Link>

      {/* PRODUCT DETAILS */}
      <div className="flex flex-col justify-between w-full">
        <div className="flex items-start justify-between gap-4">
          <Link 
          href={`/products/${id}`}
          className=" block underline 
          group-hover:text-pizza-store-primary"
          >
            <h3 className="font-bold">{title}</h3>
          </Link>


          <div className="flex flex-col items-end space-y-1">
            <div
              className="flex items-center space-x-2 
              text-sm text-muted-foreground"
            >
              {formatter.format(price)}
              <X className="h-2 w-2" />
              <span>{count}</span>
            </div>
            <Badge className="font-semibold" variant="secondary">
              {formatter.format(price * count)}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            {size && <p className="text-xs text-muted-foreground">{size}</p>}
            <p className="text-xs text-muted-foreground">{description}</p>


            <div className="flex items-center border rounded-md w-max">
              <Button
                className=""
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(cartQuantity - 1)}
                disabled={cartQuantity <= 1}
              >
                <Minus className="size-4" />
              </Button>
              <span className="px-3 ">{cartQuantity}</span>
              <Button
                className=""
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(cartQuantity + 1)}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>

          <Button
            className="text-red-600 hover:text-red-600"
            variant="ghost"
            onClick={handleRemove}
          >
            <Trash2 className="size-4 mr-2" />
            Remove
          </Button>
        </div>
      </div>
    </li>
  );
}
