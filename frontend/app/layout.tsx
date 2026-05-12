import type { ReactNode } from "react";
import Link from "next/link";
import { NavigationLinks } from "@/components/navigation";
import "./globals.css";

export const metadata = {
  title: "raph-meris",
  description: "From daily order to annual impact.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="flex min-h-screen">
          {/* Left Sidebar Navigation */}
          <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-full flex-col">
              {/* Logo/Brand */}
              <div className="flex h-16 items-center border-b border-border/40 px-6">
                <Link href="/" className="flex items-center space-x-2 group">
                  <span className="font-semibold text-lg tracking-tight transition-colors group-hover:text-primary">
                    raph-meris
                  </span>
                </Link>
              </div>
              
              {/* Navigation Links */}
              <NavigationLinks />
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 ml-64">
            <div className="container pt-4 pb-8 max-w-7xl">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}

// Made with Bob
