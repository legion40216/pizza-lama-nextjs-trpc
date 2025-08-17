import React from 'react';

import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { formatter } from '@/utils/formatters';

type OrderSummaryProps = {
  totalPrice: number;
  goNext: () => void
  paymentMethod: "stripe" | "cod"
  setPaymentMethod: (method: "stripe" | "cod") => void
  itemsLenghtZero: boolean
};

export default function OrderSummary({ 
  totalPrice,
  goNext,
  paymentMethod,
  setPaymentMethod,
  itemsLenghtZero
}: OrderSummaryProps) {
 
  const handleClick = () =>{
    goNext();
    // onPaymentMethodSelect(paymentMethod)
  }

  return (
    <div className="rounded-lg bg-gray-50 px-4 py-6 sm:px-6 lg:col-span-5 lg:px-8">
      <h2 className="text-lg font-medium text-gray-900">
        Order Summary
      </h2>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t 
        border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">
            Order total
          </div>
          {formatter.format(totalPrice)}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-base font-medium text-gray-900 mb-4">
          Payment Method
        </h3>
        <RadioGroup 
        value={paymentMethod} 
        onValueChange={setPaymentMethod} 
        className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="stripe" id="stripe" />
            <Label htmlFor="stripe">Pay with Stripe</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cod" id="cod" />
            <Label htmlFor="cod">Cash on Delivery</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Button 
      onClick ={handleClick} 
      className ="w-full mt-6"
      disabled = {itemsLenghtZero}
      >
        {/* {paymentMethod === 'stripe' ? 'Pay with Stripe' : 
        'Proceed to Cash on Delivery'} */}
        Proceed to Payment
      </Button>
    </div>
  );
}
