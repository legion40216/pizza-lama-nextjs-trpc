"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ProductsAdmin } from "../client";

import CellActions from "./columns/cell-actions";
import CellLinks from "@/components/global-ui/cell-links";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<ProductsAdmin>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <CellLinks dataId={row.original.id} dataLabel={row.getValue("title")} />
    ),
  },
  {
    accessorKey: "descr",
    header: "Description",
    cell: ({ row }) => {
      const description = row.original.descr;
      return <div className="max-w-[200px] truncate">{description}</div>;
    },
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue<string>("category");
      return <Badge variant="secondary">{category}</Badge>;
    },
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) => {
      const isFeatured = row.getValue<boolean>("isFeatured");
      return (
        <Badge variant={isFeatured ? "default" : "outline"}>
          {isFeatured ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "inStock",
    header: "In Stock",
    cell: ({ row }) => {
      const inStock = row.getValue<boolean>("inStock");
      return (
        <Badge variant={inStock ? "default" : "outline"}>
          {inStock ? "In Stock" : "Out of Stock"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isNew",
    header: "New",
   cell: ({ row }) => {
      const isNew = row.getValue<boolean>("isNew");
      return (
        <Badge variant={isNew ? "default" : "outline"}>
          {isNew ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
    cell: ({ row }) => {
      const isArchived = row.getValue<boolean>("isArchived");
      return (
        <Badge variant={isArchived ? "destructive" : "outline"}>
          {isArchived ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <CellActions itemId={row.original.id} />,
  },
];
