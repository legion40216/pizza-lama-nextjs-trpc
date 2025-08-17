"use client"
import React from 'react'

import { DataTable } from '@/components/global-ui/data-table'
import { columns } from './client/columns'

export type SizeAdmin = {
  id: string;
  title: string;
  value: string;
  createdAt: string;
};

type Props = {
  initialData: SizeAdmin[];
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
