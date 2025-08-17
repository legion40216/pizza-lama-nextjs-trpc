import { currentUser } from '@/hooks/server-auth-utils';
import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
import superjson from 'superjson';
import prisma from "@/lib/prismadb";

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  const session = await currentUser();
  return { betterAuthUserId: session?.id };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
   transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.betterAuthUserId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    })
  }

  const isUser = await prisma.user.findUnique({
    where: { id: ctx.betterAuthUserId },
  });

  if (!isUser) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    })
  }

  return next({
    ctx: {
      betterAuthUserId: ctx.betterAuthUserId,
      isUser,
    },
  });
})
