"use client";

import { PortalHeader } from "@/components/portal/PortalHeader";
import { ToolCard } from "@/components/portal/ToolCard";

const MeetIcon = () => (
  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const VideoIcon = () => (
  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v1.5m1.5-2.625C19.496 8.25 19 8.754 19 9.375v1.5m0-5.25v5.25m0 0c0 .621-.504 1.125-1.125 1.125H7.875m10.125 0h-1.5m-7.5 0v3.75m0-3.75C7.5 13.875 7.5 14.625 7.5 15.375m0-3.75H6.375" />
  </svg>
);

export default function Portal() {
  return (
    <>
      <PortalHeader />

      {/* Background glow orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-36 top-1/4 h-[32rem] w-[32rem] rounded-full bg-indigo-600/25 blur-[140px] animate-float-slow" />
        <div className="absolute -right-36 top-1/3 h-[28rem] w-[28rem] rounded-full bg-cyan-600/15 blur-[120px] animate-float-slower" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-600/10 blur-[90px] animate-float-slow" />
      </div>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-20 pt-28">
        {/* Hero */}
        <div className="mb-16 text-center animate-slide-up">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface px-4 py-1.5 text-xs text-gray-400 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
            所有工具免费开始使用
          </div>

          <h1 className="font-heading text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            效率工具，
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              AI 驱动
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-400">
            精心打造的 AI 工具集，让会议记录、格式转换等日常任务
            变得简单快速。专业、可靠、开箱即用。
          </p>
        </div>

        {/* Tool cards */}
        <div className="mx-auto grid w-full max-w-4xl gap-6 md:grid-cols-2 animate-slide-up">
          <ToolCard
            href="/meeting"
            variant="indigo"
            icon={<MeetIcon />}
            name="MeetAI"
            tagline="AI 会议纪要助手"
            description="粘贴会议记录或上传录音，AI 自动生成结构化摘要、待办事项和完整纪要。告别手动整理，一键搞定。"
            features={[
              { label: "文字 & 录音双输入" },
              { label: "自动提取待办" },
              { label: "一键复制/下载" },
            ]}
            cta="立即使用"
          />

          <ToolCard
            href="https://vfconverter.cn"
            external
            variant="cyan"
            icon={<VideoIcon />}
            name="VFConverter"
            tagline="视频图片格式转换器"
            description="在线转换视频和图片格式，支持 MP4、MOV、AVI、WebP、JPG 等 20+ 种格式，快速、免费、无需安装。"
            features={[
              { label: "20+ 格式支持" },
              { label: "免费试用" },
              { label: "无需安装" },
            ]}
            cta="立即转换"
          />
        </div>

        {/* Footer */}
        <footer className="mt-20 border-t border-surface-border pt-8 text-center">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} ToolsAI · 专注打造实用的 AI 效率工具
          </p>
        </footer>
      </main>
    </>
  );
}
