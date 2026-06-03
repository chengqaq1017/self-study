import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white py-8 text-center text-sm text-gray-500">
      <div className="mx-auto max-w-7xl space-y-2 px-4 sm:px-6">
        <p className="font-medium text-gray-700">船海能动资料共享平台</p>
        <p>武汉理工大学船海与能源动力工程学院 · 课程资料交流</p>
        <p className="text-xs text-gray-400">仅供学习交流使用</p>
      </div>
    </footer>
  );
}
