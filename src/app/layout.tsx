import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WelcomeModal } from "@/components/WelcomeModal";

export const metadata: Metadata = {
  metadataBase: new URL("https://whutstudy.cn"),
  title: {
    default: "船海能动资料共享平台",
    template: "%s | 船海能动资料共享平台",
  },
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
  applicationName: "船海能动资料共享平台",
  keywords: ["武汉理工大学", "船海学院", "课程资料", "资料共享", "自学平台"],
  openGraph: {
    title: "船海能动资料共享平台",
    description:
      "武汉理工大学船海与能源动力工程学院课程资料共享平台",
    url: "https://whutstudy.cn",
    siteName: "船海能动资料共享",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "船海能动资料共享平台网页缩略图",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "船海能动资料共享平台",
    description: "武汉理工大学船海与能源动力工程学院课程资料共享平台。",
    images: ["/og-image.png"],
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
          <main className="page-fade mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:px-6 sm:py-8">
            {children}
          </main>
          <WelcomeModal />
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
