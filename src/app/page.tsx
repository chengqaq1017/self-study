import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { COLLEGE_NAME } from "@/lib/colleges";
import {
  BookOpen,
  ClipboardCheck,
  Download,
  FileStack,
  GraduationCap,
  Search,
  Upload,
  Users,
} from "lucide-react";

export default async function Home() {
  const [subjectCount, materialCount, userCount] = await Promise.all([
    prisma.subject.count({ where: { college: COLLEGE_NAME } }),
    prisma.material.count({ where: { status: "APPROVED" } }),
    prisma.user.count(),
  ]);

  return (
    <div className="space-y-7 sm:space-y-9">
      <section className="surface subtle-grid overflow-hidden rounded-lg">
        <div className="grid gap-6 p-4 sm:gap-8 sm:p-8 lg:grid-cols-[1.08fr_0.92fr] lg:p-10">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Image
                src="/whut-logo.svg"
                alt="武汉理工大学"
                width={180}
                height={50}
                className="h-9 w-auto sm:h-10"
                priority
              />
              <span className="text-sm font-medium text-primary/70 sm:text-base">
                船海与能源动力工程学院
              </span>
            </div>

            <h1 className="mt-5 max-w-3xl text-2xl font-bold leading-tight text-ink sm:text-5xl">
              让课程资料更好找，也更值得被整理。
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              面向武汉理工大学船舶与海洋工程、轮机工程、能源与动力工程（船舶）相关专业，集中共享课程笔记、试卷资料、实验报告模板和复习参考。
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/materials"
                className="flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 font-medium text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary-light"
              >
                <Search className="h-5 w-5" />
                查找资料
              </Link>
              <Link
                href="/upload"
                className="flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white/78 px-5 py-2.5 font-medium text-slate-700 transition-colors hover:bg-white hover:text-primary"
              >
                <Upload className="h-5 w-5" />
                上传资料
              </Link>
            </div>

            <div className="mt-6 grid gap-2 text-sm sm:grid-cols-3">
              {[
                ["/subjects", "课程目录", `${subjectCount} 条课程索引`],
                ["/materials?sort=popular", "热门资料", "按下载量排序"],
                ["/upload", "贡献资料", "批量上传文件"],
              ].map(([href, title, desc]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-md border border-white/70 bg-white/68 px-3 py-2 transition-colors hover:bg-white hover:text-primary"
                >
                  <span className="block font-semibold text-ink">{title}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{desc}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="hero-radar relative overflow-hidden rounded-lg p-4 text-white shadow-2xl shadow-primary/18 sm:p-6">
            <div className="absolute -right-12 -top-14 h-40 w-40 rounded-full border border-white/18" />
            <div className="absolute -right-4 top-12 h-24 w-24 rounded-full border border-white/16" />
            <div className="absolute bottom-8 right-10 h-3 w-3 rounded-full bg-white/80" />
            <div className="relative">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white/74">Study Hub</p>
                  <p className="mt-1 text-2xl font-bold">资料流转面板</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/16">
                  <FileStack className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-3">
                <div className="rounded-lg bg-white/14 p-3">
                  <div className="flex items-center gap-1.5 text-2xl font-bold">
                    <BookOpen className="h-5 w-5" />
                    {subjectCount}
                  </div>
                  <p className="mt-1 text-xs text-white/72">课程</p>
                </div>
                <div className="rounded-lg bg-white/14 p-3">
                  <div className="flex items-center gap-1.5 text-2xl font-bold">
                    <Download className="h-5 w-5" />
                    {materialCount}
                  </div>
                  <p className="mt-1 text-xs text-white/72">资料</p>
                </div>
                <div className="rounded-lg bg-white/14 p-3">
                  <div className="flex items-center gap-1.5 text-2xl font-bold">
                    <Users className="h-5 w-5" />
                    {userCount}
                  </div>
                  <p className="mt-1 text-xs text-white/72">用户</p>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                {[
                  ["课程匹配", "按培养方案归档"],
                  ["资料审核", "管理员审核后公开"],
                  ["检索下载", "按关键词和年份查找"],
                ].map(([title, body]) => (
                  <div key={title} className="flex items-center gap-3 rounded-md bg-white/12 px-3 py-2">
                    <ClipboardCheck className="h-4 w-4 flex-shrink-0 text-white/80" />
                    <div>
                      <p className="font-medium">{title}</p>
                      <p className="text-xs text-white/66">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-[0.78fr_1.22fr]">
        <div className="surface rounded-lg p-5 sm:p-6">
          <div className="flex items-center gap-2 text-primary">
            <GraduationCap className="h-6 w-6" />
            <h2 className="text-lg font-bold text-ink">网站简介</h2>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            本站只聚焦船海与能源动力工程学院相关专业资料。资料经管理员审核后公开展示，便于同专业同学按课程、关键词和年份检索。
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["课程索引", "按培养方案课程整理，降低查找成本。"],
            ["资料审核", "上传后统一审核，让资料库保持清晰可用。"],
            ["年份标注", "按资料来源年份筛选，更适合复习和回溯。"],
          ].map(([title, body]) => (
            <div key={title} className="card-hover rounded-lg border border-white/70 bg-white/84 p-4 shadow-sm">
              <p className="font-semibold text-ink">{title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
