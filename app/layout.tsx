import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { PublicThemeProvider } from "./components/PublicThemeProvider";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://evenup.in"),
  title: {
    default: "EvenUp - Split bills, stay even",
    template: "%s | EvenUp",
  },
  description:
    "EvenUp helps friends and groups track shared expenses, settle clearly, and keep balances simple.",
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
      <body className={`${geist.variable} font-sans antialiased`}>
        <PublicThemeProvider>{children}</PublicThemeProvider>
      </body>
    </html>
  );
}
