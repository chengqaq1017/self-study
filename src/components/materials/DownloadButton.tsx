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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  async function handleDownload() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/materials/${materialId}/download`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "下载失败");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : "下载失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-white hover:bg-primary-light disabled:opacity-50"
      >
        <Download className="h-4 w-4" />
        {loading ? "下载中..." : "下载文件"}
      </button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
