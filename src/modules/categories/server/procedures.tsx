import { Prisma } from "@/generated/prisma";
import prisma from "@/lib/prismadb";
import { categorySchema } from "@/schemas";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const categoriesRouter = createTRPCRouter({
  getAll: baseProcedure.query(async () => {
    try {
      const categories = await prisma.category.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      return { categories };
    } catch (error) {
      console.error("Error categories [getAll]:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch categories",
        cause: error,
      });
    }
  }),

  getById: baseProcedure
    .input(
      z.object({
        categoryId: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      try {
        const { categoryId } = input;

        const category = await prisma.category.findUnique({
          where: {
            id: categoryId,
          },
        });

        if (!category) {
          return { category: null };
        }

        return { category };
      } catch (error) {
        // Re-throw tRPC errors as-is
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("Error categories [getById]:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch category",
          cause: error,
        });
      }
    }),

    getBySlug: baseProcedure
    .input(
      z.object({
        categorySlug: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      try {
        const { categorySlug } = input;

        const category = await prisma.category.findUnique({
          where: {
            slug: categorySlug,
          },
          include: {
            products: true,
          },
        });
        
        if (!category) {
          return { category: null };
        }

        return {
          category: {
            ...category,
            products: category.products.map((p) => ({
              ...p,
              price: p.price.toNumber(), // convert Decimal → number
            })),
          },
        };
      } catch (error) {
        // Re-throw tRPC errors as-is
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("Error categories [getBySlug]:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch category",
          cause: error,
        });
      }
    }),

  create: protectedProcedure
    .input(categorySchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.betterAuthUserId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      try {
        const category = await prisma.category.create({
          data: {
            title: input.title,
            descr: input.descr,
            imgSrc: input.imgSrc,
            slug: input.slug,
          },
        });

        return {
          success: true,
          message: "category created successfully",
        };
      } catch (error) {
        console.error("Error categories [create]:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create category",
          cause: error,
        });
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        descr: z.string().min(1),
        imgSrc: z.string().min(1),
        slug: z.string().min(1),
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
        const category = await prisma.category.update({
          where: {
            id: input.id,
          },
          data: {
            title: input.title,
            descr: input.descr,
            imgSrc: input.imgSrc,
            slug: input.slug,
          },
        });

        return {
          success: true,
          message: "Category updated successfully",
        };
      } catch (error) {
        console.error("Error categories [update]:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update category",
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

        await prisma.category.delete({
          where: {
            id: input.itemId,
          },
        });

        return {
          success: true,
          message: "Category deleted successfully",
        };
      } catch (error) {
        // Re-throw tRPC errors as-is
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("Error categories [delete]:", error);

        // Handle specific Prisma errors
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Category not found or already deleted",
              cause: error,
            });
          }
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete category",
          cause: error,
        });
      }
    }),
});