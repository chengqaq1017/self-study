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
    icon: "/whut-logo.svg",
    shortcut: "/whut-logo.svg",
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
