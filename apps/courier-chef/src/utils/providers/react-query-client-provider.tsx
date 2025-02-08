'use client';

import { QueryClientProvider, QueryClient, ReactQueryDevtools } from '@paket/shared';
import { useState } from 'react';

export const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return <QueryClientProvider client={queryClient}>
    {children}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>;
};
