"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ReviewActionModal } from "./ReviewActionModal";

interface MaterialItem {
  id: string;
  title: string;
  semester: string | null;
  fileType: string;
  fileSize: number;
  status: string;
  createdAt: Date;
  uploader: { name: string | null; email: string } | null;
  subject: { name: string };
  reviews: { status: string; comment: string | null; reviewer: { name: string | null } | null }[];
}

export function ReviewTable({ materials }: { materials: MaterialItem[] }) {
  const router = useRouter();
  const [selectedMaterial, setSelectedMaterial] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [action, setAction] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [processing, setProcessing] = useState(false);

  const formatDate = (d: Date) =>
    new Intl.DateTimeFormat("zh-CN").format(d);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "未知";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  async function handleReview(comment?: string) {
    if (!selectedMaterial) return;
    setProcessing(true);

    try {
      const res = await fetch(`/api/materials/${selectedMaterial.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action, comment }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "操作失败");
      }

      setSelectedMaterial(null);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "审核失败");
    } finally {
      setProcessing(false);
    }
  }

  if (materials.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-gray-400">
        暂无数据
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {materials.map((m) => (
          <div key={m.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <a
                  href={`/materials/${m.id}`}
                  className="line-clamp-2 font-medium text-primary"
                >
                  {m.title}
                </a>
                <p className="mt-1 text-sm text-gray-500">{m.subject.name}</p>
              </div>
              <span className="flex-shrink-0 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">
                {formatSize(m.fileSize)}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
              <div>
                <span className="block text-gray-400">上传者</span>
                <span className="truncate">{m.uploader?.name ?? m.uploader?.email ?? "—"}</span>
              </div>
              <div>
                <span className="block text-gray-400">时间</span>
                <span>{formatDate(m.createdAt)}</span>
              </div>
              <div>
                <span className="block text-gray-400">学期</span>
                <span>{m.semester ?? "—"}</span>
              </div>
              <div>
                <span className="block text-gray-400">最后审核</span>
                <span>{m.reviews[0]?.reviewer?.name ?? "—"}</span>
              </div>
            </div>

            <div className="mt-4">
              {m.status === "PENDING" ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSelectedMaterial(m);
                      setAction("APPROVED");
                    }}
                    className="rounded-md bg-green-500 px-3 py-2 text-sm text-white hover:bg-green-600"
                  >
                    通过
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMaterial(m);
                      setAction("REJECTED");
                    }}
                    className="rounded-md bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
                  >
                    拒绝
                  </button>
                </div>
              ) : m.reviews[0] ? (
                <span
                  className={`text-sm ${
                    m.reviews[0].status === "APPROVED"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {m.reviews[0].status === "APPROVED" ? "已通过" : "已拒绝"}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-lg border bg-white md:block">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">标题</th>
              <th className="px-4 py-3">科目</th>
              <th className="px-4 py-3">上传者</th>
              <th className="px-4 py-3">大小</th>
              <th className="px-4 py-3">时间</th>
              <th className="px-4 py-3">最后审核</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {materials.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <a
                    href={`/materials/${m.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {m.title}
                  </a>
                  {m.semester && (
                    <span className="ml-2 text-xs text-gray-400">
                      {m.semester}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">{m.subject.name}</td>
                <td className="px-4 py-3 text-gray-600">
                  {m.uploader?.name ?? m.uploader?.email ?? "—"}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {formatSize(m.fileSize)}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {formatDate(m.createdAt)}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {m.reviews[0]?.reviewer?.name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  {m.status === "PENDING" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedMaterial(m);
                          setAction("APPROVED");
                        }}
                        className="rounded bg-green-500 px-3 py-1 text-xs text-white hover:bg-green-600"
                      >
                        通过
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMaterial(m);
                          setAction("REJECTED");
                        }}
                        className="rounded bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600"
                      >
                        拒绝
                      </button>
                    </div>
                  ) : m.reviews[0] ? (
                    <span
                      className={`text-xs ${
                        m.reviews[0].status === "APPROVED"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {m.reviews[0].status === "APPROVED" ? "已通过" : "已拒绝"}
                    </span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedMaterial && (
        <ReviewActionModal
          title={selectedMaterial.title}
          action={action === "APPROVED" ? "通过" : "拒绝"}
          processing={processing}
          onConfirm={(comment) => handleReview(comment)}
          onCancel={() => setSelectedMaterial(null)}
        />
      )}
    </>
  );
}
