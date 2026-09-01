
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

// Case methodology metadata: one source of truth for overview and detail pages
(function(){
  var caseData={
    'case-prospectus.html':{method:'证据链与数据溯源',ai:'提取数字、计算、标记冲突并整理来源矩阵。',human:'回到正式披露，确认口径并决定哪些内容可以引用。',delivery:'证据底稿、交叉验证矩阵和研究型 PPT；引用边界仍需人工确认。'},
    'case-short-video.html':{method:'关键路径与标准化',ai:'整理纪要、生成口播、拆分镜并形成拍摄执行表。',human:'判断选题、事实、授权、可拍性和最终发布。',delivery:'分镜脚本 PPT 与逐镜拍摄执行表。'},
    'case-dashboard.html':{method:'指标口径与异常处理',ai:'计算指标、制图、标出异常并起草经营解释。',human:'核对指标定义，解释业务原因并决定下一步行动。',delivery:'经营会仪表盘原型和可继续追问的经营简报。'},
    'case-competitor-monitor.html':{method:'队列管理与自动化',ai:'汇总、去重、筛选新闻，整理日报参数和推送草稿。',human:'选择传播内容，放行权限并验收定时任务稳定性。',delivery:'日报模板、真实品牌名单、定时任务和钉钉推送证据。'},
    'case-prd.html':{method:'MVP 与迭代拆解',ai:'归类访谈、建立证据链、生成用户故事和 PRD 草案。',human:'决定一期范围、需求取舍、验收条件和排期。',delivery:'预 PRD、一期 PRD 和产品负责人确认交付包。'},
    'case-nda-review.html':{method:'风险分级与人工闸门',ai:'定位条款、分级风险、整理问题和谈判准备材料。',human:'确认法律风险、谈判底线、专业意见和最终签署决定。',delivery:'初审底稿、谈判备忘和法务复核清单；均为内部不对外文件。'}
  };
  var chapterData={
    'ch0.html':{stage:'接住混乱',ai:'帮助识别工作现场和触发任务。',human:'确认这件事是否值得推进，以及谁对结果负责。',state:'故事入口，尚未进入千问办公推演。',next:'第一章 · GTD式收集与澄清'},
    'ch1.html':{stage:'GTD式收集与澄清',ai:'阅读资料池，提取任务线索和可能的交付方向。',human:'确认任务边界，决定暂时不写 PPT、不直接给方案。',state:'AI 中间产出，尚无独立人工验收证据。',next:'第二章 · 明确交付物'},
    'ch2.html':{stage:'明确交付物',ai:'整理受众、业务问题、交付物和缺口。',human:'确认真正要交什么，以及哪些判断仍需向上确认。',state:'任务理解结果，交付格式仍需人工确认。',next:'第三章 · 上下文与流程拆解'},
    'ch3.html':{stage:'上下文与流程拆解',ai:'建立资料地图，连接文件、问题、证据和时间。',human:'确认来源可信度、优先级和敏感信息边界。',state:'资料地图中间产出，需人工核对来源。',next:'第四章 · 证据核验'},
    'ch4.html':{stage:'证据核验',ai:'计算分布、交叉比对、标出冲突并保留溯源。',human:'确认统计口径、表达边界和哪些数字可以进入汇报。',state:'证据分析结果，数字与口径需人工复核。',next:'第五章 · 人工压力测试'},
    'ch5.html':{stage:'人工压力测试',ai:'模拟挑剔总监，主动寻找证据不足和推断过度。',human:'判断质疑是否成立，并决定结论如何改写。',state:'AI 压力测试结果，质疑本身仍需人判断。',next:'第六章 · 人工审定与复用'},
    'ch6.html':{stage:'人工审定与复用',ai:'按审核决定生成待确认版和后续行动清单。',human:'决定能否交付、找谁确认、哪些事项暂不承诺。',state:'待确认版，需总监和责任人拍板。',next:'形成可复用的 Prompt、模板和检查清单'}
  };
  var current=(window.location.pathname.split('/').pop() || 'index.html').split('#')[0];

  function addCaseOverviewCards(){
    document.querySelectorAll('.case-card-link').forEach(function(card){
      var href=(card.getAttribute('href')||'').split('#')[0];
      var data=caseData[href];
      var body=card.querySelector('.case-body');
      if(!data || !body || body.querySelector('.case-method-tag')){return}
      var badge=body.querySelector('.case-badge');
      if(badge){badge.insertAdjacentHTML('afterend','<span class="case-method-tag">主方法 · '+data.method+'</span>')}
      var meta=body.querySelector('.case-meta');
      if(meta){meta.insertAdjacentHTML('beforebegin','<div class="case-role-note"><span><b>AI</b>'+data.ai+'</span><span><b>人</b>'+data.human+'</span></div>')}
    });
  }

  function addCaseDetailCard(){
    var data=caseData[current];
    if(!data || document.querySelector('.case-human-ai-card')){return}
    var card=document.createElement('section');
    card.className='case-human-ai-card';
    card.innerHTML='<div class="case-human-ai-head"><div><div class="sec-label">主方法 · 人机分工</div><h2>'+data.method+'</h2></div><span class="status-chip">个人工作提效</span></div><div class="case-human-ai-grid"><div><b>AI 主做</b><p>'+data.ai+'</p></div><div><b>人主做</b><p>'+data.human+'</p></div><div><b>AI 不能替代</b><p>责任承担、权限授权、专业判断和业务承诺。</p></div><div><b>最终交付</b><p>'+data.delivery+'</p></div></div>';
    var hero=document.querySelector('.case-detail-hero');
    var section=hero ? hero.parentNode : document.querySelector('.main');
    if(hero){section.insertBefore(card,hero.nextSibling)}else if(section){section.insertBefore(card,section.querySelector('.pg-header') ? section.querySelector('.pg-header').nextSibling : section.firstChild)}
  }

  function addChapterMethodCard(){
    var data=chapterData[current];
    if(!data || document.querySelector('.chapter-method-card')){return}
    var card=document.createElement('section');
    card.className='chapter-method-card';
    card.innerHTML='<div class="sec-label">本章方法定位</div><h2>'+data.stage+'</h2><div class="chapter-method-grid"><div><b>交付链位置</b><span>'+data.stage+'，把上一状态推进到下一状态。</span></div><div><b>AI 主做</b><span>'+data.ai+'</span></div><div><b>人必须判断</b><span>'+data.human+'</span></div><div><b>当前状态</b><span>'+data.state+'</span></div></div><div class="chapter-method-next"><b>下一步</b><span>'+data.next+'</span></div>';
    var header=document.querySelector('.pg-header');
    if(header){header.insertAdjacentElement('afterend',card)}
  }

  addCaseOverviewCards();
  addCaseDetailCard();
  addChapterMethodCard();
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
