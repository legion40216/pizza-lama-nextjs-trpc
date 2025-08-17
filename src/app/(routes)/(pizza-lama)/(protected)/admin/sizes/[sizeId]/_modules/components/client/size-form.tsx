"use client";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { SizeFormValues, sizeSchema } from "@/schemas";
import { trpc } from "@/trpc/client";
import { initialDataProps } from "../client";

import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export default function SizeForm({
  id,
  title,
  value,
}: initialDataProps) {
  const router = useRouter();

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(sizeSchema),
    defaultValues: {
      title,
      value,
    },
  });

  const { isSubmitting } = form.formState;

  const toastMessage = "Size updated successfully";
  const toastLoading = "Updating size...";
  const action = "Update";

  const utils = trpc.useUtils();
  const updateSize = trpc.sizes.update.useMutation({
    onSuccess: () => {
      utils.sizes.getById.invalidate();
      toast.success(toastMessage);
      router.push("/admin/sizes");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong.");
      console.error("Error updating size:", error);
    },
    onMutate: () => {
      toast.loading(toastLoading);
    },
    onSettled: () => {
      toast.dismiss();
    },
  });

  const onSubmit = async (data: SizeFormValues) => {
    await updateSize.mutateAsync({ id, ...data });
  };

  useEffect(() => {
    const errors = form.formState.errors;
    const errorCount = Object.keys(errors).length;

    if (errorCount > 0 && form.formState.isSubmitted) {
      if (errorCount === 1) {
        const firstError = Object.values(errors)[0];
        toast.error(firstError?.message || "Please check the form for errors.");
      } else {
        toast.error("Please check the form for errors.");
      }
    }
  }, [form.formState.errors, form.formState.isSubmitted]);

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-10"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="max-w-[400px]">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Size"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="max-w-[400px]">
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Value"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {action}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}