import { prisma } from "@/lib/prisma";
import { Users, FileText, Clock, CheckCircle, XCircle, Download, BookOpen, ClipboardCheck, FileStack } from "lucide-react";

export default async function AdminDashboardPage() {
  const [
    totalUsers,
    totalMaterials,
    pendingCount,
    approvedCount,
    rejectedCount,
    totalDownloads,
    subjectCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.material.count(),
    prisma.material.count({ where: { status: "PENDING" } }),
    prisma.material.count({ where: { status: "APPROVED" } }),
    prisma.material.count({ where: { status: "REJECTED" } }),
    prisma.downloadLog.count(),
    prisma.subject.count(),
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

      {/* 资料流转面板 */}
      <div className="admin-flow-panel relative overflow-hidden rounded-lg border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-400">Study Hub</p>
            <p className="mt-1 text-xl font-bold text-ink">资料流转面板</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileStack className="h-5 w-5 text-primary" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center gap-1.5 text-2xl font-bold text-ink">
              <BookOpen className="h-5 w-5 text-primary" />
              {subjectCount}
            </div>
            <p className="mt-1 text-xs text-slate-500">课程</p>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center gap-1.5 text-2xl font-bold text-ink">
              <Download className="h-5 w-5 text-accent" />
              {totalMaterials}
            </div>
            <p className="mt-1 text-xs text-slate-500">资料</p>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center gap-1.5 text-2xl font-bold text-ink">
              <Users className="h-5 w-5 text-purple-600" />
              {totalUsers}
            </div>
            <p className="mt-1 text-xs text-slate-500">用户</p>
          </div>
        </div>

        <div className="mt-5 space-y-2.5 text-sm">
          {[
            ["课程匹配", "按培养方案归档"],
            ["资料审核", "管理员审核后公开"],
            ["检索下载", "按关键词和年份查找"],
          ].map(([title, body]) => (
            <div key={title} className="flex items-center gap-3 rounded-md border border-slate-100 bg-slate-50/70 px-3 py-2">
              <ClipboardCheck className="h-4 w-4 flex-shrink-0 text-primary/60" />
              <div>
                <p className="font-medium text-ink">{title}</p>
                <p className="text-xs text-slate-500">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
