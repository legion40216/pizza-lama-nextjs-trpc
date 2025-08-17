"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";

import CellLinks from "@/components/global-ui/cell-links";
import { Badge } from "@/components/ui/badge";
import { OrdersProps } from "../client";

export const columns: ColumnDef<OrdersProps>[] = [
  {
    accessorKey: "id",
    header: "OrderID",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">
        <CellLinks 
          dataId={row.original.id} 
          dataLabel={row.getValue("id")} 
        />
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => {
      const products =
        row.getValue<Array<{ 
          id: string; 
          title: string; 
          count: number 
        }>>(
          "products"
        );
      return (
        <div className="flex gap-2">
          {products.map((product) => (
            <Badge key={product.id}>
              <span>{`${product.title} (${product.count})`}</span>
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
