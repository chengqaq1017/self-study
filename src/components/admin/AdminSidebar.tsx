"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileCheck, BookOpen, FileText, Users } from "lucide-react";

const links = [
  { href: "/admin/dashboard", label: "仪表盘", icon: LayoutDashboard },
  { href: "/admin/reviews", label: "待审核", icon: FileCheck },
  { href: "/admin/materials", label: "资料管理", icon: FileText },
  { href: "/admin/subjects", label: "科目管理", icon: BookOpen },
  { href: "/admin/users", label: "用户管理", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="lg:w-56 lg:flex-shrink-0">
      <nav className="rounded-lg border bg-white p-2 shadow-sm lg:p-3">
        <div className="hidden px-3 py-2 text-sm font-semibold text-gray-500 lg:mb-3 lg:block">
          管理后台
        </div>
        <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:block lg:space-y-1 lg:overflow-visible lg:px-0 lg:pb-0">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex min-w-max items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm transition-colors lg:justify-start ${
                  isActive
                    ? "bg-blue-50 font-medium text-primary"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <link.icon className="h-4 w-4 flex-shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
