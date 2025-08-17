"use client"
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import CellActions from "./columns/cell-actions";

// Define the user type
type User = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const currentRole = row.original.role;
      return currentRole && <Badge variant="secondary">{currentRole}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const itemId = row.original.id

      return (
        <CellActions 
           itemId = {itemId}
        />
      )
    },
  },
];
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => {
//       const currentStatus = row.original.status;
//       return (
//         <Badge variant={currentStatus === "Approved" ? "success" : "warning"}>
//           {currentStatus}
//         </Badge>
//       );
//     },
//   },
//   {
//     id: "switch",
//     cell: ({ row }) => {
//       const currentRole = row.original.role;
//       return (
//         <CellRoleSwitch dataId={row.original.id} currentRole={currentRole} />
//       );
//     },
//   },

