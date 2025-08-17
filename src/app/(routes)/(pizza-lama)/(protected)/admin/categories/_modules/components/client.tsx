"use client"
import React from 'react'

import { DataTable } from '@/components/global-ui/data-table'
import { columns } from './client/columns'

export type CategoriesAdmin = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  descr: string;
  imgSrc: string;
  slug: string;
};

type Props = {
  initialData: CategoriesAdmin[];
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
