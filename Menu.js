void(function(){
var d=document;
var fb='https://script-b4955-default-rtdb.firebaseio.com';
var ak='AIzaSyBBtmp2uV5ZlCUqD1tRGDdssfsSHgkYGwY';

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
    '@keyframes menuIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}';
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
nC.style.cssText='position:fixed;top:16px;right:16px;display:flex;flex-direction:column;gap:6px;z-index:99999;';
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
  
  var text=d.createElement('span');
  text.style.cssText='flex:1;';
  text.textContent=msg;
  
  n.appendChild(icon);n.appendChild(text);
  if(nC.firstChild){nC.insertBefore(n,nC.firstChild)}else{nC.appendChild(n)}
  if(nC.children.length>5){var last=nC.lastChild;last.style.animation='slideOut 0.3s ease-in forwards';setTimeout(function(){if(last.parentNode)last.remove()},300)}
  setTimeout(function(){n.style.animation='slideOut 0.3s ease-in forwards';setTimeout(function(){if(n.parentNode)n.remove()},300)},duracao)
}

// ========== DIALOG ==========
function dialog(title,msg,buttons,iconName,iconColor){
  return new Promise(function(resolve){
    var overlay=d.createElement('div');
    overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:99998;'+
      'backdrop-filter:blur(8px);background:rgba(0,0,0,0.4);animation:fadeIn 0.4s ease-out;';
    
    var box=d.createElement('div');
    box.style.cssText='width:340px;padding:32px 28px 28px;position:fixed;top:50%;left:50%;z-index:99999;'+
      'font-family:Inter,sans-serif;background:#0d0d0d;border-radius:20px;border:1px solid #1a1a1a;'+
      'box-shadow:0 20px 60px rgba(0,0,0,0.8);transform:translate(-50%,-50%);text-align:center;'+
      'animation:fadeIn 0.5s cubic-bezier(0.34,1.56,0.64,1);';
    
    if(iconName){
      var iconEl=d.createElement('i');iconEl.className='bx '+iconName;
      iconEl.style.cssText='font-size:44px;color:'+(iconColor||'#ccc')+';margin-bottom:18px;display:block;';
      box.appendChild(iconEl);
    }
    
    var titleEl=d.createElement('div');titleEl.style.cssText='font-size:16px;font-weight:500;color:#ccc;margin-bottom:10px;';titleEl.textContent=title;
    var msgEl=d.createElement('div');msgEl.style.cssText='font-size:12px;color:#666;line-height:1.7;margin-bottom:24px;white-space:pre-line;';msgEl.textContent=msg;
    var btnC=d.createElement('div');btnC.style.cssText='display:flex;gap:8px;justify-content:center;';
    
    box.appendChild(titleEl);box.appendChild(msgEl);box.appendChild(btnC);
    overlay.appendChild(box);d.body.appendChild(overlay);
    
    buttons.forEach(function(b,i){
      var btn=d.createElement('button');btn.textContent=b.text;
      btn.style.cssText='height:40px;padding:0 28px;border-radius:10px;font-size:12px;font-weight:500;cursor:pointer;font-family:Inter,sans-serif;transition:0.3s;border:1px solid #2a2a2a;background:'+(b.primary?'#fff':'transparent')+';color:'+(b.primary?'#000':'#888')+';';
      btn.addEventListener('mouseenter',function(){if(!b.primary){btn.style.borderColor='#444';btn.style.color='#bbb'}});
      btn.addEventListener('mouseleave',function(){if(!b.primary){btn.style.borderColor='#2a2a2a';btn.style.color='#888'}});
      btn.addEventListener('click',function(){overlay.style.animation='fadeOut 0.3s ease-in forwards';box.style.animation='fadeOut 0.3s ease-in forwards';setTimeout(function(){overlay.remove()},300);resolve(b.value||i)});
      btnC.appendChild(btn);
    });
  });
}

// ========== UI COMPONENTS ==========
function createLabel(text){var l=d.createElement('label');l.style.cssText='font-size:11px;color:#666;display:block;margin-bottom:6px;font-family:Inter,sans-serif;';l.textContent=text;return l}

function createParagraph(text){var p=d.createElement('p');p.style.cssText='font-size:11px;color:#555;margin:8px 0;font-family:Inter,sans-serif;line-height:1.5;';p.textContent=text;return p}

function createToggle(label,checked,onChange){
  var container=d.createElement('div');
  container.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:6px 0;';
  
  var lbl=d.createElement('span');lbl.style.cssText='font-size:12px;color:#888;font-family:Inter,sans-serif;';lbl.textContent=label;
  
  var toggle=d.createElement('div');
  toggle.style.cssText='width:36px;height:20px;border-radius:10px;cursor:pointer;transition:0.3s;position:relative;'+
    'background:'+(checked?'#fff':'#1a1a1a')+';border:1px solid '+(checked?'#fff':'#2a2a2a')+';';
  
  var dot=d.createElement('div');
  dot.style.cssText='width:14px;height:14px;border-radius:50%;position:absolute;top:2px;transition:0.3s;'+
    'background:'+(checked?'#000':'#555')+';left:'+(checked?'20px':'2px')+';';
  
  toggle.appendChild(dot);
  container.appendChild(lbl);container.appendChild(toggle);
  
  toggle.addEventListener('click',function(){
    checked=!checked;
    toggle.style.background=checked?'#fff':'#1a1a1a';
    toggle.style.borderColor=checked?'#fff':'#2a2a2a';
    dot.style.background=checked?'#000':'#555';
    dot.style.left=checked?'20px':'2px';
    if(onChange)onChange(checked);
  });
  
  return container;
}

function createSlider(label,min,max,value,onChange){
  var container=d.createElement('div');container.style.cssText='padding:6px 0;';
  var header=d.createElement('div');header.style.cssText='display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;';
  
  var lbl=d.createElement('span');lbl.style.cssText='font-size:12px;color:#888;font-family:Inter,sans-serif;';lbl.textContent=label;
  var val=d.createElement('span');val.style.cssText='font-size:11px;color:#555;font-family:Inter,sans-serif;';val.textContent=value;
  
  header.appendChild(lbl);header.appendChild(val);
  
  var slider=d.createElement('input');slider.type='range';slider.min=min;slider.max=max;slider.value=value;
  slider.style.cssText='width:100%;height:4px;appearance:none;background:#1a1a1a;border-radius:2px;outline:none;cursor:pointer;'+
    '-webkit-appearance:none;';
  
  var styleEl=d.createElement('style');
  styleEl.textContent='input[type=range]::-webkit-slider-thumb{appearance:none;width:14px;height:14px;background:#fff;border-radius:50%;cursor:pointer;}';
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
  input.addEventListener('input',function(){if(onChange)onChange(this.value)});
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

// ========== SETTINGS STORAGE ==========
function loadSettings(){
  try{return JSON.parse(localStorage.getItem('_menu_settings')||'{}')}catch(e){return{}}
}
function saveSettings(s){localStorage.setItem('_menu_settings',JSON.stringify(s))}

var settings=loadSettings();
settings.pasteEnabled=settings.pasteEnabled!==undefined?settings.pasteEnabled:true;
settings.generateEnabled=settings.generateEnabled!==undefined?settings.generateEnabled:false;
settings.typingSpeed=settings.typingSpeed||50;
settings.displayName=settings.displayName||'';
settings.essayTopic=settings.essayTopic||'free';

// ========== CREATE MENU PANEL ==========
var menuContainer=d.createElement('div');
menuContainer.setAttribute('data-menu-panel','true');
menuContainer.style.cssText='position:fixed;top:50%;right:20px;z-index:99997;transform:translateY(-50%);'+
  'width:300px;max-height:80vh;overflow-y:auto;background:#0d0d0d;border:1px solid #1a1a1a;border-radius:16px;'+
  'box-shadow:0 20px 60px rgba(0,0,0,0.8);font-family:Inter,sans-serif;padding:20px;animation:menuIn 0.4s ease-out;';

var menuHeader=d.createElement('div');
menuHeader.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #1a1a1a;';

var menuTitle=d.createElement('div');
menuTitle.style.cssText='font-size:14px;font-weight:500;color:#ccc;display:flex;align-items:center;gap:8px;';

var menuIcon=d.createElement('i');
menuIcon.className='bx bx-cog';
menuIcon.style.cssText='font-size:18px;color:#888;';
menuTitle.appendChild(menuIcon);
menuTitle.appendChild(d.createTextNode('Menu'));

var closeBtn=d.createElement('i');
closeBtn.className='bx bx-x';
closeBtn.style.cssText='font-size:20px;color:#555;cursor:pointer;transition:0.2s;';
closeBtn.addEventListener('mouseenter',function(){closeBtn.style.color='#fff'});
closeBtn.addEventListener('mouseleave',function(){closeBtn.style.color='#555'});
closeBtn.addEventListener('click',function(){menuContainer.remove()});

menuHeader.appendChild(menuTitle);menuHeader.appendChild(closeBtn);
menuContainer.appendChild(menuHeader);

// ========== TABS ==========
var tabContainer=d.createElement('div');
tabContainer.style.cssText='display:flex;gap:4px;margin-bottom:16px;background:#111;border-radius:8px;padding:3px;';

function createTab(text,active,onClick){
  var tab=d.createElement('div');
  tab.textContent=text;
  tab.style.cssText='flex:1;text-align:center;padding:6px 0;font-size:11px;border-radius:6px;cursor:pointer;transition:0.2s;font-family:Inter,sans-serif;'+
    'background:'+(active?'#fff':'transparent')+';color:'+(active?'#000':'#666')+';';
  tab.addEventListener('click',onClick);
  return tab;
}

var contentArea=d.createElement('div');
contentArea.style.cssText='min-height:200px;';

function showTools(){
  contentArea.innerHTML='';
  contentArea.appendChild(createToggle('Enable Paste',settings.pasteEnabled,function(v){settings.pasteEnabled=v;saveSettings(settings);notify('Paste '+(v?'enabled':'disabled'),'success',2000)}));
  contentArea.appendChild(createParagraph('Allows pasting text into the essay editor.'));
  
  contentArea.appendChild(createToggle('Generate Essay',settings.generateEnabled,function(v){settings.generateEnabled=v;saveSettings(settings);notify('Generator '+(v?'enabled':'disabled'),'success',2000)}));
  contentArea.appendChild(createParagraph('Automatically generates essay content.'));
  
  contentArea.appendChild(createSlider('Typing Speed',10,200,settings.typingSpeed,function(v){settings.typingSpeed=v;saveSettings(settings)}));
  contentArea.appendChild(createParagraph('Characters per second when typing.'));
  
  contentArea.appendChild(createDropdown('Essay Topic',[{label:'Free Topic',value:'free'},{label:'Narrative',value:'narrative'},{label:'Descriptive',value:'descriptive'},{label:'Argumentative',value:'argumentative'}],settings.essayTopic,function(v){settings.essayTopic=v;saveSettings(settings)}));
}

function showVisual(){
  contentArea.innerHTML='';
  contentArea.appendChild(createInput('Display Name','Enter your name',settings.displayName,function(v){settings.displayName=v;saveSettings(settings)}));
  contentArea.appendChild(createParagraph('This name will appear on your essays.'));
  contentArea.appendChild(createButton('Save Name',true,function(){saveSettings(settings);notify('Name saved!','success',3000)}));
  contentArea.appendChild(createButton('Reset Settings',false,function(){localStorage.removeItem('_menu_settings');settings=loadSettings();showTools();notify('Settings reset','info',3000)}));
}

var toolsTab=createTab('Tools',true,function(){toolsTab.style.background='#fff';toolsTab.style.color='#000';visualTab.style.background='transparent';visualTab.style.color='#666';showTools()});
var visualTab=createTab('Visual',false,function(){visualTab.style.background='#fff';visualTab.style.color='#000';toolsTab.style.background='transparent';toolsTab.style.color='#666';showVisual()});

tabContainer.appendChild(toolsTab);tabContainer.appendChild(visualTab);
menuContainer.appendChild(tabContainer);
menuContainer.appendChild(contentArea);

d.body.appendChild(menuContainer);
showTools();

notify('Menu loaded','success',3000);
})();
