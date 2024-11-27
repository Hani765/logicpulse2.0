import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Dark from "@/components/ui/Dark";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import AuthProvider from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/theme-provider";
import BackToTop from "@/components/base/BackToTop";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-950`}>
        <NextTopLoader
          showSpinner={false}
          height={4}
          color="hsl(var(--primary))"
        />
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Dark />
          </ThemeProvider>
        </AuthProvider>
        <BackToTop />
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
