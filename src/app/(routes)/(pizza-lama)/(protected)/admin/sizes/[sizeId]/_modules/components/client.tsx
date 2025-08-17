"use client";
import React from 'react';
import SizeForm from './client/size-form';

export type initialDataProps = {
  id: string;
  title: string;
  value: string;
};

type ClientProps = {
  initialData: initialDataProps;
};

export default function Client({ initialData }: ClientProps) {
  return (
    <div>
      <SizeForm
        id={initialData.id}
        title={initialData.title}
        value={initialData.value}
      />
    </div>
  );
}