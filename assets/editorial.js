(function(){
'use strict';
function esc(v){return String(v||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function safe(v){try{var u=new URL(v);return u.protocol==='https:'?u.href:''}catch(e){return ''}}
window.mountMediaEditorial=function(b, reader){
var main=document.getElementById('main'),host=document.getElementById('articles'),arts=b.articles||[];
if(!arts.length)return;
var hero=main.querySelector('.hero-copy');
hero.innerHTML='<div class="mag-date">'+esc(b.date)+'</div><h1>Medya değişiyor.<br><em>Birlikte keşfedelim.</em></h1><p class="mag-deck">Haberler, fikirler ve medya kararlarını değiştiren gelişmeler.</p><div class="mag-entry"><a href="#storyGallery">Gündemi keşfet</a>'+(main.querySelector('#tvTakvim')?'<a href="#tvTakvim">2026 TV Dizi Takvimi ↗</a>':'')+'</div>';
var gallery=document.createElement('section');gallery.id='storyGallery';gallery.className='story-gallery';
gallery.setAttribute('aria-label','Görsel haber dizini');
var cats=Array.from(new Set(arts.map(function(a){return a.category})));
gallery.innerHTML='<div class="gallery-tools"><h2>Bugün ne var?</h2><p id="galleryCount" role="status"></p></div><div class="gallery-topics" role="group" aria-label="Kapakları konuya göre süz"><button type="button" data-topic="" aria-pressed="true">Hepsi</button>'+cats.map(function(c){return '<button type="button" data-topic="'+esc(c)+'" aria-pressed="false">'+esc(c)+'</button>'}).join('')+'</div><div class="cover-grid"></div><p class="gallery-note">Bir başlığa dokun, tüm metni, analizi ve kaynakları açılan pencerede oku.</p>';

hero.after(gallery);
var row=main.querySelector('.hero-row'),social=main.querySelector('.social');
var highlights=row.querySelector('.highlights');if(highlights)highlights.remove();
row.classList.add('agenda-panels');
if(social){
 row.prepend(social);
 social.classList.add('agenda-panel','digital-panel');
 var head=social.querySelector('.soc-head'),intro=head.querySelector('div');
 intro.querySelector('.eyebrow').textContent='Platformlarda öne çıkanlar';
 intro.querySelector('h2').textContent='Dijital Gündem';
 var note=head.querySelector('.soc-note');
 if(note){var disclosure=document.createElement('details');disclosure.className='agenda-note';var summary=document.createElement('summary');summary.textContent='Veri hakkında';disclosure.append(summary,note);social.appendChild(disclosure)}
 var list=social.querySelector('.soc-list');list.tabIndex=0;list.setAttribute('aria-label','Dijital gündem içerikleri, kaydırılabilir');
 addPanelToggle(social,head,'Dijital gündemin tamamını göster');
}
var fixtures=row.querySelector('.fixtures');
if(fixtures){
 fixtures.classList.add('agenda-panel','sports-panel');
 fixtures.querySelector('.eyebrow').textContent='Haftanın karşılaşmaları';
 fixtures.querySelector('h2').textContent='Spor Takvimi';
 addPanelToggle(fixtures,fixtures.querySelector('.fx-head'),'Spor takviminin tamamını göster');
}
if(row.children.length===1)row.classList.add('single-panel');
gallery.before(row);
function addPanelToggle(panel,head,label){
 var button=document.createElement('button');button.type='button';button.className='panel-expand';button.textContent='Genişlet ↗';button.setAttribute('aria-label',label);button.setAttribute('aria-expanded','false');head.appendChild(button);
 button.addEventListener('click',function(){var expanded=panel.classList.toggle('panel-expanded');button.setAttribute('aria-expanded',String(expanded));button.textContent=expanded?'Daralt ↙':'Genişlet ↗';button.setAttribute('aria-label',expanded?'Paneli daralt':label)});
}

var grid=gallery.querySelector('.cover-grid'),topic='',query='';
var search=document.getElementById('search');search.classList.add('gallery-search');gallery.querySelector('.gallery-tools').after(search);
search.addEventListener('input',function(){query=this.value.trim().toLocaleLowerCase('tr');render()});
var progress=document.getElementById('readProgress');gallery.appendChild(progress);
function art(a,i){
 var img=a.image&&safe(a.image.url);
 var glyph=/TV|Entertainment/.test(a.category)?'◉':/Dijital|AI/.test(a.category)?'✳':/Araştırma|Ölçüm/.test(a.category)?'↗':/Yaratıcı/.test(a.category)?'✦':'◎';
 return '<a class="story-cover tone-'+(i%6)+(img?' has-photo':' type-cover')+'" href="#'+esc(a.id)+'" data-target="'+esc(a.id)+'" aria-haspopup="dialog"><div class="cover-top"><span>'+esc(a.region)+'</span><span>'+esc(a.category)+'</span></div>'+
 (img?'<div class="cover-picture"><img src="'+esc(img)+'" alt="" loading="lazy"></div>':'<div class="cover-art" aria-hidden="true"><span>'+glyph+'</span><i></i></div>')+
 '<div class="cover-copy"><h3>'+esc(a.title)+'</h3><p>'+esc(a.summary)+'</p><span class="cover-open">Haberi keşfet <b aria-hidden="true">↗</b></span></div></a>';
}
function render(){var selected=arts.filter(function(a){return (!topic||a.category===topic)&&(!query||[a.title,a.summary,a.impact,a.action,a.category].concat(a.body||[]).join(' ').toLocaleLowerCase('tr').includes(query))});grid.innerHTML=selected.map(function(a){return art(a,arts.indexOf(a))}).join('');document.getElementById('galleryCount').textContent=selected.length+' / '+arts.length+' haber';grid.querySelectorAll('img').forEach(function(img){img.addEventListener('error',function(){var c=this.closest('.story-cover');this.parentElement.remove();c.classList.remove('has-photo');c.classList.add('type-cover','image-unavailable')})})}
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
 if(dialog.open)dialog.close();
 opener=trigger||grid.querySelector('[data-target="'+CSS.escape(id)+'"]');activeId=id;scrollPosition=window.scrollY;
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

// Keep only archive navigation below the gallery; remove the retired panels.
var reading=main.querySelector('.reading-layout'),issueNav=reading.querySelector('.issue-nav');
if(issueNav)reading.before(issueNav);
reading.remove();
window.openMediaStory=function(id){return openStory(id,null)};
var mq=matchMedia('(prefers-reduced-motion: reduce)');
function motion(){main.classList.toggle('motion-off',mq.matches)}
mq.addEventListener('change',motion);motion();

};
})();