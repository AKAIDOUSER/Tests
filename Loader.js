void(function(){
var d=document;
var fb='https://script-b4955-default-rtdb.firebaseio.com';
var ak='AIzaSyBBtmp2uV5ZlCUqD1tRGDdssfsSHgkYGwY';
if(!d.querySelector('style[data-menu]')){
var s=d.createElement('style');s.setAttribute('data-menu','true');
s.textContent='@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap");@keyframes spin{to{transform:rotate(360deg)}}@keyframes slideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}@keyframes slideOut{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(40px)}}@keyframes fadeIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}@keyframes floatIn{from{opacity:0;transform:scale(0)}to{opacity:1;transform:scale(1)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}';
d.head.appendChild(s);
}
if(!d.querySelector('link[href*="boxicons"]')){
var l=d.createElement('link');l.href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css';l.rel='stylesheet';d.head.appendChild(l);
}
var nC=d.createElement('div');nC.setAttribute('data-notifications','true');
nC.style.cssText='position:fixed;top:16px;right:16px;display:flex;flex-direction:column;gap:6px;z-index:999999;';
d.body.appendChild(nC);
function notify(msg,type,duracao){
duracao=duracao||5000;var n=d.createElement('div');
n.style.cssText='background:#0d0d0d;border:1px solid #1a1a1a;padding:12px 16px;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.6);display:flex;align-items:center;gap:10px;font-size:12px;color:#888;animation:slideIn 0.3s ease-out;font-family:Inter,sans-serif;min-width:260px;';
var icon=d.createElement('i');icon.style.cssText='font-size:18px;flex-shrink:0;';
if(type==='success'){icon.className='bx bx-check-circle';icon.style.color='#28c840';n.style.borderColor='#0a1a0a'}
else if(type==='error'){icon.className='bx bx-error-circle';icon.style.color='#ff4757';n.style.borderColor='#1a0a0a'}
else{icon.className='bx bx-info-circle';icon.style.color='#febc2e';n.style.borderColor='#1a1a0a'}
var text=d.createElement('span');text.style.cssText='flex:1;';text.textContent=msg;n.appendChild(icon);n.appendChild(text);
if(nC.firstChild){nC.insertBefore(n,nC.firstChild)}else{nC.appendChild(n)}
if(nC.children.length>5){var last=nC.lastChild;last.style.animation='slideOut 0.3s ease-in forwards';setTimeout(function(){if(last.parentNode)last.remove()},300)}
setTimeout(function(){n.style.animation='slideOut 0.3s ease-in forwards';setTimeout(function(){if(n.parentNode)n.remove()},300)},duracao)
}
function removerLibras(){
var els=d.querySelectorAll('img.vp-access-button, img.vp-pop-up, [class*="vp-"], [class*="vlibras"], [class*="libras"], div[class*="access-button"], div[class*="vp-"]');
els.forEach(function(el){el.remove()});
}

// Executa antes de tudo
removerLibras();

// E coloca um observer pra remover se aparecer depois
var observer=new MutationObserver(function(mutations){
mutations.forEach(function(mutation){
mutation.addedNodes.forEach(function(node){
if(node.nodeType===1){
if(node.tagName==='IMG'&&(node.classList.contains('vp-access-button')||node.classList.contains('vp-pop-up'))){node.remove()}
if(node.querySelectorAll){var vp=node.querySelectorAll('img.vp-access-button, img.vp-pop-up, [class*="vp-"], [class*="vlibras"]');vp.forEach(function(el){el.remove()})}
}
});
});
});
observer.observe(d.body,{childList:true,subtree:true});
  
function dialog(title,msg,buttons,iconName,iconColor,persistent){
return new Promise(function(resolve){
var overlay=d.createElement('div');overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:999998;backdrop-filter:blur(8px);background:rgba(0,0,0,0.4);animation:fadeIn 0.4s ease-out;';
var box=d.createElement('div');box.style.cssText='width:340px;padding:32px 28px 28px;position:fixed;top:50%;left:50%;z-index:999999;font-family:Inter,sans-serif;background:#0d0d0d;border-radius:20px;border:1px solid #1a1a1a;box-shadow:0 20px 60px rgba(0,0,0,0.8);transform:translate(-50%,-50%);text-align:center;animation:fadeIn 0.5s cubic-bezier(0.34,1.56,0.64,1);';
if(iconName){var iconEl=d.createElement('i');iconEl.className='bx '+iconName;iconEl.style.cssText='font-size:44px;color:'+(iconColor||'#ccc')+';margin-bottom:18px;display:block;';box.appendChild(iconEl)}
var titleEl=d.createElement('div');titleEl.style.cssText='font-size:16px;font-weight:500;color:#ccc;margin-bottom:10px;';titleEl.textContent=title;
var msgEl=d.createElement('div');msgEl.style.cssText='font-size:12px;color:#666;line-height:1.7;margin-bottom:24px;white-space:pre-line;';msgEl.textContent=msg;
box.appendChild(titleEl);box.appendChild(msgEl);
if(buttons&&buttons.length>0){
var btnC=d.createElement('div');btnC.style.cssText='display:flex;gap:8px;justify-content:center;';
buttons.forEach(function(b,i){var btn=d.createElement('button');btn.textContent=b.text;btn.style.cssText='height:38px;padding:0 24px;border-radius:10px;font-size:12px;font-weight:500;cursor:pointer;font-family:Inter,sans-serif;transition:0.3s;border:1px solid #2a2a2a;background:transparent;color:#888;';btn.addEventListener('mouseenter',function(){btn.style.borderColor='#444';btn.style.color='#bbb'});btn.addEventListener('mouseleave',function(){btn.style.borderColor='#2a2a2a';btn.style.color='#888'});btn.addEventListener('click',function(){overlay.remove();resolve(b.value||i)});btnC.appendChild(btn)});
box.appendChild(btnC);
}else if(!persistent){setTimeout(function(){overlay.remove();resolve()},3000)}
overlay.appendChild(box);d.body.appendChild(overlay);
})
}
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
h.appendChild(l);h.appendChild(v);var s=d.createElement('input');s.type='range';s.min=min;s.max=max;s.value=value;
s.style.cssText='width:100%;height:4px;appearance:none;background:#1a1a1a;border-radius:2px;outline:none;cursor:pointer;-webkit-appearance:none;';
var st=d.createElement('style');st.textContent='input[type=range]::-webkit-slider-thumb{appearance:none;width:14px;height:14px;background:#fff;border-radius:50%;cursor:pointer;}';
c.appendChild(st);s.addEventListener('input',function(){v.textContent=this.value;if(onChange)onChange(parseInt(this.value))});
c.appendChild(h);c.appendChild(s);return c;
}
var userKey=null,userData=null;
var aiProviders={chatgpt:'ChatGPT',gemini:'Gemini',deepseek:'DeepSeek',mistral:'Mistral'};
var aiEndpoints={chatgpt:'https://api.openai.com/v1/chat/completions',gemini:'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=',deepseek:'https://api.deepseek.com/v1/chat/completions',mistral:'https://api.mistral.ai/v1/chat/completions'};
var cachedEssay=null,essayTheme='',propostaData=null;
var typingActive=false,currentTypingTimeout=null;
var essayMode='normal';
var currentPasteEnabled=false,currentGenerateEnabled=false;
var currentTab='tools';
var pasteForceFn=null;
var progressBar=null;

function enablePaste(){if(pasteForceFn)return;pasteForceFn=function(e){e.stopImmediatePropagation();return true};['paste','copy','cut'].forEach(function(ev){d.addEventListener(ev,pasteForceFn,true)})}
function disablePaste(){if(!pasteForceFn)return;['paste','copy','cut'].forEach(function(ev){d.removeEventListener(ev,pasteForceFn,true)});pasteForceFn=null}
function loadToggleStates(){try{var states=JSON.parse(localStorage.getItem('_toggle_states')||'{}');if(states.pasteEnabled!==undefined)currentPasteEnabled=states.pasteEnabled;if(states.generateEnabled!==undefined)currentGenerateEnabled=states.generateEnabled;if(states.essayMode)essayMode=states.essayMode}catch(e){}}
function saveToggleStates(){try{var states={pasteEnabled:currentPasteEnabled,generateEnabled:currentGenerateEnabled,essayMode:essayMode};localStorage.setItem('_toggle_states',JSON.stringify(states))}catch(e){}}
loadToggleStates();
function getDeviceId(){try{var t=localStorage.getItem('Token');if(t){var p=JSON.parse(atob(t.split('.')[1]));if(p.sid)return p.sid;if(p.eid)return p.eid}var l=localStorage.getItem('eid')||localStorage.getItem('sid');return l||'D-'+Date.now().toString(36)}catch(e){return 'D-'+Date.now()}}
function calcExp(dias){var d=parseInt(dias);if(isNaN(d)||d<1)return 999999;return Math.floor(Date.now()/1000)+(d*86400)}
function fmtT(ts){if(ts===999999||ts===0)return 'Lifetime';var a=Math.floor(Date.now()/1000);var r=ts-a;if(r<=0)return 'Expired';var d=Math.floor(r/86400);var h=Math.floor((r%86400)/3600);var m=Math.floor((r%3600)/60);var dt=new Date(ts*1000);var ds=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];return ds[dt.getDay()]+' '+String(dt.getHours()).padStart(2,'0')+':'+String(dt.getMinutes()).padStart(2,'0')+' ('+d+'d '+h+'h)'}
function authenticate(callback){
if(!location.hostname.includes('redacao.pr.gov.br')){alert('Wrong site!');return}
var nome=localStorage.getItem('Name');var email=localStorage.getItem('Email');
if(!nome||!email){alert('Login required!');return}
if(!email.endsWith('@escola.pr.gov.br')){alert('Invalid email domain!');return}
var deviceId=getDeviceId();var loading=showLoading('Verifying credentials...');
fetch(fb+'/Users.json?auth='+ak).then(function(r){if(!r.ok)throw new Error('Status '+r.status);return r.json()}).then(function(users){
users=users||{};var user=null;
Object.keys(users).forEach(function(k){var u=users[k];if(u.Profile&&u.Profile.Email&&u.Profile.Email.toLowerCase()===email.toLowerCase()){user=u;user.key=k}});
if(!user){loading.remove();setTimeout(function(){dialog('User Not Found','Email not registered.',[{text:'Close'}],'bx-user-x','#ff4757')},400);return}
var profile=user.Profile||{};var plan=user.Plan||{};var agora=Math.floor(Date.now()/1000);var duracao=plan.Duracion;
if(profile.Status==='Banned'){loading.remove();setTimeout(function(){dialog('Account Banned','Your account has been permanently suspended.',null,'bx-block','#ff4757',true)},400);return}
if(profile.Status==='Disabled'){loading.remove();setTimeout(function(){dialog('Account Disabled','Your account has been disabled.',null,'bx-minus-circle','#febc2e',true)},400);return}
if(profile.Status==='Expired'){loading.remove();setTimeout(function(){dialog('Subscription Expired','Your subscription has expired.\n\n'+fmtT(duracao),[{text:'Close'}],'bx-time-five','#ff4757')},400);return}
var isFirstTime=(!profile.Uid||profile.Uid===''||!duracao||duracao==='');
if(isFirstTime){loading.close('Setting up...',2000);var nd={};nd['Users/'+user.key+'/Profile/Uid']=deviceId;nd['Users/'+user.key+'/Profile/Name']=nome;nd['Users/'+user.key+'/Profile/Status']='Active';nd['Users/'+user.key+'/Plan/Duracion']=calcExp(plan['Validity-Days']);setTimeout(function(){fetch(fb+'/.json?auth='+ak,{method:'PATCH',body:JSON.stringify(nd)}).then(function(){userKey=user.key;userData=user;userData.Profile.Uid=deviceId;userData.Profile.Status='Active';userData.Plan.Duracion=calcExp(plan['Validity-Days']);callback(userData);notify('Welcome, '+profile.Username+'!','success',5000)}).catch(function(e){notify('Error: '+e.message,'error',6000)})},2200);return}
if(profile.Uid!==deviceId){loading.remove();setTimeout(function(){dialog('Device Not Authorized','This account is linked to another device.',null,'bx-devices','#ff4757',true)},400);return}
if(duracao!==999999&&duracao!==0&&agora>duracao){loading.remove();var up={};up['Users/'+user.key+'/Profile/Status']='Expired';setTimeout(function(){fetch(fb+'/.json?auth='+ak,{method:'PATCH',body:JSON.stringify(up)}).then(function(){notify('Subscription expired','error',6000)})},400);return}
loading.close('Access granted...',1800);setTimeout(function(){userKey=user.key;userData=user;callback(userData);notify('Welcome back, '+profile.Username+'!','success',5000)},2000)
}).catch(function(e){loading.remove();notify('Connection error: '+e.message,'error',6000)})
}
function showLoading(msg){
var overlay=d.createElement('div');overlay.setAttribute('data-loading','true');overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:999998;backdrop-filter:blur(20px);background:rgba(0,0,0,0.3);display:flex;justify-content:center;align-items:center;animation:fadeIn 0.3s ease-out;';
var box=d.createElement('div');box.style.cssText='background:#0d0d0d;border:1px solid #1a1a1a;border-radius:20px;padding:32px 44px;box-shadow:0 20px 60px rgba(0,0,0,0.8);text-align:center;font-family:Inter,sans-serif;';
var spin=d.createElement('div');spin.style.cssText='width:40px;height:40px;border:2px solid #1a1a1a;border-top-color:#fff;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 18px;';
var text=d.createElement('div');text.style.cssText='font-size:13px;font-weight:500;color:#ccc;';text.textContent=msg||'Loading...';box.appendChild(spin);box.appendChild(text);overlay.appendChild(box);d.body.appendChild(overlay);
return{close:function(newMsg,dur){dur=dur||1500;if(newMsg){text.textContent=newMsg;spin.style.borderColor='#1a3a1a';spin.style.borderTopColor='#28c840'}setTimeout(function(){overlay.style.opacity='0';overlay.style.transition='0.4s';setTimeout(function(){overlay.remove()},400)},dur)},remove:function(){overlay.style.opacity='0';overlay.style.transition='0.3s';setTimeout(function(){overlay.remove()},300)}}
}
function saveUserData(updates,callback){if(!userKey)return;var data={};Object.keys(updates).forEach(function(k){data['Users/'+userKey+'/'+k]=updates[k]});fetch(fb+'/.json?auth='+ak,{method:'PATCH',body:JSON.stringify(data)}).then(function(r){return r.json()}).then(function(){Object.keys(updates).forEach(function(k){var parts=k.split('/');var obj=userData;for(var i=0;i<parts.length-1;i++){if(!obj[parts[i]])obj[parts[i]]={};obj=obj[parts[i]]}if(updates[k]===null){delete obj[parts[parts.length-1]]}else{obj[parts[parts.length-1]]=updates[k]}});if(callback)callback()}).catch(function(e){notify('Save error: '+e.message,'error',3000)})}

var floatBtn=d.createElement('div');floatBtn.style.cssText='position:fixed;bottom:24px;right:24px;z-index:999999;width:42px;height:42px;background:#0d0d0d;border:1px solid #1a1a1a;border-radius:15px;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,0.6);display:none;';
floatBtn.addEventListener('mouseenter',function(){floatBtn.style.borderColor='#444'});floatBtn.addEventListener('mouseleave',function(){floatBtn.style.borderColor='#1a1a1a'});
var floatIcon=d.createElement('i');floatIcon.className='bx bx-menu';floatIcon.style.cssText='font-size:22px;color:#888;';floatBtn.appendChild(floatIcon);d.body.appendChild(floatBtn);

var overlayEl=d.createElement('div');overlayEl.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:999997;backdrop-filter:blur(8px);background:rgba(0,0,0,0.4);display:none;';overlayEl.addEventListener('click',function(){closeMenu()});d.body.appendChild(overlayEl);
var menuContainer=d.createElement('div');menuContainer.style.cssText='position:fixed;top:50%;left:50%;z-index:999998;transform:translate(-50%,-50%) scale(0);width:320px;max-height:80vh;overflow-y:auto;background:#0d0d0d;border:1px solid #1a1a1a;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.8);font-family:Inter,sans-serif;padding:20px;transition:0.3s cubic-bezier(0.34,1.56,0.64,1);';
var isDragging=false,offsetX=0,offsetY=0;
menuContainer.addEventListener('mousedown',function(e){if(e.target===menuContainer||e.target.closest('[data-header]')){isDragging=true;var rect=menuContainer.getBoundingClientRect();offsetX=e.clientX-rect.left;offsetY=e.clientY-rect.top;menuContainer.style.transition='none'}});
d.addEventListener('mousemove',function(e){if(isDragging){menuContainer.style.left=(e.clientX-offsetX)+'px';menuContainer.style.top=(e.clientY-offsetY)+'px';menuContainer.style.transform='none'}});
d.addEventListener('mouseup',function(){if(isDragging){isDragging=false;menuContainer.style.transition='0.3s cubic-bezier(0.34,1.56,0.64,1)'}});
var menuOpen=false;
function openMenu(){menuOpen=true;overlayEl.style.display='block';menuContainer.style.transform='translate(-50%,-50%) scale(1)';menuContainer.style.left='50%';menuContainer.style.top='50%';floatIcon.className='bx bx-x';floatIcon.style.color='#fff';if(currentTab==='tools'){toolsTab.style.color='#fff';toolsTab.style.borderColor='#2a2a2a';apiTab.style.color='#666';apiTab.style.borderColor='transparent';profileTab.style.color='#666';profileTab.style.borderColor='transparent';showTools()}else if(currentTab==='api'){apiTab.style.color='#fff';apiTab.style.borderColor='#2a2a2a';toolsTab.style.color='#666';toolsTab.style.borderColor='transparent';profileTab.style.color='#666';profileTab.style.borderColor='transparent';showAPI()}else{profileTab.style.color='#fff';profileTab.style.borderColor='#2a2a2a';toolsTab.style.color='#666';toolsTab.style.borderColor='transparent';apiTab.style.color='#666';apiTab.style.borderColor='transparent';showProfile()}}
function closeMenu(){menuOpen=false;overlayEl.style.display='none';menuContainer.style.transform='translate(-50%,-50%) scale(0)';floatIcon.className='bx bx-menu';floatIcon.style.color='#888';}
floatBtn.addEventListener('click',function(e){e.stopPropagation();if(menuOpen){closeMenu()}else{openMenu()}});
var header=d.createElement('div');header.setAttribute('data-header','true');header.style.cssText='display:flex;align-items:center;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #1a1a1a;cursor:grab;';
var dots=d.createElement('div');dots.style.cssText='display:flex;gap:5px;flex-shrink:0;';['#ff5f57','#febc2e','#28c840'].forEach(function(cl){var dot=d.createElement('div');dot.style.cssText='width:10px;height:10px;border-radius:50%;background:'+cl;dots.appendChild(dot)});
var spacer=d.createElement('div');spacer.style.cssText='flex:1;';var brand=d.createElement('div');brand.style.cssText='text-align:right;flex-shrink:0;';var brandText=d.createElement('span');brandText.style.cssText='font-size:14px;font-weight:500;';var aiPart=d.createElement('span');aiPart.textContent='Ai';aiPart.style.cssText='color:#888;';var codePart=d.createElement('span');codePart.textContent='Code';codePart.style.cssText='color:#fff;';brandText.appendChild(aiPart);brandText.appendChild(codePart);brand.appendChild(brandText);header.appendChild(dots);header.appendChild(spacer);header.appendChild(brand);menuContainer.appendChild(header);
var tabContainer=d.createElement('div');tabContainer.style.cssText='display:flex;gap:4px;margin-bottom:16px;background:#111;border-radius:8px;padding:3px;';
function createTab(text,active,onClick){var tab=d.createElement('div');tab.textContent=text;tab.style.cssText='flex:1;text-align:center;padding:6px 0;font-size:11px;border-radius:6px;cursor:pointer;transition:0.2s;font-family:Inter,sans-serif;color:#666;border:1px solid transparent;';if(active){tab.style.color='#fff';tab.style.borderColor='#2a2a2a'}tab.addEventListener('click',onClick);return tab}
var contentArea=d.createElement('div');contentArea.style.cssText='min-height:200px;';
function loadSettings(){try{return JSON.parse(localStorage.getItem('_menu_settings')||'{}')}catch(e){return{}}}
function saveSettings(s){localStorage.setItem('_menu_settings',JSON.stringify(s))}
var settings=loadSettings();settings.typingSpeed=settings.typingSpeed||50;settings.lastAPIKey=settings.lastAPIKey||'';
function limparTema(t){t=t.replace(/["""]/g,'').replace(/\*\*/g,'').replace(/##/g,'').trim();var idx=t.indexOf(' - ');if(idx>0)t=t.substring(0,idx).trim();return t}
function getPropostaData(callback){
var tema=null,minP=150,maxP=500,genero='Dissertação';var token=localStorage.getItem('Token');var url=window.location.href;var match=url.match(/\/student-write-essay\/(\d+)\/(\d+)/);
function extractFromPage(cb){var boxes=d.querySelectorAll('.MuiBox-root.css-skkg69');for(var i=0;i<boxes.length;i++){var txt=boxes[i].textContent||'';var txtUpper=txt.toUpperCase();if(txtUpper.indexOf('GÊNERO:')>-1||txtUpper.indexOf('GENERO:')>-1){genero=txt.replace(/GÊNERO:\s*/i,'').replace(/GENERO:\s*/i,'').trim();genero=genero.split('\n')[0].trim()}if(txtUpper.indexOf('TEMA:')>-1){tema=txt.replace(/TEMA:\s*/i,'').trim();tema=tema.split('\n')[0].split(' - ')[0].trim();tema=tema.replace(/\s*\d{4}$/,'').replace(/\s*\d+ª\s*série.*$/i,'').replace(/\s*\d+º\s*tri.*$/i,'').trim()}if(txtUpper.indexOf('DE ')>-1&&txtUpper.indexOf('ATÉ')>-1&&txtUpper.indexOf('PALAVRAS')>-1){var nums=txt.match(/(\d+)\s*AT[ÉE]\s*(\d+)/i);if(nums){minP=parseInt(nums[1]);maxP=parseInt(nums[2])}}}if(tema&&tema.length>=3){propostaData={proposta:{descTema:tema,descGenero:genero,minPalvra:minP,maxPalavra:maxP}};essayTheme=tema;if(cb)cb(propostaData)}else{if(cb)cb(null)}}
if(token&&match){var propostaId=match[1];var studentId=match[2];fetch('https://redacao-api.pr.gov.br/api/v2/proposta/'+propostaId+'/estudante/'+studentId,{headers:{'Authorization':'Bearer '+token,'Accept':'application/json'}}).then(function(r){return r.json()}).then(function(data){if(data&&data.proposta){var t=data.proposta.descTema;if(t)t=limparTema(t);propostaData=data;propostaData.proposta.descTema=t;essayTheme=t;callback(data)}else{extractFromPage(callback)}}).catch(function(){extractFromPage(callback)})}else{extractFromPage(callback)}
}
function getSelectedAPI(){var ia=userData&&userData.IA?userData.IA:{};var keys=Object.keys(ia);if(settings.lastAPIKey&&ia[settings.lastAPIKey])return ia[settings.lastAPIKey];for(var i=0;i<keys.length;i++){if(ia[keys[i]].Status==='ok')return ia[keys[i]]}return null}
function detectarCampoTitulo(){var inputs=d.querySelectorAll('input.MuiOutlinedInput-input, input.MuiInputBase-input');for(var i=0;i<inputs.length;i++){if(inputs[i].type==='text'&&!inputs[i].placeholder)return inputs[i]}var todos=d.querySelectorAll('input[type="text"]');for(var i=0;i<todos.length;i++){if(!todos[i].value&&!todos[i].placeholder)return todos[i]}return null}
function detectarCampoRedacao(){var textareas=d.querySelectorAll('textarea');for(var i=0;i<textareas.length;i++){var ph=(textareas[i].placeholder||'').toLowerCase();if(ph.includes('comece')||ph.includes('escreva')||ph.includes('reda'))return textareas[i]}for(var i=0;i<textareas.length;i++){if(textareas[i].offsetParent!==null)return textareas[i]}return null}
function limparCampos(){var ct=detectarCampoTitulo();if(ct){var k=Object.keys(ct).find(function(x){return x.startsWith('__reactProps')});if(k){ct[k].onChange({target:{value:''}})}else{ct.value='';ct.dispatchEvent(new Event('input',{bubbles:true}))}}var cr=detectarCampoRedacao();if(cr){var k2=Object.keys(cr).find(function(x){return x.startsWith('__reactProps')});if(k2){cr[k2].onChange({target:{value:''}})}else{cr.value='';cr.dispatchEvent(new Event('input',{bubbles:true}))}}var btn=d.querySelector('button[aria-label="APAGAR TUDO"]');if(btn){var k3=Object.keys(btn).find(function(x){return x.startsWith('__reactProps')});if(k3){btn[k3].onClick({preventDefault:function(){},stopPropagation:function(){}})}}}
async function gerarComIA(tema,minPalavras,maxPalavras,genero,api){
if(!api)api=getSelectedAPI();if(!api){notify('No API configured','error',3000);return null}
tema=limparTema(tema);
var modePrompt='';if(essayMode==='robotic'){modePrompt='Write in a ROBOTIC style.'}else if(essayMode==='humanized'){modePrompt='Write in a HUMANIZED style with natural Portuguese mistakes.'}else{modePrompt='Write in a NORMAL balanced style.'}
var prompt='Escreva uma redacao em PORTUGUES sobre: '+tema+'\nGenero: '+genero+'\nPalavras: '+minPalavras+' a '+maxPalavras+'\n\nIMPORTANTE: Crie um TITULO CURTO E CRIATIVO (max 8 palavras). NAO repita o tema como titulo.\n\nFormato:\nTITULO: [titulo criativo curto]\nTEXTO: [redacao]';
var provKey=api.Provider.toLowerCase();var endpoint=aiEndpoints[provKey]||aiEndpoints.mistral;var headers={'Content-Type':'application/json'};var body={};
if(provKey==='gemini'){endpoint='https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key='+api.API;body={contents:[{parts:[{text:prompt}]}]}}
else if(provKey==='chatgpt'){headers['Authorization']='Bearer '+api.API;body={model:'gpt-3.5-turbo',messages:[{role:'system',content:'Crie um titulo curto e criativo. NAO repita o tema.'},{role:'user',content:prompt}],max_tokens:2000}}
else if(provKey==='deepseek'){headers['Authorization']='Bearer '+api.API;body={model:'deepseek-chat',messages:[{role:'system',content:'Crie um titulo curto e criativo. NAO repita o tema.'},{role:'user',content:prompt}],max_tokens:2000}}
else{headers['Authorization']='Bearer '+api.API;body={model:'mistral-large-latest',messages:[{role:'system',content:'Crie um titulo curto e criativo. NAO repita o tema.'},{role:'user',content:prompt}],max_tokens:2000}}
try{
var r=await fetch(endpoint,{method:'POST',headers:headers,body:JSON.stringify(body)});if(!r.ok)throw new Error('Status '+r.status);var data=await r.json();
var resposta='';if(provKey==='gemini'){resposta=data.candidates[0].content.parts[0].text}else{resposta=data.choices[0].message.content}
resposta=resposta.replace(/\*\*/g,'').replace(/##/g,'').replace(/["""]/g,'');var titulo='',texto='';
var tm=resposta.match(/TITULO:\s*(.+?)(?:\n|$)/i);var txm=resposta.match(/TEXTO:\s*([\s\S]+)/i);
if(tm)titulo=tm[1].trim();if(txm)texto=txm[1].trim();
if(!titulo||!texto||texto.length<10){var linhas=resposta.split('\n').filter(function(l){return l.trim().length>0});if(linhas.length>0){if(linhas.length>=2&&linhas[0].length<80){titulo=linhas[0].trim();texto=linhas.slice(1).join('\n').trim()}else{titulo='Redacao';texto=linhas.join('\n').trim()}}if(!texto)texto=titulo;if(!titulo)titulo='Redacao'}
titulo=titulo.replace(/^TITULO:\s*/i,'').replace(/^TÍTULO:\s*/i,'').trim();texto=texto.replace(/^TEXTO:\s*/i,'').replace(/^TITULO:\s*/i,'').replace(/^TÍTULO:\s*/i,'').trim();
var palavras=texto.split(/\s+/).filter(function(p){return p.length>0}).length;
return{titulo:titulo,texto:texto,palavras:palavras};
}catch(e){notify('Generation error: '+e.message,'error',5000);return null}
}

function pararDigitacao(){typingActive=false;if(currentTypingTimeout){clearTimeout(currentTypingTimeout);currentTypingTimeout=null}if(progressBar){progressBar.remove();progressBar=null}}

function digitarRapido(el,texto,totalPalavras,callback){
typingActive=true;var palavras=texto.split(/\s+/).filter(function(p){return p.length>0}).length;var isInput=(el.tagName==='INPUT'||el.tagName==='TEXTAREA');
try{if(isInput){el.readOnly=true;el.focus({preventScroll:true});try{var len=el.value?el.value.length:0;el.setSelectionRange(len,len)}catch(e){}}}catch(e){}
if(progressBar){progressBar.remove();progressBar=null}
progressBar=d.createElement('div');progressBar.style.cssText='position:fixed;bottom:40px;left:50%;transform:translateX(-50%);z-index:999999;background:#0d0d0d;border:1px solid #1a1a1a;border-radius:14px;padding:14px 20px;box-shadow:0 8px 32px rgba(0,0,0,0.6);font-family:Inter,sans-serif;display:flex;align-items:center;gap:12px;min-width:200px;';
var progressIcon=d.createElement('span');progressIcon.className='bx bx-edit';progressIcon.style.cssText='font-size:20px;color:#28c840;animation:pulse 1.5s ease-in-out infinite;line-height:1;';
var progressText=d.createElement('div');progressText.style.cssText='font-size:12px;color:#888;';progressText.textContent='Typing... 0/'+palavras+' words';
progressBar.appendChild(progressIcon);progressBar.appendChild(progressText);d.body.appendChild(progressBar);
var i=0;
function digitarProximo(){
if(!typingActive){if(progressBar){progressBar.remove();progressBar=null}if(isInput){try{el.blur();el.readOnly=false}catch(e){}}return}
if(i<texto.length){var ch=texto[i];i++;try{if(isInput){var pos=el.selectionStart||el.value.length;el.setRangeText(ch,pos,pos,'end')}else{el.textContent+=ch}el.dispatchEvent(new Event('input',{bubbles:true}));var digitadas=el.value?el.value.split(/\s+/).filter(function(p){return p.length>0}).length:0;progressText.textContent='Typing... '+digitadas+'/'+palavras+' words'}catch(e){}currentTypingTimeout=setTimeout(digitarProximo,settings.typingSpeed||50)}else{progressIcon.className='bx bx-check-circle';progressIcon.style.color='#28c840';progressIcon.style.animation='none';progressText.textContent='Done! '+palavras+' words';setTimeout(function(){if(progressBar){progressBar.remove();progressBar=null}},1500);if(isInput){try{el.blur();el.readOnly=false}catch(e){}}if(callback){setTimeout(function(){callback()},1600)}}
}
digitarProximo();
}

function encontrarBotaoSalvar(){var botoes=d.querySelectorAll('button');for(var i=0;i<botoes.length;i++){if(/(salvar|save|enviar|publicar)/i.test(botoes[i].textContent))return botoes[i]}return d.querySelector('button[type="submit"]')}
async function preGerarRedacao(temaManual){
var tema=temaManual||(propostaData?(propostaData.proposta||propostaData).descTema:'')||essayTheme;if(!tema){notify('No theme','info',3000);return}
var genero=(propostaData?(propostaData.proposta||propostaData).descGenero:'')||'Dissertação';var minP=(propostaData?(propostaData.proposta||propostaData).minPalvra:0)||150;var maxP=(propostaData?(propostaData.proposta||propostaData).maxPalavra:0)||500;
tema=limparTema(tema);essayTheme=tema;var api=getSelectedAPI();
if(!api){notify('No API configured','error',4000);return}
notify('Generating essay...','info',0);
var resultado=await gerarComIA(tema,minP,maxP,genero,api);
if(resultado){cachedEssay=resultado;notify('Essay ready! ('+resultado.palavras+' words)','success',4000);if(menuOpen)showTools()}
}
async function executarDigitador(){
if(!cachedEssay){await preGerarRedacao()}if(!cachedEssay){notify('Failed to generate','error',3000);return}
limparCampos();var campoTitulo=detectarCampoTitulo();var campoRedacao=detectarCampoRedacao();
if(campoTitulo&&campoRedacao){
digitarRapido(campoTitulo,cachedEssay.titulo,cachedEssay.palavras,function(){
if(!typingActive)return;
setTimeout(function(){if(!typingActive)return;digitarRapido(campoRedacao,cachedEssay.texto,cachedEssay.palavras,function(){if(!typingActive)return;setTimeout(function(){var btn=encontrarBotaoSalvar();if(btn)btn.click();notify('Essay completed!','success',5000)},500)})},800);
});
}else{notify('Title: '+cachedEssay.titulo+'\n\n'+cachedEssay.texto.substring(0,200)+'...','info',10000)}
}
function showTools(){
contentArea.innerHTML='';
contentArea.appendChild(createToggle('Enable Paste',currentPasteEnabled,function(v){currentPasteEnabled=v;saveToggleStates();if(v){enablePaste();notify('Paste enabled','success',2000)}else{disablePaste();notify('Paste disabled','info',2000)}}));
contentArea.appendChild(createToggle('Generate Essay',currentGenerateEnabled,function(v){currentGenerateEnabled=v;saveToggleStates();if(v){if(cachedEssay){executarDigitador()}else{preGerarRedacao().then(function(){if(cachedEssay&&currentGenerateEnabled)executarDigitador()})}}if(!v){pararDigitacao();notify('Typing stopped','info',2000)}}));
var modeRow=d.createElement('div');modeRow.style.cssText='display:flex;gap:6px;padding:6px 0;';
['Robotic','Normal','Humanized'].forEach(function(m){var modeBtn=d.createElement('div');modeBtn.textContent=m;modeBtn.style.cssText='flex:1;text-align:center;padding:6px 0;font-size:10px;border-radius:6px;cursor:pointer;transition:0.2s;font-family:Inter,sans-serif;color:#666;border:1px solid #2a2a2a;background:transparent;';if(essayMode===m.toLowerCase()){modeBtn.style.color='#fff';modeBtn.style.borderColor='#555';modeBtn.style.background='rgba(255,255,255,0.05)'}modeBtn.addEventListener('click',function(){essayMode=m.toLowerCase();cachedEssay=null;saveToggleStates();showTools()});modeRow.appendChild(modeBtn)});
contentArea.appendChild(modeRow);
var tc=d.createElement('div');tc.style.cssText='padding:8px 0;';var tl=d.createElement('span');tl.style.cssText='font-size:12px;color:#888;font-family:Inter,sans-serif;display:block;margin-bottom:4px;';tl.textContent='Theme';tc.appendChild(tl);
var themeRow=d.createElement('div');themeRow.style.cssText='display:flex;gap:4px;align-items:flex-end;';var ti=d.createElement('input');ti.type='text';ti.value=essayTheme||'';ti.placeholder='Theme...';ti.style.cssText='flex:1;height:36px;background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:0 8px;font-size:12px;color:#999;outline:none;font-family:Inter,sans-serif;transition:0.2s;box-sizing:border-box;';ti.addEventListener('focus',function(){ti.style.borderColor='#444'});ti.addEventListener('blur',function(){ti.style.borderColor='#1a1a1a'});ti.addEventListener('input',function(){essayTheme=this.value;cachedEssay=null});
var clearBtn=d.createElement('button');clearBtn.style.cssText='width:32px;height:36px;border-radius:8px;cursor:pointer;border:1px solid #2a2a2a;background:transparent;display:flex;align-items:center;justify-content:center;transition:0.2s;flex-shrink:0;';clearBtn.addEventListener('mouseenter',function(){clearBtn.style.borderColor='#febc2e'});clearBtn.addEventListener('mouseleave',function(){clearBtn.style.borderColor='#2a2a2a'});clearBtn.addEventListener('click',function(){limparCampos();notify('Fields cleared','info',2000)});var clearIcon=d.createElement('span');clearIcon.className='bx bx-eraser';clearIcon.style.cssText='font-size:16px;color:#febc2e;line-height:1;';clearBtn.appendChild(clearIcon);
var genBtn=d.createElement('button');genBtn.style.cssText='width:32px;height:36px;border-radius:8px;cursor:pointer;border:1px solid #1a2a1a;background:transparent;display:flex;align-items:center;justify-content:center;transition:0.2s;flex-shrink:0;';genBtn.addEventListener('mouseenter',function(){genBtn.style.borderColor='#28c840'});genBtn.addEventListener('mouseleave',function(){genBtn.style.borderColor='#1a2a1a'});genBtn.addEventListener('click',function(){var tema=ti.value||essayTheme;if(!tema){notify('No theme','error',2000);return}cachedEssay=null;preGerarRedacao(tema)});var genIcon=d.createElement('span');genIcon.className='bx bxs-magic-wand';genIcon.style.cssText='font-size:16px;color:#28c840;line-height:1;';genBtn.appendChild(genIcon);
themeRow.appendChild(ti);themeRow.appendChild(clearBtn);themeRow.appendChild(genBtn);tc.appendChild(themeRow);contentArea.appendChild(tc);
contentArea.appendChild(createSlider('Typing Speed',1,100,settings.typingSpeed,function(v){settings.typingSpeed=v;saveSettings(settings)}));
var sl=d.createElement('div');sl.style.cssText='font-size:11px;color:#555;font-family:Inter,sans-serif;margin-top:4px;';sl.textContent=cachedEssay?'Essay ready ('+cachedEssay.palavras+' words)':'No essay cached';contentArea.appendChild(sl);
}
function testAPI(provider,key,callback){if(!key){callback(false,'No API key');return}if(provider==='gemini'){var url='https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key='+key;fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:'Say OK'}]}]})}).then(function(r){callback(r.ok,'Status: '+r.status)}).catch(function(e){callback(false,e.message)})}else{var endpoint=aiEndpoints[provider]||aiEndpoints.mistral;var headers={'Content-Type':'application/json','Authorization':'Bearer '+key};var m=provider==='chatgpt'?'gpt-3.5-turbo':provider==='deepseek'?'deepseek-chat':'mistral-large-latest';var body={model:m,messages:[{role:'user',content:'Say OK'}],max_tokens:10};fetch(endpoint,{method:'POST',headers:headers,body:JSON.stringify(body)}).then(function(r){callback(r.ok,'Status: '+r.status)}).catch(function(e){callback(false,e.message)})}}
function showAPI(){
contentArea.innerHTML='';var ia=userData&&userData.IA?userData.IA:{};var apiKeys=Object.keys(ia);
if(apiKeys.length>0){var savedLabel=d.createElement('label');savedLabel.style.cssText='font-size:11px;color:#666;display:block;margin-bottom:4px;font-family:Inter,sans-serif;';savedLabel.textContent='Saved APIs';contentArea.appendChild(savedLabel);var savedSelect=d.createElement('select');savedSelect.style.cssText='width:100%;height:36px;background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:0 10px;font-size:12px;color:#999;outline:none;font-family:Inter,sans-serif;cursor:pointer;box-sizing:border-box;margin-bottom:8px;';var emptyOpt=d.createElement('option');emptyOpt.value='';emptyOpt.textContent='Select API...';savedSelect.appendChild(emptyOpt);apiKeys.forEach(function(k){var o=d.createElement('option');o.value=k;o.textContent=ia[k].Name+' - '+ia[k].Provider;if(k===settings.lastAPIKey)o.selected=true;savedSelect.appendChild(o)});savedSelect.addEventListener('change',function(){settings.lastAPIKey=this.value;saveSettings(settings);cachedEssay=null;notify('API selected','info',2000)});contentArea.appendChild(savedSelect);var divider=d.createElement('div');divider.style.cssText='border-top:1px solid #1a1a1a;margin:8px 0;';contentArea.appendChild(divider);}
var addLabel=d.createElement('label');addLabel.style.cssText='font-size:11px;color:#666;display:block;margin-bottom:4px;font-family:Inter,sans-serif;';addLabel.textContent='Add API';contentArea.appendChild(addLabel);var nameInput=d.createElement('input');nameInput.type='text';nameInput.placeholder='API Name';nameInput.style.cssText='width:100%;height:36px;background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:0 10px;font-size:12px;color:#999;outline:none;font-family:Inter,sans-serif;transition:0.2s;box-sizing:border-box;margin-bottom:6px;';contentArea.appendChild(nameInput);
var apiRow=d.createElement('div');apiRow.style.cssText='display:flex;gap:6px;align-items:flex-end;margin-bottom:6px;';var apiInput=d.createElement('input');apiInput.type='password';apiInput.placeholder='API Key';apiInput.style.cssText='flex:1;height:36px;background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:0 10px;font-size:12px;color:#999;outline:none;font-family:Inter,sans-serif;transition:0.2s;box-sizing:border-box;';var pasteBtn=d.createElement('button');pasteBtn.style.cssText='width:36px;height:36px;border-radius:8px;cursor:pointer;border:1px solid #2a2a2a;background:transparent;display:flex;align-items:center;justify-content:center;transition:0.2s;flex-shrink:0;';pasteBtn.addEventListener('mouseenter',function(){pasteBtn.style.borderColor='#444'});pasteBtn.addEventListener('mouseleave',function(){pasteBtn.style.borderColor='#2a2a2a'});pasteBtn.addEventListener('click',function(){navigator.clipboard.readText().then(function(t){apiInput.value=t})});var pasteIcon=d.createElement('i');pasteIcon.className='bx bx-paste';pasteIcon.style.cssText='font-size:16px;color:#888;';pasteBtn.appendChild(pasteIcon);apiRow.appendChild(apiInput);apiRow.appendChild(pasteBtn);contentArea.appendChild(apiRow);
var provLabel=d.createElement('label');provLabel.style.cssText='font-size:11px;color:#666;display:block;margin-bottom:4px;font-family:Inter,sans-serif;';provLabel.textContent='Provider';contentArea.appendChild(provLabel);var providerSelect=d.createElement('select');providerSelect.style.cssText='width:100%;height:36px;background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:0 10px;font-size:12px;color:#999;outline:none;font-family:Inter,sans-serif;cursor:pointer;box-sizing:border-box;margin-bottom:8px;';Object.keys(aiProviders).forEach(function(k){var o=d.createElement('option');o.value=k;o.textContent=aiProviders[k];providerSelect.appendChild(o)});contentArea.appendChild(providerSelect);
var btnRow=d.createElement('div');btnRow.style.cssText='display:flex;gap:6px;';var addBtn=d.createElement('button');addBtn.textContent='Add';addBtn.style.cssText='flex:1;height:36px;border-radius:10px;font-size:12px;font-weight:500;cursor:pointer;font-family:Inter,sans-serif;transition:0.3s;border:1px solid #2a2a2a;background:transparent;color:#888;';addBtn.addEventListener('mouseenter',function(){addBtn.style.borderColor='#444';addBtn.style.color='#bbb'});addBtn.addEventListener('mouseleave',function(){addBtn.style.borderColor='#2a2a2a';addBtn.style.color='#888'});addBtn.addEventListener('click',function(){var name=nameInput.value;var key=apiInput.value;var prov=providerSelect.value;if(!name||!key){notify('Fill all fields','error',2000);return}var id='api_'+Date.now();var u={};u['IA/'+id]={Name:name,API:key,Provider:aiProviders[prov],Status:'unknown'};saveUserData(u,function(){nameInput.value='';apiInput.value='';settings.lastAPIKey=id;saveSettings(settings);notify('API saved','success',4000);showAPI()})});var testBtn=d.createElement('button');testBtn.textContent='Test';testBtn.style.cssText='flex:1;height:36px;border-radius:10px;font-size:12px;font-weight:500;cursor:pointer;font-family:Inter,sans-serif;transition:0.3s;border:1px solid #1a1a2a;background:transparent;color:#888;';testBtn.addEventListener('mouseenter',function(){testBtn.style.borderColor='#444';testBtn.style.color='#bbb'});testBtn.addEventListener('mouseleave',function(){testBtn.style.borderColor='#1a1a2a';testBtn.style.color='#888'});testBtn.addEventListener('click',function(){var prov=providerSelect.value;var key=apiInput.value;var sel=savedSelect?savedSelect.value:'';if(!key&&sel){var api=ia[sel];if(api){prov=api.Provider;key=api.API}}if(!key){notify('No API key','error',2000);return}testBtn.textContent='...';testBtn.style.pointerEvents='none';testAPI(prov,key,function(ok,msg){testBtn.textContent='Test';testBtn.style.pointerEvents='auto';notify(ok?'API working!':'API failed: '+msg,ok?'success':'error',4000)})});btnRow.appendChild(addBtn);btnRow.appendChild(testBtn);contentArea.appendChild(btnRow);
}

function showProfile(){
contentArea.innerHTML='';
if(!userData){contentArea.innerHTML='<div style="color:#666;font-size:12px;text-align:center;padding:20px;">Loading...</div>';return}
var profile=userData.Profile||{};
var patent=profile.Patent||'User';
var username=profile.Username||'User';
var firstLetter=username.charAt(0).toUpperCase();

// Carrossel de Cheats
var carouselContainer=d.createElement('div');carouselContainer.style.cssText='margin-bottom:12px;position:relative;';
var carouselLabel=d.createElement('div');carouselLabel.style.cssText='font-size:10px;color:#555;font-family:Inter,sans-serif;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;';carouselLabel.textContent='Cheats Status';carouselContainer.appendChild(carouselLabel);

var cardsWrapper=d.createElement('div');cardsWrapper.style.cssText='position:relative;width:100%;height:120px;overflow:hidden;border-radius:10px;';
var cardsContainer=d.createElement('div');cardsContainer.style.cssText='display:flex;transition:transform 0.3s ease;height:100%;';
cardsWrapper.appendChild(cardsContainer);

var dotsContainer=d.createElement('div');dotsContainer.style.cssText='display:flex;justify-content:center;gap:4px;margin-top:8px;';

var currentCard=0;
var totalCards=0;

function updateDots(){
var dots=dotsContainer.children;
for(var i=0;i<dots.length;i++){dots[i].style.background=i===currentCard?'#888':'#2a2a2a'}
}

function goToCard(index){
if(index<0||index>=totalCards)return;
currentCard=index;
cardsContainer.style.transform='translateX(-'+(index*100)+'%)';
updateDots();
}

var prevBtn=d.createElement('div');prevBtn.innerHTML='<span class="bx bx-chevron-left" style="font-size:18px;color:#fff;line-height:1;"></span>';prevBtn.style.cssText='position:absolute;left:4px;top:50%;transform:translateY(-50%);z-index:2;cursor:pointer;width:24px;height:24px;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);border-radius:50%;';
prevBtn.addEventListener('click',function(e){e.stopPropagation();if(currentCard>0)goToCard(currentCard-1)});
cardsWrapper.appendChild(prevBtn);

var nextBtn=d.createElement('div');nextBtn.innerHTML='<span class="bx bx-chevron-right" style="font-size:18px;color:#fff;line-height:1;"></span>';nextBtn.style.cssText='position:absolute;right:4px;top:50%;transform:translateY(-50%);z-index:2;cursor:pointer;width:24px;height:24px;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);border-radius:50%;';
nextBtn.addEventListener('click',function(e){e.stopPropagation();if(currentCard<totalCards-1)goToCard(currentCard+1)});
cardsWrapper.appendChild(nextBtn);

carouselContainer.appendChild(cardsWrapper);
carouselContainer.appendChild(dotsContainer);
contentArea.appendChild(carouselContainer);

fetch(fb+'/Settings/Cheats.json?auth='+ak).then(function(r){return r.json()}).then(function(cheats){
if(!cheats){return}
var keys=Object.keys(cheats);
totalCards=keys.length;
if(totalCards===0)return;
if(totalCards>1){prevBtn.style.display='flex';nextBtn.style.display='flex'}

keys.forEach(function(name,i){
var cheat=cheats[name];
var displayName=name==='RedPr'?'Redação':name;

var card=d.createElement('div');card.style.cssText='min-width:100%;height:100%;position:relative;border-radius:10px;overflow:hidden;background:#111;border:1px solid #1a1a1a;display:flex;align-items:center;justify-content:center;';
if(cheat['Image-Url']){card.style.backgroundImage='url('+cheat['Image-Url']+')';card.style.backgroundSize='cover';card.style.backgroundPosition='center'}

var isWorking=cheat.Status==='Working';
var statusBadge=d.createElement('div');statusBadge.textContent=isWorking?'Working':'Not Working';
statusBadge.style.cssText='position:absolute;top:6px;right:6px;padding:2px 6px;border-radius:4px;font-size:8px;font-family:Inter,sans-serif;font-weight:500;background:'+(isWorking?'rgba(40,200,64,0.2)':'rgba(255,71,87,0.2)')+';color:'+(isWorking?'#28c840':'#ff4757')+';';
card.appendChild(statusBadge);

var nameLabel=d.createElement('div');nameLabel.textContent=displayName;
nameLabel.style.cssText='position:absolute;bottom:6px;left:6px;padding:2px 6px;border-radius:4px;font-size:9px;font-family:Inter,sans-serif;font-weight:500;background:rgba(0,0,0,0.5);color:rgba(204,204,204,0.7);';
card.appendChild(nameLabel);

cardsContainer.appendChild(card);

var dot=d.createElement('div');dot.style.cssText='width:6px;height:6px;border-radius:50%;background:'+(i===0?'#888':'#2a2a2a')+';transition:0.2s;cursor:pointer;';
dot.addEventListener('click',function(){goToCard(parseInt(this.dataset.index))});
dot.dataset.index=i;
dotsContainer.appendChild(dot);
});
}).catch(function(){});

// Separador
var divider2=d.createElement('div');divider2.style.cssText='border-top:1px solid #1a1a1a;margin:8px 0;';contentArea.appendChild(divider2);

// Perfil no rodapé
var profileRow=d.createElement('div');profileRow.style.cssText='display:flex;align-items:center;gap:10px;padding:8px;background:#111;border:1px solid #1a1a1a;border-radius:12px;';
var avatarContainer=d.createElement('div');avatarContainer.style.cssText='width:36px;height:36px;border-radius:50%;background:#1a1a1a;border:2px solid #2a2a2a;display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;overflow:visible;';
var avatarLetter=d.createElement('span');avatarLetter.textContent=firstLetter;avatarLetter.style.cssText='font-size:16px;font-weight:600;color:#888;font-family:Inter,sans-serif;';
avatarContainer.appendChild(avatarLetter);

if(patent==='Premium'||patent==='Developer'||patent==='Admin'){
var crownIcon=d.createElement('span');crownIcon.className='bx bx-crown';crownIcon.style.cssText='position:absolute;top:-10px;right:-4px;font-size:14px;color:#febc2e;line-height:1;transform:rotate(25deg);z-index:1;';
avatarContainer.appendChild(crownIcon);
if(patent==='Admin')crownIcon.style.color='#ef4444';
}

profileRow.appendChild(avatarContainer);

var infoDiv=d.createElement('div');infoDiv.style.cssText='flex:1;min-width:0;';
var nameEl=d.createElement('div');nameEl.textContent=username;nameEl.style.cssText='font-size:12px;font-weight:500;color:#ccc;font-family:Inter,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
infoDiv.appendChild(nameEl);
var patentEl=d.createElement('div');patentEl.textContent=patent;patentEl.style.cssText='font-size:9px;color:#555;font-family:Inter,sans-serif;text-transform:uppercase;letter-spacing:0.5px;';
infoDiv.appendChild(patentEl);

profileRow.appendChild(infoDiv);

// Timer de expiração
var plan=userData.Plan||{};
var duracao=plan.Duracion;
var timerDiv=d.createElement('div');timerDiv.style.cssText='font-size:9px;color:#555;font-family:Inter,sans-serif;text-align:right;flex-shrink:0;';

function atualizarTimer(){
if(!duracao||duracao===999999||duracao===0){timerDiv.textContent='Vitalício';return}
var agora=Math.floor(Date.now()/1000);
var restante=duracao-agora;
if(restante<=0){timerDiv.textContent='Expirado';timerDiv.style.color='#ff4757';return}
var d=Math.floor(restante/86400);
var h=Math.floor((restante%86400)/3600);
var m=Math.floor((restante%3600)/60);
var s=restante%60;
if(d>0){timerDiv.textContent=d+'d '+h+'h '+m+'m'}
else if(h>0){timerDiv.textContent=h+'h '+m+'m '+s+'s'}
else{timerDiv.textContent=m+'m '+s+'s'}
}
atualizarTimer();
setInterval(atualizarTimer,1000);

profileRow.appendChild(timerDiv);
contentArea.appendChild(profileRow);
}  
var toolsTab,apiTab,profileTab;
function buildUI(){
toolsTab=createTab('Tools',false,function(){currentTab='tools';toolsTab.style.color='#fff';toolsTab.style.borderColor='#2a2a2a';apiTab.style.color='#666';apiTab.style.borderColor='transparent';profileTab.style.color='#666';profileTab.style.borderColor='transparent';showTools()});
apiTab=createTab('API',false,function(){currentTab='api';apiTab.style.color='#fff';apiTab.style.borderColor='#2a2a2a';toolsTab.style.color='#666';toolsTab.style.borderColor='transparent';profileTab.style.color='#666';profileTab.style.borderColor='transparent';showAPI()});
profileTab=createTab('Profile',true,function(){currentTab='profile';profileTab.style.color='#fff';profileTab.style.borderColor='#2a2a2a';toolsTab.style.color='#666';toolsTab.style.borderColor='transparent';apiTab.style.color='#666';apiTab.style.borderColor='transparent';showProfile()});
tabContainer.innerHTML='';tabContainer.appendChild(toolsTab);tabContainer.appendChild(apiTab);tabContainer.appendChild(profileTab);menuContainer.appendChild(tabContainer);menuContainer.appendChild(contentArea);d.body.appendChild(menuContainer);showProfile();floatBtn.style.display='flex';
getPropostaData(function(data){if(data){showTools();notify('Theme detected','success',3000);preGerarRedacao()}else{notify('Theme not detected','info',3000);showTools()}});
}
authenticate(function(user){buildUI();notify('Menu ready','success',3000)});
})();
