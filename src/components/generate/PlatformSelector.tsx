"use client";
import { PLATFORM_RULES } from "@/lib/platforms";
import type { PlatformId } from "@/lib/platforms";

interface PlatformSelectorProps {
  selected: PlatformId[];
  onChange: (ids: PlatformId[]) => void;
}

const ALL_IDS: PlatformId[] = ["xiaohongshu", "douyin", "wechat", "bilibili", "kuaishou"];

const PLATFORM_META: Record<PlatformId, { users: string; glow: string }> = {
  xiaohongshu: { users: "3亿+ 用户", glow: "rgba(239,68,68,0.18)" },
  douyin:      { users: "7亿+ 用户", glow: "rgba(255,255,255,0.10)" },
  wechat:      { users: "13亿+ 用户", glow: "rgba(22,163,74,0.18)" },
  bilibili:    { users: "3.4亿+ 用户", glow: "rgba(59,130,246,0.18)" },
  kuaishou:    { users: "4亿+ 用户", glow: "rgba(249,115,22,0.18)" },
};

export function PlatformSelector({ selected, onChange }: PlatformSelectorProps) {
  function toggle(id: PlatformId) {
    if (selected.includes(id)) {
      if (selected.length === 1) return;
      onChange(selected.filter((p) => p !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  function selectAll() { onChange([...ALL_IDS]); }
  function clearAll()  { onChange([ALL_IDS[0]]); }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-300">目标平台</p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">
            已选 <span className="font-semibold text-orange-400">{selected.length}</span> / {ALL_IDS.length} 个
          </span>
          <div className="flex items-center gap-1">
            <button type="button" onClick={selectAll}
              className="rounded-lg px-2 py-1 text-[10px] font-medium text-gray-500 transition-colors hover:bg-white/5 hover:text-gray-300">
              全选
            </button>
            <span className="text-gray-700">·</span>
            <button type="button" onClick={clearAll}
              className="rounded-lg px-2 py-1 text-[10px] font-medium text-gray-500 transition-colors hover:bg-white/5 hover:text-gray-300">
              重置
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {ALL_IDS.map((id) => {
          const r = PLATFORM_RULES[id];
          const meta = PLATFORM_META[id];
          const isActive = selected.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              className={`group relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl border p-3.5 text-center transition-all duration-200 ${
                isActive
                  ? "border-orange-500/40 bg-orange-500/[0.08]"
                  : "border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
              }`}
              style={isActive ? { boxShadow: `0 0 22px ${meta.glow}` } : undefined}
            >
              {/* 选中指示点 */}
              <div className={`absolute right-2 top-2 h-2 w-2 rounded-full transition-all duration-200 ${
                isActive ? "bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.9)]" : "bg-white/10"
              }`} />
              <span className="text-2xl leading-none">{r.icon}</span>
              <span className={`text-xs font-semibold transition-colors duration-200 ${
                isActive ? "text-orange-400" : "text-gray-300 group-hover:text-white"
              }`}>
                {r.name}
              </span>
              <span className="text-[10px] text-gray-600">{meta.users}</span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-600">每个平台将独立优化文案风格与算法规则，平台越多内容矩阵越丰富</p>
    </div>
  );
}
