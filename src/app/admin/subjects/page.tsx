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
      <h1 className="text-2xl font-bold text-gray-900">科目管理</h1>

      <div className="overflow-hidden rounded-lg border bg-white">
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
