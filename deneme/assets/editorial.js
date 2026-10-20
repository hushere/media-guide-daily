(function(){
'use strict';
function esc(v){return String(v||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function safe(v){try{var u=new URL(v);return u.protocol==='https:'?u.href:''}catch(e){return ''}}
window.mountMediaEditorial=function(b, reader){
var main=document.getElementById('main'),host=document.getElementById('articles'),arts=b.articles||[];
if(!arts.length)return;
var hero=main.querySelector('.hero-copy');
hero.innerHTML='<div class="mag-date">'+esc(b.date)+' · Daily Media Intelligence</div><h1>Medya değişiyor.<br><em>Birlikte keşfedelim.</em></h1><p class="mag-deck">Haberler, fikirler ve medya kararlarını değiştiren gelişmeler.</p><div class="mag-entry"><a href="#storyGallery">Gündemi keşfet</a><a href="#articles">Tam bülteni oku ↗</a></div>';
var gallery=document.createElement('section');gallery.id='storyGallery';gallery.className='story-gallery';
gallery.setAttribute('aria-label','Görsel haber dizini');
var cats=Array.from(new Set(arts.map(function(a){return a.category})));
gallery.innerHTML='<div class="gallery-tools"><h2>Bugün ne var?</h2><button type="button" class="text-btn" id="motionToggle" aria-pressed="true">Hareketi kapat</button><p id="galleryCount" role="status"></p></div><div class="gallery-topics" role="group" aria-label="Kapakları konuya göre süz"><button type="button" data-topic="" aria-pressed="true">Hepsi</button>'+cats.map(function(c){return '<button type="button" data-topic="'+esc(c)+'" aria-pressed="false">'+esc(c)+'</button>'}).join('')+'</div><div class="cover-grid"></div><p class="gallery-note">Bir başlığa dokun, tüm metni, analizi ve kaynakları açılan pencerede oku.</p>';
hero.after(gallery);
var grid=gallery.querySelector('.cover-grid'),topic='';
function art(a,i){
 var img=a.image&&safe(a.image.url);
 var glyph=/TV|Entertainment/.test(a.category)?'◉':/Dijital|AI/.test(a.category)?'✳':/Araştırma|Ölçüm/.test(a.category)?'↗':/Yaratıcı/.test(a.category)?'✦':'◎';
 return '<a class="story-cover tone-'+(i%6)+(img?' has-photo':' type-cover')+'" href="#'+esc(a.id)+'" data-target="'+esc(a.id)+'" aria-haspopup="dialog"><div class="cover-top"><span>'+esc(a.region)+'</span><span>'+esc(a.category)+'</span></div>'+
 (img?'<div class="cover-picture"><img src="'+esc(img)+'" alt="" loading="lazy"></div>':'<div class="cover-art" aria-hidden="true"><span>'+glyph+'</span><i></i></div>')+
 '<div class="cover-copy"><h3>'+esc(a.title)+'</h3><p>'+esc(a.summary)+'</p><span class="cover-open">Haberi keşfet <b aria-hidden="true">↗</b></span></div></a>';
}
function render(){var selected=arts.filter(function(a){return !topic||a.category===topic});grid.innerHTML=selected.map(function(a){return art(a,arts.indexOf(a))}).join('');document.getElementById('galleryCount').textContent=selected.length+' / '+arts.length+' haber';grid.querySelectorAll('img').forEach(function(img){img.addEventListener('error',function(){var c=this.closest('.story-cover');this.parentElement.remove();c.classList.remove('has-photo');c.classList.add('type-cover','image-unavailable')})})}
render();
gallery.querySelector('.gallery-topics').onclick=function(e){var t=e.target.closest('[data-topic]');if(!t)return;topic=t.dataset.topic;this.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',String(x===t))});render()};

var dialog=document.createElement('dialog');
dialog.className='story-dialog';
dialog.setAttribute('aria-labelledby','storyDialogTitle');
dialog.innerHTML='<div class="story-dialog-bar"><span>Tam haber · Analiz · Kaynaklar</span><button type="button" class="btn" autofocus aria-label="Haber penceresini kapat">Kapat ×</button></div><div class="story-dialog-content"></div>';
main.appendChild(dialog);
var content=dialog.querySelector('.story-dialog-content'),close=dialog.querySelector('button'),opener=null,scrollPosition=0,readTimer=null,activeId=null,previousOverflow='';
function openStory(id,trigger){
 if(!reader||typeof dialog.showModal!=='function')return false;
 var a=arts.find(function(x){return x.id===id});if(!a)return false;
 opener=trigger;activeId=id;scrollPosition=window.scrollY;
 content.innerHTML=reader.render(a);
 var card=content.querySelector('article');card.removeAttribute('id');
 card.querySelector('h3').id='storyDialogTitle';
 card.querySelectorAll('details').forEach(function(d){d.open=true});
 previousOverflow=document.documentElement.style.overflow;
 dialog.showModal();document.documentElement.style.overflow='hidden';
 content.scrollTop=0;dialog.scrollTop=0;close.focus({preventScroll:true});
 readTimer=setTimeout(function(){reader.markRead(id);card.classList.add('is-read')},6000);
 return true;
}
close.addEventListener('click',function(){dialog.close()});
var backdropDown=false;
dialog.addEventListener('pointerdown',function(e){backdropDown=e.target===dialog});
dialog.addEventListener('click',function(e){
 var r=dialog.getBoundingClientRect();
 if(backdropDown&&e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();
 backdropDown=false;
 var save=e.target.closest('.save-btn');
 if(save){reader.save(activeId);var temporary=document.createElement('div');temporary.innerHTML=reader.render(arts.find(function(a){return a.id===activeId}));var button=temporary.querySelector('.save-btn');if(button){save.innerHTML=button.innerHTML;save.setAttribute('aria-pressed',button.getAttribute('aria-pressed'));save.title=button.title}}
});
dialog.addEventListener('close',function(){
 clearTimeout(readTimer);document.documentElement.style.overflow=previousOverflow;
 content.replaceChildren();
 window.scrollTo({top:scrollPosition,behavior:'instant'});
 if(opener&&opener.isConnected)opener.focus({preventScroll:true});
});
function openFromLink(e){
 var a=e.target.closest('a[data-target]');
 if(!a||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0)return;
 if(openStory(a.dataset.target,a))e.preventDefault();
}
grid.addEventListener('click',openFromLink);
var tools=document.createElement('div');tools.className='reading-tools';tools.innerHTML='<span>Derinlemesine oku. Kaynakları kontrol et.</span><button class="btn" type="button" aria-pressed="false">Tüm detayları aç</button><a href="#storyGallery">Kapaklara dön ↑</a>';host.before(tools);
main.querySelector('.feed-head h2').textContent='Haberin içine gir.';
var opened=false;
function expand(){host.querySelectorAll('article details').forEach(function(d){d.open=opened})}
tools.querySelector('button').onclick=function(){opened=!opened;this.setAttribute('aria-pressed',String(opened));this.textContent=opened?'Detayları kapat':'Tüm detayları aç';expand()};
var index=document.createElement('nav');index.className='mini-index';index.setAttribute('aria-label','Haber dizini');index.innerHTML='<h3>Bu sayıda</h3>'+arts.map(function(a){return '<a href="#'+esc(a.id)+'" data-target="'+esc(a.id)+'">'+esc(a.title)+'</a>'}).join('');main.querySelector('.discover').appendChild(index);
index.addEventListener('click',openFromLink);
var current=null,pending=false;
function sync(){
pending=false;
var card=Array.from(host.querySelectorAll('article')).find(function(c){var r=c.getBoundingClientRect();return r.bottom>100&&r.top<innerHeight*.55});
if(!card||card.id===current)return;current=card.id;
index.querySelectorAll('a').forEach(function(a){if(a.dataset.target===current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})
}
function queue(){if(!pending){pending=true;requestAnimationFrame(sync)}}
addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue,{passive:true});
new MutationObserver(function(){if(opened)expand();queue()}).observe(host,{childList:true});
var off=false;try{off=localStorage.getItem('mg-trial-motion')==='off'}catch(e){}
var mq=matchMedia('(prefers-reduced-motion: reduce)'),toggle=document.getElementById('motionToggle');
function motion(){var disabled=off||mq.matches;main.classList.toggle('motion-off',disabled);toggle.textContent=mq.matches?'Azaltılmış hareket':disabled?'Hareketi aç':'Hareketi kapat';toggle.disabled=mq.matches;toggle.setAttribute('aria-pressed',String(!disabled))}
toggle.onclick=function(){off=!off;try{localStorage.setItem('mg-trial-motion',off?'off':'on')}catch(e){}motion()};
mq.addEventListener('change',motion);motion();queue();
var finish=document.createElement('div');finish.className='mag-finish';finish.innerHTML='<p>Gündem burada bitmez.</p><h2>Bir sonraki fikre<br>yer aç.</h2><a href="#storyGallery">Bu sayıyı yeniden keşfet ↗</a>';main.appendChild(finish);
};
})();