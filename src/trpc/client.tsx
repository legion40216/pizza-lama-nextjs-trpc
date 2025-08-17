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
  // Always use the environment variable if available
  if (process.env.NEXT_PUBLIC_TRPC_URL) {
    return process.env.NEXT_PUBLIC_TRPC_URL;
  }
  
  // For client-side, use the current window location
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api/trpc`;
  }
  
  // For server-side during development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000/api/trpc';
  }
  
  // Fallback for production builds using Vercel URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/trpc`;
  }
  
  // Final fallback
  return 'http://localhost:3000/api/trpc';
}

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: getUrl(),
          transformer: superjson,
          // Add headers for server-side requests
          headers: () => {
            const headers: Record<string, string> = {};
            
            // Forward important headers during SSR
            if (typeof window === 'undefined') {
              // You can add authentication headers here if needed
              // headers.authorization = ...
            }
            
            return headers;
          },
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