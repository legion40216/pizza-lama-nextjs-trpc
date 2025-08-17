import { ReactNode } from "react";
import NavbarAdmin from "./_modules/components/navbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4">
      <NavbarAdmin/>
      {children}
    </div>
  );
}
