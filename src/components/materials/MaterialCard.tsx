import Link from "next/link";
import { Clock, Download, FileText } from "lucide-react";

interface MaterialCardProps {
  material: {
    id: string;
    title: string;
    semester: string | null;
    downloadCount: number;
    fileType: string;
    createdAt: Date;
    uploader: { name: string | null } | null;
  };
}

export function MaterialCard({ material }: MaterialCardProps) {
  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);

  return (
    <Link
      href={`/materials/${material.id}`}
      className="block rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium text-gray-900">{material.title}</h3>
          {material.semester && <p className="text-xs text-gray-400">年份：{material.semester}</p>}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Download className="h-3 w-3" />
              {material.downloadCount}
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Clock className="h-3 w-3" />
              {formatDate(material.createdAt)}
            </span>
          </div>
          {material.uploader?.name && (
            <p className="mt-1 text-xs text-gray-400">上传：{material.uploader.name}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
