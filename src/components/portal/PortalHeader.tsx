"use client";

export function PortalHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-surface-border bg-surface backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <svg
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .28 2.716-1.103 2.83l-1.568.14a24.292 24.292 0 01-9.062 0l-1.568-.14c-1.383-.114-2.103-1.83-1.103-2.83L5 14.5"
              />
            </svg>
          </div>
          <span className="font-heading text-lg font-bold text-white">
            ToolsAI
          </span>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          <a
            href="/meeting"
            className="rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-surface-hover hover:text-white"
          >
            会议纪要
          </a>
          <a
            href="https://vfconverter.cn"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-surface-hover hover:text-white"
          >
            格式转换
          </a>
        </nav>
      </div>
    </header>
  );
}
