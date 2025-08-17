// import 'server-only'; // <-- ensure this file cannot be imported from the client
// import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
// import { cache } from 'react';
// import { createTRPCContext } from './init';
// import { makeQueryClient } from './query-client';
// import { appRouter } from './routers/_app';
// // IMPORTANT: Create a stable getter for the query client that
// //            will return the same client during the same request.
// export const getQueryClient = cache(makeQueryClient);
// export const trpc = createTRPCOptionsProxy({
//   ctx: createTRPCContext,
//   router: appRouter,
//   queryClient: getQueryClient,
// });
import 'server-only';
import { cache } from 'react';
import { createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/_app';

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);

// Create server-side caller that doesn't use HTTP
export const trpc = {
  products: {
    getAll: {
      queryOptions: () => ({
        queryKey: ['products', 'getAll'],
        queryFn: async () => {
          const ctx = await createTRPCContext();
          return appRouter.createCaller(ctx).products.getAll();
        },
      }),
    },
    getById: {
      queryOptions: ({ productId }: { productId: string }) => ({
        queryKey: ['products', 'getById', productId],
        queryFn: async () => {
          const ctx = await createTRPCContext();
          return appRouter.createCaller(ctx).products.getById({ productId });
        },
      }),
    },
  },
  categories: {
    getAll: {
      queryOptions: () => ({
        queryKey: ['categories', 'getAll'],
        queryFn: async () => {
          const ctx = await createTRPCContext();
          return appRouter.createCaller(ctx).categories.getAll();
        },
      }),
    },
    getBySlug: {
      queryOptions: ({ categorySlug }: { categorySlug: string }) => ({
        queryKey: ['categories', 'getBySlug', categorySlug],
        queryFn: async () => {
          const ctx = await createTRPCContext();
          return appRouter.createCaller(ctx).categories.getBySlug({ categorySlug });
        },
      }),
    },
    getById: {
      queryOptions: ({ categoryId }: { categoryId: string }) => ({
        queryKey: ['categories', 'getById', categoryId],
        queryFn: async () => {
          const ctx = await createTRPCContext();
          return appRouter.createCaller(ctx).categories.getById({ categoryId });
        },
      }),
    },
  },
  orders: {
    getAll: {
      queryOptions: () => ({
        queryKey: ['orders', 'getAll'],
        queryFn: async () => {
          const ctx = await createTRPCContext();
          return appRouter.createCaller(ctx).orders.getAll();
        },
      }),
    },
    getAllByUserId: {
      queryOptions: () => ({
        queryKey: ['orders', 'getAllByUserId'],
        queryFn: async () => {
          const ctx = await createTRPCContext();
          return appRouter.createCaller(ctx).orders.getAllByUserId();
        },
      }),
    },
  },
  sizes: {
    getAll: {
      queryOptions: () => ({
        queryKey: ['sizes', 'getAll'],
        queryFn: async () => {
          const ctx = await createTRPCContext();
          return appRouter.createCaller(ctx).sizes.getAll();
        },
      }),
    },
    getById: {
      queryOptions: ({ sizeId }: { sizeId: string }) => ({
        queryKey: ['sizes', 'getById', sizeId],
        queryFn: async () => {
          const ctx = await createTRPCContext();
          return appRouter.createCaller(ctx).sizes.getById({ sizeId });
        },
      }),
    },
  },
  users: {
    getAll: {
      queryOptions: () => ({
        queryKey: ['users', 'getAll'],
        queryFn: async () => {
          const ctx = await createTRPCContext();
          return appRouter.createCaller(ctx).users.getAll();
        },
      }),
    },
    getCurrentById: {
      queryOptions: () => ({
        queryKey: ['users', 'getCurrentById'],
        queryFn: async () => {
          const ctx = await createTRPCContext();
          return appRouter.createCaller(ctx).users.getCurrentById();
        },
      }),
    },
  },
};