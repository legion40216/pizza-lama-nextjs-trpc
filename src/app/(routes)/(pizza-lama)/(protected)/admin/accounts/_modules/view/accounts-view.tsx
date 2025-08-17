import React from "react";

import Link from "next/link";

import HeadingState from "@/components/global-ui/heading-state";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AccountsSection } from "../sections/accounts-section";

export default function AccountsView() {
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <HeadingState title="Accounts" subtitle="Manage accounts" />

        <Button asChild> 
          <Link href="/admin/accounts/new">Add new</Link>
        </Button>
      </div>

      <Separator />

      <AccountsSection />
    </div>
  );
}
