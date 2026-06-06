import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { COLLEGE_NAME } from "@/lib/colleges";
import {
  GraduationCap,
  Search,
  Upload,
} from "lucide-react";

export default async function Home() {
  const subjectCount = await prisma.subject.count({ where: { college: COLLEGE_NAME } });

  return (
    <div className="space-y-7 sm:space-y-9">
      <section className="surface subtle-grid overflow-hidden rounded-lg">
        <div className="p-4 sm:p-8 lg:p-10">
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
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 font-medium text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary-light"
            >
              <Search className="h-5 w-5" />
              查找资料
            </Link>
            <Link
              href="/upload"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white/78 px-5 py-2.5 font-medium text-slate-700 transition-colors hover:bg-white hover:text-primary"
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
