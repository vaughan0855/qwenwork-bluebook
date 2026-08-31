#!/usr/bin/env node
/**
 * 千问办公实战蓝皮书 — 多页面静态网站生成器
 * Wise 设计风格 · 基于 Wise Design System
 * 用法: node build.js
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname);

// ─── NAV CONFIG ───
const NAV = [
  { label: '首页', href: 'index.html' },
  { label: '阅读路径', href: 'path.html' },
  { label: '案例分享', href: 'cases.html' },
  { label: '工作评测', href: 'eval.html' },
  { label: '任务速查', href: 'tasks.html' },
  { label: '方法论', href: 'methodology.html' },
  { label: '目录', href: 'toc.html' },
  { label: '关于', href: 'about.html' },
];

// ─── SIDEBAR CONFIG ───
const SIDEBAR_GROUPS = [
  { title: '开始', items: [
    { label: '首页', href: 'index.html' },
    { label: '完整目录', href: 'toc.html' },
  ]},
  { title: '小明的交付升级记', items: [
    { label: '第一章 · 时间黑洞', href: 'ch1.html' },
    { label: '第二章 · 老板说做个方案', href: 'ch2.html' },
    { label: '第三章 · 27 个文件', href: 'ch3.html' },
    { label: '第四章 · 讲得明白', href: 'ch4.html' },
    { label: '第五章 · 不能直接发', href: 'ch5.html' },
    { label: '第六章 · 沉淀系统', href: 'ch6.html' },
  ]},
  { title: '实战内容', items: [
    { label: '案例分享', href: 'cases.html' },
    { label: '工作评测', href: 'eval.html' },
    { label: '任务速查', href: 'tasks.html' },
  ]},
  { title: '深度', items: [
    { label: '方法论', href: 'methodology.html' },
    { label: '关于蓝皮书', href: 'about.html' },
  ]},
  { title: '设计系统', items: [
    { label: '68 品牌目录', href: 'brands.html' },
  ]},
];

// ─── SHARED CSS (Wise Design System) ───
const CSS = `
/* ===== RESET ===== */
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{
  --black:#0e0f0c;--white:#fff;
  --wise-green:#9fe870;--dark-green:#163300;--light-mint:#e2f6d5;--pastel-green:#cdffad;
  --green-hover:rgba(211,242,192,0.4);
  --g900:#0e0f0c;--g600:#454745;--g500:#868685;--g400:#868685;--g200:#d4d4d4;--g100:#e8ebe6;--g50:#f4f6f2;
  --link:#163300;--focus:#9fe870;
  --red:#d03238;--pink:#de1d8d;--blue:#9fe870;--purple:#7928ca;
  --badge-bg:#e2f6d5;--badge-fg:#163300;
  --border-s:0 0 0 1px rgba(14,15,12,.12);
  --card-s:rgba(14,15,12,.12) 0 0 0 1px;
  --card-h:rgba(14,15,12,.2) 0 0 0 1px;
  --ring:rgba(14,15,12,.12) 0 0 0 1px;
  --sans:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  --mono:'SF Mono','Fira Code',ui-monospace,Menlo,monospace;
  --max:1200px;--py:96px;
}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
body{font-family:var(--sans);color:var(--black);background:var(--white);line-height:1.5;font-weight:600;font-feature-settings:"calt"}
a{color:var(--link);text-decoration:none}a:hover{text-decoration:underline}
img{max-width:100%;display:block}
::selection{background:var(--light-mint)}

/* ===== SIDEBAR ===== */
.sidebar{position:fixed;top:0;left:0;width:280px;height:100vh;background:#fff;border-right:1px solid rgba(14,15,12,.08);display:flex;flex-direction:column;z-index:200;overflow:hidden}
.sidebar-header{padding:20px 20px 16px;border-bottom:1px solid rgba(14,15,12,.08);flex-shrink:0}
.sidebar-logo{font-size:15px;font-weight:600;letter-spacing:-.3px;color:var(--black);display:flex;align-items:center;gap:8px;text-decoration:none}
.sidebar-logo:hover{text-decoration:none}
.sidebar-logo svg{width:20px;height:20px;flex-shrink:0}
.sidebar-nav{flex:1;overflow-y:auto;padding:12px 0}
.sidebar-nav::-webkit-scrollbar{width:4px}
.sidebar-nav::-webkit-scrollbar-thumb{background:var(--g200);border-radius:2px}
.sidebar-group{margin-bottom:4px}
.sidebar-group-title{display:flex;align-items:center;justify-content:space-between;width:100%;padding:8px 20px;background:none;border:none;cursor:pointer;font-family:var(--mono);font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.5px;color:var(--g400);transition:color .15s;text-align:left}
.sidebar-group-title:hover{color:var(--black)}
.sidebar-group-title .chevron{width:16px;height:16px;transition:transform .2s ease;flex-shrink:0;opacity:.5}
.sidebar-group.collapsed .chevron{transform:rotate(-90deg)}
.sidebar-group-items{list-style:none;overflow:hidden;transition:max-height .25s ease,opacity .2s ease;max-height:500px;opacity:1}
.sidebar-group.collapsed .sidebar-group-items{max-height:0;opacity:0}
.sidebar-group-items li a{display:block;padding:6px 20px 6px 28px;font-size:14px;font-weight:500;color:var(--g600);text-decoration:none;border-left:3px solid transparent;transition:all .15s ease;line-height:1.5}
.sidebar-group-items li a:hover{color:var(--black);background:var(--g50);text-decoration:none}
.sidebar-group-items li a.active{color:var(--dark-green);background:var(--light-mint);border-left-color:var(--wise-green);font-weight:600}
.sidebar-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.3);z-index:190;opacity:0;transition:opacity .2s}
.sidebar-overlay.visible{display:block;opacity:1}
.hamburger{display:none;position:fixed;top:12px;left:12px;z-index:210;width:40px;height:40px;border-radius:8px;background:#fff;border:1px solid var(--g100);box-shadow:0 1px 3px rgba(14,15,12,.08);cursor:pointer;align-items:center;justify-content:center}
.main{margin-left:280px;min-height:100vh}

/* ===== MASCOT ===== */
.mascot{position:fixed;top:12px;right:20px;z-index:205;width:64px;height:64px;cursor:pointer;transition:transform .2s}
.mascot:hover{transform:scale(1.1) rotate(-5deg)}
.mascot img{width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 2px 4px rgba(0,0,0,.1))}
.mascot-tooltip{position:absolute;top:70px;right:0;background:var(--black);color:var(--wise-green);padding:8px 12px;border-radius:12px;font-size:12px;font-weight:600;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .2s}
.mascot:hover .mascot-tooltip{opacity:1}
@media(max-width:768px){.mascot{width:48px;height:48px;top:12px;right:12px}}

/* ===== HERO ===== */
.hero{max-width:var(--max);margin:0 auto;padding:80px 24px 56px;text-align:center;position:relative}
.hero::before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:680px;height:360px;background:radial-gradient(ellipse at center,rgba(159,232,112,.12) 0%,rgba(159,232,112,.04) 40%,transparent 70%);pointer-events:none;z-index:0}
.hero>*{position:relative;z-index:1}
.hero-badge{display:inline-flex;align-items:center;gap:6px;background:var(--badge-bg);color:var(--badge-fg);font-size:12px;font-weight:600;padding:4px 12px;border-radius:9999px;margin-bottom:24px}
.hero-badge .dot{width:6px;height:6px;border-radius:50%;background:var(--wise-green);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.hero h1{font-size:52px;font-weight:900;line-height:0.85;margin-bottom:16px}
.hero-sub{font-size:20px;font-weight:600;line-height:1.6;color:var(--g600);max-width:560px;margin:0 auto 32px}
.hero-acts{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}

/* ===== BUTTONS (Wise pill style) ===== */
.btn-d{font-family:var(--sans);font-size:18px;font-weight:600;background:var(--wise-green);color:var(--dark-green);border:none;border-radius:9999px;padding:12px 28px;cursor:pointer;transition:transform .15s;text-decoration:none;display:inline-block}
.btn-d:hover{transform:scale(1.05);text-decoration:none;color:var(--dark-green)}
.btn-d:active{transform:scale(0.95)}
.btn-g{font-family:var(--sans);font-size:18px;font-weight:600;background:rgba(22,51,0,0.08);color:var(--black);border:none;border-radius:9999px;padding:12px 28px;cursor:pointer;transition:transform .15s;text-decoration:none;display:inline-block}
.btn-g:hover{transform:scale(1.05);text-decoration:none}
.btn-g:active{transform:scale(0.95)}

/* ===== METRICS ===== */
.metrics{max-width:var(--max);margin:0 auto;padding:0 24px 64px}
.met-grid{display:grid;grid-template-columns:repeat(4,1fr);box-shadow:var(--card-s);border-radius:30px;overflow:hidden}
.met-item{padding:28px 24px;text-align:center;position:relative}
.met-item:not(:last-child)::after{content:'';position:absolute;right:0;top:20%;height:60%;width:1px;background:var(--g100)}
.met-num{font-size:36px;font-weight:900;margin-bottom:4px}
.met-lbl{font-size:14px;color:var(--g500);font-weight:600}

/* ===== SECTION ===== */
.sec{max-width:var(--max);margin:0 auto;padding:var(--py) 24px}
.sec-b{border-top:1px solid var(--black)}
.sec-label{font-family:var(--mono);font-size:12px;font-weight:500;text-transform:uppercase;letter-spacing:.5px;color:var(--g500);margin-bottom:12px}
.sec-title{font-size:36px;font-weight:900;line-height:0.85;margin-bottom:12px}
.sec-desc{font-size:18px;font-weight:600;line-height:1.6;color:var(--g600);max-width:560px;margin-bottom:48px}

/* ===== PAGE HEADER (sub pages) ===== */
.pg-header{max-width:var(--max);margin:0 auto;padding:64px 24px 0}
.pg-header .sec-label{margin-bottom:8px}
.pg-header h1{font-size:42px;font-weight:900;line-height:0.85;margin-bottom:12px}
.pg-header p{font-size:18px;color:var(--g600);line-height:1.6;font-weight:600;max-width:560px;margin-bottom:40px}
.breadcrumb{font-size:13px;color:var(--g400);margin-bottom:20px}
.breadcrumb a{color:var(--g500);font-weight:600}

/* ===== CARDS GRID ===== */
.card-grid{display:grid;gap:16px}
.card-grid.c2{grid-template-columns:repeat(2,1fr)}
.card-grid.c3{grid-template-columns:repeat(3,1fr)}
.card-grid.c4{grid-template-columns:repeat(4,1fr)}
.card{background:var(--white);border-radius:30px;box-shadow:var(--card-s);padding:24px;transition:box-shadow .2s,transform .2s}
.card:hover{box-shadow:var(--card-h);transform:translateY(-2px)}
.card-step{font-family:var(--mono);font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px}
.card-step.s1{color:var(--wise-green)}.card-step.s2{color:var(--pink)}.card-step.s3{color:var(--red)}.card-step.s4{color:var(--purple)}
.card h3{font-size:18px;font-weight:600;margin-bottom:8px;line-height:1.4}
.card p{font-size:14px;color:var(--g600);line-height:1.6}
.card .tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:14px}
.tag{font-size:11px;font-weight:500;padding:2px 8px;border-radius:9999px;background:var(--g50);box-shadow:var(--ring);color:var(--g600)}

/* ===== CASE CARDS ===== */
.case-card{background:var(--white);border-radius:30px;box-shadow:var(--card-s);overflow:hidden;transition:box-shadow .2s,transform .2s}
.case-card:hover{box-shadow:var(--card-h);transform:translateY(-2px)}
.case-thumb{height:140px;display:flex;align-items:center;justify-content:center;font-size:36px}
.case-thumb.t1{background:linear-gradient(135deg,#e2f6d5,#d4f0c0)}
.case-thumb.t2{background:linear-gradient(135deg,#fef0f7,#fce4f0)}
.case-thumb.t3{background:linear-gradient(135deg,#f0faf4,#e0f5e8)}
.case-thumb.t4{background:linear-gradient(135deg,#fef9ee,#fdf0d8)}
.case-thumb.t5{background:linear-gradient(135deg,#f5f0fe,#ece4fd)}
.case-thumb.t6{background:linear-gradient(135deg,#eef8fe,#d8eefb)}
.case-body{padding:20px}
.case-badge{display:inline-block;font-size:11px;font-weight:500;padding:2px 8px;border-radius:9999px;margin-bottom:10px}
.case-badge.office{background:var(--badge-bg);color:var(--badge-fg)}
.case-badge.creative{background:rgba(222,29,141,.08);color:var(--pink)}
.case-badge.dev{background:rgba(159,232,112,.15);color:var(--dark-green)}
.case-badge.analysis{background:rgba(121,40,202,.08);color:var(--purple)}
.case-badge.media{background:rgba(208,50,56,.08);color:var(--red)}
.case-badge.auto{background:rgba(159,232,112,.15);color:var(--dark-green)}
.case-card h3{font-size:16px;font-weight:600;margin-bottom:6px;line-height:1.4}
.case-card p{font-size:14px;color:var(--g600);line-height:1.6}
.case-meta{display:flex;align-items:center;gap:12px;margin-top:14px;padding-top:14px;border-top:1px solid var(--g100)}
.case-meta span{font-size:12px;color:var(--g400);font-weight:600}

/* ===== TABLE ===== */
.tbl-wrap{box-shadow:var(--card-s);border-radius:30px;overflow:hidden}
.tbl{width:100%;border-collapse:collapse;font-size:14px}
.tbl thead{background:var(--g50)}
.tbl th{font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:.3px;color:var(--g500);padding:14px 20px;text-align:left;border-bottom:1px solid var(--g100)}
.tbl td{padding:16px 20px;border-bottom:1px solid var(--g100);color:var(--g600);vertical-align:top}
.tbl tr:last-child td{border-bottom:none}
.tbl .tn{font-weight:600;color:var(--black)}
.score-bar{display:inline-flex;align-items:center;gap:6px}
.score-fill{height:6px;border-radius:3px;background:var(--wise-green)}
.score-text{font-size:13px;font-weight:600;font-family:var(--mono)}
.eval-tag{display:inline-block;font-size:11px;font-weight:500;padding:2px 8px;border-radius:9999px}
.eval-tag.pass{background:rgba(5,77,40,0.1);color:#054d28}
.eval-tag.partial{background:rgba(234,179,8,.1);color:#ca8a04}

/* ===== PIPELINE ===== */
.pipeline{display:grid;grid-template-columns:repeat(3,1fr);position:relative}
.pipeline::before{content:'';position:absolute;top:32px;left:16.66%;right:16.66%;height:2px;background:linear-gradient(90deg,var(--wise-green) 0%,var(--wise-green) 33%,var(--pink) 33%,var(--pink) 66%,var(--red) 66%,var(--red) 100%);opacity:.25;z-index:0}
.pipe-step{text-align:center;padding:0 20px;position:relative;z-index:1}
.pipe-icon{width:64px;height:64px;border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:28px}
.pipe-icon.dev{background:rgba(159,232,112,.15);box-shadow:var(--ring)}
.pipe-icon.prev{background:rgba(222,29,141,.08);box-shadow:var(--ring)}
.pipe-icon.ship{background:rgba(208,50,56,.08);box-shadow:var(--ring)}
.pipe-step h3{font-size:20px;font-weight:600;margin-bottom:8px}
.pipe-step h3.dt{color:var(--dark-green)}.pipe-step h3.pt{color:var(--pink)}.pipe-step h3.st{color:var(--red)}
.pipe-step p{font-size:14px;color:var(--g600);line-height:1.6}

/* ===== CODE BLOCK ===== */
.code-block{background:var(--black);border-radius:30px;padding:20px 24px;overflow-x:auto;font-family:var(--mono);font-size:13px;line-height:1.7;color:#e5e5e5;box-shadow:var(--card-s)}
.code-block .cm{color:#666}.code-block .kw{color:#9fe870}.code-block .str{color:#cdffad}.code-block .fn{color:#de1d8d}.code-block .num{color:#e2f6d5}

/* ===== TASK GRID ===== */
.task-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.task-item{display:flex;align-items:flex-start;gap:12px;padding:16px;border-radius:30px;box-shadow:var(--ring);transition:box-shadow .15s,transform .15s;cursor:pointer}
.task-item:hover{box-shadow:var(--card-s);transform:translateY(-2px)}
.task-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;background:var(--light-mint)}
.task-item h4{font-size:14px;font-weight:600;margin-bottom:2px}
.task-item p{font-size:13px;color:var(--g500);line-height:1.4}

/* ===== METHOD ===== */
.method-grid{display:grid;grid-template-columns:repeat(4,1fr);box-shadow:var(--card-s);border-radius:30px;overflow:hidden}
.method-item{padding:32px 24px;text-align:center;position:relative}
.method-item:not(:last-child)::after{content:'';position:absolute;right:0;top:20%;height:60%;width:1px;background:var(--g100)}
.method-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:20px;background:var(--light-mint);box-shadow:var(--ring)}
.method-item h4{font-size:15px;font-weight:600;margin-bottom:6px}
.method-item p{font-size:13px;color:var(--g500);line-height:1.5}
.method-arrow{position:absolute;right:-10px;top:50%;transform:translateY(-50%);color:var(--g200);font-size:16px;z-index:2}

/* ===== TOC ===== */
.toc-list{list-style:none;counter-reset:toc}
.toc-list li{counter-increment:toc;padding:14px 0;border-bottom:1px solid var(--g100);display:flex;align-items:baseline;gap:12px}
.toc-list li::before{content:counter(toc,decimal-leading-zero);font-family:var(--mono);font-size:12px;font-weight:500;color:var(--g400);min-width:28px}
.toc-list li a{font-size:16px;font-weight:600;color:var(--black);text-decoration:none}
.toc-list li a:hover{color:var(--link)}
.toc-list li span{font-size:13px;color:var(--g500);margin-left:auto}
.toc-group{margin-bottom:40px}
.toc-group h3{font-size:20px;font-weight:900;line-height:0.85;margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid var(--black)}

/* ===== ABOUT ===== */
.about-content{max-width:680px}
.about-content h2{font-size:24px;font-weight:900;line-height:0.85;margin-bottom:12px;margin-top:40px}
.about-content h2:first-child{margin-top:0}
.about-content p{font-size:16px;line-height:1.7;color:var(--g600);margin-bottom:16px;font-weight:600}
.about-content ul{margin:0 0 16px 20px;list-style:disc}
.about-content li{font-size:15px;color:var(--g600);line-height:1.6;margin-bottom:6px;font-weight:600}

/* ===== CTA ===== */
.cta-sec{max-width:var(--max);margin:0 auto;padding:80px 24px;text-align:center}
.cta-box{box-shadow:var(--card-s);border-radius:40px;padding:64px 40px;background:linear-gradient(180deg,var(--white),var(--g50));position:relative;overflow:hidden}
.cta-box::before{content:'';position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:400px;height:200px;background:radial-gradient(ellipse,rgba(159,232,112,.12) 0%,transparent 70%);pointer-events:none}
.cta-box h2{font-size:32px;font-weight:900;line-height:0.85;margin-bottom:12px;position:relative}
.cta-box p{font-size:16px;color:var(--g600);margin-bottom:28px;position:relative;font-weight:600}
.cta-acts{display:flex;gap:10px;justify-content:center;position:relative}

/* ===== FOOTER ===== */
.footer{border-top:1px solid var(--black);padding:40px 24px}
.footer-in{max-width:var(--max);margin:0 auto;display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:32px}
.footer-left p{font-size:13px;color:var(--g500);margin-top:8px;max-width:320px;line-height:1.5;font-weight:600}
.footer-links{display:flex;gap:48px}
.footer-col h5{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--g400);margin-bottom:12px}
.footer-col ul{list-style:none}.footer-col li{margin-bottom:8px}.footer-col a{font-size:14px;color:var(--g600);font-weight:600}.footer-col a:hover{color:var(--black)}

/* ===== RESPONSIVE ===== */
@media(max-width:1024px){
  .card-grid.c4{grid-template-columns:repeat(2,1fr)}
  .card-grid.c3{grid-template-columns:repeat(2,1fr)}
  .task-grid{grid-template-columns:repeat(2,1fr)}
  .method-grid{grid-template-columns:repeat(2,1fr)}
  .method-item:nth-child(2)::after{display:none}
  .method-arrow{display:none}
  .sidebar{transform:translateX(-100%);transition:transform .25s ease}
  .sidebar.open{transform:translateX(0)}
  .main{margin-left:0}
}
@media(max-width:768px){
  :root{--py:64px}
  .hero h1{font-size:36px}
  .hero-sub{font-size:17px}
  .sec-title{font-size:28px}
  .pg-header h1{font-size:32px}
  .met-grid{grid-template-columns:repeat(2,1fr)}
  .met-item:nth-child(2)::after{display:none}
  .card-grid.c4,.card-grid.c3,.card-grid.c2{grid-template-columns:1fr}
  .pipeline{grid-template-columns:1fr;gap:32px}.pipeline::before{display:none}
  .task-grid{grid-template-columns:1fr}
  .method-grid{grid-template-columns:1fr}.method-item::after{display:none!important}
  .hamburger{display:flex}
  .footer-in{flex-direction:column}.footer-links{flex-direction:column;gap:24px}
  .tbl{font-size:13px}.tbl th,.tbl td{padding:12px 14px}
}
@media(max-width:480px){
  .hero h1{font-size:30px}
  .met-grid{grid-template-columns:1fr 1fr}
  .hero-acts{flex-direction:column;align-items:center}
  .cta-box{padding:40px 20px}.cta-box h2{font-size:24px}
}

/* ===== STORY / DIALOGUE ===== */
.scene{margin-bottom:56px;padding-bottom:40px;border-bottom:1px solid var(--g100)}
.scene:last-child{border-bottom:none}
.scene-label{font-family:var(--mono);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--wise-green);margin-bottom:8px}
.scene-title{font-size:24px;font-weight:900;line-height:0.85;margin-bottom:20px}
.scene-desc{font-size:16px;color:var(--g600);line-height:1.6;margin-bottom:24px;font-weight:400}
.dialogue{display:flex;gap:16px;margin-bottom:20px;align-items:flex-start}
.dialogue-avatar{width:56px;height:56px;border-radius:50%;overflow:hidden;flex-shrink:0;background:var(--g50);display:flex;align-items:center;justify-content:center}
.dialogue-avatar img{width:100%;height:100%;object-fit:cover}
.dialogue-bubble{background:var(--g50);border-radius:20px;padding:14px 18px;max-width:80%;position:relative}
.dialogue-bubble.xiaoming{background:var(--light-mint)}
.dialogue-bubble.xiaochu{background:var(--g50)}
.dialogue-name{font-size:12px;font-weight:600;margin-bottom:4px}
.dialogue-name.xiaoming{color:var(--dark-green)}
.dialogue-name.xiaochu{color:var(--g600)}
.dialogue-text{font-size:15px;line-height:1.6;color:var(--black);font-weight:400}
.narrator{font-size:15px;color:var(--g500);line-height:1.6;font-style:italic;margin:20px 0;padding:0 20px;border-left:3px solid var(--g200)}
.concept-card{background:var(--white);border-radius:30px;box-shadow:var(--card-s);padding:24px;margin-bottom:16px;transition:box-shadow .2s}
.concept-card:hover{box-shadow:var(--card-h)}
.concept-num{font-family:var(--mono);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--wise-green);margin-bottom:8px}
.concept-card h3{font-size:18px;font-weight:600;margin-bottom:8px;line-height:1.3}
.concept-card p{font-size:14px;color:var(--g600);line-height:1.6;font-weight:400}
.concept-card .tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
.exercise-box{background:rgba(159,232,112,0.08);border:1px solid rgba(159,232,112,0.3);border-radius:30px;padding:24px;margin-top:32px}
.exercise-box h3{font-size:16px;font-weight:600;color:var(--dark-green);margin-bottom:8px}
.exercise-box p{font-size:14px;color:var(--g600);line-height:1.6;font-weight:400}
.exercise-box .task{background:var(--white);border-radius:16px;padding:16px;margin-top:12px;font-size:14px;color:var(--black);font-weight:600}
@media(max-width:768px){
  .dialogue{flex-direction:column;gap:8px}
  .dialogue-bubble{max-width:100%}
  .dialogue-avatar{width:40px;height:40px}
}

/* ===== DARK MODE TOGGLE ===== */
.theme-toggle{position:fixed;top:20px;right:96px;z-index:205;width:40px;height:40px;border-radius:50%;background:var(--g50);border:1px solid var(--g200);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;font-size:18px}
.theme-toggle:hover{transform:scale(1.1);background:var(--g100)}
.theme-toggle .icon-sun,.theme-toggle .icon-moon{transition:opacity .2s}
body.dark .theme-toggle .icon-sun{display:none}
body:not(.dark) .theme-toggle .icon-moon{display:none}
@media(max-width:768px){.theme-toggle{right:72px;top:16px;width:36px;height:36px}}

/* ===== DARK MODE ===== */
body.dark{--black:#e8ebe6;--white:#1a1c19;--g900:#e8ebe6;--g600:#a0a3a0;--g500:#868685;--g400:#6b6d6b;--g200:#3a3d3a;--g100:#2a2d2a;--g50:#222522;--link:#9fe870;--badge-bg:rgba(159,232,112,.15);--badge-fg:#9fe870;--border-s:0 0 0 1px rgba(232,235,230,.1);--card-s:rgba(232,235,230,.1) 0 0 0 1px;--card-h:rgba(232,235,230,.2) 0 0 0 1px;--ring:rgba(232,235,230,.1) 0 0 0 1px}
body.dark .sidebar{background:#1a1c19;border-right-color:rgba(232,235,230,.08)}
body.dark .sidebar-group-items li a:hover{background:rgba(159,232,112,.08)}
body.dark .sidebar-group-items li a.active{background:rgba(159,232,112,.12);color:#9fe870}
body.dark .hero::before{background:radial-gradient(ellipse at center,rgba(159,232,112,.06) 0%,transparent 70%)}
body.dark .dialogue-bubble.xiaoming{background:rgba(159,232,112,.1)}
body.dark .dialogue-bubble.xiaochu{background:var(--g50)}
body.dark .narrator{border-left-color:var(--g200)}
body.dark .exercise-box{background:rgba(159,232,112,.06);border-color:rgba(159,232,112,.2)}
body.dark .exercise-box .task{background:var(--g50);color:var(--black)}
body.dark .card{background:var(--white)}
body.dark .concept-card{background:var(--white)}
body.dark .code-block{background:#0a0a0a}
body.dark .theme-toggle{background:var(--g50);border-color:var(--g200)}
body.dark .theme-toggle:hover{background:var(--g100)}
body.dark .hamburger{background:var(--g50);border-color:var(--g200)}
body.dark .hamburger svg{stroke:var(--black)}
body.dark .mascot-tooltip{background:var(--g50);color:var(--wise-green);border:1px solid var(--g200)}
body.dark .tbl thead{background:var(--g50)}
body.dark .footer{border-top-color:var(--g200)}
body.dark .sec-b{border-top-color:var(--g200)}
body.dark .toc-group h3{border-bottom-color:var(--g200)}
body.dark .toc-list li{border-bottom-color:var(--g100)}
body.dark .cta-box{background:linear-gradient(180deg,var(--white),var(--g50))}
`;

// ─── SHARED JS ───
const JS = `
// Dark mode persistence (global across pages via localStorage)
(function(){
  var saved=null;
  try{saved=localStorage.getItem('theme')}catch(e){}
  if(saved==='dark'){
    document.body.classList.add('dark');
  }else if(saved!=='light' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
    document.body.classList.add('dark'); // first visit: follow system preference
  }
  var toggle=document.getElementById('themeToggle');
  if(toggle){
    toggle.addEventListener('click',function(){
      var isDark=document.body.classList.toggle('dark');
      try{localStorage.setItem('theme',isDark?'dark':'light')}catch(e){}
    });
  }
})();

// Sidebar group collapse/expand
document.querySelectorAll('.sidebar-group-title').forEach(function(btn){
  btn.addEventListener('click',function(){
    this.closest('.sidebar-group').classList.toggle('collapsed');
  });
});

// Mobile sidebar toggle
var hamburger=document.querySelector('.hamburger');
var sidebar=document.querySelector('.sidebar');
var overlay=document.querySelector('.sidebar-overlay');
if(hamburger){
  hamburger.addEventListener('click',function(){
    sidebar.classList.toggle('open');
    overlay.classList.toggle('visible');
    document.body.classList.toggle('sidebar-open');
  });
}
if(overlay){
  overlay.addEventListener('click',function(){
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
    document.body.classList.remove('sidebar-open');
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="./"]').forEach(function(a){
  a.addEventListener('click',function(e){
    var t=document.querySelector(this.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'})}
  })
});
`;

// ─── LAYOUT ───
function layout(pageId, title, subtitle, breadcrumb, content) {
  const sidebarGroupsHtml = SIDEBAR_GROUPS.map(group => {
    const itemsHtml = group.items.map(item =>
      `<li><a href="${item.href}"${item.href === pageId ? ' class="active"' : ''}>${item.label}</a></li>`
    ).join('\n        ');
    return `<div class="sidebar-group">
      <button class="sidebar-group-title">
        ${group.title}
        <svg class="chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4l4 4-4 4"/></svg>
      </button>
      <ul class="sidebar-group-items">
        ${itemsHtml}
      </ul>
    </div>`;
  }).join('\n    ');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — 千问办公蓝皮书</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>

<button class="hamburger" aria-label="打开导航">
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#0e0f0c" stroke-width="1.5" stroke-linecap="round"><line x1="3" y1="5" x2="17" y2="5"/><line x1="3" y1="10" x2="17" y2="10"/><line x1="3" y1="15" x2="17" y2="15"/></svg>
</button>

<aside class="sidebar">
  <div class="sidebar-header">
    <a href="index.html" class="sidebar-logo">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg>
      千问办公蓝皮书
    </a>
  </div>
  <nav class="sidebar-nav">
    ${sidebarGroupsHtml}
  </nav>
</aside>
<div class="sidebar-overlay"></div>

<div class="theme-toggle" id="themeToggle" aria-label="切换暗黑模式" title="切换暗黑模式">
  <span class="icon-sun">☀️</span>
  <span class="icon-moon">🌙</span>
</div>

<div class="mascot" onclick="window.location.href='ch1.html'">
  <img src="xiaochu.png" alt="小触">
  <div class="mascot-tooltip">嗨！我是小触～</div>
</div>

<div class="main">
${breadcrumb ? `<div class="pg-header"><div class="breadcrumb"><a href="index.html">首页</a> / ${breadcrumb}</div>` : ''}
${breadcrumb ? `<div class="sec-label">${subtitle || ''}</div>` : ''}
${breadcrumb ? `<h1>${title}</h1>` : ''}
${breadcrumb ? `</div>` : ''}

${content}

<footer class="footer">
  <div class="footer-in">
    <div class="footer-left">
      <div class="sidebar-logo" style="font-size:14px">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg>
        千问办公蓝皮书
      </div>
      <p>以真实工作为主线，把 AI 协作经验沉淀为可复用的工作流。持续更新中。</p>
    </div>
    <div class="footer-links">
      <div class="footer-col"><h5>内容</h5><ul>
        <li><a href="path.html">阅读路径</a></li>
        <li><a href="cases.html">案例分享</a></li>
        <li><a href="eval.html">工作评测</a></li>
        <li><a href="tasks.html">任务速查</a></li>
      </ul></div>
      <div class="footer-col"><h5>资源</h5><ul>
        <li><a href="https://qwenwork.cn/docs" target="_blank">官方文档</a></li>
        <li><a href="toc.html">完整目录</a></li>
        <li><a href="https://qwenwork.cn" target="_blank">下载千问办公</a></li>
      </ul></div>
      <div class="footer-col"><h5>社区</h5><ul>
        <li><a href="about.html">关于蓝皮书</a></li>
        <li><a href="#">反馈建议</a></li>
        <li><a href="#">贡献指南</a></li>
      </ul></div>
    </div>
  </div>
</footer>
</div>

<script src="main.js"></script>
</body>
</html>`;
}

// ─── SVG ICONS (inline) ───
const ICO = {
  doc: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9fe870" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  image: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#de1d8d" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  chart: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#163300" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  shield: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  gear: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#7928ca" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.32 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  users: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#163300" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
};

// ─── PAGE: INDEX ───
const pageIndex = layout('index.html', '', '', '', `
<section class="hero">
  <div class="hero-badge"><span class="dot"></span> 持续更新中 · 2026 年 8 月</div>
  <h1>千问办公实战蓝皮书</h1>
  <p class="hero-sub">以真实工作场景为主线，把一次成功的 AI 协作变成可复用的工作流。从入门到自动化，每一章都经过实际任务验证。</p>
  <div class="hero-acts">
    <a href="path.html" class="btn-d">开始阅读</a>
    <a href="eval.html" class="btn-g">查看评测</a>
  </div>
</section>

<div class="metrics">
  <div class="met-grid">
    <div class="met-item"><div class="met-num">24</div><div class="met-lbl">实战章节</div></div>
    <div class="met-item"><div class="met-num">4</div><div class="met-lbl">学习阶段</div></div>
    <div class="met-item"><div class="met-num">18</div><div class="met-lbl">案例场景</div></div>
    <div class="met-item"><div class="met-num">6</div><div class="met-lbl">评测维度</div></div>
  </div>
</div>

<!-- 使用流程 -->
<section class="sec sec-b">
  <div class="sec-label">Workflow</div>
  <h2 class="sec-title">三步工作流</h2>
  <p class="sec-desc">从对话到交付，千问办公的核心工作循环。</p>
  <div class="pipeline">
    <div class="pipe-step">
      <div class="pipe-icon dev"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9fe870" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div>
      <h3 class="dt">Describe 描述任务</h3>
      <p>用自然语言描述工作意图，附上参考文件或数据。千问办公自动识别任务类型，选择最佳 Skill 和工具链。</p>
    </div>
    <div class="pipe-step">
      <div class="pipe-icon prev"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#de1d8d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div>
      <h3 class="pt">Preview 预览产出</h3>
      <p>实时查看生成进度，中间产出即时可预览。文档、表格、演示文稿、网页——所有格式所见即所得。</p>
    </div>
    <div class="pipe-step">
      <div class="pipe-icon ship"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d03238" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></div>
      <h3 class="st">Ship 交付使用</h3>
      <p>一键导出为 .docx / .pptx / .xlsx / .html 等格式，直接用于工作交付。沉淀为 Skill 供下次复用。</p>
    </div>
  </div>
  <div style="margin-top:48px">
    <div class="code-block">
<span class="cm">// 一个典型的千问办公工作流</span>
<span class="kw">用户</span>: 帮我把这份 PDF 合同的关键条款提取出来，生成一份风险审查报告

<span class="fn">千问办公</span>: <span class="cm">/* 自动路由 */</span>
  → 调用 <span class="str">pdf</span> Skill 解析合同全文
  → 调用 <span class="str">审查合同</span> 逐条风险分析
  → 生成 <span class="str">.docx</span> 审查报告 + 修改建议

<span class="kw">产出</span>: <span class="str">合同风险审查报告.docx</span> <span class="cm">// 红黄绿三级标记 + 谈判策略</span>
    </div>
  </div>
</section>

<!-- 精选案例预览 -->
<section class="sec sec-b">
  <div class="sec-label">Case Studies</div>
  <h2 class="sec-title">实战案例精选</h2>
  <p class="sec-desc">每个案例均来自真实工作场景，附带完整 Prompt、产出物和效果数据。</p>
  <div class="card-grid c3">
    <div class="case-card">
      <div class="case-thumb t1">${ICO.doc}</div>
      <div class="case-body">
        <span class="case-badge office">办公文档</span>
        <h3>45 页招股书核心数据提取与交叉验证</h3>
        <p>从 200 页 PDF 招股书中提取财务三表、股东结构、风险因素，自动生成投资备忘录。</p>
        <div class="case-meta"><span>节省 6 小时</span><span>准确率 97%</span></div>
      </div>
    </div>
    <div class="case-card">
      <div class="case-thumb t2">${ICO.image}</div>
      <div class="case-body">
        <span class="case-badge creative">内容创作</span>
        <h3>短视频分镜脚本 PPT — 从选题到交付</h3>
        <p>编剧向短视频创作者用千问办公生成 12 页分镜 PPT，含医学依据校验、视觉 QA 管线。</p>
        <div class="case-meta"><span>30 分钟交付</span><span>含视觉验证</span></div>
      </div>
    </div>
    <div class="case-card">
      <div class="case-thumb t3">${ICO.chart}</div>
      <div class="case-body">
        <span class="case-badge analysis">数据分析</span>
        <h3>月度经营数据仪表盘自动生成</h3>
        <p>连接 Excel 数据源，自动计算同比环比、杜邦分析，输出 HTML 仪表盘 + Word 报告。</p>
        <div class="case-meta"><span>自动化报表</span><span>5 分钟出图</span></div>
      </div>
    </div>
  </div>
  <div style="text-align:center;margin-top:32px">
    <a href="cases.html" class="btn-g">查看全部案例 →</a>
  </div>
</section>

<!-- CTA -->
<section class="cta-sec">
  <div class="cta-box">
    <h2>开始你的 AI 工作流实践</h2>
    <p>从第一个任务开始，把每次成功沉淀为可复用的能力。</p>
    <div class="cta-acts">
      <a href="https://qwenwork.cn" class="btn-d" target="_blank">下载千问办公</a>
      <a href="toc.html" class="btn-g">阅读蓝皮书</a>
    </div>
  </div>
</section>
`);

// ─── PAGE: PATH (overview) ───
const pagePath = layout('path.html', '四阶段阅读路径', 'Learning Path', '阅读路径', `
<section class="sec">
  <p class="sec-desc" style="margin-bottom:48px">从零基础上手到团队级 AI 工作流部署，按你的当前水平选择起点。每个阶段包含 6 个章节，循序渐进。</p>
  <div class="card-grid c4">
    <div class="card">
      <div class="card-step s1">Phase 01</div>
      <h3>环境搭建与基础操作</h3>
      <p>安装千问办公、连接工作目录、理解 Agent 对话模式与工具调用机制。完成第一个文件处理任务。</p>
      <div class="tags"><span class="tag">安装配置</span><span class="tag">目录连接</span><span class="tag">基础对话</span><span class="tag">文件操作</span></div>
      <div style="margin-top:16px"><a href="phase-1.html" style="font-size:13px;font-weight:500">查看详情 →</a></div>
    </div>
    <div class="card">
      <div class="card-step s2">Phase 02</div>
      <h3>场景化实战案例</h3>
      <p>覆盖办公文档、数据分析、内容创作、远程协作四大高频场景，每个案例附带完整 Prompt 与产出物。</p>
      <div class="tags"><span class="tag">文档处理</span><span class="tag">数据报表</span><span class="tag">内容生成</span><span class="tag">协作流程</span></div>
      <div style="margin-top:16px"><a href="phase-2.html" style="font-size:13px;font-weight:500">查看详情 →</a></div>
    </div>
    <div class="card">
      <div class="card-step s3">Phase 03</div>
      <h3>自动化与技能系统</h3>
      <p>将重复性工作封装为可复用 Skill，配置定时任务、多 Agent 协作流水线，搭建个人 AI 工作台。</p>
      <div class="tags"><span class="tag">Skill 开发</span><span class="tag">定时任务</span><span class="tag">Agent 编排</span><span class="tag">工作台</span></div>
      <div style="margin-top:16px"><a href="phase-3.html" style="font-size:13px;font-weight:500">查看详情 →</a></div>
    </div>
    <div class="card">
      <div class="card-step s4">Phase 04</div>
      <h3>行业方案与团队部署</h3>
      <p>法律、金融、电商、媒体等行业级实践，企业知识库接入、团队 Skill 共享与权限管理。</p>
      <div class="tags"><span class="tag">行业模板</span><span class="tag">知识库</span><span class="tag">团队共享</span><span class="tag">权限管理</span></div>
      <div style="margin-top:16px"><a href="phase-4.html" style="font-size:13px;font-weight:500">查看详情 →</a></div>
    </div>
  </div>
</section>

<!-- 方法论预览 -->
<section class="sec sec-b">
  <div class="sec-label">Methodology</div>
  <h2 class="sec-title">从一次成功到一套工作流</h2>
  <p class="sec-desc">蓝皮书的核心方法论：每次成功的 AI 协作都值得被沉淀为可复用的能力。</p>
  <div class="method-grid">
    <div class="method-item">
      <div class="method-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9fe870" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
      <h4>完成一次任务</h4><p>用自然语言对话完成具体工作，产出可交付物</p>
      <span class="method-arrow">→</span>
    </div>
    <div class="method-item">
      <div class="method-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#de1d8d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
      <h4>复盘为案例</h4><p>提炼 Prompt 策略、工具选择、产出质量评估</p>
      <span class="method-arrow">→</span>
    </div>
    <div class="method-item">
      <div class="method-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d03238" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06.06"/></svg></div>
      <h4>封装为 Skill</h4><p>将工作流沉淀为可复用技能，团队共享</p>
      <span class="method-arrow">→</span>
    </div>
    <div class="method-item">
      <div class="method-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7928ca" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
      <h4>部署 AI 团队</h4><p>多 Agent 协作、定时任务、企业知识库接入</p>
    </div>
  </div>
</section>

<section class="cta-sec">
  <div class="cta-box">
    <h2>选择你的起点</h2>
    <p>根据你的经验水平，从最合适的阶段开始。</p>
    <div class="cta-acts">
      <a href="phase-1.html" class="btn-d">从 Phase 1 开始</a>
      <a href="toc.html" class="btn-g">查看完整目录</a>
    </div>
  </div>
</section>
`);

// ─── Helper: Phase detail page ───
function phasePage(num, title, label, chapters) {
  const chapterCards = chapters.map(ch => `
    <div class="card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <span style="font-family:var(--mono);font-size:11px;font-weight:500;color:var(--g400)">CH.${String(ch.num).padStart(2,'0')}</span>
        <span class="tag">${ch.type}</span>
      </div>
      <h3>${ch.title}</h3>
      <p>${ch.desc}</p>
      ${ch.skills ? `<div class="tags" style="margin-top:12px">${ch.skills.map(s => `<span class="tag">${s}</span>`).join('')}</div>` : ''}
    </div>
  `).join('');

  return layout(`phase-${num}.html`, title, label, `<a href="path.html">阅读路径</a> / Phase ${num}`, `
<section class="sec">
  <div class="card-grid c2">
    ${chapterCards}
  </div>
</section>
<section class="cta-sec">
  <div class="cta-box">
    <h2>${num < 4 ? `继续 Phase ${num+1}` : '开始实战练习'}</h2>
    <p>${num < 4 ? '完成当前阶段后，进入下一阶段的学习。' : '所有阶段已完成，开始你的 AI 工作流实践。'}</p>
    <div class="cta-acts">
      ${num < 4 ? `<a href="phase-${num+1}.html" class="btn-d">下一阶段 →</a>` : `<a href="cases.html" class="btn-d">查看案例</a>`}
      <a href="path.html" class="btn-g">返回路径总览</a>
    </div>
  </div>
</section>
`);
}

const pagePhase1 = layout('ch2.html', '第二章 · 老板说做个方案', '小明的交付升级记', '<a href="index.html">首页</a> / 小明的交付升级记 / 第二章', `
<section class="sec">
  <div class="sec-label">GTD 第二步 · 澄清</div>
  <h2 class="sec-title" style="font-size:28px;margin-bottom:24px">周五 17:42，老板只说了一句</h2>
  <p class="scene-desc">小明终于装好了千问办公，还没来得及兴奋，老板的消息来了："下周把这个事情讲清楚。"——什么事情？讲给谁听？多长？什么标准？</p>

  <!-- Scene: 职场情节 -->
  <div class="scene">
    <div class="narrator">周五下午 5 点 42 分。小明正准备收拾东西下班，钉钉响了。老板发来一条消息。</div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaoming-avatar.png" alt="小明"></div>
      <div class="dialogue-bubble xiaoming">
        <div class="dialogue-name xiaoming">小明</div>
        <div class="dialogue-text">（看到消息）"下周把这个事情讲清楚"……什么事情？讲给谁？讲多久？</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">先别急着让 AI 干活。老板说"讲清楚"——你先回答我六个问题。</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaoming-avatar.png" alt="小明"></div>
      <div class="dialogue-bubble xiaoming">
        <div class="dialogue-name xiaoming">小明</div>
        <div class="dialogue-text">哪六个？</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">
          1. 你最后要交付什么？<br>
          2. 谁会看这个结果？<br>
          3. 什么信息是事实，什么只是猜测？<br>
          4. 哪一步可以交给 AI？<br>
          5. 哪一步必须由你自己判断？<br>
          6. 怎样才算完成？
        </div>
      </div>
    </div>

    <div class="narrator">小明愣住了。他从来没想过这些问题。以前接到任务，他就直接打开 PPT 开始做。</div>
  </div>

  <!-- 操作流程 -->
  <div class="scene">
    <div class="sec-label">Step 1 · 澄清任务</div>
    <h2 class="scene-title">把模糊要求变成明确交付物</h2>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">1.1 问自己：交付物是什么？</h3>
      <p>老板说"讲清楚"，但"讲清楚"不是交付物。交付物应该是一份<strong>10 页以内的 PPT</strong>，用于<strong>下周三的部门例会</strong>，听众是<strong>部门总监和 3 个同事</strong>，时间<strong>15 分钟</strong>。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：千问办公对话界面，展示小明和小触的对话，小触列出 6 个问题</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">1.2 问自己：受众是谁？</h3>
      <p>部门总监关心<strong>结论和成本</strong>，同事关心<strong>具体怎么做</strong>。所以 PPT 的结构应该是：先讲结论（1 页），再讲成本（2 页），最后讲执行步骤（5 页）。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label"> 截图位置：千问办公生成的 PPT 大纲，标注受众分析</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">1.3 问自己：什么是事实？</h3>
      <p>小明手上有 3 份数据报告、2 封客户邮件、1 个会议纪要。这些是<strong>事实</strong>。但"这个项目能省 30% 成本"是<strong>猜测</strong>——需要验证。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：千问办公整理的资料清单，标注"事实"和"猜测"</div>
      </div>
    </div>
  </div>

  <!-- Scene: 对话过渡 -->
  <div class="scene">
    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaoming-avatar.png" alt="小明"></div>
      <div class="dialogue-bubble xiaoming">
        <div class="dialogue-name xiaoming">小明</div>
        <div class="dialogue-text">（恍然大悟）原来我之前都是直接开始做，从来没想过这些问题！</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">现在你知道了要交付什么、给谁看、什么是事实。接下来，让 AI 帮你整理资料。</div>
      </div>
    </div>
  </div>

  <!-- 操作流程 -->
  <div class="scene">
    <div class="sec-label">Step 2 · 整理资料</div>
    <h2 class="scene-title">让 AI 捕捉、分类和提取信息</h2>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">2.1 把所有资料放进工作目录</h3>
      <p>小明把 3 份 PDF 报告、2 封邮件（导出为 .eml）、1 个会议纪要（Word）全部放入千问办公的工作目录。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：工作目录文件夹，显示 6 个文件</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">2.2 让 AI 提取关键信息</h3>
      <p>在对话框输入："帮我从这 6 个文件里提取关键数据，按'事实'和'猜测'分类。" 千问办公会逐份阅读文件，提取数据点，并标注来源。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：千问办公提取信息的过程，展示进度条和提取结果</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">2.3 人工核验</h3>
      <p>AI 提取完成后，小明逐条检查：哪些数据是准确的？哪些需要补充？哪些"猜测"需要验证？他在千问办公里直接标注。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：小明在千问办公里标注"已核验"和"待验证"的界面</div>
      </div>
    </div>
  </div>

  <!-- Scene: 对话过渡 -->
  <div class="scene">
    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">资料整理好了。现在回答我：你的核心结论是什么？用一句话说。</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaoming-avatar.png" alt="小明"></div>
      <div class="dialogue-bubble xiaoming">
        <div class="dialogue-name xiaoming">小明</div>
        <div class="dialogue-text">（思考）嗯……这个项目能帮部门提升效率，但需要先投入 50 万。</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">好。现在让 AI 帮你从资料到结论，再到汇报结构。</div>
      </div>
    </div>
  </div>

  <!-- 操作流程 -->
  <div class="scene">
    <div class="sec-label">Step 3 · 形成方案</div>
    <h2 class="scene-title">从资料到结论，再到汇报结构</h2>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">3.1 让 AI 生成 PPT 大纲</h3>
      <p>输入："基于刚才整理的资料，生成一份 10 页 PPT 大纲。结构：结论（1 页）→ 成本分析（2 页）→ 执行步骤（5 页）→ 风险与应对（2 页）。" 千问办公会生成大纲，每页标注核心观点和支持数据。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：千问办公生成的 PPT 大纲，展示每页标题和核心观点</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">3.2 人工调整逻辑</h3>
      <p>小明看了一遍大纲，发现第 4 页和第 5 页的顺序应该调换——先讲执行步骤，再讲成本，逻辑更顺。他在千问办公里直接拖拽调整。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：小明在千问办公里调整 PPT 大纲顺序的界面</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">3.3 生成 PPT 初稿</h3>
      <p>确认大纲后，让千问办公生成 PPT 初稿。它会自动填充数据、图表和文字。小明只需要微调排版和配色。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：千问办公生成的 PPT 初稿，展示前 3 页</div>
      </div>
    </div>
  </div>

  <!-- 对话收尾 -->
  <div class="scene">
    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaoming-avatar.png" alt="小明"></div>
      <div class="dialogue-bubble xiaoming">
        <div class="dialogue-name xiaoming">小明</div>
        <div class="dialogue-text">（看着 PPT）这次不一样。上次我做 PPT，做着做着就不知道要讲什么了。这次……我好像真的想清楚了。</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">因为你先想清楚了"什么叫干完"，再让 AI 帮你展开。这才是正确的顺序。</div>
      </div>
    </div>
  </div>

  <!-- 练习作业 -->
  <div class="exercise-box">
    <h3> 第二章练习作业</h3>
    <p>用"小触的 6 个问题"澄清一个你手头的模糊任务：</p>
    <div class="task">
      <strong>任务：</strong>找一个老板/客户/同事给你的模糊指令（比如"做个方案""分析一下""整理一下"）。<br><br>
      <strong>步骤：</strong><br>
      1. 写下原始指令<br>
      2. 用小触的 6 个问题逐一回答<br>
      3. 把模糊指令改写成明确的交付物描述<br><br>
      <strong>示例：</strong><br>
      原始指令："分析一下竞品"<br>
      明确交付物："一份 5 页 PPT，下周一给产品总监，对比我们和 A、B 两家竞品的功能差异，重点讲我们缺什么，10 分钟讲完"<br><br>
      <strong>记录：</strong>把改写前后的指令都记下来。你会发现，澄清任务本身就能解决 50% 的焦虑。
    </div>
  </div>

  <!-- 下一步 -->
  <div style="margin-top:48px;text-align:center">
    <h3 style="font-size:20px;font-weight:600;margin-bottom:12px">准备好进入第三章了吗？</h3>
    <p style="font-size:16px;color:var(--g600);margin-bottom:24px">任务澄清了，但资料散落在 27 个文件里。接下来，小触会教你如何让 AI 整理混乱。</p>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      <a href="ch1.html" class="btn-g">← 返回第一章</a>
      <a href="ch3.html" class="btn-d">进入第三章 →</a>
    </div>
  </div>
</section>

<style>
.screenshot-placeholder{background:var(--g50);border:2px dashed var(--g200);border-radius:12px;padding:20px;text-align:center}
.screenshot-label{font-size:13px;color:var(--g500);font-weight:500}
</style>
`);

// ─── PAGE: CHAPTER 3 (桌面上的 27 个文件) ───
const pageCh3 = layout('ch3.html', '第三章 · 桌面上的 27 个文件', '小明的交付升级记', '<a href="index.html">首页</a> / 小明的交付升级记 / 第三章', `
<section class="sec">
  <div class="sec-label">GTD 第三步 · 组织</div>
  <h2 class="sec-title" style="font-size:28px;margin-bottom:24px">资料散落在 7 个地方</h2>
  <p class="scene-desc">任务澄清了：下周三给部门总监讲"客户成功体系升级方案"。但相关资料散落在微信、邮件、共享盘、桌面、下载文件夹、同事的口头描述和两个月前的一次会议纪要里。</p>

  <!-- Scene: 职场情节 -->
  <div class="scene">
    <div class="narrator">周一早上。小明盘点了做这份方案需要的资料：桌面上 12 个文件、下载文件夹 8 个、共享盘 4 个、微信收藏 3 条——一共 27 个文件。还有销售同事老王上周说的"客户流失数据我发你"，到现在还没发。</div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaoming-avatar.png" alt="小明"></div>
      <div class="dialogue-bubble xiaoming">
        <div class="dialogue-name xiaoming">小明</div>
        <div class="dialogue-text">（看着满屏文件）27 个文件……我总不能全看一遍吧？光看完就得一天。</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">当然不用全看。先回答我：这 27 个文件里，哪些是事实，哪些是别人的观点，哪些已经过时了？</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaoming-avatar.png" alt="小明"></div>
      <div class="dialogue-bubble xiaoming">
        <div class="dialogue-name xiaoming">小明</div>
        <div class="dialogue-text">我不知道啊，我都没打开看过……</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">这就是 AI 该干的活了。把文件全部喂给我，我来分拣。但记住——分拣的标准得你来定，因为只有你知道总监关心什么。</div>
      </div>
    </div>
  </div>

  <!-- 操作流程 -->
  <div class="scene">
    <div class="sec-label">Step 1 · 捕捉资料</div>
    <h2 class="scene-title">把 27 个文件装进一个池子</h2>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">1.1 建一个项目文件夹</h3>
      <p>在工作目录里新建 <code>客户成功方案/资料池/</code>。把 27 个文件不管什么格式，全部丢进去。这一步的原则：<strong>先集中，再分类</strong>。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：工作目录中的"资料池"文件夹，显示 27 个文件</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">1.2 追回"口头资料"</h3>
      <p>别忘了他人的口头信息。小明给老王发消息要数据，把微信收藏的 3 条内容截图存入资料池。口头承诺也是资料的一部分。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：微信/钉钉聊天记录归档到资料池的操作</div>
      </div>
    </div>
  </div>

  <!-- 操作流程 -->
  <div class="scene">
    <div class="sec-label">Step 2 · 让 AI 分拣</div>
    <h2 class="scene-title">事实、观点、过时——三级分拣</h2>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">2.1 给出分拣标准</h3>
      <p>在千问办公输入："阅读资料池里的全部文件，按三类分拣：<strong>①事实数据</strong>（有明确来源的数字、日期、名单）；<strong>②观点判断</strong>（'我认为''建议'类内容）；<strong>③疑似过时</strong>（超过 6 个月的或与最新数据矛盾的）。输出分拣清单，每条注明来源文件。"</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：千问办公的分拣指令和执行进度</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">2.2 检查分拣结果</h3>
      <p>千问办公输出清单后，小明抽查了 5 条：4 条准确，1 条把销售总监的"个人预测"误判成了事实。他手动修正了分类。AI 分拣快，但<strong>标准是人定的，抽查是人做的</strong>。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：分拣结果清单，标注小明修正的那一条</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">2.3 生成"资料地图"</h3>
      <p>让千问办公把分拣结果整理成一页"资料地图"：做方案需要哪些数据、已有哪些、缺哪些、找谁要。小明发现缺 3 项关键数据，其中一项必须找老王要。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：千问办公生成的"资料地图"，标注缺口项</div>
      </div>
    </div>
  </div>

  <!-- 对话收尾 -->
  <div class="scene">
    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaoming-avatar.png" alt="小明"></div>
      <div class="dialogue-bubble xiaoming">
        <div class="dialogue-name xiaoming">小明</div>
        <div class="dialogue-text">原来 27 个文件里，真正能用的是 11 个。剩下 16 个要么过时，要么就是重复的。</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">而且你现在还知道了缺什么。去找老王要数据吧——这个 AI 替代不了，只有你能开口。</div>
      </div>
    </div>
  </div>

  <!-- 练习作业 -->
  <div class="exercise-box">
    <h3> 第三章练习作业</h3>
    <p>给你的下一个任务建一个"资料池"：</p>
    <div class="task">
      <strong>任务：</strong>选一个你手头正在进行的项目，把散落各处的资料集中起来。<br><br>
      <strong>步骤：</strong><br>
      1. 新建项目资料池文件夹，收集所有相关文件<br>
      2. 让千问办公按"事实 / 观点 / 过时"三级分拣<br>
      3. 抽查 5 条分拣结果，修正误判<br>
      4. 生成一页"资料地图"，标出缺口<br><br>
      <strong>记录：</strong>收集了多少个文件？分拣后真正可用的有几个？缺什么数据、找谁要？
    </div>
  </div>

  <!-- 下一步 -->
  <div style="margin-top:48px;text-align:center">
    <h3 style="font-size:20px;font-weight:600;margin-bottom:12px">准备好进入第四章了吗？</h3>
    <p style="font-size:16px;color:var(--g600);margin-bottom:24px">资料齐了，但小明又习惯性地想打开 PPT。小触拦住了他。</p>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      <a href="ch2.html" class="btn-g">← 返回第二章</a>
      <a href="ch4.html" class="btn-d">进入第四章 →</a>
    </div>
  </div>
</section>
`);

// ─── PAGE: CHAPTER 4 (不是写得漂亮，而是讲得明白) ───
const pageCh4 = layout('ch4.html', '第四章 · 不是写得漂亮，而是讲得明白', '小明的交付升级记', '<a href="index.html">首页</a> / 小明的交付升级记 / 第四章', `
<section class="sec">
  <div class="sec-label">GTD 第四步 · 调动 AI</div>
  <h2 class="sec-title" style="font-size:28px;margin-bottom:24px">先想清楚，再动手</h2>
  <p class="scene-desc">资料齐了，缺口也补上了。周二晚上，小明打开 PowerPoint，新建空白文档，盯着标题栏发呆——他习惯先挑个好看的模板。</p>

  <!-- Scene: 职场情节 -->
  <div class="scene">
    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">等等。你在挑模板？你的核心结论还没定呢。</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaoming-avatar.png" alt="小明"></div>
      <div class="dialogue-bubble xiaoming">
        <div class="dialogue-name xiaoming">小明</div>
        <div class="dialogue-text">结论嘛……写着写着就出来了。我以前都是这么干的。</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">所以你以前每次写到第 6 页就推翻前 5 页。回答我：你的核心结论是什么？用一句话说。说不出来，就说明还没想明白。</div>
      </div>
    </div>

    <div class="narrator">小明想了想。老板不是转发过一篇白皮书吗？流失客户里也确实有嫌贵的。他很快敲下第一版。</div>

    <div class="elevator-version">
      <div class="ev-tag ev-v1">第一版（小明的直觉）</div>
      <div class="ev-text">"客户流失主因是价格偏高，建议对流失风险客户打折促销，保住续约。"</div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">这句话，你敢让 AI 挑战一下吗？</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaoming-avatar.png" alt="小明"></div>
      <div class="dialogue-bubble xiaoming">
        <div class="dialogue-name xiaoming">小明</div>
        <div class="dialogue-text">（有点心虚）……挑战吧。</div>
      </div>
    </div>
  </div>

  <!-- 操作流程：AI 挑战 -->
  <div class="scene">
    <div class="sec-label">Step 1 · 让 AI 挑战你的结论</div>
    <h2 class="scene-title">被挑战过的结论，才配上会</h2>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">1.1 发起挑战</h3>
      <p>在千问办公输入："假设你是挑剔的部门总监，你会如何质疑这个结论？请用资料池里的证据说话。"</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：千问办公发出的挑战指令</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">1.2 AI 抛出四连问</h3>
      <p>千问办公没有客气，直接甩出证据：</p>
      <div class="challenge-list">
        <div class="challenge-item">❶ <strong>"价格是主因"和你的资料矛盾。</strong>老王的流失明细里，因为价格走的只占 20.9%，而"响应慢/找不到人"占 55.8%——你自己的数据不支持你。</div>
        <div class="challenge-item">❷ <strong>三家流失客户访谈，退订原话全部指向响应。</strong>"提了三次工单两次没人回""出问题找不到人"——没有一家提价格。</div>
        <div class="challenge-item">❸ <strong>趋势也不支持。</strong>响应时长从 48 小时恶化到 58/62/65 小时，同期流失率从 12% 涨到 18%——两条曲线一起恶化。</div>
        <div class="challenge-item">❹ <strong>打折反而有反作用。</strong>按你老板转发的行业文章，留客要靠服务升级；降价促销治标不治本，还拉低客单价。</div>
      </div>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：AI 列出的四条质疑，逐条附证据来源</div>
      </div>
    </div>
  </div>

  <!-- Scene: 推翻重来 -->
  <div class="scene">
    <div class="narrator">小明盯着屏幕，半天没说话。他最开始的那个判断——"价格是主因"——是他一秒钟的直觉。而对面这四条质疑，每一条后面都站着一份资料。他有两个选择：为自己的直觉辩护，或者承认直觉错了。</div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaoming-avatar.png" alt="小明"></div>
      <div class="dialogue-bubble xiaoming">
        <div class="dialogue-name xiaoming">小明</div>
        <div class="dialogue-text">（深吸一口气）……我错了。价格确实是个因素，但它解释不了大头。真正的主因是响应慢。</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">恭喜。这一步比写出正确答案更难——<strong>敢于把已经缩小的可能性空间重新打开</strong>。现在，把新版电梯句写出来。</div>
      </div>
    </div>

    <div class="narrator">小明重新翻了一遍资料地图。这一次，他知道每半句话该由哪份资料撑腰。五分钟后——</div>

    <div class="elevator-version">
      <div class="ev-tag ev-v2">第二版（证据撑腰）</div>
      <div class="ev-text">"客户流失的主因不是价格（仅 20.9%），是响应慢（55.8%，响应时长 48h→65h 持续恶化）。升级客服响应体系，半年有望把流失率从 18% 降到 12%（销售侧预估），需要先投 50 万。"</div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">好句子。注意你自己加的那四个字——"销售侧预估"。你已经开始区分事实和推测了，这是第五章要正式训练的能力。现在，让 AI 把这句话展开成汇报结构。</div>
      </div>
    </div>
  </div>

  <!-- 操作流程 -->
  <div class="scene">
    <div class="sec-label">Step 2 · 展开结构</div>
    <h2 class="scene-title">让 AI 把一句话变成骨架</h2>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">2.1 生成金字塔大纲</h3>
      <p>输入："基于电梯句和资料地图，生成 10 页 PPT 大纲：结论 1 页、问题与数据 3 页、方案 3 页、成本收益 2 页、风险与请示 1 页。每页只写标题和这页要回答的问题。"</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：千问办公生成的金字塔结构大纲</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">2.2 人工调整逻辑顺序</h3>
      <p>小明读了一遍，把"成本收益"提到"方案"之前——总监最关心钱，先让他看到账。AI 给的是通用结构，<strong>顺序要按听众的心智调整</strong>。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：小明拖拽调整大纲顺序的前后对比</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">2.3 生成 PPT 初稿</h3>
      <p>结构定稿后才生成 PPT。千问办公自动填充数据图表和文字，小明只微调两处措辞。<strong>模板最后挑，甚至可以不挑</strong>——结构对了，朴素也清楚。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：生成的 PPT 初稿首页与大纲页</div>
      </div>
    </div>
  </div>

  <!-- 本章判断地图 -->
  <div class="scene">
    <div class="sec-label">本章带走的地图</div>
    <h2 class="scene-title">电梯句四要素 + 判断三动作</h2>
    <div class="card" style="background:var(--light-mint);border:1px solid rgba(159,232,112,0.3)">
      <p style="font-size:14px;line-height:1.8;font-weight:400">
        <strong>电梯句公式：</strong>问题 → 主张 → 证据量级 → 代价<br><br>
        <strong>判断三动作：</strong><br>
        ① <strong>立住</strong>——一句话说结论，说不出来就是没想明白；<br>
        ② <strong>挑战</strong>——让 AI 扮演最挑剔的听众，用你自己的资料反驳你；<br>
        ③ <strong>敢改</strong>——当证据不站在你这边时，推翻自己重来。这比写对更难，也更重要。
      </p>
    </div>
  </div>

  <!-- 对话收尾 -->
  <div class="scene">
    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaoming-avatar.png" alt="小明"></div>
      <div class="dialogue-bubble xiaoming">
        <div class="dialogue-name xiaoming">小明</div>
        <div class="dialogue-text">以前我总在做完 PPT 后才发现逻辑不对，然后整夜重做。这次要是没有那四连问，我大概已经做了一晚上"打折促销方案"——方向全错的漂亮 PPT。</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">AI 最大的价值不是帮你写，是在你错的时候，用你自己的数据拦住你。不过先别高兴——明天发出去之前，还有最后一关。</div>
      </div>
    </div>
  </div>

  <!-- 练习作业 -->
  <div class="exercise-box">
    <h3> 第四章练习作业</h3>
    <p>写电梯句，让 AI 挑战它，然后诚实面对结果：</p>
    <div class="task">
      <strong>任务：</strong>为你手头的一个方案写电梯句，并让 AI 挑战它。<br><br>
      <strong>格式：</strong>问题 → 主张 → 证据量级 → 代价<br><br>
      <strong>步骤：</strong><br>
      1. <strong>先写直觉版</strong>——不许查资料，30 秒内写下你心里那个答案<br>
      2. 让千问办公扮演最挑剔的听众，提出至少 4 个质疑，每个质疑必须引用你的资料<br>
      3. 逐条对照：你的直觉版被驳倒了几条？<br>
      4. 被驳倒就重写——写出证据撑腰的第二版<br><br>
      <strong>自检品控卡：</strong><br>
      □ 第二版和第一版不一样吗？（一样 = 挑战没起作用）<br>
      □ 第二版里每个数字都能指出出处吗？<br>
      □ 推测性的话，你标出"预估"了吗？<br>
      □ 一句话说给同事听，他复述得出来吗？
    </div>
  </div>

  <!-- 下一步 -->
  <div style="margin-top:48px;text-align:center">
    <h3 style="font-size:20px;font-weight:600;margin-bottom:12px">准备好进入第五章了吗？</h3>
    <p style="font-size:16px;color:var(--g600);margin-bottom:24px">方案做好了，AI 看起来很完美。但小触发现了三个不能发的问题。</p>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      <a href="ch3.html" class="btn-g">← 返回第三章</a>
      <a href="ch5.html" class="btn-d">进入第五章 →</a>
    </div>
  </div>
</section>

<style>
.elevator-version{margin:20px 0;padding:18px 22px;border-radius:16px;max-width:640px}
.elevator-version .ev-tag{display:inline-block;font-family:var(--mono);font-size:11px;font-weight:600;padding:3px 10px;border-radius:9999px;margin-bottom:10px}
.elevator-version .ev-text{font-size:17px;font-weight:600;line-height:1.6}
.ev-v1{background:rgba(208,50,56,.05);border:1px solid rgba(208,50,56,.2)}
.ev-v1 .ev-tag{background:#d03238;color:#fff}
.ev-v1 .ev-text{color:var(--g600)}
.ev-v2{background:rgba(159,232,112,.1);border:1px solid rgba(159,232,112,.35)}
.ev-v2 .ev-tag{background:var(--wise-green);color:var(--dark-green)}
.ev-v2 .ev-text{color:var(--dark-green)}
.challenge-list{display:flex;flex-direction:column;gap:10px;margin:12px 0}
.challenge-item{font-size:14px;line-height:1.6;font-weight:400;color:var(--g600);padding:12px 16px;background:var(--g50);border-radius:12px;border-left:3px solid #d03238}
</style>
`);

// ─── PAGE: CHAPTER 5 (AI 做完了，为什么不能直接发) ───
const pageCh5 = layout('ch5.html', '第五章 · AI 做完了，为什么不能直接发', '小明的交付升级记', '<a href="index.html">首页</a> / 小明的交付升级记 / 第五章', `
<section class="sec">
  <div class="sec-label">GTD 第五步 · 人工验收</div>
  <h2 class="sec-title" style="font-size:28px;margin-bottom:24px">周三 08:15，发送键前 10 分钟</h2>
  <p class="scene-desc">方案做完了，看起来专业、完整、漂亮。小明把光标移到"发送"按钮上。就在这时，小触拦住了他。</p>

  <!-- Scene: 职场情节 -->
  <div class="scene">
    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">等一下。这份方案里有 3 个数据是 AI 推测的，不是事实。还有 1 页引用了客户名单，那是不能进 PPT 的。你自己逐条看过吗？</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaoming-avatar.png" alt="小明"></div>
      <div class="dialogue-bubble xiaoming">
        <div class="dialogue-name xiaoming">小明</div>
        <div class="dialogue-text">（心头一紧）哪里？我怎么没发现……</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">"半年降到 12%"是老王的口头预估，PPT 里却写成了"预计达成"；第 6 页的客户名单来自 CRM 导出，含联系方式。<strong>发出去的那一刻，责任就是你的，不是 AI 的。</strong>我们来过一遍验收清单。</div>
      </div>
    </div>
  </div>

  <!-- 操作流程 -->
  <div class="scene">
    <div class="sec-label">Step 1 · 事实核验</div>
    <h2 class="scene-title">每个数字都要有出处</h2>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">1.1 生成"数据溯源表"</h3>
      <p>输入："列出方案里所有数字和事实性陈述，每个标注：来源文件 / 是实测数据还是推测 / 置信度。"千问办公输出溯源表，3 条推测无所遁形。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：数据溯源表，高亮标出 3 条推测项</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">1.2 改写或删除推测项</h3>
      <p>推测不是不能写，是要<strong>诚实标注</strong>。小明把"预计达成"改成"销售侧预估，需试点验证"。一句话的差别，决定总监会不会当场戳穿。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：修改前后的措辞对比</div>
      </div>
    </div>
  </div>

  <!-- 操作流程 -->
  <div class="scene">
    <div class="sec-label">Step 2 · 权限与合规检查</div>
    <h2 class="scene-title">该发的发，不该发的删</h2>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">2.1 扫描敏感信息</h3>
      <p>输入："检查方案中是否有：客户身份信息、未公开财务数据、他人未发表的言论。"第 6 页的客户名单被标红——含手机号和合同金额。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：敏感信息扫描结果，标红项</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">2.2 脱敏处理</h3>
      <p>名单改为"客户 A / B / C"，金额改为区间。信息量没损失，风险归零。<strong>交付物的受众决定脱敏深度</strong>——这份方案总监能看全量，部门群不能。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：脱敏前后的第 6 页对比</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">2.3 最后一次"AI 朗读"</h3>
      <p>让千问办公以"第一次看到这份方案的销售同事"视角通读一遍，挑出看不懂的术语和跳跃的逻辑。改掉两处黑话。<strong>验收的本质：替每个读者先读一遍。</strong></p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：AI 模拟读者视角的审阅意见</div>
      </div>
    </div>
  </div>

  <!-- 对话收尾 -->
  <div class="scene">
    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaoming-avatar.png" alt="小明"></div>
      <div class="dialogue-bubble xiaoming">
        <div class="dialogue-name xiaoming">小明</div>
        <div class="dialogue-text">（点击发送）发出去了。奇怪，明明比以前更紧张，却也更踏实。</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">因为你核验过的每一个数字，都是你签字画押过的。这就是"敢负责"的底气。</div>
      </div>
    </div>
  </div>

  <!-- 练习作业 -->
  <div class="exercise-box">
    <h3> 第五章练习作业</h3>
    <p>给你最近一份交付物做一次验收：</p>
    <div class="task">
      <strong>任务：</strong>找一份你近期要发出去的文档/PPT，跑一遍三步验收。<br><br>
      <strong>验收清单：</strong><br>
      1. 数据溯源：每个数字有出处，推测项已标注<br>
      2. 权限扫描：无敏感信息越权，脱敏符合受众<br>
      3. 模拟朗读：让 AI 以目标读者视角挑刺<br><br>
      <strong>记录：</strong>发现了几处推测被写成了事实？几处敏感信息？这个数字会吓到你。
    </div>
  </div>

  <!-- 下一步 -->
  <div style="margin-top:48px;text-align:center">
    <h3 style="font-size:20px;font-weight:600;margin-bottom:12px">准备好进入第六章了吗？</h3>
    <p style="font-size:16px;color:var(--g600);margin-bottom:24px">方案通过了。但如果下周总监再说一次"做个方案"，还要从头来吗？</p>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      <a href="ch4.html" class="btn-g">← 返回第四章</a>
      <a href="ch6.html" class="btn-d">进入第六章 →</a>
    </div>
  </div>
</section>
`);

// ─── PAGE: CHAPTER 6 (一次成功不能只成功一次) ───
const pageCh6 = layout('ch6.html', '第六章 · 一次成功不能只成功一次', '小明的交付升级记', '<a href="index.html">首页</a> / 小明的交付升级记 / 第六章', `
<section class="sec">
  <div class="sec-label">GTD 第六步 · 沉淀系统</div>
  <h2 class="sec-title" style="font-size:28px;margin-bottom:24px">把这次成功变成下次的起点</h2>
  <p class="scene-desc">周三下午的例会，总监当场通过方案，只提了一个小修改。会后他路过小明工位，说了一句："下周帮销售部也做个类似的。"</p>

  <!-- Scene: 职场情节 -->
  <div class="scene">
    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaoming-avatar.png" alt="小明"></div>
      <div class="dialogue-bubble xiaoming">
        <div class="dialogue-name xiaoming">小明</div>
        <div class="dialogue-text">（有点得意）过了！总监还让我帮销售部也做一个……等等，那不又要从头再来一遍？</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">如果每次都从头开始，你只是成功了一次，不是掌握了一套。这次你走通了六步——捕捉、澄清、组织、展开、验收。把它们存下来。</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaoming-avatar.png" alt="小明"></div>
      <div class="dialogue-bubble xiaoming">
        <div class="dialogue-name xiaoming">小明</div>
        <div class="dialogue-text">存成什么？</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">存成一条你自己随时能调用的流水线。下次总监再丢来一个模糊指令，你从"焦虑"直接跳到"第六步"。</div>
      </div>
    </div>
  </div>

  <!-- 操作流程 -->
  <div class="scene">
    <div class="sec-label">Step 1 · 复盘流水线</div>
    <h2 class="scene-title">把过程写成可复用的清单</h2>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">1.1 让 AI 复盘全过程</h3>
      <p>输入："复盘我们这次方案的完整流程，输出一份可复用的六步清单：每步的目标、关键指令、人工检查点、耗时。"千问办公基于本次对话历史生成清单。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：AI 生成的六步流水线复盘清单</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">1.2 标记"可自动化"与"必须人工"</h3>
      <p>清单里，转写、分拣、大纲生成、敏感扫描可以自动化；<strong>电梯句、顺序调整、验收拍板必须人工</strong>。把这条边界写清楚，是流水线最值钱的部分。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：标注"AI 执行 / 人工把关"边界的清单</div>
      </div>
    </div>
  </div>

  <!-- 操作流程 -->
  <div class="scene">
    <div class="sec-label">Step 2 · 沉淀为 Skill</div>
    <h2 class="scene-title">从"做过一次"到"一键调用"</h2>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">2.1 创建个人 Skill</h3>
      <p>把清单封装为技能："方案流水线"——触发词"做个方案"。Skill 内置六步结构、电梯句模板、验收清单。下次一句"帮我做销售部的方案"，流水线自动展开。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：千问办公创建 Skill 的界面与 SKILL 配置</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">2.2 实战检验：帮销售部做方案</h3>
      <p>周四，小明调用"方案流水线"做销售部的方案。原本三天的活，四个小时交付——因为澄清问题、分拣标准、验收清单都不用重新想了。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：调用 Skill 后的执行过程，各步骤耗时对比</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">2.3 分享给团队</h3>
      <p>小明把 Skill 分享到部门。同事小林用它做了一份招聘方案，反馈"电梯句模板真好用"。流水线在别人手里长出了新分支——这超出了小明的设计，也正是沉淀的意义。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：Skill 分享界面与同事使用反馈</div>
      </div>
    </div>
  </div>

  <!-- 对话收尾 -->
  <div class="scene">
    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">还记得上周一早上，你面对 17 件待办不知从哪开始吗？</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaoming-avatar.png" alt="小明"></div>
      <div class="dialogue-bubble xiaoming">
        <div class="dialogue-name xiaoming">小明</div>
        <div class="dialogue-text">记得。那时候我以为问题是"我不会用 AI"。现在才明白——我其实从来没用看清过工作的完整结构。</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">这就是交付升级的全部秘密：<strong>人负责理解工作的意义，AI 负责展开工作的复杂性，人和 AI 一起把事情交付出去。</strong>去吧，你的下一个方案，不需要我了。</div>
      </div>
    </div>

    <div class="narrator">小明笑了笑，合上电脑。这一次，他准点下了班。（第一季 · 完）</div>
  </div>

  <!-- 练习作业 -->
  <div class="exercise-box">
    <h3> 第六章练习作业（第一季毕业作业）</h3>
    <p>完成你自己的"交付升级"闭环：</p>
    <div class="task">
      <strong>任务：</strong>把第一章到第五章的练习串联成一条属于你的流水线。<br><br>
      <strong>步骤：</strong><br>
      1. 复盘：用六步清单复盘你最近一次完整交付<br>
      2. 标界：标出哪些环节交给 AI、哪些必须人工<br>
      3. 沉淀：封装为个人 Skill，定义触发词<br>
      4. 检验：用它完整跑一遍下一个真实任务<br><br>
      <strong>毕业标准：</strong>当老板再丢来一句"下周把这个事情讲清楚"，你的第一反应不再是焦虑，而是打开流水线。
    </div>
  </div>

  <!-- 下一步 -->
  <div style="margin-top:48px;text-align:center">
    <h3 style="font-size:20px;font-weight:600;margin-bottom:12px">第一季完结</h3>
    <p style="font-size:16px;color:var(--g600);margin-bottom:24px">小明的王国还在建设中——第二季将进入行业实战与团队协作。</p>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      <a href="ch5.html" class="btn-g">← 返回第五章</a>
      <a href="cases.html" class="btn-d">看看更多实战案例 →</a>
    </div>
  </div>
</section>
`);

const pagePhase2 = phasePage(2, 'Phase 2 · 场景化实战案例', 'Phase 02', [
  { num:7, title:'办公文档自动化', type:'实战', desc:'合同审查、报告生成、会议纪要整理——用 Skill 链完成文档类工作流。', skills:['docx','pdf','审查合同'] },
  { num:8, title:'Excel 与数据分析', type:'实战', desc:'财务报表编制、数据透视、杜邦分析、仪表盘生成。从 CSV 到可视化报告。', skills:['xlsx','财务分析'] },
  { num:9, title:'演示文稿制作', type:'实战', desc:'PPT 生成全流程：分镜脚本、路演材料、汇报模板。含视觉 QA 管线。', skills:['pptx','设计系统'] },
  { num:10, title:'内容创作与营销', type:'实战', desc:'营销文案、社媒运营、SEO 优化、品牌调性审查。多平台内容适配。', skills:['营销文案','SEO'] },
  { num:11, title:'法律实务工具包', type:'实战', desc:'起诉状、答辩状、证据目录、法条检索与核验。全套诉讼文书生成。', skills:['法律文书','法条检索'] },
  { num:12, title:'前端页面与 UI 生成', type:'实战', desc:'HTML 页面、React 组件、品牌风格 UI。DESIGN.md 设计系统应用。', skills:['HTML','design-md'] },
]);

const pagePhase3 = phasePage(3, 'Phase 3 · 自动化与技能系统', 'Phase 03', [
  { num:13, title:'Skill 开发入门', type:'教程', desc:'从零编写第一个自定义 Skill：SKILL.md 格式、触发条件、输入输出规范。', skills:['create-skill'] },
  { num:14, title:'定时任务配置', type:'操作', desc:'配置 Cron 定时任务：竞品监控、日报生成、数据备份。零值守自动化。', skills:['定时任务','Cron'] },
  { num:15, title:'IM 集成与消息推送', type:'操作', desc:'连接钉钉/飞书群聊，配置自动推送、交互式通知、审批流集成。', skills:['钉钉','飞书'] },
  { num:16, title:'多 Agent 协作编排', type:'进阶', desc:'设计多 Agent 工作流：任务分解、并行执行、结果合并。复杂任务自动化。' },
  { num:17, title:'企业知识库接入', type:'进阶', desc:'将企业文档、行业规范、内部流程接入千问办公，构建领域专属 AI 助手。', skills:['知识库','RAG'] },
  { num:18, title:'搭建个人 AI 工作台', type:'综合', desc:'整合 Skill、定时任务、知识库、IM 推送，打造完整的个人效率系统。' },
]);

const pagePhase4 = phasePage(4, 'Phase 4 · 行业方案与团队部署', 'Phase 04', [
  { num:19, title:'法律行业解决方案', type:'行业', desc:'律所/法务部的完整 AI 工作流：案件管理、文书生成、类案检索、庭审准备。', skills:['诉讼套件','案件管家'] },
  { num:20, title:'金融与投研工作流', type:'行业', desc:'研报生成、财务建模、尽调清单、投决备忘录。投研全链路 AI 化。', skills:['研报','财务建模'] },
  { num:21, title:'电商与营销自动化', type:'行业', desc:'1688 选品、竞品追踪、营销文案、活动策划。电商运营 AI 工具箱。', skills:['1688','竞品追踪'] },
  { num:22, title:'团队 Skill 共享', type:'管理', desc:'在团队中共享和分发 Skill：版本管理、权限控制、使用统计。' },
  { num:23, title:'企业级部署与安全', type:'管理', desc:'数据隔离、访问控制、审计日志。企业级安全合规配置指南。' },
  { num:24, title:'蓝皮书贡献指南', type:'社区', desc:'如何贡献你的实战案例？提交规范、审核流程、社区协作方式。' },
]);

// ─── PAGE: CASES ───
const pageCases = layout('cases.html', '实战案例分享', 'Case Studies', '案例分享', `
<section class="sec">
  <p class="sec-desc" style="margin-bottom:48px">每个案例均来自真实工作场景，附带完整 Prompt、产出物和效果数据。点击查看详情。</p>
  <div class="card-grid c3">
    ${[
      { thumb:'t1', icon:ICO.doc, badge:'office', badgeText:'办公文档', title:'45 页招股书核心数据提取与交叉验证', desc:'从 200 页 PDF 招股书中提取财务三表、股东结构、风险因素，自动生成 Word 版投资备忘录。', meta:['节省 6 小时','准确率 97%'] },
      { thumb:'t2', icon:ICO.image, badge:'creative', badgeText:'内容创作', title:'短视频分镜脚本 PPT — 从选题到交付', desc:'编剧向短视频创作者用千问办公生成 12 页分镜 PPT，含医学依据校验、视觉 QA 管线。', meta:['30 分钟交付','含视觉验证'] },
      { thumb:'t3', icon:ICO.chart, badge:'analysis', badgeText:'数据分析', title:'月度经营数据仪表盘自动生成', desc:'连接 Excel 数据源，自动计算同比环比、杜邦分析，输出 HTML 交互式仪表盘 + Word 分析报告。', meta:['自动化报表','5 分钟出图'] },
      { thumb:'t4', icon:ICO.shield, badge:'dev', badgeText:'法律实务', title:'民事起诉状 + 证据目录 + 庭审提纲一站式', desc:'律师从案件描述到全套诉讼文书，千问办公自动完成案由匹配、法条引用、文书格式校验。', meta:['文书套件','法条核验'] },
      { thumb:'t5', icon:ICO.gear, badge:'auto', badgeText:'自动化', title:'每日竞品监控 — 定时任务 + 钉钉推送', desc:'配置定时任务自动抓取竞品动态，生成结构化日报并推送到钉钉群，实现零人工值守。', meta:['定时自动化','IM 集成'] },
      { thumb:'t6', icon:ICO.users, badge:'media', badgeText:'团队协作', title:'产品需求 → 设计简报 → PRD 全链路', desc:'产品经理输入需求描述，千问办公串联 PRD 生成、用户故事拆解、设计简报输出。', meta:['Skill 链式调用','多角色协同'] },
      { thumb:'t1', icon:ICO.chart, badge:'analysis', badgeText:'数据分析', title:'年度财务三表编制与勾稽验证', desc:'从科目余额表自动生成资产负债表、利润表、现金流量表，含期间对比与勾稽关系验证。', meta:['CAS 准则','三表联动'] },
      { thumb:'t2', icon:ICO.doc, badge:'office', badgeText:'办公文档', title:'NDA 保密协议快速审查', desc:'上传 NDA 文件，8 项关键条款快速筛查，输出"可签/需改/需谈"分级判断。', meta:['5 分钟出结果','分级标记'] },
      { thumb:'t3', icon:ICO.gear, badge:'auto', badgeText:'自动化', title:'企业知识库 + AI 问答助手', desc:'将公司制度、行业规范、历史案例接入千问办公，构建领域专属智能问答系统。', meta:['RAG 增强','持续更新'] },
    ].map(c => `
    <div class="case-card">
      <div class="case-thumb ${c.thumb}">${c.icon}</div>
      <div class="case-body">
        <span class="case-badge ${c.badge}">${c.badgeText}</span>
        <h3>${c.title}</h3>
        <p>${c.desc}</p>
        <div class="case-meta">${c.meta.map(m => `<span>${m}</span>`).join('')}</div>
      </div>
    </div>`).join('')}
  </div>
</section>
`);

// ─── PAGE: EVAL ───
const pageEval = layout('eval.html', '实际工作评测报告', 'Evaluation', '工作评测', `
<section class="sec">
  <p class="sec-desc" style="margin-bottom:48px">用真实工作任务测试千问办公的表现，六维度量化评分，不刷榜、不虚构。</p>
  <div class="tbl-wrap">
    <table class="tbl">
      <thead><tr><th style="width:22%">测试任务</th><th style="width:10%">类型</th><th style="width:28%">质量评分</th><th style="width:12%">耗时</th><th style="width:14%">可用性</th><th style="width:14%">备注</th></tr></thead>
      <tbody>
        ${[
          ['PDF 合同风险审查','文档分析',9.2,'~3 分钟','pass','红黄绿分级准确'],
          ['Excel 财务三表编制','数据处理',8.7,'~5 分钟','pass','勾稽关系自动验证'],
          ['产品竞品分析报告','研究报告',8.9,'~8 分钟','pass','SWOT + Porter 五力'],
          ['12 页分镜 PPT 生成','演示文稿',8.5,'~12 分钟','pass','含视觉 QA 管线'],
          ['民事起诉状起草','法律文书',9.1,'~6 分钟','partial','法条引用需核验'],
          ['HTML 仪表盘生成','前端开发',8.8,'~4 分钟','pass','响应式 + 交互完整'],
          ['行业深度研究报告','研究报告',8.6,'~15 分钟','partial','数据需人工补充'],
          ['定时竞品监控 + 推送','自动化',8.3,'配置 ~10 分钟','pass','首次配置后零值守'],
        ].map(r => `<tr>
          <td class="tn">${r[0]}</td><td>${r[1]}</td>
          <td><div class="score-bar"><div class="score-fill" style="width:${r[2]*10}px"></div><span class="score-text">${r[2]}</span></div></td>
          <td>${r[3]}</td>
          <td><span class="eval-tag ${r[4]}">${r[4]==='pass'?'直接可用':'需微调'}</span></td>
          <td>${r[5]}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
  <p style="font-size:13px;color:var(--g400);margin-top:16px;text-align:center">* 评分基于 2026 年 8 月版本，任务耗时受文件复杂度与网络环境影响，数据仅供参考</p>
</section>

<!-- 评测维度说明 -->
<section class="sec sec-b">
  <div class="sec-label">Dimensions</div>
  <h2 class="sec-title">评测维度说明</h2>
  <div class="card-grid c3">
    <div class="card"><h3>质量评分</h3><p>产出物的准确性、完整性、专业性。10 分制，由领域专家打分。</p></div>
    <div class="card"><h3>耗时</h3><p>从发出指令到产出最终文件的总时间。含中间交互轮次。</p></div>
    <div class="card"><h3>可用性</h3><p>产出物是否可直接用于工作交付，还是需要人工修改。分"直接可用"和"需微调"。</p></div>
    <div class="card"><h3>一致性</h3><p>多次执行同一任务，产出质量是否稳定。测试 3-5 次取中位数。</p></div>
    <div class="card"><h3>上下文理解</h3><p>对复杂指令、多轮对话、附件信息的理解和利用能力。</p></div>
    <div class="card"><h3>工具链协同</h3><p>多 Skill 串联、工具调用的准确性和效率。是否出现冗余调用或遗漏。</p></div>
  </div>
</section>
`);

// ─── PAGE: TASKS ───
const pageTasks = layout('tasks.html', '按任务类型速查', 'Task Index', '任务速查', `
<section class="sec">
  <p class="sec-desc" style="margin-bottom:48px">不用逐章阅读，直接找到你的工作场景。每个任务类型关联对应的 Skill 和实战案例。</p>
  <div class="task-grid">
    ${[
      ['📄','文档处理','PDF 解析、Word 生成、合同审查、报告排版'],
      ['📊','数据分析','Excel 处理、财务报表、仪表盘、杜邦分析'],
      ['🖥','演示文稿','PPT 生成、分镜脚本、路演材料、汇报模板'],
      ['⚖️','法律实务','起诉状、答辩状、证据目录、法条检索与核验'],
      ['🌐','内容创作','营销文案、社媒运营、SEO 优化、品牌调性审查'],
      ['💻','前端开发','HTML 页面、React 组件、设计系统、品牌风格 UI'],
      ['⚙️','自动化流程','定时任务、IM 推送、多 Agent 编排、Skill 链式调用'],
      ['👥','团队协作','PRD 生成、设计简报、竞品分析、项目周报'],
      ['📚','知识管理','企业知识库、研报摘要、行业研究、法规速查'],
      ['💰','财务税务','记账凭证、预算分析、增值税管理、汇算清缴'],
      ['📈','投研分析','深度报告、行业研究、读年报、可比公司分析'],
      ['🛒','电商采购','1688 选品、供应商查询、分销铺货、采购询盘'],
    ].map(t => `
    <div class="task-item">
      <div class="task-icon">${t[0]}</div>
      <div><h4>${t[1]}</h4><p>${t[2]}</p></div>
    </div>`).join('')}
  </div>
</section>

<!-- 相关 Skill 索引 -->
<section class="sec sec-b">
  <div class="sec-label">Skill Index</div>
  <h2 class="sec-title">关联 Skill 速查</h2>
  <div class="tbl-wrap">
    <table class="tbl">
      <thead><tr><th>任务类型</th><th>推荐 Skill</th><th>触发示例</th></tr></thead>
      <tbody>
        ${[
          ['文档处理','pdf, docx, pptx, xlsx','"帮我解析这份 PDF""生成 Word 报告"'],
          ['合同管理','审查合同, 起草合同, 合同对比','"审一下这个合同""比较两份合同"'],
          ['法律诉讼','诉讼套件中枢, 案件管家, 主诉诉状','"写起诉状""案件建档"'],
          ['数据分析','xlsx, 财务分析, 预算分析','"分析这份 Excel""做杜邦分析"'],
          ['内容创作','营销文案, SEO内容优化, 社媒热点追踪','"写小红书文案""SEO 优化"'],
          ['前端开发','design-md, product-design 套件','"做个 Wise 风格的页面"'],
          ['行业研究','行业研究, 深度报告, 竞品追踪','"分析这个行业""写深度报告"'],
          ['自动化','create-skill, 定时任务, dws','"每天 9 点发日报""创建 Skill"'],
        ].map(r => `<tr><td class="tn">${r[0]}</td><td>${r[1]}</td><td style="font-family:var(--mono);font-size:13px;color:var(--g500)">${r[2]}</td></tr>`).join('')}
      </tbody>
    </table>
  </div>
</section>
`);

// ─── PAGE: METHODOLOGY ───
const pageMethod = layout('methodology.html', '方法论', 'Methodology', '方法论', `
<section class="sec">
  <p class="sec-desc" style="margin-bottom:48px">蓝皮书的三大方法论：先用"会做 × 想做"矩阵看清自己该守什么、该学什么、该交什么；再用 GTD 六步走完一次完整交付；最后用判断力三道关保证每次交付的质量。</p>

  <!-- 方法论一：会做×想做矩阵 -->
  <div class="sec-label">方法论一 · 岗位评估</div>
  <h2 class="sec-title" style="font-size:28px">会做 × 想做：AI 时代的岗位地图</h2>
  <p style="font-size:16px;color:var(--g600);line-height:1.7;margin-bottom:28px;font-weight:400">
    "什么事情应该交给 AI？"本来是一个几乎没有边界的问题。但只需要问两个问题——<strong>这件事，我会不会做？这件事，我想不想自己做？</strong>——两个维度一交叉，所有事情就落进了一张可以理解、掌握和复用的地图。这是每个人面对 AI 转型时最先要完成的自我评估：你的岗位价值在哪里，你该以什么姿态迎接这场变革。
  </p>

  <div class="quadrant-grid">
    <div class="quadrant q1">
      <div class="q-tag">① 会做 · 也想做</div>
      <div class="q-title">自己留着做</div>
      <p class="q-desc">这些事是你的价值所在，交给 AI 等于把自己交出去。没有让 AI 替代的必要。</p>
      <div class="q-action">→ 守住岗位价值的核心</div>
    </div>
    <div class="quadrant q3">
      <div class="q-tag">③ 不会做 · 但想做</div>
      <div class="q-title">先学，再让 AI 参与</div>
      <p class="q-desc">自己不会，就不知道 AI 做得好不好，也没法验收。先掌握基本框架和体感，再逐渐让 AI 参与。</p>
      <div class="q-action">→ 学习区，也是成长区</div>
    </div>
    <div class="quadrant q2">
      <div class="q-tag">② 不会做 · 也不想做</div>
      <div class="q-title">要么远离，要么外包</div>
      <p class="q-desc">这件事你本来就会远离，谈不上"被 AI 替代"。不必纠结。</p>
      <div class="q-action">→ 不占用注意力</div>
    </div>
    <div class="quadrant q4">
      <div class="q-tag">④ 会做 · 但不想做</div>
      <div class="q-title">最适合交给 AI</div>
      <p class="q-desc">正因为你会做，才知道什么叫"做好"，才能判断 AI 的结果、逐步让 AI 替代你。</p>
      <div class="q-action">→ 逐步交出去，且能验收</div>
    </div>
  </div>

  <div class="card" style="margin-bottom:64px;background:var(--light-mint);border:1px solid rgba(159,232,112,0.3)">
    <p style="font-size:14px;line-height:1.8;font-weight:400">
      <strong>矩阵的深层含义：</strong>第①格是你<strong>守住的价值</strong>——如果它空空荡荡，说明岗位价值需要重新思考；第③格是你<strong>投资的成长</strong>——挤满了说明你正在快速成长区；第④格是你<strong>交出去的重复</strong>——交出的前提是"会做"，因为会做才能验收。<br>
      完整剧情演练见 <a href="ch1.html">第一章 · 小明的时间黑洞</a>。
    </p>
  </div>

  <!-- 方法论二：GTD 六步 -->
  <div class="sec-label">方法论二 · 交付流程</div>
  <h2 class="sec-title" style="font-size:28px;margin-bottom:24px">GTD 六步：从混乱到交付</h2>
  <div class="method-grid" style="margin-bottom:64px">
    <div class="method-item">
      <div class="method-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9fe870" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
      <h4>完成一次任务</h4><p>用自然语言对话完成具体工作，产出可交付物</p>
      <span class="method-arrow">→</span>
    </div>
    <div class="method-item">
      <div class="method-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#de1d8d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
      <h4>复盘为案例</h4><p>提炼 Prompt 策略、工具选择、产出质量评估</p>
      <span class="method-arrow">→</span>
    </div>
    <div class="method-item">
      <div class="method-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d03238" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/></svg></div>
      <h4>封装为 Skill</h4><p>将工作流沉淀为可复用技能，团队共享</p>
      <span class="method-arrow">→</span>
    </div>
    <div class="method-item">
      <div class="method-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7928ca" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
      <h4>部署 AI 团队</h4><p>多 Agent 协作、定时任务、企业知识库接入</p>
    </div>
  </div>

  <div class="sec-label">Detail</div>
  <h2 class="sec-title">四步闭环详解</h2>
  <div class="card-grid c2">
    <div class="card">
      <div class="card-step s1">Step 01</div>
      <h3>任务驱动学习</h3>
      <p>不是先学理论再实践，而是直接从真实工作任务出发。选一个你今天要完成的任务，用千问办公来做。在做的过程中理解 AI 的能力边界和最佳实践。</p>
    </div>
    <div class="card">
      <div class="card-step s2">Step 02</div>
      <h3>结构化复盘</h3>
      <p>完成任务后，回顾整个过程：哪些 Prompt 有效？哪些工具选择正确？产出质量如何？把经验提炼为可分享的知识。这就是蓝皮书案例的来源。</p>
    </div>
    <div class="card">
      <div class="card-step s3">Step 03</div>
      <h3>Skill 封装复用</h3>
      <p>把反复出现的工作模式封装为 Skill。一个 Skill 包含触发条件、执行步骤、质量标准。团队共享后，所有人都能复用这个最佳实践。</p>
    </div>
    <div class="card">
      <div class="card-step s4">Step 04</div>
      <h3>AI 团队协作</h3>
      <p>当 Skill 足够多、足够成熟，就可以编排多个 Agent 协作。定时任务自动触发、IM 推送结果、知识库持续积累——形成真正的 AI 工作流。</p>
    </div>
  </div>

  <!-- 方法论三：判断力三道关 -->
  <div class="sec-label">方法论三 · 判断力</div>
  <h2 class="sec-title" style="font-size:28px;margin-bottom:12px">判断力三道关</h2>
  <p style="font-size:16px;color:var(--g600);line-height:1.7;margin-bottom:28px;font-weight:400">
    AI 让答案越来越便宜，压力重新回到人这里：这么多答案，哪个该留下？判断力不是在充分信息下找到答案的能力，而是<strong>在灰度条件下，迅速缩小可能性空间，并形成可供推进的工作假设的能力</strong>。每个判断都要过三道关：
  </p>

  <div class="card-grid c3" style="margin-bottom:24px">
    <div class="card">
      <div class="card-step s1">第一关</div>
      <h3>立住：干掉竞争答案</h3>
      <p>不只是证明自己的答案有道理，还要证明竞争答案不如你的。AI 能帮你找到越来越多的竞争答案、寻找证据、甚至反驳你——但哪些留下、哪些排除，是人的判断。</p>
    </div>
    <div class="card">
      <div class="card-step s2">第二关</div>
      <h3>产品化：把判断做成地图</h3>
      <p>结论只在脑子里，只是认知。把它加工成别人可以理解、参与、修改和推进的东西——一张四象限、一句电梯句、一份资料地图。协作方进入你的判断，而不是只能同意或不同意。</p>
    </div>
    <div class="card">
      <div class="card-step s3">第三关</div>
      <h3>敢改：推翻重来</h3>
      <p>当不同证据都指向别处，要敢把已经缩小的可能性空间重新打开。在错误答案上继续优化，是最贵的浪费。让答案接受真实检验，错了就重找。</p>
    </div>
  </div>

  <div class="card" style="background:var(--light-mint);border:1px solid rgba(159,232,112,0.3)">
    <p style="font-size:14px;line-height:1.8;font-weight:400">
      <strong>为什么用故事训练判断力？</strong>因为判断力必须借助载体才能显现——<strong>借任务才能练，借产物才能评</strong>。小明六步走完的每一次"立住 → 产品化 → 敢改"，练的正是这三道关。剧情演练见 <a href="ch4.html">第四章</a>（敢改）与 <a href="ch5.html">第五章</a>（验收）。
    </p>
  </div>
</section>

<style>
.quadrant-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:24px 0}
.quadrant{border-radius:20px;padding:20px;box-shadow:var(--card-s);transition:box-shadow .2s,transform .2s}
.quadrant:hover{box-shadow:var(--card-h);transform:translateY(-2px)}
.quadrant .q-tag{display:inline-block;font-family:var(--mono);font-size:11px;font-weight:600;padding:3px 10px;border-radius:9999px;margin-bottom:10px}
.quadrant .q-title{font-size:17px;font-weight:900;line-height:1;margin-bottom:8px}
.quadrant .q-desc{font-size:13px;color:var(--g600);line-height:1.5;margin-bottom:12px;font-weight:400}
.quadrant .q-action{font-size:12px;font-weight:700;letter-spacing:.5px}
.q1{background:rgba(159,232,112,.08);border:1px solid rgba(159,232,112,.3)}
.q1 .q-tag{background:var(--wise-green);color:var(--dark-green)}
.q1 .q-title{color:var(--dark-green)}
.q1 .q-action{color:var(--dark-green)}
.q2{background:var(--g50)}
.q2 .q-tag{background:var(--g200);color:var(--g600)}
.q2 .q-action{color:var(--g500)}
.q3{background:rgba(255,209,26,.06);border:1px solid rgba(255,209,26,.3)}
.q3 .q-tag{background:#ffd11a;color:#163300}
.q3 .q-action{color:#ca8a04}
.q4{background:rgba(208,50,56,.04);border:1px solid rgba(208,50,56,.15)}
.q4 .q-tag{background:#d03238;color:#fff}
.q4 .q-action{color:#d03238}
@media(max-width:768px){.quadrant-grid{grid-template-columns:1fr}}
</style>
`);

// ─── PAGE: TOC ───
const pageToc = layout('toc.html', '完整目录', 'Table of Contents', '目录', `
<section class="sec">
  <div class="toc-group">
    <h3>Phase 1 · 环境搭建与基础操作</h3>
    <ul class="toc-list">
      ${[
        ['安装千问办公','操作','5 min'],['认识 Agent 对话模式','概念','8 min'],
        ['连接你的工作目录','操作','5 min'],['第一个任务：文件处理','实战','15 min'],
        ['理解 Skill 系统','概念','10 min'],['Prompt 基础技巧','技巧','10 min'],
      ].map(c => `<li><a href="phase-1.html">${c[0]}</a><span>${c[1]} · ${c[2]}</span></li>`).join('')}
    </ul>
  </div>
  <div class="toc-group">
    <h3>Phase 2 · 场景化实战案例</h3>
    <ul class="toc-list">
      ${[
        ['办公文档自动化','实战','20 min'],['Excel 与数据分析','实战','25 min'],
        ['演示文稿制作','实战','30 min'],['内容创作与营销','实战','20 min'],
        ['法律实务工具包','实战','25 min'],['前端页面与 UI 生成','实战','20 min'],
      ].map(c => `<li><a href="phase-2.html">${c[0]}</a><span>${c[1]} · ${c[2]}</span></li>`).join('')}
    </ul>
  </div>
  <div class="toc-group">
    <h3>Phase 3 · 自动化与技能系统</h3>
    <ul class="toc-list">
      ${[
        ['Skill 开发入门','教程','20 min'],['定时任务配置','操作','15 min'],
        ['IM 集成与消息推送','操作','15 min'],['多 Agent 协作编排','进阶','30 min'],
        ['企业知识库接入','进阶','25 min'],['搭建个人 AI 工作台','综合','40 min'],
      ].map(c => `<li><a href="phase-3.html">${c[0]}</a><span>${c[1]} · ${c[2]}</span></li>`).join('')}
    </ul>
  </div>
  <div class="toc-group">
    <h3>Phase 4 · 行业方案与团队部署</h3>
    <ul class="toc-list">
      ${[
        ['法律行业解决方案','行业','30 min'],['金融与投研工作流','行业','30 min'],
        ['电商与营销自动化','行业','25 min'],['团队 Skill 共享','管理','20 min'],
        ['企业级部署与安全','管理','25 min'],['蓝皮书贡献指南','社区','10 min'],
      ].map(c => `<li><a href="phase-4.html">${c[0]}</a><span>${c[1]} · ${c[2]}</span></li>`).join('')}
    </ul>
  </div>
</section>
`);

// ─── PAGE: ABOUT ───
const pageAbout = layout('about.html', '关于蓝皮书', 'About', '关于', `
<section class="sec">
  <div class="about-content">
    <h2>这是什么</h2>
    <p>千问办公实战蓝皮书是一份以真实工作场景为主线的 AI 办公实践指南。它不是产品说明书，而是一本"做过之后写下来的经验集"——每个章节都经过实际任务验证，每个案例都附带可复现的 Prompt 和产出物。</p>
    <p>蓝皮书的结构借鉴了 WorkBuddy.homes 的组织方式，设计上遵循 Wise 的友好清晰美学。我们相信好的工具文档应该像好的代码一样：精确、简洁、没有废话。</p>

    <h2>核心方法论</h2>
    <p>蓝皮书的核心主张是：<strong>一次成功的 AI 协作，应该变成一套可复用的工作流。</strong></p>
    <p>这个理念拆解为四步闭环：完成任务 → 复盘为案例 → 封装为 Skill → 部署为 AI 团队。每一个阶段在蓝皮书中都有对应的章节和实操指导。</p>

    <h2>谁应该读</h2>
    <ul>
      <li>想用 AI 提升工作效率的职场人</li>
      <li>正在评估 AI 办公工具的决策者</li>
      <li>希望将 AI 融入团队工作流的管理者</li>
      <li>对 AI Agent 架构感兴趣的技术人员</li>
    </ul>

    <h2>如何参与</h2>
    <p>蓝皮书是开放的。如果你在实际工作中用千问办公完成了有价值的任务，欢迎将经验整理为案例贡献进来。我们尤其欢迎以下类型的内容：</p>
    <ul>
      <li>真实工作场景的完整案例（含 Prompt 和产出物）</li>
      <li>特定行业的深度实践报告</li>
      <li>自定义 Skill 的开发经验分享</li>
      <li>多 Agent 协作的编排方案</li>
    </ul>

    <h2>技术说明</h2>
    <p>本网站为纯静态 HTML，采用 Wise 设计系统（Inter 字体 weight 900 display / 600 body、ring shadow、pill buttons、30px cards）。所有页面自包含，无外部依赖（除 Google Fonts CDN），可直接部署到任何静态托管服务。</p>
  </div>
</section>
`);

// ─── PAGE: BRANDS ──
const pageBrands = layout('brands.html', '68 品牌设计系统', 'Brand Design Systems', '品牌目录', `
<section class="sec">
  <p class="sec-desc" style="margin-bottom:48px">收录 68 个全球领先品牌的视觉设计语言，从色彩体系到排版风格，为 AI 产品界面设计提供参考坐标。</p>
  <div class="filter-bar" id="filterBar">
    <button class="filter-btn active" data-cat="all">全部</button>
    <button class="filter-btn" data-cat="ai-llm">AI & LLM</button>
    <button class="filter-btn" data-cat="dev-tools">开发工具</button>
    <button class="filter-btn" data-cat="backend-devops">后端 & DevOps</button>
    <button class="filter-btn" data-cat="saas">效率 & SaaS</button>
    <button class="filter-btn" data-cat="design">设计 & 创意</button>
    <button class="filter-btn" data-cat="fintech">金融科技</button>
    <button class="filter-btn" data-cat="ecommerce">电商 & 零售</button>
    <button class="filter-btn" data-cat="media">媒体 & 消费</button>
    <button class="filter-btn" data-cat="auto">汽车</button>
  </div>
  <div class="grid-count" id="gridCount">显示 <strong>68</strong> / 68 个品牌</div>
  <div class="brand-grid" id="brandGrid"></div>
</section>

<script>
const brands = [
  {name:"Claude",id:"claude",colors:["#D97757","#F5E8D6","#FAF3EB","#2A1A0F"],desc:"温暖赤陶色调，干净编辑式布局",tags:["AI 产品","对话界面"],cat:"ai-llm"},
  {name:"Cohere",id:"cohere",colors:["#FF5C36","#1A1A2E","#FFB84D","#FFFFFF"],desc:"鲜艳渐变，数据丰富的仪表盘",tags:["企业 AI 平台"],cat:"ai-llm"},
  {name:"ElevenLabs",id:"elevenlabs",colors:["#1A1A2E","#00D4AA","#FF6B35","#FFFFFF"],desc:"暗色电影感 UI，音频波形",tags:["音频/语音产品"],cat:"ai-llm"},
  {name:"Minimax",id:"minimax",colors:["#0A0A0A","#00FF88","#6366F1","#FFFFFF"],desc:"大胆暗色界面，霓虹点缀",tags:["AI 模型平台"],cat:"ai-llm"},
  {name:"Mistral AI",id:"mistral.ai",colors:["#0A0A0A","#7C3AED","#F0ABFC","#FFFFFF"],desc:"法式工程极简，紫色调",tags:["AI/ML 平台"],cat:"ai-llm"},
  {name:"Ollama",id:"ollama",colors:["#0A0A0A","#FFFFFF","#6B7280","#374151"],desc:"终端优先，单色简约",tags:["CLI 工具"],cat:"ai-llm"},
  {name:"OpenCode AI",id:"opencode.ai",colors:["#0D1117","#58A6FF","#3FB950","#FFFFFF"],desc:"开发者中心暗色主题",tags:["编码平台"],cat:"ai-llm"},
  {name:"Replicate",id:"replicate",colors:["#FFFFFF","#0A0A0A","#FF4F00","#F5F5F5"],desc:"干净白色画布，代码优先",tags:["API 平台"],cat:"ai-llm"},
  {name:"RunwayML",id:"runwayml",colors:["#0A0A0A","#00D4FF","#7C3AED","#FFFFFF"],desc:"电影感暗色 UI",tags:["视频/创意工具"],cat:"ai-llm"},
  {name:"Together AI",id:"together.ai",colors:["#0A1628","#0066FF","#00D4FF","#FFFFFF"],desc:"技术蓝图风格",tags:["AI 基础设施"],cat:"ai-llm"},
  {name:"VoltAgent",id:"voltagent",colors:["#0A0A0A","#10B981","#065F46","#1F2937"],desc:"虚空黑画布，翡翠绿",tags:["Agent 框架"],cat:"ai-llm"},
  {name:"xAI",id:"x.ai",colors:["#0A0A0A","#FFFFFF","#6B7280","#1F2937"],desc:"极简单色，未来主义",tags:["AI 实验室"],cat:"ai-llm"},
  {name:"Cursor",id:"cursor",colors:["#0A0A0A","#8B5CF6","#06B6D4","#FFFFFF"],desc:"流畅暗色，渐变点缀",tags:["代码编辑器"],cat:"dev-tools"},
  {name:"Expo",id:"expo",colors:["#0A0A0A","#FFFFFF","#4A90D9","#E5E5E5"],desc:"暗色主题，紧凑字间距",tags:["移动开发"],cat:"dev-tools"},
  {name:"Lovable",id:"lovable",colors:["#FF6B6B","#845EF7","#339AF0","#FFFFFF"],desc:"活泼渐变，友好开发",tags:["AI 全栈构建器"],cat:"dev-tools"},
  {name:"Raycast",id:"raycast",colors:["#0A0A0A","#FF6B35","#8B5CF6","#06B6D4"],desc:"流畅暗色铬，渐变",tags:["效率工具"],cat:"dev-tools"},
  {name:"Superhuman",id:"superhuman",colors:["#0A0A0A","#7C3AED","#A78BFA","#1A1A2E"],desc:"高端暗色，紫色光晕",tags:["邮件客户端"],cat:"dev-tools"},
  {name:"Vercel",id:"vercel",colors:["#0A0A0A","#FFFFFF","#0070F3","#E5E5E5"],desc:"黑白精确，Geist 字体",tags:["前端部署"],cat:"dev-tools"},
  {name:"Warp",id:"warp",colors:["#0A0A0A","#5B5FC7","#FF6B35","#00D4AA"],desc:"现代终端，块状命令",tags:["终端工具"],cat:"dev-tools"},
  {name:"ClickHouse",id:"clickhouse",colors:["#FFCC00","#0A0A0A","#FFFFFF","#FAFBFC"],desc:"黄色点缀，技术文档",tags:["数据库产品"],cat:"backend-devops"},
  {name:"Composio",id:"composio",colors:["#0A0A0A","#FF6B35","#00D4AA","#8B5CF6"],desc:"现代暗色，彩色集成",tags:["集成平台"],cat:"backend-devops"},
  {name:"HashiCorp",id:"hashicorp",colors:["#0A0A0A","#FFFFFF","#1D4ED4","#E5E5E5"],desc:"企业级干净，黑白",tags:["基础设施工具"],cat:"backend-devops"},
  {name:"MongoDB",id:"mongodb",colors:["#00684A","#00ED64","#0A0A0A","#FFFFFF"],desc:"绿叶品牌",tags:["数据库产品"],cat:"backend-devops"},
  {name:"PostHog",id:"posthog",colors:["#1D1F3B","#F7A500","#FF6B6B","#FFFFFF"],desc:"活泼刺猬，暗色 UI",tags:["产品分析"],cat:"backend-devops"},
  {name:"Sanity",id:"sanity",colors:["#F03E2F","#0A0A0A","#FFFFFF","#F0F4F8"],desc:"红色点缀，编辑布局",tags:["CMS"],cat:"backend-devops"},
  {name:"Sentry",id:"sentry",colors:["#362D59","#6C5FC7","#E5E5E5","#FFFFFF"],desc:"暗色仪表盘，粉紫",tags:["监控工具"],cat:"backend-devops"},
  {name:"Supabase",id:"supabase",colors:["#18181B","#3ECF8E","#0A0A0A","#FFFFFF"],desc:"暗色翡翠，代码优先",tags:["BaaS 平台"],cat:"backend-devops"},
  {name:"Cal.com",id:"cal",colors:["#FFFFFF","#0A0A0A","#2563EB","#E5E5E5"],desc:"干净中性，开发者导向",tags:["日程工具"],cat:"saas"},
  {name:"Intercom",id:"intercom",colors:["#1F1F4B","#6366F1","#3B82F6","#FFFFFF"],desc:"友好蓝色调，对话式",tags:["客服系统"],cat:"saas"},
  {name:"Linear",id:"linear.app",colors:["#5E6AD2","#0A0A0A","#FFFFFF","#8B8E98"],desc:"极致极简，紫色点缀",tags:["项目管理"],cat:"saas"},
  {name:"Mintlify",id:"mintlify",colors:["#0A0A0A","#10B981","#FFFFFF","#ECFDF5"],desc:"干净绿色，阅读优化",tags:["文档平台"],cat:"saas"},
  {name:"Notion",id:"notion",colors:["#FFFFFF","#0A0A0A","#E5E5E5","#2383E2"],desc:"温暖极简，柔和表面",tags:["知识库"],cat:"saas"},
  {name:"Resend",id:"resend",colors:["#0A0A0A","#FFFFFF","#6B7280","#F5F5F5"],desc:"极简暗色，等宽字体",tags:["邮件 API"],cat:"saas"},
  {name:"Zapier",id:"zapier",colors:["#FF4A00","#FFFFFF","#0A0A0A","#FFD6CC"],desc:"温暖橙色，插画驱动",tags:["自动化平台"],cat:"saas"},
  {name:"Airtable",id:"airtable",colors:["#18BFA5","#FCB400","#F82B60","#FFFFFF"],desc:"多彩友好，结构化数据",tags:["数据管理"],cat:"design"},
  {name:"Clay",id:"clay",colors:["#FF6B6B","#C084FC","#60A5FA","#FFF7ED"],desc:"有机形状，柔和渐变",tags:["创意机构"],cat:"design"},
  {name:"Figma",id:"figma",colors:["#F24E1E","#A259FF","#0ACF83","#FF7262"],desc:"鲜艳多色，活泼专业",tags:["设计工具"],cat:"design"},
  {name:"Framer",id:"framer",colors:["#0055FF","#0A0A0A","#FFFFFF","#00AAFF"],desc:"大胆黑蓝，动效优先",tags:["网站构建器"],cat:"design"},
  {name:"Miro",id:"miro",colors:["#FFD02F","#0A0A0A","#050038","#FFFFFF"],desc:"明亮黄色，无限画布",tags:["协作白板"],cat:"design"},
  {name:"Webflow",id:"webflow",colors:["#1357C7","#4353FF","#FFFFFF","#0A0A0A"],desc:"蓝色点缀，营销美学",tags:["可视化建站"],cat:"design"},
  {name:"Binance",id:"binance",colors:["#F0B90B","#0A0A0A","#1E2329","#FFFFFF"],desc:"币安黄，交易紧迫感",tags:["交易平台"],cat:"fintech"},
  {name:"Coinbase",id:"coinbase",colors:["#0052FF","#0A0A0A","#FFFFFF","#E5E5E5"],desc:"干净蓝色，信任聚焦",tags:["金融产品"],cat:"fintech"},
  {name:"Kraken",id:"kraken",colors:["#5741D9","#0A0A0A","#00D4AA","#FFFFFF"],desc:"紫色暗色，数据密集",tags:["交易平台"],cat:"fintech"},
  {name:"Revolut",id:"revolut",colors:["#0A0A0A","#0066FF","#FFFFFF","#1A1A2E"],desc:"流畅暗色，渐变卡片",tags:["数字银行"],cat:"fintech"},
  {name:"Stripe",id:"stripe",colors:["#635BFF","#0A2540","#FFFFFF","#A3ACB9"],desc:"标志性紫色渐变",tags:["支付页面"],cat:"fintech"},
  {name:"Wise",id:"wise",colors:["#9FE870","#0A0A0A","#FFFFFF","#163300"],desc:"明亮绿色，友好清晰",tags:["转账工具"],cat:"fintech"},
  {name:"Airbnb",id:"airbnb",colors:["#FF385C","#0A0A0A","#FFFFFF","#FFB400"],desc:"珊瑚色调，摄影驱动",tags:["旅行市场"],cat:"ecommerce"},
  {name:"Meta",id:"meta",colors:["#0081FB","#0A0A0A","#FFFFFF","#E5E5E5"],desc:"摄影优先，Meta 蓝",tags:["科技零售"],cat:"ecommerce"},
  {name:"Nike",id:"nike",colors:["#0A0A0A","#FFFFFF","#FA5400","#E5E5E5"],desc:"单色 UI，大写 Futura",tags:["运动品牌"],cat:"ecommerce"},
  {name:"Shopify",id:"shopify",colors:["#0A0A0A","#008060","#5C6AC4","#FFFFFF"],desc:"暗色电影感，霓虹绿",tags:["电商平台"],cat:"ecommerce"},
  {name:"Apple",id:"apple",colors:["#0A0A0A","#FFFFFF","#86868B","#F5F5F7"],desc:"高端留白，电影感",tags:["消费电子"],cat:"media"},
  {name:"IBM",id:"ibm",colors:["#0F62FE","#0A0A0A","#FFFFFF","#E5E5E5"],desc:"Carbon 设计系统",tags:["企业技术"],cat:"media"},
  {name:"NVIDIA",id:"nvidia",colors:["#76B900","#0A0A0A","#1A1A1A","#FFFFFF"],desc:"绿黑能量感",tags:["GPU/硬件"],cat:"media"},
  {name:"Pinterest",id:"pinterest",colors:["#E60023","#0A0A0A","#FFFFFF","#E5E5E5"],desc:"红色点缀，瀑布流",tags:["图片社区"],cat:"media"},
  {name:"PlayStation",id:"playstation",colors:["#003791","#0070CC","#FFFFFF","#0A0A0A"],desc:"三表面通道，青色",tags:["游戏平台"],cat:"media"},
  {name:"SpaceX",id:"spacex",colors:["#0A0A0A","#FFFFFF","#005699","#E5E5E5"],desc:"极简黑白，未来感",tags:["航天科技"],cat:"media"},
  {name:"Spotify",id:"spotify",colors:["#1DB954","#0A0A0A","#FFFFFF","#191414"],desc:"鲜艳绿，粗体字",tags:["音乐/媒体"],cat:"media"},
  {name:"The Verge",id:"theverge",colors:["#0A0A0A","#FF0080","#00D4FF","#FFFFFF"],desc:"酸性薄荷，紫外线",tags:["科技媒体"],cat:"media"},
  {name:"Uber",id:"uber",colors:["#0A0A0A","#FFFFFF","#276EF1","#E5E5E5"],desc:"大胆黑白，都市能量",tags:["出行平台"],cat:"media"},
  {name:"WIRED",id:"wired",colors:["#0A0A0A","#FFFFFF","#0000FF","#E5E5E5"],desc:"纸白报纸密度",tags:["科技杂志"],cat:"media"},
  {name:"BMW",id:"bmw",colors:["#0A0A0A","#1C69D1","#FFFFFF","#E5E5E5"],desc:"暗色高端，德国工程",tags:["豪华品牌"],cat:"auto"},
  {name:"Bugatti",id:"bugatti",colors:["#0A0A0A","#1A1A1A","#FFFFFF","#8B7355"],desc:"电影黑，纪念碑式",tags:["超豪华品牌"],cat:"auto"},
  {name:"Ferrari",id:"ferrari",colors:["#DC0000","#0A0A0A","#FFFFFF","#F5F5F5"],desc:"法拉利红，极致留白",tags:["奢侈品牌"],cat:"auto"},
  {name:"Lamborghini",id:"lamborghini",colors:["#0A0A0A","#DDB321","#1A1A1A","#FFFFFF"],desc:"纯黑教堂感，金色",tags:["超跑品牌"],cat:"auto"},
  {name:"Renault",id:"renault",colors:["#FFCC33","#0A0A0A","#FFFFFF","#6366F1"],desc:"极光渐变，零圆角",tags:["汽车品牌"],cat:"auto"},
  {name:"Tesla",id:"tesla",colors:["#0A0A0A","#E31937","#FFFFFF","#E5E5E5"],desc:"极致减法，电影感",tags:["电动车"],cat:"auto"}
];
const catLabels = {"ai-llm":"AI & LLM","dev-tools":"开发工具","backend-devops":"后端 & DevOps","saas":"效率 & SaaS","design":"设计 & 创意","fintech":"金融科技","ecommerce":"电商 & 零售","media":"媒体 & 消费","auto":"汽车"};
const grid = document.getElementById('brandGrid');
const countEl = document.getElementById('gridCount');
function renderBrands(filter) {
  grid.innerHTML = '';
  let count = 0;
  brands.forEach(b => {
    if (filter !== 'all' && b.cat !== filter) return;
    count++;
    const card = document.createElement('div');
    card.className = 'brand-card';
    card.setAttribute('data-cat', b.cat);
    const strip = b.colors.map(c => \`<span style="background:\${c}"></span>\`).join('');
    const tags = b.tags.map(t => \`<span class="brand-tag">\${t}</span>\`).join('');
    card.innerHTML = \`<div class="color-strip">\${strip}</div><div class="brand-body"><div class="brand-cat">\${catLabels[b.cat]}</div><div class="brand-name">\${b.name}</div><div class="brand-id">\${b.id}</div><div class="brand-desc">\${b.desc}</div><div class="brand-tags">\${tags}</div></div>\`;
    grid.appendChild(card);
  });
  countEl.innerHTML = \`显示 <strong>\${count}</strong> / 68 个品牌\`;
}
document.getElementById('filterBar').addEventListener('click', function(e) {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  this.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderBrands(btn.dataset.cat);
});
renderBrands('all');
</script>

<style>
.filter-bar{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px}
.filter-btn{font-family:var(--sans);font-size:13px;font-weight:600;padding:6px 16px;border-radius:9999px;border:1px solid var(--g200);background:var(--white);color:var(--g600);cursor:pointer;transition:all .2s}
.filter-btn:hover{border-color:var(--g400);color:var(--black)}
.filter-btn.active{background:var(--dark-green);color:var(--white);border-color:var(--dark-green)}
.grid-count{font-size:13px;color:var(--g500);margin-bottom:24px;font-weight:600}
.grid-count strong{font-weight:600;color:var(--black)}
.brand-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.brand-card{background:var(--white);border-radius:30px;box-shadow:var(--card-s);overflow:hidden;transition:box-shadow .25s,transform .25s}
.brand-card:hover{box-shadow:var(--card-h);transform:translateY(-2px)}
.color-strip{display:flex;height:48px}
.color-strip span{flex:1}
.brand-card:hover .color-strip span:first-child{flex:1.3}
.brand-body{padding:16px 18px 18px}
.brand-cat{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--g400);margin-bottom:8px}
.brand-name{font-size:18px;font-weight:600;line-height:1.3;margin-bottom:2px}
.brand-id{font-family:var(--mono);font-size:12px;color:var(--g400);margin-bottom:10px}
.brand-desc{font-size:13px;color:var(--g600);line-height:1.55;margin-bottom:12px;font-weight:600}
.brand-tags{display:flex;flex-wrap:wrap;gap:5px}
.brand-tag{font-size:11px;font-weight:500;padding:2px 8px;border-radius:9999px;background:var(--g50);box-shadow:var(--ring);color:var(--g600)}
@media(max-width:1024px){.brand-grid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:768px){.brand-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:480px){.brand-grid{grid-template-columns:1fr}}
</style>
`);

// ─── PAGE: CHAPTER 1 (小明的时间黑洞) ───
const pagePhase0 = layout('ch1.html', '第一章 · 小明的时间黑洞', '小明的交付升级记', '<a href="index.html">首页</a> / 小明的交付升级记 / 第一章', `
<section class="sec">
  <div class="sec-label">GTD 第一步 · 捕捉</div>
  <h2 class="sec-title" style="font-size:28px;margin-bottom:24px">任务太多，但不知道真正重要的是什么</h2>
  <p class="scene-desc">小明每天被各种任务淹没——老板的微信、客户的邮件、同事的口头交代。他忙了一整天，不知道真正重要的是什么。</p>

  <div class="scene">
    <div class="narrator">周一早上 9 点。小明打开电脑，看到：3 条老板的微信语音、5 封未读邮件、2 个同事的钉钉消息、1 个客户电话留言。</div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaoming-avatar.png" alt="小明"></div>
      <div class="dialogue-bubble xiaoming">
        <div class="dialogue-name xiaoming">小明</div>
        <div class="dialogue-text">（叹气）这么多事，从哪开始啊……</div>
      </div>
    </div>

    <div class="narrator">这时，小触出现了。</div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">别慌。先把所有任务都倒出来，一个别落。</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaoming-avatar.png" alt="小明"></div>
      <div class="dialogue-bubble xiaoming">
        <div class="dialogue-name xiaoming">小明</div>
        <div class="dialogue-text">怎么倒？</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">打开千问办公，把所有消息、邮件、语音全部转成文字，列成清单。不用整理，先全部捕捉。</div>
      </div>
    </div>
  </div>

  <!-- 操作流程 -->
  <div class="scene">
    <div class="sec-label">Step 1 · 捕捉所有任务</div>
    <h2 class="scene-title">把混乱全部倒出来</h2>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">1.1 收集所有信息来源</h3>
      <p>微信语音、钉钉消息、邮件、电话留言、便签纸、同事口头交代——所有地方可能藏着任务。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：千问办公对话界面，展示小明列出所有任务来源</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">1.2 让 AI 转写和整理</h3>
      <p>在千问办公里输入："帮我把这些语音、邮件、消息全部转成文字，列成任务清单，每条一句话。" AI 会自动处理。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label"> 截图位置：千问办公生成的任务清单，展示 10+ 条任务</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">1.3 检查遗漏</h3>
      <p>对照清单，问自己：还有没有漏掉的？比如"上周答应客户的事""老板随口提的一句"。全部补上。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：小明在千问办公里补充遗漏任务的界面</div>
      </div>
    </div>
  </div>

  <!-- Scene: 对话过渡 -->
  <div class="scene">
    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaoming-avatar.png" alt="小明"></div>
      <div class="dialogue-bubble xiaoming">
        <div class="dialogue-name xiaoming">小明</div>
        <div class="dialogue-text">（看着清单）哇，居然有 17 件事！我以为只有 5、6 件……</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaoming-avatar.png" alt="小明"></div>
      <div class="dialogue-bubble xiaoming">
        <div class="dialogue-name xiaoming">小明</div>
        <div class="dialogue-text">不过没关系，现在有了 AI——我把这 17 件全丢给千问办公，让它替我干！</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">停。如果你打算把所有事都交给 AI，那你第一个交出去的，就是你的判断力。</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaoming-avatar.png" alt="小明"></div>
      <div class="dialogue-bubble xiaoming">
        <div class="dialogue-name xiaoming">小明</div>
        <div class="dialogue-text">那……哪些能交给 AI？世界上的工作千千万，总不能一件一件想吧？</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">不用一件一件想。只需要问两个问题：<strong>这件事，我会不会做？这件事，我想不想自己做？</strong>两个问题一交叉，所有事情自动落进四个格子。</div>
      </div>
    </div>
  </div>

  <!-- 操作流程：四象限 -->
  <div class="scene">
    <div class="sec-label">Step 2 · 会做 × 想做：给工作分格</div>
    <h2 class="scene-title">AI 时代的岗位地图</h2>

    <div class="quadrant-grid">
      <div class="quadrant q1">
        <div class="q-tag">① 会做 · 也想做</div>
        <div class="q-title">自己留着做</div>
        <p class="q-desc">这些事是你的价值所在，交给 AI 等于把自己交出去。</p>
        <ul class="q-list">
          <li>周五部门会讲小组进展</li>
          <li>绩效面谈（下月的）</li>
        </ul>
        <div class="q-action">→ 别让 AI 碰</div>
      </div>
      <div class="quadrant q3">
        <div class="q-tag">③ 不会做 · 但想做</div>
        <div class="q-title">先学，再让 AI 参与</div>
        <p class="q-desc">自己不会，就没法验收 AI 的结果。先掌握基本框架。</p>
        <ul class="q-list">
          <li>客户流失的数据分析</li>
          <li>健康分 V2 口径分析</li>
        </ul>
        <div class="q-action">→ 学框架 → 再协作</div>
      </div>
      <div class="quadrant q2">
        <div class="q-tag">② 不会做 · 也不想做</div>
        <div class="q-title">要么远离，要么外包</div>
        <p class="q-desc">本来就会躲开的事，谈不上"被 AI 替代"。</p>
        <ul class="q-list">
          <li>（小明想了想，暂时没有）</li>
        </ul>
        <div class="q-action">→ 不用纠结</div>
      </div>
      <div class="quadrant q4">
        <div class="q-tag">④ 会做 · 但不想做</div>
        <div class="q-title">最适合交给 AI</div>
        <p class="q-desc">你会做，所以知道什么叫"做好"，才能判断 AI 的结果。</p>
        <ul class="q-list">
          <li>报销单据整理</li>
          <li>27 个文件的资料分拣</li>
          <li>汇报 PPT 排版</li>
          <li>催老王要数据的跟踪记录</li>
        </ul>
        <div class="q-action">→ 逐步交出去</div>
      </div>
    </div>

    <div class="card" style="margin-top:24px;margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">2.1 让 AI 帮你把 17 件事分格</h3>
      <p>在千问办公输入："这是我的 17 件待办。用'我会不会做 / 我想不想自己做'两个维度给每件分到四个格子，拿不准的标出来问我。"AI 会给出初步归类，<strong>拿不准的由你拍板</strong>——因为"想不想"只有你自己知道。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：千问办公输出的 17 件事四象限归类表，含"拿不准"标注项</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">2.2 注意那件被小明漏掉的事</h3>
      <p>AI 把"客户流失初步数据分析"放进了第③格。小明本来想把它直接丢给 AI——但小触提醒：<strong>"你自己不会数据分析，AI 给你一份数据，你能看出它算错了吗？"</strong>第③格的事，先花两小时学框架，再让 AI 干。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：AI 对第③格事项的提醒说明</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">2.3 识别留在"待澄清"区的模糊任务</h3>
      <p>分完格，还有一件事实在放不进去——"下周把这个事情讲清楚"。它是什么、算哪格，完全不明。这类任务需要进一步澄清——这是第二章的内容。</p>
      <div class="screenshot-placeholder" style="margin-top:12px">
        <div class="screenshot-label">📸 截图位置：千问办公标注"待澄清"任务的界面</div>
      </div>
    </div>
  </div>

  <!-- 对话收尾 -->
  <div class="scene">
    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaoming-avatar.png" alt="小明"></div>
      <div class="dialogue-bubble xiaoming">
        <div class="dialogue-name xiaoming">小明</div>
        <div class="dialogue-text">（盯着矩阵看了很久）……原来我真正想留给自己的，只有第①格那两件事。剩下的，要么在学，要么在交出去。</div>
      </div>
    </div>

    <div class="dialogue">
      <div class="dialogue-avatar"><img src="xiaochu.png" alt="小触"></div>
      <div class="dialogue-bubble xiaochu">
        <div class="dialogue-name xiaochu">小触</div>
        <div class="dialogue-text">这就是你在 AI 大潮里该有的姿态：<strong>第①格守住你的价值，第③格投资你的成长，第④格把重复交出去。</strong>记住为什么第④格才适合交——因为你会做，所以你能验收。这一点，到第五章你会体会更深。</div>
      </div>
    </div>
  </div>

  <!-- 练习作业 -->
  <div class="exercise-box">
    <h3> 第一章练习作业</h3>
    <p>画一张你自己的"会做 × 想做"矩阵：</p>
    <div class="task">
      <strong>任务：</strong>列出你本周所有要做的事，逐件放进四个格子。<br><br>
      <strong>步骤：</strong><br>
      1. 把所有来源的任务（微信、邮件、钉钉、便签、记忆）全部输入千问办公，让 AI 整理成清单<br>
      2. 让 AI 按"会不会做 / 想不想做"初步分格<br>
      3. 拿不准的你自己拍板（"想不想"只有你知道）<br>
      4. 圈出第①格——那就是你岗位价值的核心<br><br>
      <strong>记录：</strong>17 件事里，第①格有几件？第③格有几件？如果第①格空空荡荡，值得警惕；如果第③格挤满了，说明你在快速成长区。<br><br>
      <strong>目的：</strong>焦虑往往不是来自"事太多"，而是"看不清哪些事值得自己出手"。
    </div>
  </div>

  <!-- 下一步 -->
  <div style="margin-top:48px;text-align:center">
    <h3 style="font-size:20px;font-weight:600;margin-bottom:12px">准备好进入第二章了吗？</h3>
    <p style="font-size:16px;color:var(--g600);margin-bottom:24px">任务捕捉了，但有些指令很模糊。接下来，小触会教你如何澄清任务。</p>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      <a href="ch2.html" class="btn-d">进入第二章 →</a>
      <a href="index.html" class="btn-g">返回首页</a>
    </div>
  </div>
</section>

<style>
.screenshot-placeholder{background:var(--g50);border:2px dashed var(--g200);border-radius:12px;padding:20px;text-align:center}
.screenshot-label{font-size:13px;color:var(--g500);font-weight:500}

/* 会做×想做 四象限 */
.quadrant-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:24px 0}
.quadrant{border-radius:20px;padding:20px;box-shadow:var(--card-s);transition:box-shadow .2s,transform .2s}
.quadrant:hover{box-shadow:var(--card-h);transform:translateY(-2px)}
.quadrant .q-tag{display:inline-block;font-family:var(--mono);font-size:11px;font-weight:600;padding:3px 10px;border-radius:9999px;margin-bottom:10px}
.quadrant .q-title{font-size:17px;font-weight:900;line-height:1;margin-bottom:8px}
.quadrant .q-desc{font-size:13px;color:var(--g600);line-height:1.5;margin-bottom:12px;font-weight:400}
.quadrant .q-list{list-style:none;margin-bottom:12px}
.quadrant .q-list li{font-size:13px;font-weight:600;padding:4px 0;border-bottom:1px dashed var(--g200)}
.quadrant .q-list li:last-child{border-bottom:none}
.quadrant .q-action{font-size:12px;font-weight:700;letter-spacing:.5px}
.q1{background:rgba(159,232,112,.08);border:1px solid rgba(159,232,112,.3)}
.q1 .q-tag{background:var(--wise-green);color:var(--dark-green)}
.q1 .q-title{color:var(--dark-green)}
.q1 .q-action{color:var(--dark-green)}
.q2{background:var(--g50)}
.q2 .q-tag{background:var(--g200);color:var(--g600)}
.q2 .q-action{color:var(--g500)}
.q3{background:rgba(255,209,26,.06);border:1px solid rgba(255,209,26,.3)}
.q3 .q-tag{background:#ffd11a;color:#163300}
.q3 .q-action{color:#ca8a04}
.q4{background:rgba(208,50,56,.04);border:1px solid rgba(208,50,56,.15)}
.q4 .q-tag{background:#d03238;color:#fff}
.q4 .q-action{color:#d03238}
@media(max-width:768px){.quadrant-grid{grid-template-columns:1fr}}
</style>
`);

// ─── GENERATE ALL FILES ───
const files = {
  'style.css': CSS,
  'main.js': JS,
  'index.html': pageIndex,
  'path.html': pagePath,
  'phase-0.html': pagePhase0,
  'ch1.html': pagePhase0,
  'ch2.html': pagePhase1,
  'ch3.html': pageCh3,
  'ch4.html': pageCh4,
  'ch5.html': pageCh5,
  'ch6.html': pageCh6,
  'phase-2.html': pagePhase2,
  'phase-3.html': pagePhase3,
  'phase-4.html': pagePhase4,
  'cases.html': pageCases,
  'eval.html': pageEval,
  'tasks.html': pageTasks,
  'methodology.html': pageMethod,
  'toc.html': pageToc,
  'about.html': pageAbout,
  'brands.html': pageBrands,
};

let count = 0;
for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(OUT, name), content, 'utf-8');
  count++;
}
console.log(`✅ Generated ${count} files in ${OUT}`);
