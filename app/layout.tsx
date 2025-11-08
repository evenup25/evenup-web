import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EvenUp - Split Bills, Stay Even",
  description:
    "The easiest way to share expenses with friends, family, and roommates. Made in India.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
