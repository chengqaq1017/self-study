import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/auth";
import { LogOut, Shield, Upload, User } from "lucide-react";

export async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/70 bg-white/82 shadow-sm shadow-slate-900/5 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2.5 sm:gap-3 sm:px-6">
        <Link href="/" className="flex min-w-0 flex-shrink-0 items-center gap-2.5">
          <Image
            src="/icon-512.png"
            alt="武汉理工大学"
            width={40}
            height={40}
            className="h-8 w-8 flex-shrink-0 rounded sm:h-9 sm:w-9"
            priority
          />
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate text-sm font-bold text-primary sm:text-base">
              船海能动资料共享
            </span>
            <span className="hidden text-xs text-primary/70 sm:block">WHUT NAOEP Study Hub</span>
          </span>
        </Link>

        <div className="flex min-w-0 items-center gap-1 text-sm sm:justify-end sm:gap-2">
          <Link
            href="/subjects"
            className="flex-shrink-0 rounded-md px-2.5 py-1.5 text-slate-600 transition-colors hover:bg-primary/8 hover:text-primary sm:px-3"
          >
            课程
          </Link>
          <Link
            href="/materials"
            className="flex-shrink-0 rounded-md px-2.5 py-1.5 text-slate-600 transition-colors hover:bg-primary/8 hover:text-primary sm:px-3"
          >
            资料库
          </Link>

          {user ? (
            <>
              <Link
                href="/upload"
                className="flex flex-shrink-0 items-center gap-1 rounded-md px-2.5 py-1.5 text-slate-600 transition-colors hover:bg-primary/8 hover:text-primary sm:px-3"
              >
                <Upload className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">上传</span>
              </Link>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin/dashboard"
                  className="flex flex-shrink-0 items-center gap-1 rounded-md px-2.5 py-1.5 text-amber-700 transition-colors hover:bg-amber-50 sm:px-3"
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">管理</span>
                </Link>
              )}
              <div className="ml-1 flex flex-shrink-0 items-center gap-1 border-l border-slate-200 pl-2 sm:min-w-0 sm:pl-3">
                <Link
                  href="/profile"
                  className="flex min-w-0 items-center gap-1 rounded-md px-2 py-1.5 text-slate-600 transition-colors hover:bg-primary/8 hover:text-primary"
                  title={user.name ?? user.email ?? undefined}
                >
                  <User className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="hidden max-w-36 truncate sm:inline">{user.name ?? user.email}</span>
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <button
                    type="submit"
                    className="flex items-center gap-1 rounded-md px-2 py-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    title="退出登录"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="ml-auto flex flex-shrink-0 items-center gap-1 sm:gap-2">
              <Link
                href="/login"
                className="rounded-md px-2.5 py-1.5 text-slate-600 transition-colors hover:bg-primary/8 hover:text-primary sm:px-3"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white shadow-sm shadow-primary/20 transition-colors hover:bg-primary-light sm:px-4"
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
