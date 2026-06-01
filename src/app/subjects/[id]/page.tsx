import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MaterialCard } from "@/components/materials/MaterialCard";

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const subject = await prisma.subject.findUnique({
    where: { id },
  });

  if (!subject) {
    notFound();
  }

  const materials = await prisma.material.findMany({
    where: { subjectId: id, status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    include: {
      uploader: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/subjects" className="text-sm text-primary hover:underline">
          返回课程目录
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{subject.name}</h1>
        <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
          {subject.code && <span>{subject.code}</span>}
          {subject.college && <span>{subject.college}</span>}
        </div>
        {subject.description && <p className="mt-2 text-gray-600">{subject.description}</p>}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-800">
          课程资料（{materials.length}）
        </h2>
        {materials.length === 0 ? (
          <p className="rounded-lg border bg-white p-8 text-center text-gray-400">
            暂无资料，欢迎上传第一份。
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {materials.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
