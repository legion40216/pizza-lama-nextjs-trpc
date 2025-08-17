"use client";
import React, { useEffect, useMemo, useState } from 'react'

import useCart from '@/hooks/useCartStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@/trpc/client';
import { toast } from 'sonner';

import { 
  CustomerInfoFormValues, 
  customerInfoSchema 
} from '@/schemas';

import CheckoutReview from './client/checkout-review';
import { CheckoutForm } from './client/checkout-form';
import { CheckoutSummary } from './client/checkout-summary';
import CheckoutConfirmation from './client/checkout-confirmation';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { format } from "date-fns";
import { formatter } from '@/utils/formatters';

const STEP_FLOW = [
  "checkout-review",
  "checkout-form", 
  "checkout-summary",
  "checkout-confirmation",
] as const;

type Step = typeof STEP_FLOW[number];

// Map each step to the corresponding field(s) to validate
const stepFieldMap: Record<Step, keyof CustomerInfoFormValues | (keyof CustomerInfoFormValues)[] | undefined> = {
  "checkout-review": undefined,
  "checkout-form": ["customerName", "email", "phone", "address", "city", "country", "postalCode"],
  "checkout-summary": undefined,
  "checkout-confirmation": undefined,
};

type TransformedOrder = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  postalCode: string;
  address: string;
  totalPrice: number;
  paymentMethod: string;
  createdAt: Date;
  orderItems: {
    id: string;
    count: number;
    price: number;
    product: {
      title: string;
      id: string;
    };
  }[];
};

export default function MultiStepCheckout() {
  const { items, removeAll } = useCart();
  const [step, setStep] = useState<Step>(STEP_FLOW[0]);
  const [isOrderPlaced, setIsOrderPlaced] = useState<boolean>(false);
  const [confirmedOrderData, setConfirmedOrderData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod"> ("stripe");

  const form = useForm<CustomerInfoFormValues>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
    },
  });

  const currentIndex = useMemo(() => STEP_FLOW.indexOf(step), [step]);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === STEP_FLOW.length - 1;
  const isSecondLast = currentIndex === STEP_FLOW.length - 2;
  const itemsLenghtZero = items.length === 0 ? true : false;

  // Check if cart is empty
  useEffect(() => {
    // Check if the cart is empty and the user is not on the checkout review step and the order has not been placed
    if (itemsLenghtZero && step !== "checkout-review" && !isOrderPlaced) {
      setStep("checkout-review");
      toast.error("Your cart is empty. Please add items before checkout.");
    }
  }, [itemsLenghtZero, step, isOrderPlaced]);

  const totalPrice = items.reduce(
    (total, item) => total + Number(item.price) * item.count,
    0
  );

  const goBack = () => {
    if (!isFirst) {
      setStep(STEP_FLOW[currentIndex - 1]);
    }
  };

  const handleNextOrSubmit = async () => {
    if (paymentMethod === "stripe") {
      return
    }
    
    const currentField = stepFieldMap[step];

    // If no validation needed for this step, just proceed
    if (!currentField) {
      if (!isSecondLast) {
        setStep(STEP_FLOW[currentIndex + 1]);
      }
      if(isSecondLast) {
        await handleSubmit(); // Add await
        return; // Don't continue navigation here
      }
      return;
    }

    // Validate current step fields
    const isValid = await form.trigger(currentField);
    if (isValid) {
      if (!isLast) {
        setStep(STEP_FLOW[currentIndex + 1]);
      }
    }
  };

  const toastLoading = "Processing your order...";
  const toastMessage = "Order placed successfully!";
  const createOrder = trpc.orders.create.useMutation({
    onSuccess: () => {
      toast.success(toastMessage);
      setStep("checkout-confirmation");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong.");
      console.error("Error creating order:", error);
    },
    onMutate: () => {
      toast.loading(toastLoading);
    },
    onSettled: () => {
      setIsOrderPlaced(true);
      removeAll();
      toast.dismiss();
      form.reset();
    },
  });

const handleSubmit = async () => {
  const data = form.getValues();
  const orderData = {
    ...data,
    items: items.map((item) => ({
      id: item.id,
      title: item.title,
      count: item.count,
      price: item.price,
    })),
    totalPrice,
    paymentMethod,
  };

  try {
    const response: { order: TransformedOrder } = await createOrder.mutateAsync(orderData);
    const { order } = response;
    
    const formattedOrders = {
      id: order.id,
      customerName: order.customerName,
      email: order.email,
      phone: order.phone,
      postalCode: order.postalCode,
      address: order.address,
      items: order.orderItems.map((item) => ({ // TypeScript now knows the type
        id: item.id,
        title: item.product.title,
        count: item.count,
        price: formatter.format(item.price),
      })),
      totalPrice: formatter.format(order.totalPrice),
      paymentMethod: order.paymentMethod,
      createdAt: format(order.createdAt, "MMMM do, yyyy"),
    };
    
    setConfirmedOrderData(formattedOrders);
  } catch (error) {
    console.error("Order creation failed:", error);
  }
};

  const getStepTitle = () => {
    switch (step) {
      case "checkout-review":
        return "Review Your Order";
      case "checkout-form":
        return "Customer Information";
      case "checkout-summary":
        return "Order Summary";
      case "checkout-confirmation":
        return "Order Confirmation";
      default:
        return "Checkout";
    }
  };

  const getButtonText = () => {
    switch (step) {
      case "checkout-review":
        return "Continue to Information";
      case "checkout-form":
        return "Continue to Summary";
      case "checkout-summary":
        return "Place Order";
      case "checkout-confirmation":
        return "Continue Shopping";
      default:
        return "Continue";
    }
  };

  return (
    <div>
      {/* Progress indicator */}
      <div className="mb-8">
        {!itemsLenghtZero && (
          <div className="flex items-center justify-between">
            {STEP_FLOW.map((stepName, index) => (
              <div
                key={stepName}
                className={`flex items-center ${
                  index < STEP_FLOW.length - 1 ? "flex-1" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>
                {index < STEP_FLOW.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      index < currentIndex ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold mb-6">{getStepTitle()}</h1>

      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-6">
            {step === "checkout-review" && (
              <CheckoutReview
                items={items}
                totalPrice={totalPrice}
                goNext={handleNextOrSubmit}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                itemsLenghtZero={itemsLenghtZero}
              />
            )}

            {step === "checkout-form" && <CheckoutForm form={form} />}

            {step === "checkout-summary" && (
              <CheckoutSummary
                items={items}
                totalPrice={totalPrice}
                customerInfo={form.getValues()}
              />
            )}

            {step === "checkout-confirmation" && confirmedOrderData && (
              <CheckoutConfirmation
                id={confirmedOrderData.id}
                customerName={confirmedOrderData.customerName}
                email={confirmedOrderData.email}
                phone={confirmedOrderData.phone}
                address={confirmedOrderData.address}
                items={confirmedOrderData.items}
                totalPrice={confirmedOrderData.totalPrice}
                paymentMethod={confirmedOrderData.paymentMethod}
                date={confirmedOrderData.createdAt}
              />
            )}
          </div>

          {/* Navigation buttons */}
          {step !== "checkout-review" && !itemsLenghtZero && (
            <div className="flex justify-between mt-8">
              {!isFirst && step !== "checkout-confirmation" && (
                <Button type="button" variant="outline" onClick={goBack}>
                  Back
                </Button>
              )}

              <div className="ml-auto">
                {step !== "checkout-confirmation" && (
                  <Button
                    type="button"
                    onClick={handleNextOrSubmit}
                    disabled={items.length === 0}
                  >
                    {getButtonText()}
                  </Button>
                )}
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}

