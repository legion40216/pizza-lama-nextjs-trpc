"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";
import { CategoryFormValues, categorySchema } from "@/schemas";

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
import CategoryImageUpload from "./category-form/category-image_upload";
import { Textarea } from "@/components/ui/textarea";

export default function CategoryForm() {
  const router = useRouter();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: "",
      descr: "",
      imgSrc: "",
      slug: "",
    },
  });

  const { isSubmitting } = form.formState;

  const toastLoading = "Creating category... Please wait.";
  const toastMessage = "Category created successfully!";
  const action = "Create";

  const createCategory = trpc.categories.create.useMutation({
    onSuccess: () => {
      toast.success(toastMessage);
      router.push("/admin/categories");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong.");
      console.error("Error creating category:", error);
    },
    onMutate: () => {
      toast.loading(toastLoading);
    },
    onSettled: () => {
      toast.dismiss();
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
  await createCategory.mutateAsync(data);
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
          className="space-y-5"
        >
          {/* image upload */}
          <div className="w-full max-w-[200px]">
            <FormField
              control={form.control}
              name="imgSrc"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CategoryImageUpload
                      value={field.value ? [field.value] : []}
                      disabled={isSubmitting}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      onRemove={() => {
                        field.onChange("");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* form fields */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Category title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="descr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Short description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Category slug" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* submit button */}
          <Button 
          type="submit" 
          disabled={isSubmitting}
          >
            {action}
          </Button>
        </form>
      </Form>
    </div>
  );
}
