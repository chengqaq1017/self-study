import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { COLLEGE_NAME } from "@/lib/colleges";
import { sortSubjectsByPinyin } from "@/lib/subjects";

export default async function SubjectsPage() {
  const subjects = sortSubjectsByPinyin(
    await prisma.subject.findMany({
      where: { college: COLLEGE_NAME },
      include: {
        _count: { select: { materials: { where: { status: "APPROVED" } } } },
      },
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">课程目录</h1>
        <p className="mt-2 text-sm text-slate-500">
          仅展示船海与能源动力工程学院相关专业培养方案课程，按拼音排序。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {subjects.map((subject) => (
          <Link
            key={subject.id}
            href={`/subjects/${subject.id}`}
            className="card-hover rounded-lg border border-white/70 bg-white/86 p-4 shadow-sm"
          >
            <p className="font-semibold text-ink">{subject.name}</p>
            {subject.code && <p className="mt-0.5 text-xs text-slate-400">{subject.code}</p>}
            <p className="mt-3 inline-flex rounded-full bg-primary/8 px-2.5 py-1 text-xs font-medium text-primary">
              {subject._count.materials} 份资料
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
