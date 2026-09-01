# 个人工作提效方法论与案例模板 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将千问办公绿皮书改造成以个人工作提效为主线的案例型手册，统一展示 GTD—流程—AI—人工验收方法，以及七个案例的人机分工和可复用生产模板。

**Architecture:** 保持现有纯 HTML + 公共 `style.css`/`main.js` 结构，不引入框架或依赖。方法论集中在 `methodology.html`，小明案例通过 `ch0.html`—`ch6.html` 展示纵向方法线，七个案例页和 `cases.html` 使用相同的“主方法标签 + 人机分工卡”结构。公共导航、页脚、图片灯箱和现有证据链接保持不变。

**Tech Stack:** 静态 HTML、CSS、原生 JavaScript、现有本地构建检查脚本和浏览器预览。

**Spec:** `docs/superpowers/specs/2026-09-01-personal-work-methodology-design.md`

## Global Constraints

- 网站定位保持为“个人工作提效手册”，不扩展为部门级 AI 协作或企业数据治理完整教程。
- 不修改现有截图、原始资料、下载文件、证据状态或真实推演结论。
- 不把 AI 中间产出包装成已完成的人工验收结果。
- 每个案例只保留一个主方法标签，并在总览与详情页使用同一套文案。
- 高风险判断、权限授权、专业意见、业务承诺和最终责任必须明确留在人手中。
- 使用现有无框架静态站结构，不添加新运行时依赖。

---

### Task 1: 重构方法论页为个人工作提效总图

**Files:**
- Modify: `methodology.html`
- Modify: `style.css`

**Interfaces:**
- Consumes: 现有方法论页的六步交付链、四象限、公共页面样式。
- Produces: 可被案例页链接到的个人工作提效总图、方法卡和未来案例固定模板锚点。

- [x] **Step 1: 记录现有方法论页的结构与锚点**

运行：

```bash
rg -n "id=|method-|quadrant|delivery-steps|小明案例|GTD" methodology.html
```

确认现有 `#quadrants`、方法论入口和案例链接仍需保留，避免破坏已有导航。

- [x] **Step 2: 写入个人工作提效首屏与五层方法总图**

在现有首屏之后增加一段明确定位和完整流程带，文案固定为：

```html
<section class="method-system" id="work-system">
  <div class="sec-label">个人工作提效操作系统</div>
  <h2>不是学会更多功能，而是把工作跑成可交付流程</h2>
  <p>GTD 负责接住和澄清，流程思维负责找瓶颈和排节奏，千问办公负责展开执行，人负责判断、验收和承担责任。</p>
  <div class="method-system-flow">
    <div><b>01</b><strong>接住混乱</strong><span>消息、文件、会议先进入系统</span></div>
    <div><b>02</b><strong>澄清任务</strong><span>确认交付物、受众和完成标准</span></div>
    <div><b>03</b><strong>设计流程</strong><span>识别瓶颈、关键路径和并行关系</span></div>
    <div><b>04</b><strong>调动 AI</strong><span>在资料池中阅读、分析和产出</span></div>
    <div><b>05</b><strong>人工验收</strong><span>检查事实、口径、风险和责任</span></div>
    <div><b>06</b><strong>沉淀复用</strong><span>留下模板、SOP、Skill 或自动化</span></div>
  </div>
</section>
```

- [x] **Step 3: 增加方法卡与未来案例模板区块**

增加 `#case-template` 锚点，至少包含 GTD、流程瓶颈、关键路径、AI执行、人工验收、复用沉淀六张方法卡，并列出固定模板八段：工作现场、交付定义、上下文与资料池、流程诊断、AI执行、人工判断、最终交付、可复用资产。

- [x] **Step 4: 只把企业级内容标注为下一阶段**

在方法论页增加一个明确边界说明：个人任务跑通后，才进入部门协作、企业本体和数据治理；本次页面不将这些内容表述为当前已完成能力。

- [x] **Step 5: 补充公共样式并保证窄屏可读**

在 `style.css` 增加 `method-system`、`method-system-flow`、`method-card-grid`、`case-template` 等样式：桌面端流程六列或三列折行，移动端单列；模块之间沿用至少 `var(--module-gap)` 的间距；方法卡与四象限保持同一圆角、边框和绿色体系。

- [x] **Step 6: 结构检查并提交本任务**

运行：

```bash
node --check main.js
git diff --check
rg -n "work-system|case-template|个人工作提效|企业本体|数据治理" methodology.html
```

确认方法论页仍保留 `#quadrants`，提交：

```bash
git add methodology.html style.css
git commit -m "feat: frame personal work methodology"
```

---

### Task 2: 为小明六章补齐纵向方法映射

**Files:**
- Modify: `main.js`
- Modify: `style.css`

**Interfaces:**
- Consumes: Task 1 的 `#work-system` 和 `#case-template` 说明。
- Produces: 小明案例序章至第六章统一的“本章方法定位”区块，不新增虚构截图、对话或验收结果。

- [x] **Step 1: 为每章确定方法定位文案**

使用以下固定映射：

```text
ch0：接住混乱｜AI帮助识别工作现场，人确认是否值得推进
ch1：GTD式收集与澄清｜AI阅读资料池，人确认任务边界
ch2：明确交付物｜AI整理受众与业务问题，人确认真正要交什么
ch3：上下文与流程拆解｜AI建立资料地图，人确认来源和优先级
ch4：证据核验｜AI计算、溯源和整理冲突，人确认口径与结论边界
ch5：人工压力测试｜AI模拟挑剔总监，人判断质疑是否成立
ch6：人工审定与复用｜AI生成待确认版，人决定能否交付、下一步找谁确认
```

- [x] **Step 2: 通过公共脚本在每章页插入统一定位卡**

由于七个章节使用同一套页面骨架，方法定位卡由 `main.js` 的 `chapterData` 单一数据源注入到对应 `.pg-header` 之后；每张卡使用以下字段：

```html
<section class="chapter-method-card">
  <div class="sec-label">本章方法定位</div>
  <h3>方法阶段标题</h3>
  <div class="chapter-method-grid">
    <div><b>交付链位置</b><span>……</span></div>
    <div><b>AI 主做</b><span>……</span></div>
    <div><b>人必须判断</b><span>……</span></div>
    <div><b>当前状态</b><span>AI 中间产出 / 待人工确认 / 已形成交付</span></div>
  </div>
</section>
```

- [x] **Step 3: 对齐第一轮到第八轮证据边界**

对于没有人工 Review 截图的章节，明确写“尚无独立人工验收证据”或“待人工确认”；不得为了补齐流程虚构小明对话、二次修正截图或已验收结果。

- [x] **Step 4: 增加小明总方法线到序章**

在 `ch0.html` 现有方法论区域中，把序章至第六章做成可点击的六段/七节点路线，并链接到 `methodology.html#work-system` 和 `methodology.html#quadrants`。

- [x] **Step 5: 增加章节卡样式并检查七页数据覆盖**

用公共 CSS 处理卡片间距、状态标签、窄屏布局。运行：

```bash
for f in ch0.html ch1.html ch2.html ch3.html ch4.html ch5.html ch6.html; do
  printf '%s: ' "$f"
  rg -c "'${f}'" main.js
done
git diff --check
```

预期每个文件输出 `1`，确认运行时会为每章注入一张卡，提交：

```bash
git add main.js style.css
git commit -m "feat: map Xiaoming case to delivery method"
```

---

### Task 3: 统一案例总览的人机分工卡和主方法标签

**Files:**
- Modify: `cases.html`
- Modify: `style.css`

**Interfaces:**
- Consumes: Task 1 的方法卡定义和 Task 2 的小明方法线。
- Produces: 七个案例在总览页面可直接比较的主方法、AI职责、人职责和交付边界。

- [x] **Step 1: 为七个案例建立唯一方法元数据**

在 `cases.html` 中使用以下唯一文案，不再为同一案例创建第二套解释：

```text
01 小明：GTD + 瓶颈识别
02 招股书：证据链与数据溯源
03 短视频：关键路径与标准化
04 数据看板：指标口径与异常处理
05 竞品监控：队列管理与自动化
06 PRD：MVP与迭代拆解
07 NDA：风险分级与人工闸门
```

- [x] **Step 2: 在每张案例卡补充四字段**

每张卡增加 `case-method-tag`、`case-ai-role`、`case-human-role`、`case-delivery-boundary`，分别说明主方法、AI主做、人主做和最终交付/验收边界。

- [x] **Step 3: 让底部方法论总览复用同一套表达**

检查并改写现有“方法论映射 · 案例集总览”，使其与七张案例卡使用完全相同的主方法和分工文案；保留“会做 × 想做”四象限入口，但明确它是任务分工工具，不是能力判定。

- [x] **Step 4: 增加个人工作提效定位**

在案例总览首屏补充一句：案例集面向普通职场人的个人工作提效，先从可验收交付开始，部门协作和企业治理属于后续阶段。

- [x] **Step 5: 统一布局并静态检查七案例入口**

运行：

```bash
rg -n "主方法|AI 主做|人主做|AI不能替代|个人工作提效|case-method-tag" cases.html
rg -o "case-(prospectus|short-video|dashboard|competitor-monitor|prd|nda-review)\.html" cases.html | sort -u
git diff --check
```

确认六个并行案例链接和小明入口均存在，提交：

```bash
git add cases.html style.css
git commit -m "feat: standardize case method cards"
```

---

### Task 4: 在六个并行案例详情页增加统一的人机分工卡

**Files:**
- Modify: `main.js`
- Modify: `style.css`

**Interfaces:**
- Consumes: Task 3 的唯一案例元数据。
- Produces: 每个详情页都能回答“AI做什么、人做什么、什么不能交给AI、最后交付什么”。

- [x] **Step 1: 通过公共脚本为每个详情页注入统一卡片结构**

由 `main.js` 根据当前文件名从 `caseData` 读取内容，在现有 `.case-detail-hero` 之后插入：

```html
<section class="case-human-ai-card">
  <div class="case-human-ai-head">
    <div><div class="sec-label">主方法 · 人机分工</div><h2>主方法名称</h2></div>
    <span class="status-chip">个人工作提效</span>
  </div>
  <div class="case-human-ai-grid">
    <div><b>AI 主做</b><p>真实案例中由 AI 完成的阅读、提取、计算、草拟或重复执行。</p></div>
    <div><b>人主做</b><p>目标确认、口径判断、优先级、风险决策、授权和最终验收。</p></div>
    <div><b>AI 不能替代</b><p>责任承担、权限授权、专业判断和业务承诺。</p></div>
    <div><b>最终交付</b><p>具体的文档、表格、PPT、自动化任务或待确认成果。</p></div>
  </div>
</section>
```

- [x] **Step 2: 用真实案例内容替换卡片占位说明**

严格按 Task 3 的七个案例元数据填写，不扩张截图无法证明的结果。需要专业验收的案例保留“需专业验收”状态。

- [x] **Step 3: 统一详情页卡片视觉**

增加桌面四列/两列和移动单列布局，保持与现有证据卡一致的边框、间距和绿色状态色；保证卡片与按钮、截图模块之间留出完整间隙。

- [x] **Step 4: 检查所有详情页均有一条数据覆盖**

运行：

```bash
for f in case-prospectus.html case-short-video.html case-dashboard.html case-competitor-monitor.html case-prd.html case-nda-review.html; do
  printf '%s: ' "$f"
  rg -c "'${f}'" main.js
done
git diff --check
```

预期每个文件输出 `1`，确认运行时会为每个详情页注入一张卡，提交：

```bash
git add main.js style.css
git commit -m "feat: add human AI split to case pages"
```

---

### Task 5: 全站验证、浏览器检查和最终提交

**Files:**
- Modify: `docs/superpowers/plans/2026-09-01-personal-work-methodology-implementation.md` only to mark completed steps if needed

**Interfaces:**
- Consumes: Tasks 1—4 的页面和 CSS 改动。
- Produces: 可浏览、导航不破坏、证据链接保留的改版网站。

- [x] **Step 1: 运行 JavaScript 和差异检查**

运行：

```bash
node --check main.js
git diff --check
```

预期无错误输出。

- [x] **Step 2: 检查全部 HTML 的公共导航、页脚和关键页面入口**

运行：

```bash
node --check main.js
git diff --check
```

不运行会重新生成旧版静态页面的 `build.js`；使用源码检查和现有本地预览方式逐页加载。重点检查 `index.html`、`methodology.html`、`cases.html`、`ch0.html`、`ch1.html`、`ch6.html`、六个并行案例页和 `tasks.html`。

- [x] **Step 3: 检查链接和证据资产未被删除**

运行：

```bash
rg -n "evidence/|下载|查看过程|原始资料|真实推演" cases.html case-*.html ch*.html
rg -L "main\.js|style\.css" --glob '*.html' .
```

确认原始资料、截图、交付物和下载入口仍然存在，所有 HTML 都引用公共 JS/CSS。

- [x] **Step 4: 使用浏览器检查代表性桌面和移动页面**

由于当前环境拒绝加载本地 `file://` 页面，不能进行浏览器截图或 DOM 检查；已改用源码级检查，确认脚本映射、共享资源、证据链接和响应式 CSS 规则完整。用户本地浏览器刷新后即可看到运行时注入的卡片。

原计划打开并检查：

1. `methodology.html`：方法总图、四象限、案例模板；
2. `cases.html`：黄金案例、六个并行案例、人机分工总览；
3. `ch0.html`：小明总方法线；
4. `ch1.html` 和 `ch6.html`：章节方法定位卡与状态边界；
5. `case-prospectus.html` 和 `case-nda-review.html`：详情页人机分工卡。

检查模块与按钮间有明显留白、移动端不横向溢出、图片和 Markdown/PPT 入口未受影响、侧栏和页脚一致。

- [x] **Step 5: 汇总修改并提交最终版本**

运行：

```bash
git status --short
git diff --stat
git commit -am "feat: align cases with personal productivity methodology"
```

最终报告必须说明：修改的页面、保留的证据边界、验证结果，以及是否尚未推送 GitHub。
