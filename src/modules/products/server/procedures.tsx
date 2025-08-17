import { Prisma } from "@/generated/prisma";
import { Decimal } from "@/generated/prisma/runtime/library";
import prisma from "@/lib/prismadb";
import { productSchema } from "@/schemas";

import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const productsRouter = createTRPCRouter({
  getAll: baseProcedure.query(async () => {
    try {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          sizes: {
            include: {
              size: true,
            },
          },
          category: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      });

      const serializedProducts = products.map((p) => ({
        ...p,
        price: p.price.toNumber(), // Product main price to number
        sizes: p.sizes.map((s) => ({
          ...s,
          price: s.price ? s.price.toNumber() : null, // Convert size price safely
          size: {
            ...s.size,
            // Keep size.value as is, do NOT overwrite with price
          },
        })),
      }));

      return { products: serializedProducts };
    } catch (error) {
      console.error("Error product [getAll]:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch product",
        cause: error,
      });
    }
  }),

  getById: baseProcedure
    .input(
      z.object({
        productId: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      try {
        const { productId } = input;

        const product = await prisma.product.findUnique({
          where: { id: productId },
          include: {
            category: true,
            sizes: {
              include: {
                size: true,
              },
            },
          },
        });

        if (!product) {
          return { product: null };
        }

        const serializedProduct = {
          ...product,
          price: product.price.toNumber(), // convert product price

          sizes: product.sizes.map((p) => ({
            ...p,
            price: p.price.toNumber(), // handle null case safely
            size: {
              ...p.size,
            },
          })),
        };

        // Return key name consistent with what you fetched: product (not products)
        return { product: serializedProduct };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("Error products [getById]:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch product",
          cause: error,
        });
      }
    }),

  create: protectedProcedure
    .input(productSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.betterAuthUserId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      try {
        const { sizes, ...productData } = input;
        const priceDecimal = new Decimal(productData.price);

        const product = await prisma.$transaction(async (tx) => {
          // Create the product
          const newProduct = await tx.product.create({
            data: {
              title: productData.title,
              descr: productData.descr,
              imgSrc: productData.imgSrc,
              price: priceDecimal,
              isFeatured: productData.isFeatured,
              isArchived: productData.isArchived,
              inStock: productData.inStock,
              discount: productData.discount,
              catSlug: productData.catSlug,
            },
          });

          // Create ProductSize entries with individual prices
          if (sizes && sizes.length > 0) {
            await tx.productSize.createMany({
              data: sizes.map((sizeItem) => ({
                productId: newProduct.id,
                sizeId: sizeItem.sizeId,
                price: new Decimal(sizeItem.price),
                stock: sizeItem.stock || null,
              })),
            });
          }

          return newProduct;
        });

        return {
          success: true,
          message: "Product created successfully",
          product: product,
        };
      } catch (error) {
        console.error("Error product [create]:", error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "A product with this information already exists",
            });
          }
          if (error.code === "P2003") {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Invalid category or size reference",
            });
          }
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create product",
          cause: error,
        });
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        ...productSchema.shape, // Use .shape to spread the schema fields
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.betterAuthUserId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      try {
        const { id, sizes, ...productData } = input;
        const priceDecimal = new Decimal(productData.price);

        await prisma.$transaction(async (tx) => {
          // Update the product - use the id from input, not productData.id
          const updatedProduct = await tx.product.update({
            where: {
              id: id, // ✅ Use the id from input destructuring
            },
            data: {
              title: productData.title,
              descr: productData.descr,
              imgSrc: productData.imgSrc,
              price: priceDecimal,
              isFeatured: productData.isFeatured,
              isArchived: productData.isArchived,
              isNew: productData.isNew,
              inStock: productData.inStock,
              discount: productData.discount,
              catSlug: productData.catSlug,
            },
          });
          
          // Update ProductSize entries with individual prices
          if (sizes && sizes.length > 0) {
            // ✅ Check if sizes exists
            // Delete existing ProductSize entries
            await tx.productSize.deleteMany({
              where: {
                productId: id, // ✅ Use the id from input destructuring
              },
            });

            if (sizes) {
              // Always delete existing sizes first
              await tx.productSize.deleteMany({
                where: { productId: id },
              });

              // Then recreate only if there are valid sizes
              const validSizes = sizes.filter(s => s.sizeId?.trim() !== "");

              if (validSizes.length > 0) {
                await tx.productSize.createMany({
                  data: validSizes.map(sizeItem => ({
                    productId: id,
                    sizeId: sizeItem.sizeId,
                    price: new Decimal(sizeItem.price),
                    stock: sizeItem.stock || null,
                  })),
                });
              }
            }
          } else {
            await tx.productSize.deleteMany({
              where: {
                productId: id, // ✅ Use the id from input destructuring
              },
            });
          }

          return updatedProduct;
        });

        return {
          success: true,
          message: "Product updated successfully",
        };
      } catch (error) {
        console.error("Error product [update]:", error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "A product with this information already exists",
            });
          }
          if (error.code === "P2003") {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Invalid category or size reference",
            });
          }
          if (error.code === "P2025") {
            // ✅ Add handling for record not found
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Product not found",
            });
          }
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update product",
          cause: error,
        });
      }
    }),

  delete: protectedProcedure
    .input(
      z.object({
        itemId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.betterAuthUserId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      try {
        await prisma.product.delete({
          where: {
            id: input.itemId,
          },
        });

        return {
          success: true,
          message: "Product deleted successfully",
        };
      } catch (error) {
        // Re-throw tRPC errors as-is
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("Error products [delete]:", error);

        // Handle specific Prisma errors
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Product not found or already deleted",
              cause: error,
            });
          }
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete product",
          cause: error,
        });
      }
    }),
});