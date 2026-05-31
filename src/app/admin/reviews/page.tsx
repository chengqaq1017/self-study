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
      <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">资料审核</h1>

      <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-100 p-1 text-center text-sm sm:inline-grid sm:w-auto">
        {(["PENDING", "APPROVED", "REJECTED"] as const).map((s) => (
          <a
            key={s}
            href={`/admin/reviews?status=${s}`}
            className={`rounded-md px-3 py-2 font-medium ${
              status === s
                ? "bg-white text-primary shadow-sm"
                : "text-gray-600 hover:bg-white/70"
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
