import Link from "next/link";
import { auth, signOut } from "@/auth";
import { BookOpen, Upload, User, LogOut, Shield } from "lucide-react";

export async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2 text-lg font-bold text-primary sm:text-xl">
          <BookOpen className="h-6 w-6 flex-shrink-0" />
          <span className="truncate">武理资料共享平台</span>
        </Link>

        <div className="-mx-1 flex w-full items-center gap-3 overflow-x-auto px-1 pb-1 text-sm sm:mx-0 sm:w-auto sm:gap-4 sm:overflow-visible sm:pb-0">
          <Link href="/subjects" className="whitespace-nowrap text-gray-600 hover:text-primary">
            科目分类
          </Link>
          <Link href="/materials" className="whitespace-nowrap text-gray-600 hover:text-primary">
            资料库
          </Link>

          {user ? (
            <>
              <Link
                href="/upload"
                className="flex items-center gap-1 whitespace-nowrap text-gray-600 hover:text-primary"
              >
                <Upload className="h-4 w-4" />
                上传
              </Link>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-1 whitespace-nowrap text-orange-600 hover:text-orange-700"
                >
                  <Shield className="h-4 w-4" />
                  管理
                </Link>
              )}
              <div className="flex min-w-0 items-center gap-2 border-l pl-3 sm:pl-4">
                <Link
                  href="/profile"
                  className="flex min-w-0 items-center gap-1 text-gray-600 hover:text-primary"
                >
                  <User className="h-4 w-4 flex-shrink-0" />
                  <span className="max-w-28 truncate sm:max-w-40">{user.name ?? user.email}</span>
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <button
                    type="submit"
                    className="flex items-center gap-1 text-gray-400 hover:text-red-500"
                    title="退出"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="whitespace-nowrap text-gray-600 hover:text-primary"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="whitespace-nowrap rounded-md bg-primary px-4 py-1.5 text-white hover:bg-primary-light"
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
