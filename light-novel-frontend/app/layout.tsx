import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/src/components/common/Navbar";
import Footer from "@/src/components/common/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Light Novel Online | Đọc Light Novel Hay Nhất",
  description: "Website bán light novel trực tuyến hàng đầu Việt Nam",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" data-theme="dark">
      <body className={`${inter.className} bg-base-200 min-h-screen flex flex-col`}>
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <Footer />

        {/* Toast Notification */}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '8px',
            }
          }}
        />
      </body>
    </html>
  );
}