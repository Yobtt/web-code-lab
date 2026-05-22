# 网页代码实验室 - 部署指南

## 方案一：EdgeOne Pages（推荐 - 国内访问最快）

EdgeOne Pages 是腾讯云的免费部署平台，支持全栈 Node.js 应用，国内学生访问速度极快。

### 步骤

**1. 打开 EdgeOne Pages 控制台**
浏览器打开：https://console.cloud.tencent.com/edgeone/pages

**2. 导入项目**
- 点击「新建项目」→「导入 Git 仓库」
- 如果没有 GitHub 仓库，先创建：https://github.com/new
  仓库名：`web-code-lab`，设为 Public（公开）
- 然后运行下面命令推送代码：
```bash
cd D:\workbuddy\项目智能网页制作\web-code-lab
git remote add origin https://github.com/你的用户名/web-code-lab.git
git push -u origin master
```

**3. 配置构建**
- 框架预设：选择「Other」（或「自定义」）
- 构建命令：`npm run build`
- 输出目录：`dist`
- Node.js 版本：18+

**4. 配置启动命令**
在 EdgeOne Pages 设置中：
- 启动命令：`npm start`（即 `node server.cjs`）
- 环境变量添加：
  - `DEEPSEEK_API_KEY` = `sk-e83db6ca030b47168639dc1cde218b07`

**5. 部署**
点击「保存并部署」，等待 2-3 分钟

**6. 获取链接**
部署成功后，EdgeOne Pages 会生成一个域名如：
`https://web-code-lab-xxx.edgeonepages.com`

把这个链接发给学生即可！

---

## 方案二：Vercel（免费，国外快）

**1. 推送代码到 GitHub**（同方案一步骤 2）

**2. 打开 Vercel**
https://vercel.com/new

**3. 导入 GitHub 仓库** `web-code-lab`

**4. 配置**
- Framework: Other
- Build Command: `npm run build`
- Output Directory: `dist`
- 环境变量：`DEEPSEEK_API_KEY` = `sk-e83db6ca030b47168639dc1cde218b07`

**5. 部署后获得链接** 如 `https://web-code-lab.vercel.app`

---

## 方案三：直接本地运行 + 内网穿透

如果只是在局域网内使用（机房电脑），保持当前方式即可：

```bash
cd D:\workbuddy\项目智能网页制作\web-code-lab
node server.cjs
```

然后让学生访问 `http://你的电脑IP:8080`

---

## 注意事项

⚠️ DeepSeek API Key 有调用频率限制，如果 30+ 个学生同时使用可能超额
💡 建议限制 AI 调用频率或错峰使用
