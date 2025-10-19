import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="container mx-auto p-4 h-screen">
        {children}
    </main>
  );
}
