"use client";
import { useState } from "react";
import type { AnalyzedProduct } from "@/lib/types";

interface ProductAnalysisCardProps {
  product: AnalyzedProduct;
}

export function ProductAnalysisCard({ product }: ProductAnalysisCardProps) {
  const [open, setOpen] = useState(true);

  return (
    <section className="glass-card-elevated overflow-hidden">
      {/* 标题行 */}
      <button
        type="button"
        className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-white/[0.03]"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/20 to-pink-500/20 border border-orange-500/20">
            <svg className="h-4 w-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-heading text-base font-semibold text-white">产品分析摘要</h3>
            {!open && (
              <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">{product.name} · {product.category}</p>
            )}
          </div>
        </div>
        <svg
          className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="animate-fade-in border-t border-white/[0.06] px-6 pb-6 pt-5">
          {/* 产品名称 + 品类 */}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <h4 className="font-heading text-lg font-bold text-white">{product.name}</h4>
            <span className="rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-400">
              {product.category}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400">
              {product.pricePositioning}
            </span>
          </div>

          {/* 总结 */}
          <p className="mb-5 text-sm leading-relaxed text-gray-300">{product.summary}</p>

          <div className="grid gap-5 md:grid-cols-3">
            {/* 核心卖点 */}
            <div>
              <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-orange-400">
                <span className="h-1 w-4 rounded-full bg-orange-500/60" />
                核心卖点
              </p>
              <ul className="space-y-2">
                {product.usps.slice(0, 4).map((u, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-500/50" />
                    {u}
                  </li>
                ))}
              </ul>
            </div>

            {/* 目标受众 */}
            <div>
              <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-pink-400">
                <span className="h-1 w-4 rounded-full bg-pink-500/60" />
                目标受众
              </p>
              <div className="space-y-2">
                {product.audienceSegments.slice(0, 2).map((seg, i) => (
                  <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                    <p className="text-xs font-semibold text-gray-300">{seg.label}</p>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">{seg.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 情感触发 + 差异化 */}
            <div className="space-y-4">
              <div>
                <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-purple-400">
                  <span className="h-1 w-4 rounded-full bg-purple-500/60" />
                  情感触发
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {product.emotionalTriggers.map((t) => (
                    <span key={t} className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-xs text-purple-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-400">
                  <span className="h-1 w-4 rounded-full bg-blue-500/60" />
                  差异化优势
                </p>
                <ul className="space-y-1.5">
                  {product.differentiators.slice(0, 3).map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                      <span className="mt-1 h-1 w-3 flex-shrink-0 rounded-full bg-blue-500/40" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
