// CheckoutSummary.tsx
"use client";
import React from 'react';
import { CustomerInfoFormValues } from '@/schemas';
import { CartItemProps } from '@/hooks/useCartStore';
import { X } from 'lucide-react';
import { formatter } from '@/utils/formatters';
import { Separator } from '@/components/ui/separator';

type CheckoutSummaryProps = {
  items: CartItemProps[];
  totalPrice: number;
  customerInfo: CustomerInfoFormValues;
};

export function CheckoutSummary({ 
  items, 
  totalPrice, 
  customerInfo 
}: CheckoutSummaryProps) {
  return (
    <div className="grid md:grid-cols-2 md:gap-8 space-y-4">
      {/* Customer Information */}
      <div>
        <h3 className="font-medium mb-3">Shipping Information</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="space-y-1 text-sm">
            <p className="font-medium">{customerInfo.customerName}</p>
            <p>{customerInfo.email}</p>
            <p>{customerInfo.phone}</p>
            <p>{customerInfo.address}</p>
            <p>
              {customerInfo.city}, {customerInfo.country}{" "}
              {customerInfo.postalCode}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className='space-y-4'>
        <h3 className="font-medium mb-2">Order Items:</h3>
        <ul className="space-y-6">
          {items.map((item, index) => (
            <li key={index} className="flex justify-between items-center">
              <div>
                <span>{item.title}</span>
                {item.selectedSize && (
                  <p className="text-sm text-muted-foreground">
                    Size: {item.selectedSize}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-end gap-1">
                  <span>{formatter.format(item.price)}</span>
                  <X className="size-2" />
                  <span>{item.count}</span>
                </div>

                <p className="text-sm text-muted-foreground">
                  ${Number(item.price).toFixed(2)} each
                </p>
              </div>
            </li>
          ))}
        </ul>

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-lg font-bold">${totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}