"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold text-gray-900">出错了</h1>
      <p className="mt-2 text-gray-500">
        {error.message ?? "页面加载失败，请稍后重试"}
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-md bg-primary px-6 py-2 text-white hover:bg-primary-light"
      >
        重试
      </button>
    </div>
  );
}
