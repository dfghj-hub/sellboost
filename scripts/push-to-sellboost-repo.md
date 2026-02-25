# 推送到 SellBoost 独立仓库

当前代码已在 **origin**（meet-ai）上。若要单独建一个名为 **sellboost** 的仓库，任选一种方式即可。

---

## 方式一：网页创建仓库后推送（推荐）

1. 打开：https://github.com/new  
2. Repository name 填：**sellboost**  
3. 选 Public，**不要**勾选 “Add a README”  
4. 点 Create repository  

5. 在本地 `Web` 目录执行：
   ```bash
   cd /Users/dd/Desktop/ToolsAI/Web
   git push sellboost main
   ```

---

## 方式二：用 GitHub CLI 创建并推送

先重新登录（当前 token 已失效）：

```bash
gh auth login -h github.com
```

然后创建仓库并推送：

```bash
cd /Users/dd/Desktop/ToolsAI/Web
gh repo create sellboost --public --source=. --remote=sellboost --push
```

（若已手动在 GitHub 建好 sellboost，只需执行：`git push sellboost main`）
