import { prisma } from "@/lib/prisma";

export default async function AdminMaterialsPage() {
  const materials = await prisma.material.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      uploader: { select: { name: true, email: true } },
      subject: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">资料管理</h1>

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">标题</th>
              <th className="px-4 py-3">科目</th>
              <th className="px-4 py-3">上传者</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">下载</th>
              <th className="px-4 py-3">时间</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {materials.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <a
                    href={`/materials/${m.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {m.title}
                  </a>
                </td>
                <td className="px-4 py-3 text-gray-600">{m.subject.name}</td>
                <td className="px-4 py-3 text-gray-600">
                  {m.uploader?.name ?? m.uploader?.email ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                      m.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : m.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {m.status === "APPROVED"
                      ? "已通过"
                      : m.status === "PENDING"
                        ? "待审核"
                        : "已拒绝"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">{m.downloadCount}</td>
                <td className="px-4 py-3 text-gray-400">
                  {new Intl.DateTimeFormat("zh-CN").format(m.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
