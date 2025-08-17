// app/(routes)/(pizza-lama)/(home)/page.tsx
import React from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import HomeView from "./_modules/views/home-view";
import { getQueryClient } from "@/trpc/server";
import { appRouter } from "@/trpc/routers/_app";
import { createTRPCContext } from "@/trpc/init";

export default async function Page() {
  // 🚀 Create a caller (direct router, no fetch)
  const caller = appRouter.createCaller(await createTRPCContext());

  // 🚀 Get the data directly from your router
  const products = await caller.products.getAll();

  // 🚀 Preload into React Query so client hydration works
  const queryClient = getQueryClient();
  queryClient.setQueryData(
    [["products", "getAll"], { type: "query" }], // must match tRPC key
    { products }
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeView />
    </HydrationBoundary>
  );
}
