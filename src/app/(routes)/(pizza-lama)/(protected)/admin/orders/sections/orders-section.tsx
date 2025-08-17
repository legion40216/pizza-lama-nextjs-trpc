"use client";
import React, { Suspense } from 'react';

import { trpc } from '@/trpc/client';
import { ErrorBoundary } from 'react-error-boundary';

import EmptyState from '@/components/global-ui/empty-state';
import Client from '../components/client';
import { format } from "date-fns";
import { formatter } from '@/utils/formatters';
import { email } from 'zod';
import { OrderStatus } from '@/data/data';

export const OrdersSection = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={
        <EmptyState 
          title="Error loading orders" 
          subtitle="Please try again later." 
        />
        }>
        <OrdersSectionContent />
      </ErrorBoundary>
    </Suspense>
  );
};

const OrdersSectionContent = () => {
  const [data] = trpc.orders.getAll.useSuspenseQuery();
  const orders = data.orders
  
  const formattedData = orders.map((item) => {
    return {
      id: item.id,
      totalPrice: formatter.format(item.totalPrice),
      customerName: item.customerName,
      phone: item.phone,
      address: item.address,
      email: item.email,
      status: item.status as OrderStatus,
      isPaid: item.isPaid,
      paymentMethod: item.paymentMethod,
      products: item.orderItems.map(orderItem => ({
        id:    orderItem.productId,
        title: orderItem.product.title,
        count: orderItem.count
      })),
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    };
  });

  return (
    <Client 
      initialData={formattedData}
    />
  )
};
