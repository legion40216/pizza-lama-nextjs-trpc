'use client';
import { useState } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { makeQueryClient } from './query-client';
import type { AppRouter } from './routers/_app';
import superjson from 'superjson';

export const trpc = createTRPCReact<AppRouter>();
let browserQueryClient: QueryClient;

function getQueryClient() {
  if (typeof window === 'undefined') return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

function getUrl() {
  return process.env.NEXT_PUBLIC_TRPC_URL ?? 'http://localhost:3000/api/trpc';
}

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: getUrl(),
          transformer: superjson, // ✅ moved here
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </trpc.Provider>
    </QueryClientProvider>
  );
}
