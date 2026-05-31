import { prisma } from "@/lib/prisma";
import { Users, FileText, Clock, CheckCircle, XCircle, Download } from "lucide-react";

export default async function AdminDashboardPage() {
  const [
    totalUsers,
    totalMaterials,
    pendingCount,
    approvedCount,
    rejectedCount,
    totalDownloads,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.material.count(),
    prisma.material.count({ where: { status: "PENDING" } }),
    prisma.material.count({ where: { status: "APPROVED" } }),
    prisma.material.count({ where: { status: "REJECTED" } }),
    prisma.downloadLog.count(),
  ]);

  const stats = [
    { label: "用户总数", value: totalUsers, icon: Users, color: "text-blue-600" },
    { label: "资料总数", value: totalMaterials, icon: FileText, color: "text-purple-600" },
    { label: "待审核", value: pendingCount, icon: Clock, color: "text-yellow-600" },
    { label: "已通过", value: approvedCount, icon: CheckCircle, color: "text-green-600" },
    { label: "已拒绝", value: rejectedCount, icon: XCircle, color: "text-red-600" },
    { label: "总下载量", value: totalDownloads, icon: Download, color: "text-indigo-600" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">管理仪表盘</h1>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
