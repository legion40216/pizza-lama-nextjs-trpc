import React from "react";
import ProductCard from "./product-card";
import EmptyState from "./empty-state";

export type Product = {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  isNew: boolean;
  discount: number;
};

interface ProductListProps {
  initialData: Product[];
}

export default function ProductList({ initialData }: ProductListProps) {
  return (
    <div>
      {initialData.length > 0 ? (
        <div className="grid  sm:grid-cols-2 gap-3 
        md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]"
        >
          {initialData.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
