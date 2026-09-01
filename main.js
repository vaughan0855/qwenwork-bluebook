
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

// Canonical site chrome: keep every page on the same navigation and footer
// while allowing the content pages to remain static and independently linkable.
(function(){
  var chevron='<svg class="chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4l4 4-4 4"/></svg>';
  var caseItems=[
    '<li><a href="cases.html">案例 01 · 小明的交付升级记</a><ul class="sidebar-sublist">'+
      '<li><a href="ch0.html">序章 · 为什么打开千问办公</a></li>'+
      '<li><a href="ch1.html">第一章 · 先让资料池开口</a></li>'+
      '<li><a href="ch2.html">第二章 · 这个事情要交付什么</a></li>'+
      '<li><a href="ch3.html">第三章 · 27 份资料如何变成资料地图</a></li>'+
      '<li><a href="ch4.html">第四章 · 从数字到证据型结论</a></li>'+
      '<li><a href="ch5.html">第五章 · 让挑剔总监先来质疑</a></li>'+
      '<li><a href="ch6.html">第六章 · 人工审定与待确认版</a></li>'+
    '</ul></li>',
    '<li><a href="case-prospectus.html">案例 02 · 宇树招股书数据提取与交叉验证</a></li>',
    '<li><a href="case-short-video.html">案例 03 · 短视频分镜脚本 PPT</a></li>',
    '<li><a href="case-dashboard.html">案例 04 · 月度经营数据仪表盘</a></li>',
    '<li><a href="case-competitor-monitor.html">案例 05 · 竞品监控与钉钉推送</a></li>',
    '<li><a href="case-prd.html">案例 06 · 产品需求到 PRD</a></li>',
    '<li><a href="case-nda-review.html">案例 07 · NDA 保密协议快速审查</a></li>'
  ].join('');
  function group(title,items){
    return '<div class="sidebar-group"><button class="sidebar-group-title" type="button">'+title+chevron+'</button><ul class="sidebar-group-items">'+items+'</ul></div>';
  }
  var sidebarHTML=
    '<div class="sidebar-header"><a href="index.html" class="sidebar-logo"><img class="brand-logo" src="qwenwork-logo.png" alt="">千问办公绿皮书</a></div>'+
    '<nav class="sidebar-nav">'+
      group('开始','<li><a href="index.html">首页</a></li><li><a href="toc.html">完整目录</a></li>')+
      group('阅读路径','<li><a href="path.html">路径总览</a></li><li><a href="phase-1.html">Phase 1 · 新手入门</a></li><li><a href="phase-2.html">Phase 2 · 核心功能</a></li><li><a href="phase-3.html">Phase 3 · 常见任务与场景实战</a></li>')+
      group('实战案例分享',caseItems)+
      group('任务速查','<li><a href="tasks.html">按任务找到入口</a></li>')+
      group('深度','<li><a href="methodology.html">方法论</a></li><li><a href="about.html">关于绿皮书</a></li>')+
    '</nav>';
  var sidebar=document.querySelector('.sidebar');
  if(sidebar){sidebar.innerHTML=sidebarHTML}

  var footer=document.querySelector('footer.footer');
  if(footer){
    footer.innerHTML='<div class="footer-in"><div class="footer-left"><a class="sidebar-logo" href="index.html"><img class="brand-logo" src="qwenwork-logo.png" alt="">千问办公绿皮书</a><p>以真实工作为主线，把 AI 协作经验沉淀为可复用的工作流。持续更新中。</p></div><div class="footer-links"><div class="footer-col"><h5>内容</h5><ul><li><a href="path.html">阅读路径</a></li><li><a href="cases.html">案例分享</a></li><li><a href="tasks.html">任务速查</a></li></ul></div><div class="footer-col"><h5>资源</h5><ul><li><a href="https://learn.qwenwork.host/docs/getting-started/intro.html" target="_blank" rel="noopener">官方文档</a></li><li><a href="toc.html">完整目录</a></li><li><a href="https://qwenwork.cn" target="_blank" rel="noopener">下载千问办公</a></li></ul></div><div class="footer-col"><h5>社区</h5><ul><li><a href="about.html">关于绿皮书</a></li><li><a href="https://github.com/vaughan0855/qwenwork-bluebook/issues" target="_blank" rel="noopener">反馈建议</a></li><li><a href="https://github.com/vaughan0855/qwenwork-bluebook" target="_blank" rel="noopener">参与贡献</a></li></ul></div></div></div>';
  }
})();

// Sidebar group collapse/expand
document.querySelectorAll('.sidebar-group-title').forEach(function(btn){
  btn.addEventListener('click',function(){
    this.closest('.sidebar-group').classList.toggle('collapsed');
  });
});

// Keep the active state correct after the shared navigation is rendered on every page
(function(){
  var current=(window.location.pathname.split('/').pop() || 'index.html').split('#')[0];
  document.querySelectorAll('.sidebar a[href]').forEach(function(link){
    var href=link.getAttribute('href') || '';
    if(href.startsWith('http') || href.startsWith('#')){return}
    var target=href.split('#')[0].split('?')[0] || 'index.html';
    if(target===current){link.classList.add('active')}
  });
})();

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

// Evidence image lightbox: keep the reader on the current page while viewing full-size evidence
(function(){
  var triggers=document.querySelectorAll('.evidence-figure > a[href]');
  if(!triggers.length){return}

  var lightbox=document.createElement('div');
  lightbox.className='evidence-lightbox';
  lightbox.setAttribute('role','dialog');
  lightbox.setAttribute('aria-modal','true');
  lightbox.setAttribute('aria-label','查看证据原图');
  lightbox.innerHTML='<div class="evidence-lightbox-backdrop"></div><div class="evidence-lightbox-content"><button class="evidence-lightbox-close" type="button" aria-label="关闭原图">×</button><img class="evidence-lightbox-image" alt=""></div>';
  document.body.appendChild(lightbox);

  var image=lightbox.querySelector('.evidence-lightbox-image');
  var closeButton=lightbox.querySelector('.evidence-lightbox-close');
  var backdrop=lightbox.querySelector('.evidence-lightbox-backdrop');
  var lastTrigger=null;

  function close(){
    lightbox.classList.remove('is-open');
    document.body.classList.remove('evidence-lightbox-open');
    if(lastTrigger){lastTrigger.focus()}
  }

  triggers.forEach(function(trigger){
    trigger.addEventListener('click',function(e){
      e.preventDefault();
      lastTrigger=trigger;
      var source=trigger.querySelector('img');
      image.src=trigger.href;
      image.alt=source ? source.alt : '证据原图';
      lightbox.classList.add('is-open');
      document.body.classList.add('evidence-lightbox-open');
      closeButton.focus();
    });
  });
  closeButton.addEventListener('click',close);
  backdrop.addEventListener('click',close);
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape' && lightbox.classList.contains('is-open')){close()}
  });
})();

// Markdown evidence lightbox: open the source document inside the current page
(function(){
  var triggers=document.querySelectorAll('.document-lightbox-trigger[href]');
  if(!triggers.length){return}

  var lightbox=document.createElement('div');
  lightbox.className='document-lightbox';
  lightbox.setAttribute('role','dialog');
  lightbox.setAttribute('aria-modal','true');
  lightbox.setAttribute('aria-label','当前页阅读证据底稿');
  lightbox.innerHTML='<div class="document-lightbox-backdrop"></div><div class="document-lightbox-content"><div class="document-lightbox-toolbar"><span class="document-lightbox-title">证据底稿</span><button class="document-lightbox-close" type="button" aria-label="关闭文档">×</button></div><iframe class="document-lightbox-frame" title="证据底稿内容"></iframe></div>';
  document.body.appendChild(lightbox);

  var frame=lightbox.querySelector('.document-lightbox-frame');
  var title=lightbox.querySelector('.document-lightbox-title');
  var closeButton=lightbox.querySelector('.document-lightbox-close');
  var backdrop=lightbox.querySelector('.document-lightbox-backdrop');
  var lastTrigger=null;

  function close(){
    lightbox.classList.remove('is-open');
    document.body.classList.remove('evidence-lightbox-open');
    frame.src='about:blank';
    if(lastTrigger){lastTrigger.focus()}
  }
  triggers.forEach(function(trigger){
    trigger.addEventListener('click',function(e){
      e.preventDefault();
      lastTrigger=trigger;
      frame.src=trigger.href;
      title.textContent=trigger.getAttribute('data-document-title') || '证据底稿';
      lightbox.classList.add('is-open');
      document.body.classList.add('evidence-lightbox-open');
      closeButton.focus();
    });
  });
  closeButton.addEventListener('click',close);
  backdrop.addEventListener('click',close);
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape' && lightbox.classList.contains('is-open')){close()}
  });
})();
