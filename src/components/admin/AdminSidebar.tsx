"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileCheck, BookOpen, FileText } from "lucide-react";

const links = [
  { href: "/admin/dashboard", label: "仪表盘", icon: LayoutDashboard },
  { href: "/admin/reviews", label: "待审核", icon: FileCheck },
  { href: "/admin/materials", label: "资料管理", icon: FileText },
  { href: "/admin/subjects", label: "科目管理", icon: BookOpen },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 flex-shrink-0">
      <nav className="rounded-lg border bg-white p-3">
        <div className="mb-3 px-3 py-2 text-sm font-semibold text-gray-500">
          管理后台
        </div>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                isActive
                  ? "bg-blue-50 font-medium text-primary"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
