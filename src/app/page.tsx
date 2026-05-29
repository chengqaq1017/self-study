import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BookOpen, Search, Upload, Users } from "lucide-react";

export default async function Home() {
  const [subjectCount, materialCount, userCount, recentSubjects] = await Promise.all([
    prisma.subject.count(),
    prisma.material.count({ where: { status: "APPROVED" } }),
    prisma.user.count(),
    prisma.subject.findMany({ take: 12, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-primary to-primary-light p-12 text-white text-center">
        <h1 className="text-4xl font-bold">武理工自习室</h1>
        <p className="mt-3 text-lg text-blue-100">
          武汉理工大学笔记与考试资料分享平台
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/materials"
            className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-primary hover:bg-blue-50"
          >
            <Search className="h-5 w-5" />
            搜索资料
          </Link>
          <Link
            href="/upload"
            className="flex items-center gap-2 rounded-lg border-2 border-white px-6 py-3 font-medium text-white hover:bg-white/10"
          >
            <Upload className="h-5 w-5" />
            上传资料
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-6">
        <div className="rounded-xl bg-white p-6 text-center shadow-sm">
          <div className="flex items-center justify-center gap-2 text-3xl font-bold text-primary">
            <BookOpen className="h-8 w-8" />
            {subjectCount}
          </div>
          <p className="mt-1 text-sm text-gray-500">科目数量</p>
        </div>
        <div className="rounded-xl bg-white p-6 text-center shadow-sm">
          <div className="text-3xl font-bold text-primary">{materialCount}</div>
          <p className="mt-1 text-sm text-gray-500">资料数量</p>
        </div>
        <div className="rounded-xl bg-white p-6 text-center shadow-sm">
          <div className="flex items-center justify-center gap-2 text-3xl font-bold text-primary">
            <Users className="h-8 w-8" />
            {userCount}
          </div>
          <p className="mt-1 text-sm text-gray-500">注册用户</p>
        </div>
      </section>

      {/* Subjects */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">科目分类</h2>
          <Link href="/subjects" className="text-sm text-primary hover:underline">
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {recentSubjects.map((s) => (
            <Link
              key={s.id}
              href={`/subjects/${s.id}`}
              className="rounded-lg border bg-white p-4 text-center transition-shadow hover:shadow-md"
            >
              <p className="font-medium text-gray-900">{s.name}</p>
              {s.college && (
                <p className="mt-1 text-xs text-gray-400">{s.college}</p>
              )}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
