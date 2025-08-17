//schemas/index.ts
import { UserRole } from "@/data/data";
import * as z from "zod"

//Form schemas
export type LoginFormValues = z.infer<typeof loginSchema>;
export const loginSchema = z.object({
    email: z.email({
        message: "Email is required"
    }),
    password: z.string().min(1,{
        message: "Password is required"
    })
})

export type RegisterFormValues = z.infer<typeof registerSchema>;
export const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RoleRegisterFormValues = z.infer<typeof roleRegisterSchema>;
export const roleRegisterSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum([UserRole.ADMIN, UserRole.MODERATOR]).default(UserRole.ADMIN),
});

export type ProductFormValues = z.infer<typeof productSchema>;
export const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  descr: z.string().min(1, "Description is required"),
  imgSrc: z.string().min(1, "Image is required"),
  price: z.string().min(1, "Base price is required"), // This becomes base price for reference
  isFeatured: z.boolean(),
  isArchived: z.boolean(),
  isNew: z.boolean(),
  inStock: z.boolean(),
  discount: z.number().min(0).max(100),
  catSlug: z.string().min(1, "Category is required"),
  stock: z.number().optional(),
  // Updated to include price per size
  sizes: z.array(z.object({
    sizeId: z.string(),
    price: z.string().min(1, "Price is required for each size"),
    stock: z.number().optional(),
  })).default([]).optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
export const categorySchema = z.object({
  title:  z.string().min(1, "Title is required"),
  descr:  z.string().min(1, "Description is required"),
  imgSrc: z.url("Must be a valid image URL"),
  slug:   z.string().min(1, "Slug is required"),
});

export type SizeFormValues = z.infer<typeof sizeSchema>;
export const sizeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  value: z.string().min(1, "Value is required"),
});

export type CustomerInfoFormValues = z.infer<typeof customerInfoSchema>;
export const customerInfoSchema = z.object({
  customerName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  address: z.string().min(5, { message: 'Please enter a valid address.' }),
  city: z.string().min(2, { message: 'Please enter a valid city.' }),
  country: z.string().min(2, { message: 'Please enter a valid country.' }),
  postalCode: z.string().min(5, { message: 'Please enter a valid postal code.' }),
});

// Order item schema
const orderItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  count: z.number(),
  price: z.number(),
});

// Order data schema (compose with customerInfoSchema)
export const orderDataSchema = customerInfoSchema.extend({
  items: z.array(orderItemSchema),
  totalPrice: z.number(),
  paymentMethod: z.enum(["stripe", "cod"]),
});

// Infer the TypeScript type from Zod
export type OrderData = z.infer<typeof orderDataSchema>;