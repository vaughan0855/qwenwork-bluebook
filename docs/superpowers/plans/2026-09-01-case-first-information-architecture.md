# 案例优先与去 AI 味改版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将千问办公绿皮书从“官方教程目录优先”调整为“案例优先的个人工作提效手册”，并降低案例前台表达的 AI 产品腔。

**Architecture:** 保留静态 HTML 页面和现有证据资产，以 `main.js` 作为全站公共导航与公共案例标签的唯一运行时入口；首页和案例集首页直接修改静态文案，确保首屏定位不依赖额外页面。官方 Phase 页面、完整目录和路径总览继续保留，但从主导航降级为补充入口。

**Tech Stack:** 静态 HTML、CSS、原生 JavaScript、GitHub Pages。

**Spec:** `docs/superpowers/specs/2026-09-01-case-first-information-architecture.md`

## Global Constraints

- 默认读者已经会使用千问办公，正文从真实工作麻烦和交付结果开始。
- 不删除任何案例证据、原始资料、截图或交付物。
- 官方 Phase 1–3 只作为补充教程入口，不冒充绿皮书原创内容。
- 案例前台优先使用普通工作语言，方法论页保留必要专业术语。
- 保持现有静态站点结构，不引入依赖和复杂交互。

### Task 1: Update canonical navigation

**Files:**
- Modify: `main.js`

**Steps:**

- [ ] 调整公共侧栏顺序为首页、实战案例分享、任务速查、方法论、官方教程、关于与贡献。
- [ ] 将完整目录与路径总览从侧栏前置入口移除，保留现有页面与页脚可访问性。
- [ ] 将 Phase 1–3 统一标注为“官方教程 / 补充入口”。
- [ ] 将公共人机分工文案从“AI 主做 / 人主做”改为“千问先接手 / 你来判断”。

### Task 2: Rewrite first-screen positioning

**Files:**
- Modify: `index.html`
- Modify: `cases.html`

**Steps:**

- [ ] 将首页标题、导语和按钮改为个人工作提效与交付结果导向。
- [ ] 将首页流程标题改为普通工作语言，保留六步结构但不把它包装成软件功能教学。
- [ ] 将案例集首页说明改为“先看交付，再看做法”，突出小明黄金案例和其他案例并行入口。
- [ ] 将案例集总览卡片的公共说明改为“工作分工”语言。

### Task 3: Reduce AI terminology in shared case modules

**Files:**
- Modify: `main.js`

**Steps:**

- [ ] 将案例详情公共卡片的栏目改为“千问可以先接手”“你需要判断”“不能交给软件”“最后要交出”。
- [ ] 将章节公共方法定位卡的栏目改为“千问办公先处理”“你必须判断”。
- [ ] 保留方法论页的正式术语，以便读者在需要时理解底层方法。

### Task 4: Verify the static site

**Files:**
- Test: `main.js`, `index.html`, `cases.html`

**Steps:**

- [ ] 运行 `node --check main.js`。
- [ ] 运行 `git diff --check`。
- [ ] 检查所有根目录 HTML 仍引用 `main.js` 和 `style.css`。
- [ ] 检查案例链接、证据目录和下载附件没有被删除。
- [ ] 检查变更范围只包含本轮导航、首页、案例集、公共文案和规格文档。
