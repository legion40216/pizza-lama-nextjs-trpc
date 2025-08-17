"use client";
import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { OrderStatus } from "@/data/data";
import { trpc } from "@/trpc/client";

type Props = {
  orderId: string;
  initialStatus: OrderStatus;
};

export default function StatusSelect({ orderId, initialStatus }: Props) {
  const [status, setStatus] = React.useState<OrderStatus>(initialStatus);
  const [isLoading, setIsLoading] = React.useState(false);

  const utils = trpc.useUtils();
  const updateStatus = trpc.orders.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.orders.getAll.invalidate();
      toast.success("Order status updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update order status.");
      console.error("Error updating order status:", error);
    },
    onMutate: () => {
      toast.loading("Updating order status...");
      setIsLoading(true);
    },
    onSettled: () => {
      toast.dismiss();
      setIsLoading(false);
    },
  });

  const handleChange = async (newStatus: OrderStatus) => {
    setStatus(newStatus);

    try {
      await updateStatus.mutateAsync({
        id: orderId,
        status: newStatus,
      });
    } catch {
      // revert if failed
      setStatus(initialStatus);
    }
  };

  return (
    <Select
      value={status}
      onValueChange={handleChange}
      disabled={isLoading}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
        <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
        <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
      </SelectContent>
    </Select>
  );
}
