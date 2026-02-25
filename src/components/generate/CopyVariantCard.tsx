"use client";
import { useState } from "react";
import type { CopyVariant } from "@/lib/types";

interface CopyVariantCardProps {
  variant: CopyVariant;
}

const VARIANT_COLORS = {
  A: { label: "理性版", accent: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/25" },
  B: { label: "情感版", accent: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/25" },
  C: { label: "紧迫版", accent: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/25" },
};

export function CopyVariantCard({ variant }: CopyVariantCardProps) {
  const [copied, setCopied] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const style = VARIANT_COLORS[variant.id] ?? VARIANT_COLORS.A;

  async function copyText(text: string, field: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }

  async function copyFull() {
    const full = `${variant.title}\n\n${variant.body}\n\n${variant.tags.join(" ")}`;
    try { await navigator.clipboard.writeText(full); }
    catch {
      const el = document.createElement("textarea");
      el.value = full;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="glass-card flex flex-col gap-0 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      {/* 顶部标识栏 */}
      <div className={`flex items-center justify-between border-b border-white/[0.06] px-4 py-3 ${style.bg}`}>
        <div className="flex items-center gap-2.5">
          <span className={`flex h-6 w-6 items-center justify-center rounded-lg border ${style.border} ${style.bg} text-xs font-bold ${style.accent}`}>
            {variant.id}
          </span>
          <span className={`text-xs font-semibold ${style.accent}`}>{style.label}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* 互动分 */}
          <div className="flex items-center gap-1">
            <div className="h-1 w-12 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-pink-500"
                style={{ width: `${variant.engagementScore}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500">{variant.engagementScore}</span>
          </div>
        </div>
      </div>

      {/* 内容区 */}
      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* 钩子句 */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">开头钩子</span>
            <button
              type="button"
              onClick={() => copyText(variant.hook, "hook")}
              className={`copy-btn ${copiedField === "hook" ? "copied" : ""}`}
            >
              {copiedField === "hook" ? "✓" : "复制"}
            </button>
          </div>
          <p className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-2.5 text-xs italic text-gray-400 leading-relaxed">
            &quot;{variant.hook}&quot;
          </p>
        </div>

        {/* 标题 */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-orange-500/70">标题</span>
            <button
              type="button"
              onClick={() => copyText(variant.title, "title")}
              className={`copy-btn ${copiedField === "title" ? "copied" : ""}`}
            >
              {copiedField === "title" ? "✓" : "复制"}
            </button>
          </div>
          <p className="text-sm font-semibold leading-snug text-gray-200">{variant.title}</p>
        </div>

        {/* 正文 */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-pink-500/70">正文</span>
            <button
              type="button"
              onClick={() => copyText(variant.body, "body")}
              className={`copy-btn ${copiedField === "body" ? "copied" : ""}`}
            >
              {copiedField === "body" ? "✓" : "复制"}
            </button>
          </div>
          <p className="whitespace-pre-line text-xs leading-relaxed text-gray-400">{variant.body}</p>
        </div>

        {/* 标签 */}
        <div>
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-gray-600">话题标签</span>
          <div className="flex flex-wrap gap-1.5">
            {variant.tags.map((tag) => (
              <span key={tag} className="tag-badge">{tag}</span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-gray-600">结尾 CTA</span>
          <p className="text-xs text-gray-400">{variant.cta}</p>
        </div>
      </div>

      {/* 底部：发布时间 + 一键复制 */}
      <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {variant.postingTime}
        </div>
        <button
          type="button"
          onClick={copyFull}
          className={`copy-btn ${copied ? "copied" : ""}`}
        >
          {copied ? (
            <><span>✓</span><span>已复制全文</span></>
          ) : (
            <><span>⎘</span><span>一键复制全文</span></>
          )}
        </button>
      </div>
    </div>
  );
}
