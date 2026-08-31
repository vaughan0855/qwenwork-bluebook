
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
