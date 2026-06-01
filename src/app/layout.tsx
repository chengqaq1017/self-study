import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WelcomeModal } from "@/components/WelcomeModal";

export const metadata: Metadata = {
  title: "船海能动资料共享平台",
  description: "武汉理工大学船海与能源动力工程学院课程资料共享平台",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "船海能动资料平台",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <SessionProvider>
          <Navbar />
          <main className="page-fade mx-auto w-full max-w-7xl flex-1 px-4 py-4 sm:px-6 sm:py-6">
            {children}
          </main>
          <WelcomeModal />
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
