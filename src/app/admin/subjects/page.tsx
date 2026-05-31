import { prisma } from "@/lib/prisma";

export default async function AdminSubjectsPage() {
  const subjects = await prisma.subject.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { materials: true } },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">科目管理</h1>

      <div className="space-y-3 md:hidden">
        {subjects.map((s) => (
          <div key={s.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-gray-900">{s.name}</p>
                <p className="mt-1 text-sm text-gray-500">{s.college ?? "未设置学院"}</p>
              </div>
              <span className="flex-shrink-0 rounded-full bg-blue-50 px-2 py-1 text-xs text-primary">
                {s._count.materials} 份
              </span>
            </div>
            <div className="mt-3 grid gap-2 text-xs text-gray-500">
              <div>
                <span className="text-gray-400">代码：</span>
                <span>{s.code ?? "—"}</span>
              </div>
              <div>
                <span className="text-gray-400">描述：</span>
                <span>{s.description ?? "—"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-lg border bg-white md:block">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">名称</th>
              <th className="px-4 py-3">代码</th>
              <th className="px-4 py-3">学院</th>
              <th className="px-4 py-3">资料数</th>
              <th className="px-4 py-3">描述</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {subjects.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {s.name}
                </td>
                <td className="px-4 py-3 text-gray-500">{s.code ?? "—"}</td>
                <td className="px-4 py-3 text-gray-600">
                  {s.college ?? "—"}
                </td>
                <td className="px-4 py-3 text-gray-600">{s._count.materials}</td>
                <td className="px-4 py-3 text-gray-400 max-w-xs truncate">
                  {s.description ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
