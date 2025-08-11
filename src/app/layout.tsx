import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from '@/components/navigation/Layout'
import { ToastProvider } from '@/components/ui/Toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "INVENTREE PLUS - Advanced Inventory Management",
  description: "Professional multi-platform inventory management with advanced bundle tracking for eBay, Shopify, and Etsy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ToastProvider>
          <Layout>
            {children}
          </Layout>
        </ToastProvider>
      </body>
    </html>
  );
}