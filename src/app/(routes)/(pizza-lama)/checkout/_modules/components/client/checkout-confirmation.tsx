import React, { useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

import { CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

type CheckoutConfirmationProps = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: { 
    id: string; 
    title: string; 
    count: number; 
    price: string
  }[];
  totalPrice: string;
  paymentMethod: ["stripe" | "cod"];
  date: string;
}

export default function CheckoutConfirmation ({ 
  id,
  customerName,
  email,
  phone,
  address,
  items, 
  totalPrice, 
  paymentMethod,
  date
 }: CheckoutConfirmationProps) {
  const router = useRouter();

  // Confetti
  useEffect(() => {
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
  
    confetti({
      particleCount: 100,
      origin: { x: 0.5, y: 0.5 },
      ...defaults,
    });
  }, []);

  const totalItemsCount = items.reduce((total, item) => {
  return total + item.count;
}, 0);

  return (
    <div className="max-w-3xl text-center mx-auto space-y-6">
      <div className="flex justify-center">
        <CheckCircle className="w-16 h-16 text-green-600" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-green-600">Order Confirmed!</h2>
        <p className="text-muted-foreground">
          Thank you for your order. We've received your payment and will process
          your order shortly.
        </p>
      </div>

      {/* Order Details */}
      <div className="bg-gray-50 p-6 rounded-lg text-left 
      max-w-md mx-auto"
      >
        <h3 className="font-semibold mb-3">Order Details</h3>
        <div className="space-y-8 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
            <span>Order ID:</span>
            <span className="font-mono">{id}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Amount:</span>
            <span className="font-semibold">
              {totalPrice}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Items:</span>
            <span>{totalItemsCount} item(s)</span>
          </div>
          <div>
            {items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="font-medium">
                  {item.title} x {item.count}
                </span>
                <span>{parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.count}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <span>Order Date:</span>
            <span>{date}</span>
          </div>
          </div>

          <div className="flex justify-between">
            <span>Payment Method:</span>
            <span>{paymentMethod ? "Cash on Delivery" : "Stripe"}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg text-left 
      max-w-md mx-auto"
      >
        <h3 className="font-semibold mb-3">Shipping Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Name:</span>
            <span>{customerName}</span>
          </div>
          <div className="flex justify-between">
            <span>Email:</span>
            <span>{email}</span>
          </div>
          <div className="flex justify-between">
            <span>Phone:</span>
            <span>{phone}</span>
          </div>
          <div className="flex justify-between">
            <span>Address:</span>
            <span>{address}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm text-muted-foreground">
        <p>
          A confirmation email has been sent to{" "}
          <span className="font-medium">{email}</span>
        </p>
        <p>
          You can track your order status in your account or contact our support
          team if you have any questions.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Button
          onClick={() => {
            router.push("/");
          }}
          variant="outline"
        >
          Continue Shopping
        </Button>
        <Button
          onClick={() => {
            router.push("/orders");
          }}
        >
          Track Order
        </Button>
      </div>
    </div>
  );
}