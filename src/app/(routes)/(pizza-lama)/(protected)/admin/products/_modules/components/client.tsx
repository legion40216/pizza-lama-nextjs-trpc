"use client"
import React from 'react'

import { DataTable } from '@/components/global-ui/data-table'
import { columns } from './client/columns'

export type ProductsAdmin = {
  id: string;
  title: string;
  price: string;
  descr: string;
  discount: number;
  category: string;
  isFeatured: boolean;
  isArchived: boolean;
  isNew: boolean
  inStock: boolean;
  createdAt: string;
};

type Props = {
  initialData: ProductsAdmin[];
};

export default function Client({ initialData }: Props) {
  return (
    <div>
      <DataTable 
        columns={columns} 
        data={initialData} 
        searchKey="title" 
      />
    </div>
  );
}
