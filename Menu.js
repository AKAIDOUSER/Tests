void(function(){
var d=document;

// ========== STYLES ==========
if(!d.querySelector('style[data-menu]')){
  var s=d.createElement('style');
  s.setAttribute('data-menu','true');
  s.textContent='@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap");'+
    '@keyframes spin{to{transform:rotate(360deg)}}'+
    '@keyframes slideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}'+
    '@keyframes slideOut{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(40px)}}'+
    '@keyframes fadeIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}'+
    '@keyframes fadeOut{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(0.9)}}'+
    '@keyframes floatIn{from{opacity:0;transform:scale(0)}to{opacity:1;transform:scale(1)}}';
  d.head.appendChild(s);
}

if(!d.querySelector('link[href*="boxicons"]')){
  var l=d.createElement('link');
  l.href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css';
  l.rel='stylesheet';
  d.head.appendChild(l);
}

// ========== NOTIFICATIONS ==========
var nC=d.createElement('div');
nC.setAttribute('data-notifications','true');
nC.style.cssText='position:fixed;top:16px;right:16px;display:flex;flex-direction:column;gap:6px;z-index:999999;';
d.body.appendChild(nC);

function notify(msg,type,duracao){
  duracao=duracao||5000;
  var n=d.createElement('div');
  n.style.cssText='background:#0d0d0d;border:1px solid #1a1a1a;padding:12px 16px;border-radius:12px;'+
    'box-shadow:0 8px 32px rgba(0,0,0,0.6);display:flex;align-items:center;gap:10px;font-size:12px;'+
    'color:#888;animation:slideIn 0.3s ease-out;font-family:Inter,sans-serif;min-width:260px;';
  var icon=d.createElement('i');icon.style.cssText='font-size:18px;flex-shrink:0;';
  if(type==='success'){icon.className='bx bx-check-circle';icon.style.color='#28c840';n.style.borderColor='#0a1a0a'}
  else if(type==='error'){icon.className='bx bx-error-circle';icon.style.color='#ff4757';n.style.borderColor='#1a0a0a'}
  else{icon.className='bx bx-info-circle';icon.style.color='#febc2e';n.style.borderColor='#1a1a0a'}
  var text=d.createElement('span');text.style.cssText='flex:1;';text.textContent=msg;
  n.appendChild(icon);n.appendChild(text);
  if(nC.firstChild){nC.insertBefore(n,nC.firstChild)}else{nC.appendChild(n)}
  if(nC.children.length>5){var last=nC.lastChild;last.style.animation='slideOut 0.3s ease-in forwards';setTimeout(function(){if(last.parentNode)last.remove()},300)}
  setTimeout(function(){n.style.animation='slideOut 0.3s ease-in forwards';setTimeout(function(){if(n.parentNode)n.remove()},300)},duracao)
}

// ========== UI COMPONENTS ==========
function createToggle(label,checked,onChange){
  var c=d.createElement('div');c.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:8px 0;';
  var l=d.createElement('span');l.style.cssText='font-size:12px;color:#888;font-family:Inter,sans-serif;';l.textContent=label;
  var t=d.createElement('div');t.style.cssText='width:36px;height:20px;border-radius:10px;cursor:pointer;transition:0.3s;position:relative;background:'+(checked?'#fff':'#1a1a1a')+';border:1px solid '+(checked?'#fff':'#2a2a2a')+';';
  var dot=d.createElement('div');dot.style.cssText='width:14px;height:14px;border-radius:50%;position:absolute;top:2px;transition:0.3s;background:'+(checked?'#000':'#555')+';left:'+(checked?'20px':'2px')+';';
  t.appendChild(dot);c.appendChild(l);c.appendChild(t);
  t.addEventListener('click',function(){checked=!checked;t.style.background=checked?'#fff':'#1a1a1a';t.style.borderColor=checked?'#fff':'#2a2a2a';dot.style.background=checked?'#000':'#555';dot.style.left=checked?'20px':'2px';if(onChange)onChange(checked)});
  return c;
}

function createSlider(label,min,max,value,onChange){
  var c=d.createElement('div');c.style.cssText='padding:8px 0;';
  var h=d.createElement('div');h.style.cssText='display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;';
  var l=d.createElement('span');l.style.cssText='font-size:12px;color:#888;font-family:Inter,sans-serif;';l.textContent=label;
  var v=d.createElement('span');v.style.cssText='font-size:11px;color:#555;font-family:Inter,sans-serif;';v.textContent=value;
  h.appendChild(l);h.appendChild(v);
  var s=d.createElement('input');s.type='range';s.min=min;s.max=max;s.value=value;
  s.style.cssText='width:100%;height:4px;appearance:none;background:#1a1a1a;border-radius:2px;outline:none;cursor:pointer;-webkit-appearance:none;';
  var st=d.createElement('style');st.textContent='input[type=range]::-webkit-slider-thumb{appearance:none;width:14px;height:14px;background:#fff;border-radius:50%;cursor:pointer;}';
  c.appendChild(st);s.addEventListener('input',function(){v.textContent=this.value;if(onChange)onChange(parseInt(this.value))});
  c.appendChild(h);c.appendChild(s);return c;
}

// ========== SETTINGS ==========
function loadSettings(){try{return JSON.parse(localStorage.getItem('_menu_settings')||'{}')}catch(e){return{}}}
function saveSettings(s){localStorage.setItem('_menu_settings',JSON.stringify(s))}
var settings=loadSettings();
settings.pasteEnabled=settings.pasteEnabled!==undefined?settings.pasteEnabled:true;
settings.generateEnabled=settings.generateEnabled!==undefined?settings.generateEnabled:false;
settings.typingSpeed=settings.typingSpeed||50;
settings.essayTopic=settings.essayTopic||'Free';
settings.savedAPIs=settings.savedAPIs||[];
settings.selectedAPI=settings.selectedAPI||'';

var aiProviders={chatgpt:{name:'ChatGPT',models:['gpt-4','gpt-4-turbo','gpt-3.5-turbo']},gemini:{name:'Gemini',models:['gemini-pro','gemini-ultra']},deepseek:{name:'DeepSeek',models:['deepseek-chat','deepseek-coder']},mistral:{name:'Mistral',models:['mistral-large','mistral-medium','mistral-small']}};

// ========== FLOATING BUTTON ==========
var floatBtn=d.createElement('div');
floatBtn.style.cssText='position:fixed;bottom:24px;right:24px;z-index:999999;width:48px;height:48px;background:#0d0d0d;border:1px solid #1a1a1a;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,0.6);animation:floatIn 0.4s cubic-bezier(0.34,1.56,0.64,1);transition:0.3s;';
floatBtn.addEventListener('mouseenter',function(){floatBtn.style.borderColor='#444';floatBtn.style.transform='scale(1.05)'});
floatBtn.addEventListener('mouseleave',function(){floatBtn.style.borderColor='#1a1a1a';floatBtn.style.transform='scale(1)'});
var floatIcon=d.createElement('i');floatIcon.className='bx bx-menu';floatIcon.style.cssText='font-size:22px;color:#888;transition:0.2s;';
floatBtn.appendChild(floatIcon);d.body.appendChild(floatBtn);

// ========== OVERLAY ==========
var overlay=d.createElement('div');
overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:999997;backdrop-filter:blur(8px);background:rgba(0,0,0,0.4);display:none;';
overlay.addEventListener('click',function(){closeMenu()});
d.body.appendChild(overlay);

// ========== MENU PANEL ==========
var menuContainer=d.createElement('div');
menuContainer.style.cssText='position:fixed;top:50%;left:50%;z-index:999998;transform:translate(-50%,-50%) scale(0);width:320px;max-height:80vh;overflow-y:auto;background:#0d0d0d;border:1px solid #1a1a1a;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.8);font-family:Inter,sans-serif;padding:20px;transition:0.3s cubic-bezier(0.34,1.56,0.64,1);';

var isDragging=false,offsetX=0,offsetY=0;
menuContainer.addEventListener('mousedown',function(e){if(e.target===menuContainer||e.target.closest('[data-header]')){isDragging=true;var rect=menuContainer.getBoundingClientRect();offsetX=e.clientX-rect.left;offsetY=e.clientY-rect.top;menuContainer.style.transition='none'}});
d.addEventListener('mousemove',function(e){if(isDragging){menuContainer.style.left=(e.clientX-offsetX)+'px';menuContainer.style.top=(e.clientY-offsetY)+'px';menuContainer.style.transform='none'}});
d.addEventListener('mouseup',function(){if(isDragging){isDragging=false;menuContainer.style.transition='0.3s cubic-bezier(0.34,1.56,0.64,1)'}});

var menuOpen=false;
function openMenu(){menuOpen=true;overlay.style.display='block';menuContainer.style.transform='translate(-50%,-50%) scale(1)';menuContainer.style.left='50%';menuContainer.style.top='50%';floatIcon.className='bx bx-x';floatIcon.style.color='#fff'}
function closeMenu(){menuOpen=false;overlay.style.display='none';menuContainer.style.transform='translate(-50%,-50%) scale(0)';floatIcon.className='bx bx-menu';floatIcon.style.color='#888'}
floatBtn.addEventListener('click',function(){menuOpen?closeMenu():openMenu()});

// ========== HEADER ==========
var header=d.createElement('div');
header.setAttribute('data-header','true');
header.style.cssText='display:flex;align-items:center;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #1a1a1a;cursor:grab;';

var dots=d.createElement('div');dots.style.cssText='display:flex;gap:5px;flex-shrink:0;';
['#ff5f57','#febc2e','#28c840'].forEach(function(cl){var dot=d.createElement('div');dot.style.cssText='width:10px;height:10px;border-radius:50%;background:'+cl;dots.appendChild(dot)});

var spacer=d.createElement('div');spacer.style.cssText='flex:1;';

var brand=d.createElement('div');brand.style.cssText='text-align:right;flex-shrink:0;';
var brandText=d.createElement('span');brandText.style.cssText='font-size:14px;font-weight:500;';
var aiPart=d.createElement('span');aiPart.textContent='Ai';aiPart.style.cssText='color:#888;';
var codePart=d.createElement('span');codePart.textContent='Code';codePart.style.cssText='color:#fff;';
brandText.appendChild(aiPart);brandText.appendChild(codePart);
brand.appendChild(brandText);

header.appendChild(dots);header.appendChild(spacer);header.appendChild(brand);
menuContainer.appendChild(header);

// ========== TABS ==========
var tabContainer=d.createElement('div');
tabContainer.style.cssText='display:flex;gap:4px;margin-bottom:16px;background:#111;border-radius:8px;padding:3px;';

function createTab(text,active,onClick){
  var tab=d.createElement('div');tab.textContent=text;
  tab.style.cssText='flex:1;text-align:center;padding:6px 0;font-size:11px;border-radius:6px;cursor:pointer;transition:0.2s;font-family:Inter,sans-serif;color:#666;border:1px solid transparent;';
  if(active){tab.style.color='#fff';tab.style.borderColor='#2a2a2a'}
  tab.addEventListener('click',onClick);return tab;
}

var contentArea=d.createElement('div');contentArea.style.cssText='min-height:200px;';

// ========== TOOLS TAB ==========
function showTools(){
  contentArea.innerHTML='';
  contentArea.appendChild(createToggle('Enable Paste',settings.pasteEnabled,function(v){settings.pasteEnabled=v;saveSettings(settings)}));
  contentArea.appendChild(createToggle('Generate Essay',settings.generateEnabled,function(v){settings.generateEnabled=v;saveSettings(settings)}));
  var tc=d.createElement('div');tc.style.cssText='padding:8px 0;';
  var tl=d.createElement('span');tl.style.cssText='font-size:12px;color:#888;font-family:Inter,sans-serif;display:block;margin-bottom:4px;';tl.textContent='Theme: '+settings.essayTopic;
  var ti=d.createElement('input');ti.type='text';ti.value=settings.essayTopic;ti.placeholder='Essay theme...';
  ti.style.cssText='width:100%;height:36px;background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:0 10px;font-size:12px;color:#999;outline:none;font-family:Inter,sans-serif;transition:0.2s;box-sizing:border-box;';
  ti.addEventListener('focus',function(){ti.style.borderColor='#444'});ti.addEventListener('blur',function(){ti.style.borderColor='#1a1a1a'});
  ti.addEventListener('input',function(){settings.essayTopic=this.value;tl.textContent='Theme: '+this.value;saveSettings(settings)});
  tc.appendChild(tl);tc.appendChild(ti);contentArea.appendChild(tc);
  contentArea.appendChild(createSlider('Typing Speed',10,200,settings.typingSpeed,function(v){settings.typingSpeed=v;saveSettings(settings)}));
}

// ========== API TAB ==========
function showAPI(){
  contentArea.innerHTML='';
  
  // Dropdown de APIs salvas
  if(settings.savedAPIs.length>0){
    var savedLabel=d.createElement('label');savedLabel.style.cssText='font-size:11px;color:#666;display:block;margin-bottom:4px;font-family:Inter,sans-serif;';savedLabel.textContent='Saved APIs';
    contentArea.appendChild(savedLabel);
    
    var savedSelect=d.createElement('select');
    savedSelect.style.cssText='width:100%;height:36px;background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:0 10px;font-size:12px;color:#999;outline:none;font-family:Inter,sans-serif;cursor:pointer;box-sizing:border-box;margin-bottom:8px;';
    var emptyOpt=d.createElement('option');emptyOpt.value='';emptyOpt.textContent='Select saved API...';savedSelect.appendChild(emptyOpt);
    settings.savedAPIs.forEach(function(api,i){
      var o=d.createElement('option');o.value=i;o.textContent=api.name+' - '+aiProviders[api.provider].name+' - '+api.model;
      if(String(i)===String(settings.selectedAPI))o.selected=true;
      savedSelect.appendChild(o);
    });
    savedSelect.addEventListener('change',function(){settings.selectedAPI=this.value;saveSettings(settings)});
    contentArea.appendChild(savedSelect);
    
    if(settings.selectedAPI!==''&&settings.savedAPIs[settings.selectedAPI]){
      var delBtn=d.createElement('button');delBtn.textContent='Remove selected';
      delBtn.style.cssText='width:100%;height:32px;border-radius:8px;font-size:11px;cursor:pointer;font-family:Inter,sans-serif;transition:0.2s;border:1px solid #2a0a0a;background:transparent;color:#ff4757;margin-bottom:12px;';
      delBtn.addEventListener('mouseenter',function(){delBtn.style.borderColor='#ff4757'});
      delBtn.addEventListener('mouseleave',function(){delBtn.style.borderColor='#2a0a0a'});
      delBtn.addEventListener('click',function(){settings.savedAPIs.splice(settings.selectedAPI,1);settings.selectedAPI='';saveSettings(settings);showAPI();notify('API removed','info',2000)});
      contentArea.appendChild(delBtn);
    }
    
    var divider=d.createElement('div');divider.style.cssText='border-top:1px solid #1a1a1a;margin:8px 0;';contentArea.appendChild(divider);
  }
  
  // Adicionar nova API
  var addLabel=d.createElement('label');addLabel.style.cssText='font-size:11px;color:#666;display:block;margin-bottom:4px;font-family:Inter,sans-serif;';addLabel.textContent='Add new API';
  contentArea.appendChild(addLabel);
  
  var nameInput=d.createElement('input');nameInput.type='text';nameInput.placeholder='API Name (e.g. My ChatGPT)';
  nameInput.style.cssText='width:100%;height:36px;background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:0 10px;font-size:12px;color:#999;outline:none;font-family:Inter,sans-serif;transition:0.2s;box-sizing:border-box;margin-bottom:6px;';
  nameInput.addEventListener('focus',function(){nameInput.style.borderColor='#444'});
  nameInput.addEventListener('blur',function(){nameInput.style.borderColor='#1a1a1a'});
  contentArea.appendChild(nameInput);
  
  var apiRow=d.createElement('div');apiRow.style.cssText='display:flex;gap:6px;align-items:flex-end;margin-bottom:6px;';
  var apiInput=d.createElement('input');apiInput.type='password';apiInput.placeholder='API Key';
  apiInput.style.cssText='flex:1;height:36px;background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:0 10px;font-size:12px;color:#999;outline:none;font-family:Inter,sans-serif;transition:0.2s;box-sizing:border-box;';
  apiInput.addEventListener('focus',function(){apiInput.style.borderColor='#444'});
  apiInput.addEventListener('blur',function(){apiInput.style.borderColor='#1a1a1a'});
  
  var pasteBtn=d.createElement('button');
  pasteBtn.style.cssText='width:36px;height:36px;border-radius:8px;cursor:pointer;border:1px solid #2a2a2a;background:transparent;display:flex;align-items:center;justify-content:center;transition:0.2s;flex-shrink:0;';
  pasteBtn.addEventListener('mouseenter',function(){pasteBtn.style.borderColor='#444'});
  pasteBtn.addEventListener('mouseleave',function(){pasteBtn.style.borderColor='#2a2a2a'});
  pasteBtn.addEventListener('click',function(){navigator.clipboard.readText().then(function(t){apiInput.value=t}).catch(function(){notify('Clipboard denied','error',2000)})});
  var pasteIcon=d.createElement('i');pasteIcon.className='bx bx-paste';pasteIcon.style.cssText='font-size:16px;color:#888;';
  pasteBtn.appendChild(pasteIcon);
  apiRow.appendChild(apiInput);apiRow.appendChild(pasteBtn);
  contentArea.appendChild(apiRow);
  
  // Provider dropdown
  var providerSelect=d.createElement('select');
  providerSelect.style.cssText='width:100%;height:36px;background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:0 10px;font-size:12px;color:#999;outline:none;font-family:Inter,sans-serif;cursor:pointer;box-sizing:border-box;margin-bottom:6px;';
  Object.keys(aiProviders).forEach(function(k){var o=d.createElement('option');o.value=k;o.textContent=aiProviders[k].name;providerSelect.appendChild(o)});
  
  var modelSelect=d.createElement('select');
  modelSelect.style.cssText='width:100%;height:36px;background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:0 10px;font-size:12px;color:#999;outline:none;font-family:Inter,sans-serif;cursor:pointer;box-sizing:border-box;margin-bottom:8px;';
  function updateModels(){modelSelect.innerHTML='';var p=aiProviders[providerSelect.value];if(p){p.models.forEach(function(m){var o=d.createElement('option');o.value=m;o.textContent=m;modelSelect.appendChild(o)})}}
  providerSelect.addEventListener('change',updateModels);updateModels();
  
  var provLabel=d.createElement('label');provLabel.style.cssText='font-size:11px;color:#666;display:block;margin-bottom:4px;font-family:Inter,sans-serif;';provLabel.textContent='AI Provider';
  contentArea.appendChild(provLabel);
  contentArea.appendChild(providerSelect);
  
  var modelLabel=d.createElement('label');modelLabel.style.cssText='font-size:11px;color:#666;display:block;margin-bottom:4px;font-family:Inter,sans-serif;';modelLabel.textContent='AI Model';
  contentArea.appendChild(modelLabel);
  contentArea.appendChild(modelSelect);
  
  var addBtn=d.createElement('button');addBtn.textContent='Add API';
  addBtn.style.cssText='width:100%;height:38px;border-radius:10px;font-size:12px;font-weight:500;cursor:pointer;font-family:Inter,sans-serif;transition:0.3s;border:1px solid #2a2a2a;background:transparent;color:#888;';
  addBtn.addEventListener('mouseenter',function(){addBtn.style.borderColor='#444';addBtn.style.color='#bbb'});
  addBtn.addEventListener('mouseleave',function(){addBtn.style.borderColor='#2a2a2a';addBtn.style.color='#888'});
  addBtn.addEventListener('click',function(){
    var name=nameInput.value;var key=apiInput.value;var prov=providerSelect.value;var model=modelSelect.value;
    if(!name||!key){notify('Fill all fields','error',2000);return}
    settings.savedAPIs.push({name:name,key:key,provider:prov,model:model});saveSettings(settings);
    nameInput.value='';apiInput.value='';notify('API saved: '+name,'success',4000);showAPI()
  });
  contentArea.appendChild(addBtn);
}

var toolsTab=createTab('Tools',true,function(){toolsTab.style.color='#fff';toolsTab.style.borderColor='#2a2a2a';apiTab.style.color='#666';apiTab.style.borderColor='transparent';showTools()});
var apiTab=createTab('API',false,function(){apiTab.style.color='#fff';apiTab.style.borderColor='#2a2a2a';toolsTab.style.color='#666';toolsTab.style.borderColor='transparent';showAPI()});

tabContainer.appendChild(toolsTab);tabContainer.appendChild(apiTab);
menuContainer.appendChild(tabContainer);
menuContainer.appendChild(contentArea);
d.body.appendChild(menuContainer);
showTools();
})();
