"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  currentRole: string;
  userName: string;
}

export function UserRoleButton({ userId, currentRole, userName }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const targetRole = currentRole === "ADMIN" ? "STUDENT" : "ADMIN";
  const label = currentRole === "ADMIN" ? "降级为学生" : "提升为管理员";
  const confirmMsg =
    currentRole === "ADMIN"
      ? `确定要将 ${userName} 降级为学生吗？`
      : `确定要将 ${userName} 提升为管理员吗？`;

  const handleToggle = async () => {
    if (!window.confirm(confirmMsg)) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: targetRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error ?? "操作失败");
        return;
      }

      router.refresh();
    } catch {
      alert("网络错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`rounded px-2.5 py-1 text-xs font-medium transition ${
        currentRole === "ADMIN"
          ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
          : "bg-blue-50 text-blue-600 hover:bg-blue-100"
      } disabled:opacity-50`}
    >
      {loading ? "处理中..." : label}
    </button>
  );
}
