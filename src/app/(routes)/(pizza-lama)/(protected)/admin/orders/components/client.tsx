"use client"
import React from 'react'

import { DataTable } from '@/components/global-ui/data-table'
import { columns } from './client/columns'
import { OrderStatus } from '@/data/data';

export type OrdersProps = {
  id: string;
  totalPrice: string;
  status: OrderStatus
  isPaid: boolean;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  products: { id: string; title: string; count: number }[];
  createdAt: string;
  paymentMethod: string
};

type Props = {
  initialData: OrdersProps[];
};

export default function Client({ initialData }: Props) {
  return (
    <div>
      <DataTable 
        columns={columns} 
        data={initialData} 
        searchKey="id" 
      />
    </div>
  );
}
