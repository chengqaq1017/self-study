import { prisma } from "@/lib/prisma";
import { ReviewTable } from "@/components/admin/ReviewTable";

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const status = (sp.status ?? "PENDING") as "PENDING" | "APPROVED" | "REJECTED";

  const materials = await prisma.material.findMany({
    where: { status },
    orderBy: { createdAt: "desc" },
    include: {
      uploader: { select: { name: true, email: true } },
      subject: { select: { name: true } },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { reviewer: { select: { name: true } } },
      },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">资料审核</h1>

      <div className="flex gap-3">
        {(["PENDING", "APPROVED", "REJECTED"] as const).map((s) => (
          <a
            key={s}
            href={`/admin/reviews?status=${s}`}
            className={`rounded-md px-4 py-1.5 text-sm font-medium ${
              status === s
                ? "bg-primary text-white"
                : "border bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {{ PENDING: "待审核", APPROVED: "已通过", REJECTED: "已拒绝" }[s]}
          </a>
        ))}
      </div>

      <ReviewTable materials={materials} />
    </div>
  );
}
