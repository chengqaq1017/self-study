import { ShieldCheck } from "lucide-react";

const ICP_NUMBER = process.env.ICP_NUMBER ?? "鄂ICP备2026027939号-1";
const PSB_NUMBER = process.env.PSB_NUMBER ?? ""; // 公安备案号，在 https://www.beian.gov.cn/ 注册后填入

export function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-primary bg-slate-900 py-8 text-sm text-slate-200">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 sm:flex-row sm:justify-between sm:px-6">
        {/* 左侧：版权 */}
        <p className="text-center sm:text-left">
          <span className="font-bold text-white">
            船海能动资料共享平台
          </span>
          <span className="mx-2 text-slate-500">·</span>
          <span className="text-slate-200">武汉理工大学船海与能源动力工程学院</span>
        </p>

        {/* 右侧：双备案 */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs">
          {/* ICP 备案 */}
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-slate-300 transition-colors hover:text-white"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{ICP_NUMBER}</span>
          </a>

          {/* 公安备案（有号才显示） */}
          {PSB_NUMBER && (
            <>
              <span className="text-slate-500" aria-hidden="true">|</span>
              <a
                href="https://www.beian.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-slate-300 transition-colors hover:text-white"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{PSB_NUMBER}</span>
              </a>
            </>
          )}

          {/* 声明 */}
          <span className="text-slate-500" aria-hidden="true">|</span>
          <span className="text-slate-300">仅供学习交流使用</span>
        </div>
      </div>
    </footer>
  );
}
