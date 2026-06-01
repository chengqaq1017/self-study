import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { COLLEGE_NAME } from "@/lib/colleges";
import { BookOpen, GraduationCap, Search, Upload, Users } from "lucide-react";

export default async function Home() {
  const [subjectCount, materialCount, userCount] = await Promise.all([
    prisma.subject.count({ where: { college: COLLEGE_NAME } }),
    prisma.material.count({ where: { status: "APPROVED" } }),
    prisma.user.count(),
  ]);

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-4">
            <Image
              src="/whut-logo.svg"
              alt="武汉理工大学"
              width={180}
              height={50}
              className="h-10 w-auto"
              priority
            />
            <Image
              src="/naoep-logo.png"
              alt="船海与能源动力工程学院"
              width={210}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          </div>

          <h1 className="mt-7 text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">
            船海与能源动力工程学院资料共享平台
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">
            面向武汉理工大学船舶与海洋工程、轮机工程、能源与动力工程（船舶）相关专业，集中共享课程笔记、试卷资料、实验报告模板和复习参考。
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/materials"
              className="flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 font-medium text-white hover:bg-primary-light"
            >
              <Search className="h-5 w-5" />
              查找资料
            </Link>
            <Link
              href="/upload"
              className="flex items-center justify-center gap-2 rounded-md border px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
            >
              <Upload className="h-5 w-5" />
              上传资料
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-2xl font-bold text-primary">
            <BookOpen className="h-7 w-7" />
            {subjectCount}
          </div>
          <p className="mt-1 text-sm text-gray-500">课程条目</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="text-2xl font-bold text-primary">{materialCount}</div>
          <p className="mt-1 text-sm text-gray-500">已公开资料</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Users className="h-7 w-7" />
            {userCount}
          </div>
          <p className="mt-1 text-sm text-gray-500">注册用户</p>
        </div>
      </section>

      <section className="rounded-lg border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2 text-primary">
          <GraduationCap className="h-6 w-6" />
          <h2 className="text-lg font-bold text-gray-900">网站简介</h2>
        </div>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-gray-600 sm:text-base">
          本站只聚焦船海与能源动力工程学院相关专业资料。用户登录后可批量上传资料，填写课程和资料年份；资料经管理员审核后公开展示，便于同专业同学按课程、关键词和年份检索。
        </p>
      </section>
    </div>
  );
}
