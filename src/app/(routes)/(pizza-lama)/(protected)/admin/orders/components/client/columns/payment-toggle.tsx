import { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { trpc } from '@/trpc/client';


type Props = {
  orderId: string;
  initialStatus: boolean;
  paymentMethod: string;
};

export const PaymentToggle = ({ 
  orderId, 
  initialStatus, 
  paymentMethod 
}: Props) => {
  const [isPaid, setIsPaid] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  const utils = trpc.useUtils();
  const updatePaymentStatus = trpc.orders.updatePaymentStatus.useMutation({
    onSuccess: async () => {
      await utils.orders.getAll.invalidate(); // or getById/order list, depending on your usage
      toast.success("Order payment status updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update order payment status.");
      console.error("Error updating payment status:", error);
    },
    onMutate: () => {
      toast.loading("Updating payment status...");
      setIsLoading(true);
    },
    onSettled: () => {
      toast.dismiss();
      setIsLoading(false);
    },
  });

  const onToggle = async (checked: boolean) => {
    if (paymentMethod !== "cod") {
      toast.error("Only COD orders can be manually toggled.");
      return;
    }

    setIsPaid(checked);

    try {
      await updatePaymentStatus.mutateAsync({
        id: orderId,
        isPaid: checked,
      });
    } catch {
      // Revert if failed
      setIsPaid((prev) => !prev);
    }
  };

  return (
    <Switch
      checked={isPaid}
      onCheckedChange={onToggle}
      disabled={isLoading || paymentMethod !== "cod"}
    />
  );
};
