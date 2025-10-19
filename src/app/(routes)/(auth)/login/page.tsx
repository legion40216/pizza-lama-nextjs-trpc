"use client";

import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

import LoginForm from "./_components/login-form";
import { Button } from "@/components/ui/button";

export default function page() {
  return (
    <div className="grid grid-rows-[min-content_1fr] gap-y-4 h-full">
      {/* Navigation Buttons */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Home
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      
      <div className="grid place-items-center">
        <LoginForm />
      </div>
    </div>
  );
}
