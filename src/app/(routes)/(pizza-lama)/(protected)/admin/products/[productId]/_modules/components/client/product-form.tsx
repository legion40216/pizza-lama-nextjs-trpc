"use client";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { ProductFormValues, productSchema } from "@/schemas";
import { formattedDataProps, initialDataProps } from "../client";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ProductImageUpload from "./product-form/product-image_upload";

type ProductFormProps = {
  categories: formattedDataProps["categories"];
  sizeOptions: formattedDataProps["sizes"];
} & initialDataProps;

export default function ProductForm({
  categories,
  sizeOptions,
  id = "",
  title = "",
  descr = "",
  imgSrc = "",
  price = "0",
  isFeatured = false,
  isArchived = false,
  isNew = false,
  inStock = false,
  stock = 0,
  discount = 0,
  catSlug = "",
  sizes: productSizes = [{ sizeId: "", price: "", stock: 0 }],
}: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title,
      descr,
      imgSrc,
      price,
      isFeatured,
      isArchived,
      isNew,
      inStock,
      stock,
      discount,
      catSlug,
      sizes: productSizes,
    },
  });

  const router = useRouter();
  const { isSubmitting } = form.formState;

  const productId = id;
  const toastLoading = "Updating product... Please wait.";
  const toastMessage = "Product updated successfully!";
  const action = "Update";

  const utils = trpc.useUtils();
  const updateProduct = trpc.products.update.useMutation({
    onSuccess: () => {
      utils.products.getById.invalidate();
      toast.success(toastMessage);
      router.push("/admin/products");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update product.");
      console.error("Error updating product:", error);
    },
    onMutate: () => {
      toast.loading(toastLoading);
    },
    onSettled: () => {
      toast.dismiss();
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    console.log(data);
    await updateProduct.mutateAsync({
      id: productId,
      ...data,
    });
  };

  // Use field array for dynamic size/price combinations
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sizes",
  });
  const addSizePrice = () => {
    append({ sizeId: "", price: "", stock: 0 });
  };
  const getAvailableSizes = (currentIndex: number) => {
    const selectedSizeIds = fields
      .map((field, index) =>
        index !== currentIndex ? form.watch(`sizes.${index}.sizeId`) : null
      )
      .filter(Boolean);

    return sizeOptions.filter((item) => !selectedSizeIds.includes(item.id));
  };
  const allSelectedSizeIds = fields
    .map((_, i) => form.watch(`sizes.${i}.sizeId`))
    .filter(Boolean);
  const remainingSizes = sizeOptions.filter(
    (sizeOptions) => !allSelectedSizeIds.includes(sizeOptions.id)
  );

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
          {/* Image upload */}
          <div className="w-full max-w-[200px]">
            <FormField
              control={form.control}
              name="imgSrc"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ProductImageUpload
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

          {/* Basic Product Info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 space-y-2">
            <div className="w-full max-w-[400px]">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Margherita Pizza"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full max-w-[400px]">
              <FormField
                control={form.control}
                name="descr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Product description"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full max-w-[400px]">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price (Reference)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full max-w-[400px]">
              <FormField
                control={form.control}
                name="catSlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      disabled={isSubmitting}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full max-w-[400px]">
              <FormField
                control={form.control}
                name={"stock"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        placeholder="0"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Size & Price Configuration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel className="text-base">
                Size & Pricing (Optional)
              </FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSizePrice}
                disabled={isSubmitting || remainingSizes.length === 0}
              >
                <Plus className="size-4 mr-2" />
                Add Size
              </Button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-end gap-3 p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`sizes.${index}.sizeId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size</FormLabel>
                        <Select
                          disabled={isSubmitting}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getAvailableSizes(index).map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.title} ({item.value})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`sizes.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price for this size</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`sizes.${index}.stock`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                            placeholder="0"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => remove(index)}
                  disabled={isSubmitting}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Additional Product Settings */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="w-full max-w-[400px]">
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount (%)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Product Status Checkboxes */}
          <div className="flex flex-col space-y-3">
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem
                  className="flex flex-row items-start 
                space-x-3 space-y-0"
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormLabel>Featured Product</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="inStock"
              render={({ field }) => (
                <FormItem
                  className="flex flex-row items-start 
                space-x-3 space-y-0"
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormLabel>In Stock</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem
                  className="flex flex-row items-start 
                space-x-3 space-y-0"
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormLabel>Archived</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isNew"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start 
                space-x-3 space-y-0"
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormLabel>New Product</FormLabel>
                </FormItem>
              )}
            />
          </div>

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
