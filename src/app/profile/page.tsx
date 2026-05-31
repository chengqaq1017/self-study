import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MaterialCard } from "@/components/materials/MaterialCard";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/profile");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      materials: {
        orderBy: { createdAt: "desc" },
        include: {
          subject: { select: { name: true } },
          uploader: { select: { name: true } },
        },
      },
      _count: {
        select: { materials: true, downloads: true },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const formatDate = (d: Date) =>
    new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);

  const statusBadge = (status: string) => {
    const map: Record<string, { text: string; color: string }> = {
      PENDING: { text: "审核中", color: "bg-yellow-100 text-yellow-700" },
      APPROVED: { text: "已审核", color: "bg-green-100 text-green-700" },
      REJECTED: { text: "已拒绝", color: "bg-red-100 text-red-700" },
    };
    const b = map[status] ?? { text: status, color: "bg-gray-100 text-gray-700" };
    return b;
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* User Info */}
      <div className="rounded-lg border bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-primary sm:h-16 sm:w-16">
            {(user.name ?? user.email).charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900">
              {user.name ?? "未设置姓名"}
            </h1>
            <p className="truncate text-sm text-gray-500">{user.email}</p>
            <p className="text-xs text-gray-400">
              {user.role === "ADMIN" ? "管理员" : "学生"} · 注册于{" "}
              {formatDate(user.createdAt)}
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3 text-center sm:grid-cols-3 sm:gap-4">
          <div className="rounded-md bg-gray-50 p-3">
            <p className="text-2xl font-bold text-primary">
              {user._count.materials}
            </p>
            <p className="text-xs text-gray-500">上传资料</p>
          </div>
          <div className="rounded-md bg-gray-50 p-3">
            <p className="text-2xl font-bold text-primary">
              {user._count.downloads}
            </p>
            <p className="text-xs text-gray-500">下载次数</p>
          </div>
          <div className="rounded-md bg-gray-50 p-3">
            <p className="text-2xl font-bold text-primary">
              {user.materials.reduce((sum, m) => sum + m.downloadCount, 0)}
            </p>
            <p className="text-xs text-gray-500">被下载</p>
          </div>
        </div>
      </div>

      {/* My Uploads */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">我的上传</h2>
        {user.materials.length === 0 ? (
          <p className="rounded-lg border bg-white p-8 text-center text-gray-400">
            还没有上传过资料
          </p>
        ) : (
          <div className="space-y-3">
            {user.materials.map((m) => {
              const badge = statusBadge(m.status);
              return (
                <div
                  key={m.id}
                  className="flex flex-col gap-3 rounded-lg border bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <a
                      href={`/materials/${m.id}`}
                    className="break-words font-medium text-gray-900 hover:text-primary"
                    >
                      {m.title}
                    </a>
                    <p className="text-xs text-gray-400">
                      {m.subject.name} · {m.downloadCount} 次下载 ·{" "}
                      {formatDate(m.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`w-fit rounded-full px-2.5 py-0.5 text-xs sm:ml-3 ${badge.color}`}
                  >
                    {badge.text}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
