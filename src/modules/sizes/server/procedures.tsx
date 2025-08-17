import { Prisma } from "@/generated/prisma";
import prisma from "@/lib/prismadb";
import { sizeSchema } from "@/schemas";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const sizesRouter = createTRPCRouter({
  getAll: baseProcedure.query(async () => {
    try {
      const sizes = await prisma.size.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      return { sizes };
    } catch (error) {
      console.error("Error size [getAll]:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch size",
        cause: error,
      });
    }
  }),

  getById: baseProcedure
    .input(
      z.object({
        sizeId: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      try {
        const { sizeId } = input;

        const size = await prisma.size.findUnique({
          where: {
            id: sizeId,
          },
        });

        if (!size) {
          return { size: null };
        }

        return { size };
      } catch (error) {
        // Re-throw tRPC errors as-is
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("Error sizes [getById]:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch size",
          cause: error,
        });
      }
    }),

  create: protectedProcedure
    .input(sizeSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.betterAuthUserId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      try {
        await prisma.size.create({
          data: {
            title: input.title,
            value: input.value,
          },
        });

        return {
          success: true,
          message: "Size created successfully",
        };
      } catch (error) {
        console.error("Error size [create]:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create size",
          cause: error,
        });
      }
    }),
    
  update: protectedProcedure
  .input(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      value: z.string().min(1),
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
      const size = await prisma.size.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          value: input.value,
        },
      });

      return {
        success: true,
        message: "Size updated successfully",
      };
    } catch (error) {
      console.error("Error sizes [update]:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update size",
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
        await prisma.size.delete({
          where: {
            id: input.itemId,
          },
        });

        return {
          success: true,
          message: "Size deleted successfully",
        };
      } catch (error) {
        // Re-throw tRPC errors as-is
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("Error sizes [delete]:", error);

        // Handle specific Prisma errors
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Size not found or already deleted",
              cause: error,
            });
          }
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete size",
          cause: error,
        });
      }
    }),
});