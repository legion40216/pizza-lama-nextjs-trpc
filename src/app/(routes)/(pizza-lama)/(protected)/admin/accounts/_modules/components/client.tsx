"use client"
import React from 'react'

import { DataTable } from '@/components/global-ui/data-table'
import { columns } from './client/columns'

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
  createdAt: string | Date;
};

type Props = {
  initialData: User[];
};

export default function Client({ initialData }: Props) {
  return (
    <div>
      <DataTable 
        columns={columns} 
        data={initialData} 
        searchKey="email" 
      />
    </div>
  );
}
