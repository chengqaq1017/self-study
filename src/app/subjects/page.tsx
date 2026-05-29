import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function SubjectsPage() {
  const subjects = await prisma.subject.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { materials: { where: { status: "APPROVED" } } } },
    },
  });

  // 按学院分组
  const grouped = subjects.reduce<Record<string, typeof subjects>>((acc, s) => {
    const college = s.college ?? "其他";
    if (!acc[college]) acc[college] = [];
    acc[college].push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">科目分类</h1>
      {Object.entries(grouped).map(([college, list]) => (
        <div key={college}>
          <h2 className="mb-3 text-lg font-semibold text-gray-700">{college}</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {list.map((s) => (
              <Link
                key={s.id}
                href={`/subjects/${s.id}`}
                className="rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
              >
                <p className="font-medium text-gray-900">{s.name}</p>
                {s.code && (
                  <p className="mt-0.5 text-xs text-gray-400">{s.code}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  {s._count.materials} 份资料
                </p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
