"use client"
import React from 'react'

import { DataTable } from '@/components/global-ui/data-table'
import { columns } from './client/columns'

export type OrdersProps = {
  id: string;
  totalPrice: string;
  status: string;
  products: { id: string; title: string; count: number }[];
  createdAt: string;
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
