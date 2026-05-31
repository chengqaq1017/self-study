import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BookOpen, Search, Upload, Users, HeartHandshake } from "lucide-react";

export default async function Home() {
  const [subjectCount, materialCount, userCount] = await Promise.all([
    prisma.subject.count(),
    prisma.material.count({ where: { status: "APPROVED" } }),
    prisma.user.count(),
  ]);

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Hero */}
      <section className="rounded-xl bg-gradient-to-br from-primary to-primary-light p-6 text-center text-white sm:rounded-2xl sm:p-10 lg:p-12">
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">武理资料共享平台</h1>
        <p className="mt-3 text-base text-blue-100 sm:text-lg">
          武汉理工大学笔记与考试资料分享平台
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link
            href="/materials"
            className="flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-primary hover:bg-blue-50"
          >
            <Search className="h-5 w-5" />
            搜索资料
          </Link>
          <Link
            href="/upload"
            className="flex items-center justify-center gap-2 rounded-lg border-2 border-white px-6 py-3 font-medium text-white hover:bg-white/10"
          >
            <Upload className="h-5 w-5" />
            上传资料
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
        <div className="rounded-lg bg-white p-4 text-center shadow-sm sm:rounded-xl sm:p-6">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary sm:text-3xl">
            <BookOpen className="h-7 w-7 sm:h-8 sm:w-8" />
            {subjectCount}
          </div>
          <p className="mt-1 text-sm text-gray-500">科目数量</p>
        </div>
        <div className="rounded-lg bg-white p-4 text-center shadow-sm sm:rounded-xl sm:p-6">
          <div className="text-2xl font-bold text-primary sm:text-3xl">{materialCount}</div>
          <p className="mt-1 text-sm text-gray-500">资料数量</p>
        </div>
        <div className="rounded-lg bg-white p-4 text-center shadow-sm sm:rounded-xl sm:p-6">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary sm:text-3xl">
            <Users className="h-7 w-7 sm:h-8 sm:w-8" />
            {userCount}
          </div>
          <p className="mt-1 text-sm text-gray-500">注册用户</p>
        </div>
      </section>

      {/* Intro */}
      <section className="rounded-xl border bg-white p-5 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-primary">
              <HeartHandshake className="h-6 w-6" />
              <h2 className="text-xl font-bold text-gray-900">简介</h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600 sm:text-base">
              本网站免费为武汉理工大学学生提供复习资料共享服务，方便同学们查找、上传和交流课程笔记、考试资料与学习参考内容。所有同学都可以登录后上传资料，审核通过后会公开展示，供大家学习交流使用。
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:min-w-48">
            <Link
              href="/materials"
              className="rounded-md bg-primary px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-light"
            >
              浏览资料库
            </Link>
            <Link
              href="/upload"
              className="rounded-md border px-4 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              分享资料
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
