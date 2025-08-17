"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CategoriesAdmin } from "../client";

import CellActions from "./columns/cell-actions";
import CellLinks from "@/components/global-ui/cell-links";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<CategoriesAdmin>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => 
      <CellLinks 
      dataId    = {row.original.id} 
      dataLabel = {row.getValue("title")} 
      /> 
  },
  {
    accessorKey: "descr",
    header: "Description",
    cell: ({ row }) => {
      const description = row.original.descr;
      return (
        <div className="max-w-[200px] truncate">
          {description}
        </div>
      );
    },
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => {
      const slug = row.getValue<string>("slug");
      return <Badge variant="secondary">{slug}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const itemId = row.original.id;
      return <CellActions itemId={itemId} />;
    },
  },
];
