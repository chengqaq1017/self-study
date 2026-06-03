"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Download } from "lucide-react";

export function DownloadButton({
  materialId,
  fileName,
}: {
  materialId: string;
  fileName: string;
}) {
  const { data: session } = useSession();
  const [clicked, setClicked] = useState(false);

  if (!session?.user) {
    return (
      <Link
        href={`/login?callbackUrl=/materials/${materialId}`}
        className="inline-flex items-center gap-2 rounded-md bg-gray-400 px-6 py-2.5 text-white hover:bg-gray-500"
      >
        <Download className="h-4 w-4" />
        登录后下载
      </Link>
    );
  }

  // 使用原生 <a> 标签直接访问下载 API，浏览器原生处理下载：
  // 1. 自动携带 session cookie（同源请求）
  // 2. 不经过 JS 内存，大文件也不会卡
  // 3. 手机端自动弹出保存/下载管理器
  // 4. 浏览器原生显示下载进度
  return (
    <a
      href={`/api/materials/${materialId}/download`}
      download={fileName}
      onClick={() => setClicked(true)}
      className={`inline-flex items-center gap-2 rounded-md px-6 py-2.5 text-white ${
        clicked ? "cursor-wait bg-gray-400" : "bg-primary hover:bg-primary-light"
      }`}
    >
      <Download className="h-4 w-4" />
      {clicked ? "下载中..." : "下载文件"}
    </a>
  );
}
