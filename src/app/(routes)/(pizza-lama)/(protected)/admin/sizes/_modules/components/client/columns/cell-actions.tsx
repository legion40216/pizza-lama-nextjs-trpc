"use client";
import { useState } from "react";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

import {
  MoreHorizontal,
  Trash2
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/global-ui/confirm-modal";

type Props = {
  itemId: string;
};

export default function CellActions({ itemId }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toastLoading = " Deleting size... Please wait.";
  const toastMessage = " Size deleted successfully!";

  const utils = trpc.useUtils();
  const deleteSize = trpc.sizes.delete.useMutation({
    onSuccess: () => {
      utils.sizes.getAll.invalidate();
      toast.success(toastMessage);
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong.");
      console.error("Error deleting size:", error);
    },
    onMutate: () => {
      toast.loading(toastLoading);
      setLoading(true);
    },
    onSettled: () => {
      toast.dismiss();
      setDropdownOpen(false);
      setConfirmOpen(false);
      setLoading(false);
    },
  });

  const handleDeleteUser = async () => {
  await deleteSize.mutateAsync({ itemId });
  };

  return (
    <>
      <ConfirmModal
        onConfirm={handleDeleteUser}
        open={confirmOpen}
        setOpen={setConfirmOpen}
        isDisabled={loading}
      />

      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setConfirmOpen(true);
            }}
          >
            <div className="flex items-center gap-2 h-full
             text-destructive"
             >
              <Trash2 className="size-4 text-destructive" />
              <span>Delete</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
