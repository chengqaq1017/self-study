"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "naoep-study-welcome-hidden-until";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const [hideForSevenDays, setHideForSevenDays] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const hiddenUntil = Number(window.localStorage.getItem(STORAGE_KEY) ?? 0);
      if (!hiddenUntil || Date.now() > hiddenUntil) {
        setOpen(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function close() {
    if (hideForSevenDays) {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now() + SEVEN_DAYS));
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="modal-fade fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-3 sm:items-center">
      <div className="modal-panel w-full max-w-lg rounded-lg bg-white p-5 shadow-xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">公告</h2>
            <p className="mt-1 text-sm text-gray-500">
              船海与能源动力工程学院课程资料库已按 2024 版培养方案重新整理。
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="关闭"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-sm leading-6 text-gray-600">
          <p>
            平台现在只收录船舶与海洋工程、轮机工程、能源与动力工程（船舶）相关课程资料。上传时可以一次选择多个文件，并用单个年份标注资料来源。
          </p>
          <p>
            个人中心已支持修改姓名、邮箱和密码。资料仍需审核后公开，请上传与课程学习直接相关的内容。
          </p>
          <div>
            <p className="font-medium text-gray-900">联系与反馈</p>
            <p className="mt-1">邮箱：364672@whut.edu.cn</p>
          </div>
        </div>

        <label className="mt-5 flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={hideForSevenDays}
            onChange={(e) => setHideForSevenDays(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          7 天内不再显示
        </label>

        <button
          type="button"
          onClick={close}
          className="mt-5 w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-light"
        >
          我知道了
        </button>
      </div>
    </div>
  );
}
