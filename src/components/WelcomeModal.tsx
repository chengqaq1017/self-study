"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "whut-study-welcome-hidden-until";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const [hideForSevenDays, setHideForSevenDays] = useState(false);

  useEffect(() => {
    const hiddenUntil = Number(window.localStorage.getItem(STORAGE_KEY) ?? 0);
    if (!hiddenUntil || Date.now() > hiddenUntil) {
      setOpen(true);
    }
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
            <h2 className="text-lg font-semibold text-gray-900">
              欢迎使用武理资料共享平台
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              本网站免费为武汉理工大学学生提供复习资料共享服务。
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
          <div>
            <p className="font-medium text-gray-900">使用方法</p>
            <p className="mt-1">
              可以在资料库按关键词、科目和学期搜索资料；也可以登录后上传自己的复习资料。新上传的资料会先进入审核，通过后公开给同学下载。
            </p>
          </div>

          <div>
            <p className="font-medium text-gray-900">联系与反馈</p>
            <p className="mt-1">邮箱：364672@whut.edu.cn</p>
            <p>QQ：2782881499</p>
            <p className="mt-1">
              欢迎大家提出在使用网站时遇到的问题和改进建议。
            </p>
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
