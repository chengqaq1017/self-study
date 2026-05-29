import Link from "next/link";
import { auth, signOut } from "@/auth";
import { BookOpen, Upload, User, LogOut, Shield } from "lucide-react";

export async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <BookOpen className="h-6 w-6" />
          <span>武理工自习室</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/subjects" className="text-sm text-gray-600 hover:text-primary">
            科目分类
          </Link>
          <Link href="/materials" className="text-sm text-gray-600 hover:text-primary">
            资料库
          </Link>

          {user ? (
            <>
              <Link
                href="/upload"
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary"
              >
                <Upload className="h-4 w-4" />
                上传
              </Link>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700"
                >
                  <Shield className="h-4 w-4" />
                  管理
                </Link>
              )}
              <div className="flex items-center gap-2 border-l pl-4">
                <Link
                  href="/profile"
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary"
                >
                  <User className="h-4 w-4" />
                  {user.name ?? user.email}
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <button
                    type="submit"
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500"
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
                className="text-sm text-gray-600 hover:text-primary"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-primary px-4 py-1.5 text-sm text-white hover:bg-primary-light"
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
