import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/auth";
import { LogOut, Shield, Upload, User } from "lucide-react";

export async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 backdrop-blur shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* 左侧：Logo + 标题 */}
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <Image
            src="/naoep-logo.png"
            alt="船海与能源动力工程学院"
            width={36}
            height={36}
            className="h-8 w-auto flex-shrink-0 sm:h-9"
            priority
          />
          <span className="truncate text-sm font-bold text-primary sm:text-base">
            船海能动资料共享
          </span>
        </Link>

        {/* 右侧：导航链接 */}
        <div className="flex items-center gap-1.5 text-sm sm:gap-3">
          <Link
            href="/subjects"
            className="rounded-md px-3 py-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary"
          >
            课程
          </Link>
          <Link
            href="/materials"
            className="rounded-md px-3 py-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary"
          >
            资料库
          </Link>

          {user ? (
            <>
              <Link
                href="/upload"
                className="flex items-center gap-1 rounded-md px-3 py-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary"
              >
                <Upload className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">上传</span>
              </Link>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-1 rounded-md px-3 py-1.5 text-orange-600 transition-colors hover:bg-orange-50"
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">管理</span>
                </Link>
              )}
              <div className="ml-1 flex items-center gap-1 border-l border-gray-200 pl-3 sm:pl-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-1 rounded-md px-2 py-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary"
                  title={user.name ?? user.email ?? undefined}
                >
                  <User className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="max-w-20 truncate sm:max-w-36">{user.name ?? user.email}</span>
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <button
                    type="submit"
                    className="flex items-center gap-1 rounded-md px-2 py-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    title="退出登录"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="ml-1 flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-md px-3 py-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-primary px-4 py-1.5 text-sm text-white transition-colors hover:bg-primary-light"
              >
                注册
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
