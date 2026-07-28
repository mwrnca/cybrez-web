import type { ReactNode } from "react";

import {
  QueryClientProvider,
} from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@/contexts/AuthProvider";
import queryClient from "@/lib/queryClient";

type Props = {
  children: ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
  <AuthProvider>
    {children}
  </AuthProvider>

  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
  );
}