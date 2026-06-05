import { prisma } from "@/lib/prisma";
import { DeleteMaterialButton } from "@/components/materials/DeleteMaterialButton";

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
      <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">资料管理</h1>

      <div className="space-y-3 md:hidden">
        {materials.map((m) => (
          <div key={m.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <a
                  href={`/materials/${m.id}`}
                  className="line-clamp-2 font-medium text-primary"
                >
                  {m.title}
                </a>
                <p className="mt-1 text-sm text-gray-500">{m.subject.name}</p>
              </div>
              <span
                className={`flex-shrink-0 rounded-full px-2 py-1 text-xs ${
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
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
              <div>
                <span className="block text-gray-400">上传者</span>
                <span className="truncate">{m.uploader?.name ?? m.uploader?.email ?? "—"}</span>
              </div>
              <div>
                <span className="block text-gray-400">下载</span>
                <span>{m.downloadCount}</span>
              </div>
              <div>
                <span className="block text-gray-400">时间</span>
                <span>{new Intl.DateTimeFormat("zh-CN").format(m.createdAt)}</span>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <DeleteMaterialButton materialId={m.id} materialTitle={m.title} />
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-lg border bg-white md:block">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">标题</th>
              <th className="px-4 py-3">科目</th>
              <th className="px-4 py-3">上传者</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">下载</th>
              <th className="px-4 py-3">时间</th>
              <th className="px-4 py-3">操作</th>
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
                <td className="px-4 py-3">
                  <DeleteMaterialButton materialId={m.id} materialTitle={m.title} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
