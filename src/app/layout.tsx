import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ToolsAI — AI 效率工具集",
  description:
    "精心打造的 AI 工具集：会议纪要助手、视频图片格式转换器，专业、可靠、开箱即用。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
