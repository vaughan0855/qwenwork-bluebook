# Navigation Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Reorganize the Green Book navigation around official learning phases, a single task index, and parallel case studies with Xiaoming's chapters nested under one featured case.

**Architecture:** Keep the existing static HTML/CSS site. Update the shared sidebar/footer contract in all public pages, rebuild `tasks.html` as one task-to-official-doc index, align `path.html` and `toc.html`, and make `cases.html` the case directory with Xiaoming featured and six other cases parallel.

**Tech Stack:** Static HTML, shared `style.css`, existing `main.js`, Git.

**Spec:** `docs/superpowers/specs/2026-08-31-navigation-architecture.md`

## Global Constraints

- Phase 1–3 use the official QwenWork documentation hierarchy and exact official URLs.
- Phase 4 is removed from the public learning path.
- Task lookup remains a single page with no new sidebar submenu.
- Do not delete existing content files; remove only public navigation entries.
- Preserve the existing visual language and image/lightbox behavior.

---

### Task 1: Normalize public navigation labels and entries

**Files:**
- Modify: all public `*.html` pages that contain the shared sidebar or footer navigation

**Interfaces:**
- Produces: one consistent navigation vocabulary: no `工作评测`, no Phase 4, and official Phase 1–3 labels.

- [x] **Step 1: Remove the public `工作评测` links**

Remove `eval.html` from shared sidebar and footer lists, while leaving `eval.html` itself intact.

- [x] **Step 2: Remove the public Phase 4 link**

Remove the Phase 4 item from the shared 阅读路径 list. Keep the local Phase 4 file unlinked for recovery.

- [x] **Step 3: Rename the remaining shared Phase labels**

Use `Phase 1 · 新手入门`, `Phase 2 · 核心功能`, and `Phase 3 · 常见任务与场景实战` wherever those shared sidebar entries appear.

- [x] **Step 4: Verify navigation residue**

Run:

```bash
rg -n "工作评测|Phase 4 ·" --glob '*.html'
```

Expected: no matches in public navigation; any remaining match must be inside an intentionally unlinked historical page and be reviewed before completion.

- [x] **Step 5: Commit the navigation normalization**

```bash
git add '*.html'
git commit -m "Normalize public navigation hierarchy"
```

### Task 2: Rebuild the single-page task index

**Files:**
- Modify: `tasks.html`
- Modify: `style.css` only if the existing card/list styles cannot express the grouped task rows

**Interfaces:**
- Consumes: official URLs already mapped in `toc.html`.
- Produces: a task-to-official-doc index with a separate case-materials entry.

- [x] **Step 1: Replace the three broad task cards with task-type groups**

Create rows for Word/document, Excel/data, PPT/presentation, PDF/prospectus, research/competitor monitoring, automation/message delivery, and website/multimedia/PRD.

- [x] **Step 2: Link each row to the closest official tutorial**

Use exact `learn.qwenwork.host` URLs; link the related local case where one exists.

- [x] **Step 3: Add the task materials entry**

Add a clearly labeled bottom card linking to `cases.html` as the place to download source materials and reproduce a workflow.

- [x] **Step 4: Verify task index shape**

Run:

```bash
rg -n "Word|Excel|PPT|PDF|自动化|任务素材|learn\.qwenwork\.host" tasks.html
```

Expected: every requested task type is present, all official links use the official host, and the page remains one entry without new sidebar children.

- [x] **Step 5: Commit the task index**

```bash
git add tasks.html style.css
git commit -m "Rebuild task lookup around deliverable types"
```

### Task 3: Align learning path and complete directory

**Files:**
- Modify: `path.html`
- Modify: `toc.html`

**Interfaces:**
- Produces: matching Phase 1–3 labels and separate `实战案例分享` section without Phase 4.

- [x] **Step 1: Align `path.html` cards to Phase 1–3**

Point Phase 1 to the official getting-started page, Phase 2 to `toc.html`'s official feature map, Phase 3 to the official task/scenario map, and keep the cases link separate.

- [x] **Step 2: Remove Phase 4 from `toc.html`**

Keep the official Phase 1–3 groups and append a standalone local section titled `本站实战案例`, linking to `cases.html` and the featured Xiaoming case.

- [x] **Step 3: Verify label and link parity**

Run:

```bash
rg -n "Phase [1-4]|本站实战案例|案例分享|learn\.qwenwork\.host" path.html toc.html
```

Expected: Phase 1–3 wording matches in both pages, no Phase 4 public section remains, and cases are a separate local entry.

- [x] **Step 4: Commit path and directory alignment**

```bash
git add path.html toc.html
git commit -m "Align learning path and complete directory"
```

### Task 4: Make cases a parallel directory with a nested Xiaoming case

**Files:**
- Modify: `cases.html`
- Modify: `style.css`

**Interfaces:**
- Produces: a featured Case 01 block, six parallel case cards, and a visible chapter tree under Xiaoming.

- [x] **Step 1: Add a chapter tree to the featured Xiaoming block**

Show `序章` and `第一章` through `第六章` as child links under the featured case rather than as unrelated top-level cases.

- [x] **Step 2: Keep Cases 02–07 parallel**

Retain the six existing case cards with consistent `案例 02` through `案例 07` labels and direct links.

- [x] **Step 3: Add a clear task-materials handoff**

Add a local entry point for downloading/reproducing case materials without turning each case into a sidebar submenu.

- [x] **Step 4: Verify case count and hierarchy**

Run:

```bash
rg -o "案例 0[1-7]" cases.html | sort | uniq -c
rg -n "序章|第一章|第六章|案例 0[2-7]" cases.html
```

Expected: one featured Case 01, six parallel cards, and all seven Xiaoming links grouped under the featured block.

- [x] **Step 5: Commit case hierarchy**

```bash
git add cases.html style.css
git commit -m "Clarify featured and parallel case hierarchy"
```

### Task 5: Run final static verification

**Files:**
- Test: all modified HTML and CSS files

- [x] **Step 1: Check whitespace and repository status**

```bash
git diff --check
git status --short
```

Expected: no whitespace errors; only intended changes remain.

- [x] **Step 2: Check local links**

Use a small Node script to collect relative `href` values from modified HTML files and report missing local targets.

- [x] **Step 3: Check official links**

Verify every official link in `toc.html`, `path.html`, and `tasks.html` uses an exact `learn.qwenwork.host/docs/...html` path.

- [x] **Step 4: Commit final verification-only fixes**

```bash
git add -u
git commit -m "Verify Green Book navigation links"
```

