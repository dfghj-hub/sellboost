"use client";
import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PlatformSelector } from "@/components/generate/PlatformSelector";
import { ProductAnalysisCard } from "@/components/generate/ProductAnalysisCard";
import { PlatformResultTabs } from "@/components/generate/PlatformResultTabs";
import { VerifiedResultCard } from "@/components/flow/VerifiedResultCard";
import { FlowFeedback } from "@/components/flow/FlowFeedback";
import { trackEvent } from "@/lib/analytics";
import {
  getActiveStyleProfile,
  hasStyleProfile,
  loadStyleProfileListFromStorage,
} from "@/lib/style-profile";
import type { AnalyzedProduct, SellingPack } from "@/lib/types";
import type { PlatformId } from "@/lib/platforms";
import type { StyleProfileRecord } from "@/lib/style-profile";

const FLOW_NAME = "generate";
const GENERATE_HISTORY_KEY = "sellboost_generate_history_v1";
const MAX_HISTORY_ITEMS = 20;

interface GenerateHistoryItem {
  id: string;
  createdAt: string;
  productText: string;
  productUrl: string;
  platforms: PlatformId[];
  useBrandVoice: boolean;
  brandProfileId: string | null;
  publishMode: "image_text" | "spoken" | "review";
  conversionGoal: "awareness" | "engagement" | "leads" | "sales";
  focusAngle: string;
  pack: SellingPack;
}

const PLATFORM_ICONS: Record<string, string> = {
  xiaohongshu: "📕", douyin: "🎵", wechat: "💬", bilibili: "📺", kuaishou: "⚡",
};
const PLATFORM_NAMES: Record<string, string> = {
  xiaohongshu: "小红书", douyin: "抖音", wechat: "微信", bilibili: "B站", kuaishou: "快手",
};

const CONTENT_TYPES = [
  { id: "image_text" as const, icon: "🖼️", label: "图文", desc: "小红书 / 微信" },
  { id: "spoken" as const, icon: "🎙️", label: "口播", desc: "抖音 / 快手" },
  { id: "review" as const, icon: "🔬", label: "测评", desc: "B站 / 深度" },
];

const CONVERSION_GOALS = [
  { id: "awareness" as const, label: "品牌曝光" },
  { id: "engagement" as const, label: "互动涨粉" },
  { id: "leads" as const, label: "留资获客" },
  { id: "sales" as const, label: "直接转化" },
];

export default function GeneratePage() {
  const [step, setStep] = useState<"input" | "loading" | "result">("input");
  const [productText, setProductText] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [platforms, setPlatforms] = useState<PlatformId[]>(["xiaohongshu", "douyin"]);
  const [useBrandVoice, setUseBrandVoice] = useState(false);
  const [pack, setPack] = useState<SellingPack | null>(null);
  const [error, setError] = useState("");
  const [hasBrandVoice, setHasBrandVoice] = useState(false);
  const [brandProfiles, setBrandProfiles] = useState<StyleProfileRecord[]>([]);
  const [selectedBrandProfileId, setSelectedBrandProfileId] = useState<string | null>(null);
  const [historyItems, setHistoryItems] = useState<GenerateHistoryItem[]>([]);
  const [publishMode, setPublishMode] = useState<"image_text" | "spoken" | "review">("image_text");
  const [conversionGoal, setConversionGoal] = useState<"awareness" | "engagement" | "leads" | "sales">("awareness");
  const [focusAngle, setFocusAngle] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    try {
      const { profiles, activeId } = loadStyleProfileListFromStorage(window.localStorage);
      setBrandProfiles(profiles);
      setSelectedBrandProfileId(activeId);
      const active = getActiveStyleProfile(profiles, activeId);
      setHasBrandVoice(active ? hasStyleProfile(active.profile) : false);
    } catch { setHasBrandVoice(false); }
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(GENERATE_HISTORY_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return;
      const records = parsed.map((item) => {
        if (!item || typeof item !== "object") return null;
        const o = item as Record<string, unknown>;
        if (!o.pack || typeof o.pack !== "object") return null;
        const pf = Array.isArray(o.platforms)
          ? (o.platforms as unknown[]).filter(
              (p): p is PlatformId =>
                typeof p === "string" &&
                ["xiaohongshu","douyin","wechat","bilibili","kuaishou"].includes(p)
            )
          : ["xiaohongshu", "douyin"];
        return {
          id: typeof o.id === "string" ? o.id : String(Date.now()),
          createdAt: typeof o.createdAt === "string" ? o.createdAt : new Date().toISOString(),
          productText: typeof o.productText === "string" ? o.productText : "",
          productUrl: typeof o.productUrl === "string" ? o.productUrl : "",
          platforms: pf,
          useBrandVoice: Boolean(o.useBrandVoice),
          brandProfileId: typeof o.brandProfileId === "string" ? o.brandProfileId : null,
          publishMode: o.publishMode === "spoken" || o.publishMode === "review" ? o.publishMode : "image_text",
          conversionGoal: o.conversionGoal === "engagement" || o.conversionGoal === "leads" || o.conversionGoal === "sales" ? o.conversionGoal : "awareness",
          focusAngle: typeof o.focusAngle === "string" ? o.focusAngle : "",
          pack: o.pack as SellingPack,
        } as GenerateHistoryItem;
      }).filter((x): x is GenerateHistoryItem => x !== null);
      setHistoryItems(records);
    } catch {}
  }, []);

  function persistHistory(items: GenerateHistoryItem[]) {
    setHistoryItems(items);
    try { window.localStorage.setItem(GENERATE_HISTORY_KEY, JSON.stringify(items)); } catch {}
  }
  function deleteHistoryItem(id: string) { persistHistory(historyItems.filter((h) => h.id !== id)); }
  function applyHistoryInput(item: GenerateHistoryItem) {
    setProductText(item.productText); setProductUrl(item.productUrl);
    setPlatforms(item.platforms); setPublishMode(item.publishMode);
    setConversionGoal(item.conversionGoal); setFocusAngle(item.focusAngle);
    setUseBrandVoice(item.useBrandVoice);
    if (item.brandProfileId) setSelectedBrandProfileId(item.brandProfileId);
    setStep("input"); setHistoryOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function openHistoryResult(item: GenerateHistoryItem) {
    setPack(item.pack); setStep("result"); setHistoryOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleGenerate() {
    const text = productText.trim();
    if (!text) { setError("请填写产品描述，这是生成高质量文案的基础"); return; }
    setError(""); setStep("loading");
    trackEvent({ event: "flow_start_generate", payload: { flow: FLOW_NAME } });
    try {
      const ar = await fetch("/api/analyze-product", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, url: productUrl.trim() || undefined }),
      });
      if (!ar.ok) { const d = await ar.json().catch(() => ({})); throw new Error((d as {error?:string})?.error || "产品分析失败"); }
      const product: AnalyzedProduct = await ar.json();
      let brandVoice = undefined;
      if (useBrandVoice && typeof window !== "undefined") {
        const { profiles, activeId } = loadStyleProfileListFromStorage(window.localStorage);
        const sel = selectedBrandProfileId ? profiles.find((p) => p.id === selectedBrandProfileId) ?? null : getActiveStyleProfile(profiles, activeId);
        brandVoice = sel?.profile;
      }
      const pr = await fetch("/api/generate-selling-pack", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, platforms, brandVoice: brandVoice && (brandVoice.brandVoice || brandVoice.audience) ? brandVoice : undefined, publishMode, conversionGoal, focusAngle: focusAngle.trim() || undefined }),
      });
      if (!pr.ok) { const d = await pr.json().catch(() => ({})); throw new Error((d as {error?:string})?.error || "内容包生成失败"); }
      const packData: SellingPack = await pr.json();
      setPack(packData); setStep("result");
      persistHistory([{
        id: `${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
        createdAt: new Date().toISOString(), productText: text, productUrl: productUrl.trim(),
        platforms, useBrandVoice: Boolean(useBrandVoice), brandProfileId: useBrandVoice ? selectedBrandProfileId : null,
        publishMode, conversionGoal, focusAngle, pack: packData,
      }, ...historyItems].slice(0, MAX_HISTORY_ITEMS));
      trackEvent({ event: "flow_complete_generate", payload: { flow: FLOW_NAME } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "生成失败，请重试");
      setStep("input");
      trackEvent({ event: "flow_error_generate", payload: { flow: FLOW_NAME } });
    }
  }

  function downloadAll() {
    if (!pack) return;
    const lines = [`# ${pack.product.name} — 全平台带货内容包`, `生成时间：${pack.generatedAt}`, "", "---", ""];
    for (const p of pack.platforms) {
      lines.push(`## ${p.platformName}`, "");
      for (const v of p.variants) {
        lines.push(`### 变体 ${v.id}`, `**标题：** ${v.title}`, "", v.body, "", `**标签：** ${v.tags.join(" ")}`, `**发布时间：** ${v.postingTime}`, "");
      }
      lines.push("---", "");
    }
    const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `sellboost_${pack.product.name}_${Date.now()}.md`; a.click();
    URL.revokeObjectURL(url);
  }

  const isEmpty = productText.trim().length === 0;

  return (
    <main className="min-h-screen">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-orange-600/[0.06] blur-[120px]" />
        <div className="absolute -top-20 right-1/4 h-[400px] w-[400px] rounded-full bg-pink-600/[0.05] blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/[0.04] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-10 md:px-6 lg:py-14">

        {/* Page Header */}
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
              <span className="text-xs font-semibold tracking-wide text-orange-400">AI 内容引擎</span>
            </div>
            <h1 className="font-heading text-3xl font-bold text-white md:text-4xl">生成带货内容矩阵</h1>
            <p className="mt-2 max-w-lg text-base text-gray-400">
              输入产品信息，AI 自动分析并为每个平台生成 3 套差异化文案变体，覆盖理性、情感与紧迫三种策略。
            </p>
          </div>
          {historyItems.length > 0 && (
            <button type="button" onClick={() => setHistoryOpen((o) => !o)} className="btn-ghost flex w-fit items-center gap-2 lg:hidden">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              历史记录
              <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-xs font-semibold text-orange-400">{historyItems.length}</span>
            </button>
          )}
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">

          {/* LEFT */}
          <div className="min-w-0 space-y-5">

            {step !== "result" && (
              <div className="animate-fade-up space-y-5">

                {/* Product Description */}
                <div className="glass-card-elevated p-6">
                  <div className="mb-4 flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/25 to-pink-500/25">
                      <span className="text-sm">📝</span>
                    </div>
                    <label className="font-heading text-sm font-semibold text-white">
                      产品描述<span className="ml-1 text-orange-400">*</span>
                    </label>
                    <span className="ml-auto text-xs text-gray-600">{productText.length} 字</span>
                  </div>
                  <textarea
                    rows={5}
                    className="input-glass resize-none text-sm leading-relaxed"
                    placeholder={"详细描述您的产品：核心功能、独特优势、目标用户、使用场景、价格区间……\n\n描述越详细，生成的文案质量越高。可直接粘贴电商详情页文案。"}
                    value={productText}
                    onChange={(e) => setProductText(e.target.value)}
                  />
                  <div className="mt-3 flex items-center gap-2">
                    <svg className="h-4 w-4 flex-shrink-0 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <input
                      type="url"
                      className="input-glass py-2.5 text-sm"
                      placeholder="产品链接（可选）：淘宝 / 京东 / 官网 URL"
                      value={productUrl}
                      onChange={(e) => setProductUrl(e.target.value)}
                    />
                  </div>
                </div>

                {/* Platform + Content Type + Goal */}
                <div className="glass-card-elevated space-y-6 p-6">
                  <PlatformSelector selected={platforms} onChange={setPlatforms} />
                  <div className="gradient-divider" />
                  <div>
                    <p className="mb-3 text-sm font-medium text-gray-300">内容形式</p>
                    <div className="grid grid-cols-3 gap-3">
                      {CONTENT_TYPES.map((ct) => (
                        <button
                          key={ct.id}
                          type="button"
                          onClick={() => setPublishMode(ct.id)}
                          className={`content-type-card ${publishMode === ct.id ? "active" : ""}`}
                        >
                          <span className="text-2xl">{ct.icon}</span>
                          <span className={`text-sm font-semibold ${publishMode === ct.id ? "text-orange-400" : "text-gray-300"}`}>{ct.label}</span>
                          <span className="text-[10px] text-gray-600">{ct.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="gradient-divider" />
                  <div>
                    <p className="mb-3 text-sm font-medium text-gray-300">转化目标</p>
                    <div className="flex flex-wrap gap-2">
                      {CONVERSION_GOALS.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setConversionGoal(g.id)}
                          className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                            conversionGoal === g.id
                              ? "border-orange-500/40 bg-orange-500/[0.12] text-orange-400"
                              : "border-surface-border bg-surface text-gray-400 hover:border-white/20 hover:text-white"
                          }`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="glass-card-elevated space-y-5 p-6">
                  <p className="font-heading text-sm font-semibold text-white/60">高级设置（可选）</p>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-400">内容角度 / 创作方向</label>
                    <input
                      type="text"
                      className="input-glass text-sm"
                      placeholder="例：突出性价比、强调成分天然、针对敏感肌人群、节日礼品场景……"
                      value={focusAngle}
                      onChange={(e) => setFocusAngle(e.target.value)}
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="flex cursor-pointer items-center gap-3">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={useBrandVoice}
                          onClick={() => setUseBrandVoice((v) => !v)}
                          className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${useBrandVoice ? "bg-orange-500" : "bg-white/10"}`}
                        >
                          <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${useBrandVoice ? "translate-x-4" : "translate-x-0.5"}`} />
                        </button>
                        <span className="text-sm font-medium text-gray-300">应用品牌语音档案</span>
                      </label>
                      {!hasBrandVoice && (
                        <a href="/brand" className="text-xs text-orange-400 transition-colors hover:text-orange-300">去创建档案 →</a>
                      )}
                    </div>
                    {useBrandVoice && brandProfiles.length > 0 && (
                      <div className="mt-3 animate-fade-in">
                        <select
                          className="input-glass text-sm"
                          value={selectedBrandProfileId ?? ""}
                          onChange={(e) => setSelectedBrandProfileId(e.target.value || null)}
                        >
                          {brandProfiles.map((p) => <option key={p.id} value={p.id}>{p.profileName}</option>)}
                        </select>
                      </div>
                    )}
                    {useBrandVoice && !hasBrandVoice && (
                      <p className="mt-2 text-xs text-amber-400/80">尚未创建品牌语音档案，文案将使用默认风格生成</p>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="flex animate-fade-in items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                {step === "input" && (
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isEmpty}
                    className="btn-primary w-full py-4 text-base"
                  >
                    <span className="flex items-center justify-center gap-2.5">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      智能分析并生成策略矩阵
                      {platforms.length > 0 && (
                        <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium">
                          {platforms.length} 个平台 · 各 3 套变体
                        </span>
                      )}
                    </span>
                  </button>
                )}
              </div>
            )}

            {step === "loading" && (
              <div className="animate-fade-up">
                <LoadingSpinner stage="AI 正在深度分析产品特征，生成全平台内容矩阵…" />
              </div>
            )}

            {step === "result" && pack && (
              <div className="animate-fade-up space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/15">
                      <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-heading text-sm font-semibold text-white">策略矩阵已生成</p>
                      <p className="text-xs text-gray-500">
                        {pack.platforms.length} 个平台 · 共 {pack.platforms.reduce((s, p) => s + p.variants.length, 0)} 套文案
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button type="button" onClick={downloadAll} className="btn-ghost flex items-center gap-2 text-sm">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      下载全部
                    </button>
                    <button type="button" onClick={() => { setStep("input"); setPack(null); }} className="btn-primary py-2.5 text-sm">
                      重新生成
                    </button>
                  </div>
                </div>

                <ProductAnalysisCard product={pack.product} />

                <VerifiedResultCard
                  basis={[
                    `基于产品描述提取的 ${pack.product.usps.length} 个核心卖点`,
                    `匹配 ${pack.platforms.length} 个平台的内容规则与算法偏好`,
                    "参考各平台最佳发布时间与 CTA 模式",
                  ]}
                  risks={[
                    "AI 生成内容可能需要根据实际产品情况调整",
                    "平台规则与算法可能随时更新，建议定期重新生成",
                    "效果因产品品类、账号权重和发布时机而异",
                  ]}
                  checkpoints={[
                    "核对文案中的产品参数与实际是否一致",
                    "确认标签数量与平台当前规范相符",
                    "根据品牌调性微调语气后再发布",
                  ]}
                  onRegenerate={handleGenerate}
                  onBacktrack={() => { setStep("input"); setPack(null); }}
                />

                <PlatformResultTabs platforms={pack.platforms} />
                <FlowFeedback flow={FLOW_NAME} />
              </div>
            )}
          </div>

          {/* RIGHT: History */}
          <aside className={`space-y-4 lg:block ${historyOpen ? "block" : "hidden"}`}>
            <div className="glass-card-elevated p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-heading text-sm font-semibold text-white/80">生成历史</h3>
                </div>
                {historyItems.length > 0 && (
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-gray-500">{historyItems.length} 条</span>
                )}
              </div>

              {historyItems.length > 0 ? (
                <div className="space-y-3">
                  {historyItems.slice(0, 5).map((item) => (
                    <div key={item.id} className="group relative overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4 transition-all hover:border-white/10 hover:bg-white/[0.04]">
                      <button
                        type="button"
                        onClick={() => deleteHistoryItem(item.id)}
                        className="absolute right-3 top-3 rounded-lg p-1 text-gray-600 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <p className="mb-2 pr-6 text-sm font-medium text-gray-200 line-clamp-2">
                        {item.pack.product.name || item.productText.slice(0, 28) || "未命名记录"}
                      </p>
                      <p className="mb-3 text-[10px] text-gray-600">
                        {new Date(item.createdAt).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {item.platforms.slice(0, 4).map((p) => (
                          <span key={p} className="flex items-center gap-1 rounded-md border border-white/[0.08] bg-black/30 px-1.5 py-0.5 text-[10px] text-gray-400">
                            <span>{PLATFORM_ICONS[p]}</span><span>{PLATFORM_NAMES[p]}</span>
                          </span>
                        ))}
                        {item.platforms.length > 4 && (
                          <span className="rounded-md border border-white/[0.08] bg-black/30 px-1.5 py-0.5 text-[10px] text-gray-500">+{item.platforms.length - 4}</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => applyHistoryInput(item)} className="flex-1 rounded-lg bg-white/[0.05] py-2 text-xs font-medium text-gray-400 transition-colors hover:bg-white/10 hover:text-white">
                          复用参数
                        </button>
                        <button type="button" onClick={() => openHistoryResult(item)} className="flex-1 rounded-lg border border-orange-500/20 bg-orange-500/10 py-2 text-xs font-medium text-orange-400 transition-colors hover:bg-orange-500/20">
                          查看结果
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/[0.06] bg-white/[0.01] py-10 text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.04] text-gray-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-500">暂无生成记录</p>
                  <p className="mt-1 text-xs text-gray-600">成功生成后自动保存</p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-blue-500/15 bg-gradient-to-b from-blue-500/[0.08] to-transparent p-5">
              <h4 className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-blue-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                高转化技巧
              </h4>
              <p className="text-xs leading-relaxed text-blue-300/70">
                描述越详细效果越好。可直接粘贴电商详情页文案，包含痛点、成分、使用场景和目标人群，AI 会自动提炼核心卖点。
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
