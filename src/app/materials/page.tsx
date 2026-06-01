import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MaterialCard } from "@/components/materials/MaterialCard";
import { SubjectCombobox } from "@/components/subjects/SubjectCombobox";
import { sortSubjectsByPinyin } from "@/lib/subjects";

export default async function MaterialsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1", 10);
  const limit = 20;
  const subjectId = sp.subjectId;
  const year = sp.year;
  const q = sp.q;
  const sort = sp.sort ?? "latest";

  const where: Record<string, unknown> = { status: "APPROVED" };
  if (subjectId) where.subjectId = subjectId;
  if (year) where.semester = year;
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const orderBy =
    sort === "popular" ? { downloadCount: "desc" as const } : { createdAt: "desc" as const };

  const [materials, total, subjects] = await Promise.all([
    prisma.material.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        uploader: { select: { name: true } },
        subject: { select: { name: true } },
      },
    }),
    prisma.material.count({ where }),
    prisma.subject.findMany({ select: { id: true, name: true } }).then(sortSubjectsByPinyin),
  ]);

  const selectedSubject = subjects.find((subject) => subject.id === subjectId);
  const totalPages = Math.ceil(total / limit);
  const pageQuery = (nextPage: number) => {
    const params = new URLSearchParams();
    params.set("page", String(nextPage));
    if (subjectId) params.set("subjectId", subjectId);
    if (year) params.set("year", year);
    if (q) params.set("q", q);
    params.set("sort", sort);
    return `/materials?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">资料库</h1>

      <form className="grid grid-cols-1 gap-3 rounded-lg border bg-white p-3 shadow-sm sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end">
        <div className="min-w-0 lg:w-64">
          <label className="block text-xs text-gray-500">搜索</label>
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="搜索标题或描述"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none lg:py-1.5"
          />
        </div>
        <div className="min-w-0 lg:w-64">
          <label className="block text-xs text-gray-500">课程</label>
          <SubjectCombobox
            subjects={subjects}
            value={subjectId}
            inputValue={selectedSubject?.name ?? ""}
            placeholder="输入课程名筛选"
          />
        </div>
        <div className="min-w-0 lg:w-32">
          <label className="block text-xs text-gray-500">年份</label>
          <input
            type="text"
            name="year"
            defaultValue={year}
            placeholder="2025"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none lg:py-1.5"
          />
        </div>
        <div className="min-w-0 lg:w-36">
          <label className="block text-xs text-gray-500">排序</label>
          <select
            name="sort"
            defaultValue={sort}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none lg:py-1.5"
          >
            <option value="latest">最新上传</option>
            <option value="popular">最多下载</option>
          </select>
        </div>
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-light sm:self-end lg:py-1.5"
        >
          筛选
        </button>
      </form>

      {materials.length === 0 ? (
        <div className="rounded-lg border bg-white p-12 text-center text-gray-400">
          暂未找到相关资料
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500">共 {total} 份资料</p>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {materials.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              {page > 1 && (
                <Link href={pageQuery(page - 1)} className="rounded-md border bg-white px-4 py-2 text-sm hover:bg-gray-50">
                  上一页
                </Link>
              )}
              <span className="text-sm text-gray-500">
                {page} / {totalPages}
              </span>
              {page < totalPages && (
                <Link href={pageQuery(page + 1)} className="rounded-md border bg-white px-4 py-2 text-sm hover:bg-gray-50">
                  下一页
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
