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
    '@keyframes fadeIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}'+
    '@keyframes fadeOut{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(0.92)}}'+
    '@keyframes menuIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}'+
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
  
  var icon=d.createElement('i');
  icon.style.cssText='font-size:18px;flex-shrink:0;';
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
function createLabel(text){var l=d.createElement('label');l.style.cssText='font-size:11px;color:#666;display:block;margin-bottom:4px;font-family:Inter,sans-serif;';l.textContent=text;return l}

function createToggle(label,checked,onChange){
  var container=d.createElement('div');
  container.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:8px 0;';
  var lbl=d.createElement('span');lbl.style.cssText='font-size:12px;color:#888;font-family:Inter,sans-serif;';lbl.textContent=label;
  var toggle=d.createElement('div');
  toggle.style.cssText='width:36px;height:20px;border-radius:10px;cursor:pointer;transition:0.3s;position:relative;background:'+(checked?'#fff':'#1a1a1a')+';border:1px solid '+(checked?'#fff':'#2a2a2a')+';';
  var dot=d.createElement('div');
  dot.style.cssText='width:14px;height:14px;border-radius:50%;position:absolute;top:2px;transition:0.3s;background:'+(checked?'#000':'#555')+';left:'+(checked?'20px':'2px')+';';
  toggle.appendChild(dot);
  container.appendChild(lbl);container.appendChild(toggle);
  toggle.addEventListener('click',function(){
    checked=!checked;toggle.style.background=checked?'#fff':'#1a1a1a';toggle.style.borderColor=checked?'#fff':'#2a2a2a';
    dot.style.background=checked?'#000':'#555';dot.style.left=checked?'20px':'2px';
    if(onChange)onChange(checked);
  });
  return container;
}

function createSlider(label,min,max,value,onChange){
  var container=d.createElement('div');container.style.cssText='padding:8px 0;';
  var header=d.createElement('div');header.style.cssText='display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;';
  var lbl=d.createElement('span');lbl.style.cssText='font-size:12px;color:#888;font-family:Inter,sans-serif;';lbl.textContent=label;
  var val=d.createElement('span');val.style.cssText='font-size:11px;color:#555;font-family:Inter,sans-serif;';val.textContent=value;
  header.appendChild(lbl);header.appendChild(val);
  var slider=d.createElement('input');slider.type='range';slider.min=min;slider.max=max;slider.value=value;
  slider.style.cssText='width:100%;height:4px;appearance:none;background:#1a1a1a;border-radius:2px;outline:none;cursor:pointer;-webkit-appearance:none;';
  var styleEl=d.createElement('style');styleEl.textContent='input[type=range]::-webkit-slider-thumb{appearance:none;width:14px;height:14px;background:#fff;border-radius:50%;cursor:pointer;}';
  container.appendChild(styleEl);
  slider.addEventListener('input',function(){val.textContent=this.value;if(onChange)onChange(parseInt(this.value))});
  container.appendChild(header);container.appendChild(slider);
  return container;
}

function createInput(label,placeholder,value,onChange){
  var container=d.createElement('div');container.style.cssText='padding:6px 0;';
  var lbl=d.createElement('label');lbl.style.cssText='font-size:11px;color:#666;display:block;margin-bottom:4px;font-family:Inter,sans-serif;';lbl.textContent=label;
  var input=d.createElement('input');input.type='text';input.placeholder=placeholder||'';input.value=value||'';
  input.style.cssText='width:100%;height:36px;background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:0 10px;font-size:12px;color:#999;outline:none;font-family:Inter,sans-serif;transition:0.2s;box-sizing:border-box;';
  input.addEventListener('focus',function(){input.style.borderColor='#444'});
  input.addEventListener('blur',function(){input.style.borderColor='#1a1a1a'});
  if(onChange)input.addEventListener('input',function(){onChange(this.value)});
  container.appendChild(lbl);container.appendChild(input);
  return container;
}

function createDropdown(label,options,selected,onChange){
  var container=d.createElement('div');container.style.cssText='padding:6px 0;';
  var lbl=d.createElement('label');lbl.style.cssText='font-size:11px;color:#666;display:block;margin-bottom:4px;font-family:Inter,sans-serif;';lbl.textContent=label;
  var select=d.createElement('select');
  select.style.cssText='width:100%;height:36px;background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:0 10px;font-size:12px;color:#999;outline:none;font-family:Inter,sans-serif;cursor:pointer;box-sizing:border-box;';
  options.forEach(function(opt){var o=d.createElement('option');o.value=opt.value;o.textContent=opt.label;if(opt.value===selected)o.selected=true;select.appendChild(o)});
  select.addEventListener('change',function(){if(onChange)onChange(this.value)});
  container.appendChild(lbl);container.appendChild(select);
  return container;
}

function createButton(text,primary,onClick){
  var btn=d.createElement('button');btn.textContent=text;
  btn.style.cssText='width:100%;height:38px;border-radius:10px;font-size:12px;font-weight:500;cursor:pointer;font-family:Inter,sans-serif;transition:0.3s;border:1px solid #2a2a2a;background:'+(primary?'#fff':'transparent')+';color:'+(primary?'#000':'#888')+';margin-top:4px;';
  btn.addEventListener('mouseenter',function(){if(!primary){btn.style.borderColor='#444';btn.style.color='#bbb'}});
  btn.addEventListener('mouseleave',function(){if(!primary){btn.style.borderColor='#2a2a2a';btn.style.color='#888'}});
  btn.addEventListener('click',onClick);
  return btn;
}

// ========== COLOR PICKER ==========
function createColorPicker(label,currentColor,onChange){
  var container=d.createElement('div');container.style.cssText='padding:8px 0;';
  var lbl=d.createElement('label');lbl.style.cssText='font-size:11px;color:#666;display:block;margin-bottom:6px;font-family:Inter,sans-serif;';lbl.textContent=label;
  var picker=d.createElement('input');picker.type='color';picker.value=currentColor||'#ffffff';
  picker.style.cssText='width:100%;height:32px;border:none;background:transparent;cursor:pointer;border-radius:6px;';
  picker.addEventListener('input',function(){if(onChange)onChange(this.value)});
  container.appendChild(lbl);container.appendChild(picker);
  return container;
}

// ========== SETTINGS ==========
function loadSettings(){
  try{return JSON.parse(localStorage.getItem('_menu_settings')||'{}')}catch(e){return{}}
}
function saveSettings(s){localStorage.setItem('_menu_settings',JSON.stringify(s))}

var settings=loadSettings();
settings.pasteEnabled=settings.pasteEnabled!==undefined?settings.pasteEnabled:true;
settings.generateEnabled=settings.generateEnabled!==undefined?settings.generateEnabled:false;
settings.typingSpeed=settings.typingSpeed||50;
settings.essayTopic=settings.essayTopic||'Free';
settings.apiKey=settings.apiKey||'';
settings.aiProvider=settings.aiProvider||'chatgpt';
settings.aiModel=settings.aiModel||'';
settings.accentColor=settings.accentColor||'#ffffff';
settings.darkMode=settings.darkMode!==undefined?settings.darkMode:true;

// ========== FLOATING BUTTON ==========
var floatBtn=d.createElement('div');
floatBtn.setAttribute('data-float-btn','true');
floatBtn.style.cssText='position:fixed;bottom:24px;right:24px;z-index:999999;width:48px;height:48px;'+
  'background:#0d0d0d;border:1px solid #1a1a1a;border-radius:50%;display:flex;align-items:center;justify-content:center;'+
  'cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,0.6);animation:floatIn 0.4s cubic-bezier(0.34,1.56,0.64,1);transition:0.3s;';
floatBtn.addEventListener('mouseenter',function(){floatBtn.style.borderColor='#444';floatBtn.style.transform='scale(1.05)'});
floatBtn.addEventListener('mouseleave',function(){floatBtn.style.borderColor='#1a1a1a';floatBtn.style.transform='scale(1)'});

var floatIcon=d.createElement('i');
floatIcon.className='bx bx-menu';
floatIcon.style.cssText='font-size:22px;color:#888;transition:0.2s;';
floatBtn.appendChild(floatIcon);
d.body.appendChild(floatBtn);

// ========== MENU PANEL ==========
var menuContainer=d.createElement('div');
menuContainer.setAttribute('data-menu-panel','true');
menuContainer.style.cssText='position:fixed;top:50%;right:-320px;z-index:999998;transform:translateY(-50%);'+
  'width:300px;max-height:80vh;overflow-y:auto;background:#0d0d0d;border:1px solid #1a1a1a;border-radius:16px;'+
  'box-shadow:0 20px 60px rgba(0,0,0,0.8);font-family:Inter,sans-serif;padding:20px;transition:0.4s cubic-bezier(0.34,1.56,0.64,1);';

var menuOpen=false;
floatBtn.addEventListener('click',function(){
  menuOpen=!menuOpen;
  if(menuOpen){
    menuContainer.style.right='20px';
    floatIcon.className='bx bx-x';
    floatIcon.style.color='#fff';
  }else{
    menuContainer.style.right='-320px';
    floatIcon.className='bx bx-menu';
    floatIcon.style.color='#888';
  }
});

// ========== HEADER ==========
var menuHeader=d.createElement('div');
menuHeader.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #1a1a1a;';
var menuTitle=d.createElement('div');
menuTitle.style.cssText='font-size:14px;font-weight:500;color:#ccc;display:flex;align-items:center;gap:8px;';
var menuIcon=d.createElement('i');menuIcon.className='bx bx-cog';menuIcon.style.cssText='font-size:18px;color:#888;';
menuTitle.appendChild(menuIcon);menuTitle.appendChild(d.createTextNode('Settings'));
menuHeader.appendChild(menuTitle);
menuContainer.appendChild(menuHeader);

// ========== TABS ==========
var tabContainer=d.createElement('div');
tabContainer.style.cssText='display:flex;gap:4px;margin-bottom:16px;background:#111;border-radius:8px;padding:3px;';
function createTab(text,active,onClick){
  var tab=d.createElement('div');tab.textContent=text;
  tab.style.cssText='flex:1;text-align:center;padding:6px 0;font-size:11px;border-radius:6px;cursor:pointer;transition:0.2s;font-family:Inter,sans-serif;background:'+(active?'#fff':'transparent')+';color:'+(active?'#000':'#666')+';';
  tab.addEventListener('click',onClick);return tab;
}

var contentArea=d.createElement('div');contentArea.style.cssText='min-height:200px;';

// ========== TOOLS TAB ==========
function showTools(){
  contentArea.innerHTML='';
  contentArea.appendChild(createToggle('Enable Paste',settings.pasteEnabled,function(v){settings.pasteEnabled=v;saveSettings(settings)}));
  contentArea.appendChild(createToggle('Generate Essay',settings.generateEnabled,function(v){settings.generateEnabled=v;saveSettings(settings)}));
  
  var topicContainer=d.createElement('div');topicContainer.style.cssText='padding:8px 0;';
  var topicLabel=d.createElement('span');topicLabel.style.cssText='font-size:12px;color:#888;font-family:Inter,sans-serif;display:block;margin-bottom:4px;';
  topicLabel.textContent='Theme: '+settings.essayTopic;
  var topicInput=d.createElement('input');topicInput.type='text';topicInput.value=settings.essayTopic;topicInput.placeholder='Essay theme...';
  topicInput.style.cssText='width:100%;height:36px;background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:0 10px;font-size:12px;color:#999;outline:none;font-family:Inter,sans-serif;transition:0.2s;box-sizing:border-box;';
  topicInput.addEventListener('focus',function(){topicInput.style.borderColor='#444'});
  topicInput.addEventListener('blur',function(){topicInput.style.borderColor='#1a1a1a'});
  topicInput.addEventListener('input',function(){settings.essayTopic=this.value;topicLabel.textContent='Theme: '+this.value;saveSettings(settings)});
  topicContainer.appendChild(topicLabel);topicContainer.appendChild(topicInput);
  contentArea.appendChild(topicContainer);
  
  contentArea.appendChild(createSlider('Typing Speed',10,200,settings.typingSpeed,function(v){settings.typingSpeed=v;saveSettings(settings)}));
}

// ========== CONFIG TAB ==========
var aiProviders={
  chatgpt:{name:'ChatGPT',models:['gpt-4','gpt-4-turbo','gpt-3.5-turbo']},
  gemini:{name:'Gemini',models:['gemini-pro','gemini-ultra']},
  deepseek:{name:'DeepSeek',models:['deepseek-chat','deepseek-coder']},
  mistral:{name:'Mistral',models:['mistral-large','mistral-medium','mistral-small']}
};

function updateModelDropdown(){
  var provider=aiProviders[settings.aiProvider];
  if(!provider)return;
  modelSelect.innerHTML='';
  provider.models.forEach(function(m){
    var o=d.createElement('option');o.value=m;o.textContent=m;if(m===settings.aiModel)o.selected=true;
    modelSelect.appendChild(o);
  });
}

function showConfig(){
  contentArea.innerHTML='';
  
  var apiContainer=d.createElement('div');apiContainer.style.cssText='padding:6px 0;display:flex;gap:6px;align-items:flex-end;';
  var apiInput=d.createElement('input');apiInput.type='password';apiInput.placeholder='API Key';apiInput.value=settings.apiKey||'';
  apiInput.style.cssText='flex:1;height:36px;background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:0 10px;font-size:12px;color:#999;outline:none;font-family:Inter,sans-serif;transition:0.2s;box-sizing:border-box;';
  apiInput.addEventListener('focus',function(){apiInput.style.borderColor='#444'});
  apiInput.addEventListener('blur',function(){apiInput.style.borderColor='#1a1a1a'});
  
  var pasteBtn=d.createElement('button');pasteBtn.textContent='Paste';
  pasteBtn.style.cssText='height:36px;padding:0 14px;border-radius:8px;font-size:11px;font-weight:500;cursor:pointer;font-family:Inter,sans-serif;transition:0.2s;border:1px solid #2a2a2a;background:transparent;color:#888;white-space:nowrap;';
  pasteBtn.addEventListener('mouseenter',function(){pasteBtn.style.borderColor='#444';pasteBtn.style.color='#bbb'});
  pasteBtn.addEventListener('mouseleave',function(){pasteBtn.style.borderColor='#2a2a2a';pasteBtn.style.color='#888'});
  pasteBtn.addEventListener('click',function(){
    navigator.clipboard.readText().then(function(t){apiInput.value=t;settings.apiKey=t;saveSettings(settings);notify('API Key pasted!','success',2000)}).catch(function(){notify('Clipboard access denied','error',3000)});
  });
  
  apiContainer.appendChild(apiInput);apiContainer.appendChild(pasteBtn);
  contentArea.appendChild(createLabel('API Key'));
  contentArea.appendChild(apiContainer);
  
  var providerSelect=d.createElement('select');
  providerSelect.style.cssText='width:100%;height:36px;background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:0 10px;font-size:12px;color:#999;outline:none;font-family:Inter,sans-serif;cursor:pointer;box-sizing:border-box;margin-top:4px;';
  Object.keys(aiProviders).forEach(function(k){
    var o=d.createElement('option');o.value=k;o.textContent=aiProviders[k].name;if(k===settings.aiProvider)o.selected=true;
    providerSelect.appendChild(o);
  });
  providerSelect.addEventListener('change',function(){settings.aiProvider=this.value;updateModelDropdown();saveSettings(settings)});
  
  contentArea.appendChild(createLabel('AI Provider'));
  contentArea.appendChild(providerSelect);
  
  var modelSelect=d.createElement('select');
  modelSelect.style.cssText='width:100%;height:36px;background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:0 10px;font-size:12px;color:#999;outline:none;font-family:Inter,sans-serif;cursor:pointer;box-sizing:border-box;margin-top:4px;';
  modelSelect.addEventListener('change',function(){settings.aiModel=this.value;saveSettings(settings)});
  
  contentArea.appendChild(createLabel('AI Model'));
  contentArea.appendChild(modelSelect);
  updateModelDropdown();
  
  contentArea.appendChild(createColorPicker('Accent Color',settings.accentColor,function(v){settings.accentColor=v;saveSettings(settings);notify('Color updated','success',2000)}));
  contentArea.appendChild(createToggle('Dark Mode',settings.darkMode,function(v){settings.darkMode=v;saveSettings(settings);applyTheme()}));
  contentArea.appendChild(createButton('Save Settings',true,function(){saveSettings(settings);notify('Settings saved!','success',3000)}));
}

// ========== THEME ==========
function applyTheme(){
  if(settings.darkMode){
    d.body.style.cssText='background:#050505!important;color:#ccc!important';
  }else{
    d.body.style.cssText='background:#f5f5f5!important;color:#222!important';
  }
}

var toolsTab=createTab('Tools',true,function(){
  toolsTab.style.background='#fff';toolsTab.style.color='#000';
  configTab.style.background='transparent';configTab.style.color='#666';
  showTools();
});
var configTab=createTab('Config',false,function(){
  configTab.style.background='#fff';configTab.style.color='#000';
  toolsTab.style.background='transparent';toolsTab.style.color='#666';
  showConfig();
});

tabContainer.appendChild(toolsTab);tabContainer.appendChild(configTab);
menuContainer.appendChild(tabContainer);
menuContainer.appendChild(contentArea);

d.body.appendChild(menuContainer);
showTools();
applyTheme();
})();
