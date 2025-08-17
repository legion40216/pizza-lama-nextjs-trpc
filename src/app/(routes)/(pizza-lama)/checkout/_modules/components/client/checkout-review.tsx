"use client"
import React from 'react';

import OrderSummary from './checkout-review/order-summary';
import CheckoutItem from './checkout-review/checkout-Item';
import { CartItemProps } from '@/hooks/useCartStore';

type CheckoutReviewProps = {
  items: CartItemProps[]
  totalPrice: number;
  goNext: () => void
  paymentMethod: "stripe" | "cod"
  setPaymentMethod: (method: "stripe" | "cod") => void
  itemsLenghtZero: boolean
};

export default function CheckoutReview({ 
  items, 
  totalPrice,
  goNext,
  paymentMethod,
  setPaymentMethod,
  itemsLenghtZero
}: CheckoutReviewProps) {
  
  return (
    <div>
      {/* PARENT CONTAINER */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* ITEMS CONTAINER */}
        <div className="lg:col-span-8 space-y-2">
          <div>
          {items.length === 0 ? (
          <p className="text-muted-foreground">Your cart is empty</p>
          ) : (
            <ul className="space-y-6">
              {items.map((item, index) => (
                <CheckoutItem 
                key={index} 
                id={item.id}
                title={item.title}
                description={item.description}
                price={item.price}
                size={item.selectedSize}
                image={item.image}
                count={item.count}
                />
              ))}
            </ul>
          )}
          </div>
        </div>

        {/* PAYMENT CONTAINER */}
        <div className="lg:col-span-4">
          <OrderSummary
            totalPrice={totalPrice}
            goNext={goNext}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            itemsLenghtZero={itemsLenghtZero}
          />
        </div>
      </div>
    </div>
  );
}