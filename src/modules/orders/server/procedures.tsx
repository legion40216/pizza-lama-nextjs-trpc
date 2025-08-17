import { Prisma } from "@/generated/prisma";
import prisma from "@/lib/prismadb";
import { orderDataSchema } from "@/schemas";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const ordersRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.betterAuthUserId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    try {
      const orders = await prisma.order.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      return {
        orders: orders.map((order) => ({
          ...order,
          totalPrice: order.totalPrice.toNumber(),
          orderItems: order.orderItems.map((item) => ({
            ...item,
            price: item.price.toNumber(),
            product: {
              ...item.product,
              price: item.product.price.toNumber(),
            },
          })),
        })),
      };
    } catch (error) {
      console.error("Error orders [getAll]:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch orders",
        cause: error,
      });
    }
  }),

  getAllByUserId: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.betterAuthUserId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    try {
      const orders = await prisma.order.findMany({
        where: {
          userId: ctx.betterAuthUserId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      return {
        orders: orders.map((order) => ({
          ...order,
          totalPrice: order.totalPrice.toNumber(),
          orderItems: order.orderItems.map((item) => ({
            ...item,
            price: item.price.toNumber(),
            product: {
              ...item.product,
              price: item.product.price.toNumber(),
            },
          })),
        })),
      };
    } catch (error) {
      console.error("Error orders [getAllByUserId]:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch orders",
        cause: error,
      });
    }
  }),
  
  create: protectedProcedure
    .input(orderDataSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.betterAuthUserId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      try {
        const order = await prisma.order.create({
          data: {
            // From customerInfoSchema
            customerName: input.customerName,
            email: input.email,
            phone: input.phone,
            address: input.address,
            city: input.city,
            country: input.country,
            postalCode: input.postalCode,

            // From orderDataSchema
            userId: ctx.betterAuthUserId,

            // Order-specific fields
            totalPrice: new Prisma.Decimal(input.totalPrice),
            paymentMethod: input.paymentMethod,
            isPaid: false, // default

            // Related order items
            orderItems: {
              create: input.items.map((item) => ({
                productId: item.id,
                count: item.count,
                price: new Prisma.Decimal(item.price),
              })),
            },
          },
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        });

        return {
          success: true,
          message: "Order created successfully",
          order: {
            ...order,
            totalPrice: order.totalPrice.toNumber(), // ← Converting Decimal to number
            orderItems: order.orderItems.map((item) => ({
              ...item,
              price: item.price.toNumber(), // ← Converting Decimal to number
            })),
          },
        };
      } catch (error) {
        console.error("Error orders [create]:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create order",
          cause: error,
        });
      }
    }),

  delete: protectedProcedure
    .input(
      z.object({
        orderId: z.string().min(1),
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
        await prisma.order.delete({
          where: {
            id: input.orderId,
          },
        });

        return {
          success: true,
          message: "Order deleted successfully",
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("Error orders [delete]:", error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Order not found or already deleted",
              cause: error,
            });
          }
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete order",
          cause: error,
        });
      }
    }),

  updatePaymentStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        isPaid: z.boolean(),
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
        await prisma.order.update({
          where: { id: input.id },
          data: { isPaid: input.isPaid },
        });

        return {
          success: true,
          message: "Order payment status updated successfully",
        };
      } catch (error: any) {
        if (error.code === "P2025") {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Order not found",
          });
        }

        console.error("Error orders [updatePaymentStatus]:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update order payment status",
          cause: error,
        });
      }
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        status: z.enum(["PENDING", "DELIVERED", "CANCELLED"]),
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
        const order = await prisma.order.update({
          where: { id: input.id },
          data: { status: input.status },
        });

        return {
          success: true,
          message: "Order status updated successfully",
          order,
        };
      } catch (error: any) {
        if (error.code === "P2025") {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Order not found",
          });
        }

        console.error("Error [updateStatus]:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update order status",
        });
      }
    }),
});
