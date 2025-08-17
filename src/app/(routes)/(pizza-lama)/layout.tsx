import { ReactNode } from "react";
import Navbar from "./_modules/components/navbar";
import Footer from "./_modules/components/footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-rows-[min-content_1fr_min-content] space-y-4">
      <header className="container mx-auto">
        <nav className="w-[calc(100%-2rem)] mx-auto">
          <Navbar />
        </nav>
      </header>

      <main className="container mx-auto px-4">
        {children}
      </main>

      <footer  className="container mx-auto">
        <Footer />
      </footer>
    </div>
  );
}
