# SellBoost 进度记录

**最后更新**：2026-02-25

---

## 当前状态

- **项目**：SellBoost — AI 社交电商内容引擎
- **仓库**：https://github.com/dfghj-hub/sellboost
- **线上**：https://sellboost.vercel.app（Vercel 已部署）

---

## 已完成

1. **功能**：多平台文案生成、品牌语音多档案、生成历史、策略（发布模式/转化目标/内容角度）、埋点与反馈
2. **前端**：Manus 设计版（平台卡片+已选/全选/重置、内容形式/转化目标、毛玻璃与 chip 样式）
3. **代码**：构建与 ESLint 通过；`CopyVariantCard` 引号转义已修
4. **部署**：Vercel 生产环境已上线

---

## 待办 / 明日可继续

- [ ] **Vercel 环境变量**：在 Vercel 项目设置里配置 `LLM_PROVIDER`、`DEEPSEEK_API_KEY`（或对应 Key），否则线上「分析并生成」会报错
- [ ] **调研**：你提到「要开始调研」— 可从此处接着做
- [ ] （可选）后续迭代：其他页面 UI、限流、数据分析 GET 鉴权等见 `docs/AUDIT.md`

---

## 本地开发

```bash
cd /Users/dd/Desktop/ToolsAI/Web
npm run dev   # http://localhost:3000
```

## 常用命令

- 拉最新：`git pull origin main`
- 推送：`git add . && git commit -m "..." && git push origin main`
- 重新部署：在项目目录执行 `vercel --prod`

---

明天从「调研」或「配置好 Vercel 环境变量后做一次完整生成测试」接着即可。
