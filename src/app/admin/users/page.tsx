import { prisma } from "@/lib/prisma";
import { UserRoleButton } from "@/components/admin/UserRoleButton";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function roleBadge(role: string) {
  return role === "ADMIN"
    ? { text: "管理员", className: "bg-purple-100 text-purple-700" }
    : { text: "学生", className: "bg-gray-100 text-gray-600" };
}

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: { select: { materials: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">用户管理</h1>
        <p className="text-sm text-gray-500">{users.length} 个用户</p>
      </div>

      {/* 桌面端表格 */}
      <div className="hidden overflow-hidden rounded-lg border bg-white shadow-sm lg:block">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                用户
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                角色
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                上传数
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                注册时间
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => {
              const badge = roleBadge(user.role);
              return (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.name ?? "未设置姓名"}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
                    >
                      {badge.text}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {user._count.materials}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <UserRoleButton
                      userId={user.id}
                      currentRole={user.role}
                      userName={user.name ?? user.email}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 移动端卡片 */}
      <div className="space-y-3 lg:hidden">
        {users.map((user) => {
          const badge = roleBadge(user.role);
          return (
            <div
              key={user.id}
              className="rounded-lg border bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {user.name ?? "未设置姓名"}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
                <span
                  className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
                >
                  {badge.text}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>上传 {user._count.materials} 份 · 注册于 {formatDate(user.createdAt)}</span>
                <UserRoleButton
                  userId={user.id}
                  currentRole={user.role}
                  userName={user.name ?? user.email}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
