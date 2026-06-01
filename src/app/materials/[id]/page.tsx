import { notFound } from "next/navigation";
import { Calendar, Download, FileText, User } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DownloadButton } from "@/components/materials/DownloadButton";

export default async function MaterialDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const material = await prisma.material.findUnique({
    where: { id },
    include: {
      subject: { select: { id: true, name: true, college: true } },
      uploader: { select: { id: true, name: true } },
    },
  });

  if (!material) {
    notFound();
  }

  if (material.status !== "APPROVED") {
    if (
      !session?.user ||
      (session.user.id !== material.uploaderId && session.user.role !== "ADMIN")
    ) {
      notFound();
    }
  }

  const isOwner = session?.user?.id === material.uploaderId;
  const isAdmin = session?.user?.role === "ADMIN";

  const statusBadge = {
    PENDING: { text: "审核中", color: "bg-yellow-100 text-yellow-700" },
    APPROVED: { text: "已通过", color: "bg-green-100 text-green-700" },
    REJECTED: { text: "已拒绝", color: "bg-red-100 text-red-700" },
  }[material.status];

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "未知";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-lg border bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="break-words text-xl font-bold text-gray-900">{material.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <a href={`/subjects/${material.subject.id}`} className="text-primary hover:underline">
                {material.subject.name}
              </a>
              {material.subject.college && <span>· {material.subject.college}</span>}
              {material.semester && <span>· 年份：{material.semester}</span>}
            </div>
          </div>
          <span
            className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge.color}`}
          >
            {statusBadge.text}
          </span>
        </div>

        {material.description && (
          <p className="mt-4 whitespace-pre-wrap text-gray-600">{material.description}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            {formatSize(material.fileSize)}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(material.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            {material.uploader.name ?? "未知用户"}
          </span>
          <span className="flex items-center gap-1">
            <Download className="h-3.5 w-3.5" />
            {material.downloadCount} 次下载
          </span>
        </div>

        <div className="mt-6">
          {(material.status === "APPROVED" || isOwner || isAdmin) && (
            <DownloadButton materialId={material.id} fileName={material.fileName} />
          )}
          {material.status !== "APPROVED" && !isOwner && !isAdmin && (
            <p className="text-sm text-gray-400">该资料尚未通过审核</p>
          )}
          {material.status === "PENDING" && isOwner && (
            <p className="mt-2 text-xs text-yellow-600">审核通过后即可被其他同学下载</p>
          )}
        </div>
      </div>
    </div>
  );
}
