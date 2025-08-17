"use client";
import React from "react";
import ProductForm from "./client/product-form";

export type formattedDataProps = {
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

export type initialDataProps = {
    id: string;
    title: string;
    descr: string;
    imgSrc: string;
    price: string;
    isFeatured: boolean;
    isArchived: boolean;
    isNew: boolean;
    inStock: boolean;
    discount: number;
    catSlug: string;
    stock: number;
    sizes: {
      sizeId: string;
      price: string;
      stock: number;
    }[];
};

type ClientProps = {
  formattedData: formattedDataProps;
  initialData: initialDataProps;
};

export default function Client({ formattedData, initialData }: ClientProps) {
  return (
    <div>
      <ProductForm
        {...initialData}
        categories={formattedData.categories}
        sizeOptions={formattedData.sizes}
      />
    </div>
  );
}
