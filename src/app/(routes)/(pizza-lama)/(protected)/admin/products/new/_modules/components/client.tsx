// Client.tsx
"use client";
import React from "react";
import ProductForm from "./client/product-form";

export type ProductFormProps = {
  categories: { 
    id: string; 
    title: string; 
    value: string; 
    label: string; 
  }[];
  sizes: { 
    id: string; 
    title: string; 
    value: string; 
    label: string; 
  }[];
};
type ClientProps = {
  initialData: ProductFormProps;
};

export default function Client({ initialData }: ClientProps) {
  return (
    <div>
      <ProductForm 
        categories={initialData.categories}
        sizes={initialData.sizes}
      />
    </div>
  );
}
