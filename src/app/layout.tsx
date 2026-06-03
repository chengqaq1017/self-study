import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WelcomeModal } from "@/components/WelcomeModal";

export const metadata: Metadata = {
  title: "船海能动资料共享平台",
  description:
    "武汉理工大学船海与能源动力工程学院课程资料共享平台，船舶与海洋工程、轮机工程、能源与动力工程（船舶）专业资料一站式检索下载。",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "船海能动资料平台",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "船海能动资料共享平台",
    description:
      "武汉理工大学船海与能源动力工程学院课程资料共享平台",
    url: "https://whutstudy.cn",
    siteName: "船海能动资料共享",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "武汉理工大学校徽",
      },
    ],
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
