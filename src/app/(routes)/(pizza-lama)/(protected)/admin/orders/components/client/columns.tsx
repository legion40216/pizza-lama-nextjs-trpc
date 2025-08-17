"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";

import CellLinks from "@/components/global-ui/cell-links";
import { Badge } from "@/components/ui/badge";
import { OrdersProps } from "../client";
import { PaymentToggle } from "./columns/payment-toggle";
import CellActions from "./columns/cell-actions";
import StatusSelect from "./columns/status-select";

export const columns: ColumnDef<OrdersProps>[] = [
  {
    accessorKey: "id",
    header: "OrderID",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">
        <CellLinks dataId={row.original.id} dataLabel={row.getValue("id")} />
      </div>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">
        <span>{row.getValue("address")}</span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">
        <span>{row.getValue("email")}</span>
      </div>
    ),
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => (
      <div>
        <span>{row.getValue("paymentMethod") === 'cod' ? "Cash On Delivery" : "Stripe"}</span>
      </div>
    ),
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => {
      const products = row.getValue<
        Array<{
          id: string;
          title: string;
          count: number;
        }>
      >("products");
      return (
        <div className="flex gap-2">
          {products.map((product, index) => (
            <Badge key={index}>
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
    cell: ({ row }) => (
      <StatusSelect
        orderId={row.original.id}
        initialStatus={row.original.status}
      />
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
    cell: ({ row }) => (
      <PaymentToggle
        orderId={row.original.id}
        initialStatus={row.original.isPaid}
        paymentMethod={row.original.paymentMethod}
      />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const itemId = row.original.id;
      return <CellActions itemId={itemId} />;
    },
  },
];
