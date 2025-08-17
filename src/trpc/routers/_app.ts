import { createTRPCRouter } from '../init';

import { usersRouter } from '@/modules/users/server/procedures';
import { productsRouter } from '@/modules/products/server/procedures';
import { sizesRouter } from '@/modules/sizes/server/procedures';
import { categoriesRouter } from '@/modules/categories/server/procedures';
import { ordersRouter } from '@/modules/orders/server/procedures';

export const appRouter = createTRPCRouter({
  users: usersRouter,
  products: productsRouter,
  sizes: sizesRouter,
  categories: categoriesRouter,
  orders: ordersRouter,
});

export type AppRouter = typeof appRouter;
