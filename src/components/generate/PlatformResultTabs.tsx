"use client";
import { useState } from "react";
import type { PlatformContent } from "@/lib/types";
import { CopyVariantCard } from "./CopyVariantCard";
import { PLATFORM_RULES } from "@/lib/platforms";

interface PlatformResultTabsProps {
  platforms: PlatformContent[];
}

export function PlatformResultTabs({ platforms }: PlatformResultTabsProps) {
  const [activeId, setActiveId] = useState(platforms[0]?.platformId ?? "");
  const active = platforms.find((p) => p.platformId === activeId) ?? platforms[0];
  const rule = active ? PLATFORM_RULES[active.platformId] : null;

  return (
    <div className="space-y-5">
      {/* Tab 栏 */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <div className="flex min-w-max border-b border-white/[0.06]">
            {platforms.map((p) => {
              const r = PLATFORM_RULES[p.platformId];
              const isActive = activeId === p.platformId;
              return (
                <button
                  key={p.platformId}
                  type="button"
                  onClick={() => setActiveId(p.platformId)}
                  className={`result-tab ${isActive ? "active" : ""}`}
                >
                  <span className="text-base">{r.icon}</span>
                  <span>{r.name}</span>
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                    isActive
                      ? "bg-orange-500/20 text-orange-400"
                      : "bg-white/5 text-gray-600"
                  }`}>
                    {p.variants.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 平台调性说明 */}
        {rule && (
          <div className="animate-fade-in border-b border-white/[0.04] bg-white/[0.015] px-5 py-3">
            <p className="text-xs text-gray-500 leading-relaxed">
              <span className="mr-2 font-semibold text-gray-400">{rule.name} 调性：</span>
              {rule.toneGuidance}
            </p>
          </div>
        )}
      </div>

      {/* 文案变体卡片 */}
      {active && (
        <div className="animate-fade-in grid gap-4 md:grid-cols-3" key={activeId}>
          {active.variants.map((v) => (
            <CopyVariantCard key={v.id} variant={v} />
          ))}
        </div>
      )}
    </div>
  );
}
