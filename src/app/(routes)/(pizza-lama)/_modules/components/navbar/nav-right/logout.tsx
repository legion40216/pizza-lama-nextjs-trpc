"use client";
import React from "react";

import { useCurrentUser } from "@/hooks/client-auth-utils";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Logout() {
  const { user, isPending } = useCurrentUser();
  const isLoggedIn = !!user;

  const router = useRouter();

  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await authClient.signOut();
    router.refresh();
  };
  
  return (
    <>
      {isPending ? (
        <Button
          className="bg-pizza-store-primary 
              hover:bg-pizza-store-primary/90"
          disabled={isPending}
        >
          <span className="animate-pulse">Loading...</span>
        </Button>
      ) : (
        <>
          {isLoggedIn ? (
            <Button
              asChild
              className="bg-pizza-store-primary 
              hover:bg-pizza-store-primary/90"
              onClick={handleLogout}
            >
              <Link href="/login">Logout</Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                className="bg-pizza-store-primary 
                hover:bg-pizza-store-primary/90"
              >
                <Link href="/login">Login</Link>
              </Button>
            </>
          )}
        </>
      )}
    </>
  );
}
