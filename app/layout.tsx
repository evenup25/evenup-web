// app/layout.tsx
import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "EvenUp — Split expenses the smart way",
  description: "EvenUp — settle shared bills, track who owes who, and keep friendships tidy.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="antialiased bg-gray-50 text-slate-900">
        <div className="min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  );
}
