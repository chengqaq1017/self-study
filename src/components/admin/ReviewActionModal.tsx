"use client";

import { useState } from "react";

interface ReviewActionModalProps {
  title: string;
  action: string;
  processing: boolean;
  onConfirm: (comment?: string) => void;
  onCancel: () => void;
}

export function ReviewActionModal({
  title,
  action,
  processing,
  onConfirm,
  onCancel,
}: ReviewActionModalProps) {
  const [comment, setComment] = useState("");

  return (
    <div className="modal-fade fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 sm:items-center">
      <div className="modal-panel w-full max-w-md rounded-lg bg-white p-5 shadow-xl sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900">{action}资料</h3>
        <p className="mt-1 text-sm text-gray-500">{title}</p>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            审核意见（可选）
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder={action === "拒绝" ? "请填写拒绝原因" : "审核意见"}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="rounded-md border px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 sm:py-2"
          >
            取消
          </button>
          <button
            type="button"
            onClick={() => onConfirm(comment || undefined)}
            disabled={processing}
            className={`rounded-md px-4 py-2.5 text-sm text-white sm:py-2 ${
              action === "通过" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
            } disabled:opacity-50`}
          >
            {processing ? "处理中..." : `确认${action}`}
          </button>
        </div>
      </div>
    </div>
  );
}
