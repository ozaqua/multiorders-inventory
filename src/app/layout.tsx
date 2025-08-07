import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from '@/components/navigation/Layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Multiorders - Inventory Management System",
  description: "Professional multi-channel inventory management and order fulfillment platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}