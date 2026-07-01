import type { Metadata } from "next";
import { Geist, Plus_Jakarta_Sans } from "next/font/google";

import { PublicThemeProvider } from "./components/PublicThemeProvider";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://evenup.in"),
  applicationName: "EvenUp",
  category: "Finance",
  title: {
    default: "EvenUp - Split Bills & Track Shared Expenses",
    template: "%s | EvenUp",
  },
  description:
    "EvenUp is a shared expense tracker for friends, flatmates, families, and groups. Split bills, track balances, and settle clearly without bank details.",
  keywords: [
    "EvenUp",
    "split bills app",
    "shared expense tracker",
    "expense tracker India",
    "group expense app",
    "bill splitting app",
    "split expenses with friends",
    "track shared expenses",
    "flat expenses tracker",
    "trip expense splitter",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "EvenUp",
    title: "EvenUp - Split Bills & Track Shared Expenses",
    description:
      "Track shared expenses, group balances, bills, receipts, and settlements with friends and everyday groups.",
    url: "/",
    images: [
      {
        url: "/banner/banner-light.png",
        width: 1792,
        height: 896,
        alt: "EvenUp app preview showing shared bills, balances, groups, and friends",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EvenUp - Split Bills & Track Shared Expenses",
    description:
      "Track shared expenses, group balances, bills, receipts, and settlements with friends and everyday groups.",
    images: ["/banner/banner-light.png"],
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
};

const themeScript = `
(function() {
  try {
    var key = "evenup-public-theme";
    var stored = window.localStorage.getItem(key);
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch (error) {
    document.documentElement.dataset.theme = "light";
    document.documentElement.style.colorScheme = "light";
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        suppressHydrationWarning
        className={`${geist.variable} ${plusJakarta.variable} font-sans antialiased`}>
        <PublicThemeProvider>{children}</PublicThemeProvider>
      </body>
    </html>
  );
}
