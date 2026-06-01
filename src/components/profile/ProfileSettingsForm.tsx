"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Save } from "lucide-react";

export function ProfileSettingsForm({
  name,
  email,
}: {
  name: string | null;
  email: string;
}) {
  const router = useRouter();
  const { update } = useSession();
  const [form, setForm] = useState({
    name: name ?? "",
    email,
    currentPassword: "",
    newPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim() || null,
          email: form.email.trim(),
          currentPassword: form.currentPassword || undefined,
          newPassword: form.newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "保存失败");
      }

      await update({ name: data.name, email: data.email });
      setForm((current) => ({ ...current, currentPassword: "", newPassword: "" }));
      setMessage("个人信息已更新");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900">个人信息</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">姓名</label>
          <input
            value={form.name}
            onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="请输入姓名"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">邮箱</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="请输入邮箱"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">当前密码</label>
          <input
            type="password"
            value={form.currentPassword}
            onChange={(e) =>
              setForm((current) => ({ ...current, currentPassword: e.target.value }))
            }
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="修改密码时填写"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">新密码</label>
          <input
            type="password"
            value={form.newPassword}
            onChange={(e) => setForm((current) => ({ ...current, newPassword: e.target.value }))}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="至少 6 位"
          />
        </div>
      </div>

      {error && <p className="mt-3 rounded-md bg-red-50 p-2 text-sm text-red-600">{error}</p>}
      {message && <p className="mt-3 rounded-md bg-green-50 p-2 text-sm text-green-700">{message}</p>}

      <button
        type="submit"
        disabled={saving}
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        {saving ? "保存中..." : "保存修改"}
      </button>
    </form>
  );
}
