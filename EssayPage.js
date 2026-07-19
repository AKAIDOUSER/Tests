void(function(){
var d=document;
var token=localStorage.getItem('Token');
if(!token){alert('Login required!');return}
var payload=JSON.parse(atob(token.split('.')[1]));
var sid=payload.sid;
var email=payload.email;
var nome=payload.unique_name||'Aluno';
var url=window.location.href;
var match=url.match(/\/student-write-essay\/(\d+)\/(\d+)/);
if(!match){alert('Abra uma redacao primeiro!');return}
var propostaId=match[1];
var fb='https://script-b4955-default-rtdb.firebaseio.com';
var ak='AIzaSyBBtmp2uV5ZlCUqD1tRGDdssfsSHgkYGwY';

// ========== STYLES ==========
if(!d.querySelector('style[data-essay]')){
var s=d.createElement('style');s.setAttribute('data-essay','true');
s.textContent='@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");@keyframes spin{to{transform:rotate(360deg)}}@keyframes slideIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}@keyframes slideOut{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(40px)}}@keyframes fadeIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}';
d.head.appendChild(s);
}
if(!d.querySelector('link[href*="boxicons"]')){
var l=d.createElement('link');l.href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css';l.rel='stylesheet';d.head.appendChild(l);
}

// ========== NOTIFICATIONS ==========
var nC=d.createElement('div');nC.id='toastContainer';
nC.style.cssText='position:fixed;top:16px;right:16px;z-index:99999;display:flex;flex-direction:column;gap:6px;';
d.body.appendChild(nC);

function notify(msg,type){
var n=d.createElement('div');
n.style.cssText='background:#0d0d0d;border:1px solid #1a1a1a;padding:10px 14px;border-radius:10px;font-size:11px;color:#888;font-family:Inter,sans-serif;animation:slideIn 0.3s ease-out;display:flex;align-items:center;gap:8px;min-width:200px;';
var dot=d.createElement('div');dot.style.cssText='width:6px;height:6px;border-radius:50%;flex-shrink:0;';
if(type==='success'){dot.style.background='#28c840';n.style.borderColor='#0a1a0a'}
else if(type==='error'){dot.style.background='#ff4757';n.style.borderColor='#1a0a0a'}
else{dot.style.background='#febc2e';n.style.borderColor='#1a1a0a'}
n.appendChild(dot);n.appendChild(d.createTextNode(msg));nC.appendChild(n);
if(nC.children.length>3)nC.firstChild.remove();
setTimeout(function(){n.style.animation='slideOut 0.3s ease-in forwards';setTimeout(function(){n.remove()},300)},4000);
}

// ========== DIALOG ==========
function dialog(title,msg,icon,color,buttons){
return new Promise(function(resolve){
var overlay=d.createElement('div');
overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;backdrop-filter:blur(8px);background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;';
var box=d.createElement('div');
box.style.cssText='width:320px;padding:28px 24px;background:#0d0d0d;border:1px solid #1a1a1a;border-radius:16px;text-align:center;font-family:Inter,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,0.8);';
if(icon){var ic=d.createElement('i');ic.className='bx '+icon;ic.style.cssText='font-size:40px;color:'+(color||'#ccc')+';margin-bottom:14px;display:block;';box.appendChild(ic);}
var t=d.createElement('div');t.style.cssText='font-size:15px;font-weight:500;color:#ccc;margin-bottom:8px;';t.textContent=title;
var m=d.createElement('div');m.style.cssText='font-size:11px;color:#666;line-height:1.6;margin-bottom:20px;white-space:pre-line;';m.textContent=msg;
box.appendChild(t);box.appendChild(m);
if(buttons&&buttons.length>0){
var bc=d.createElement('div');bc.style.cssText='display:flex;gap:8px;justify-content:center;';
buttons.forEach(function(b,i){
var btn=d.createElement('button');btn.textContent=b.text;
btn.style.cssText='height:36px;padding:0 20px;border-radius:8px;font-size:11px;font-weight:500;cursor:pointer;font-family:Inter,sans-serif;border:1px solid #2a2a2a;background:transparent;color:#888;';
btn.addEventListener('mouseenter',function(){btn.style.borderColor='#444';btn.style.color='#bbb'});
btn.addEventListener('mouseleave',function(){btn.style.borderColor='#2a2a2a';btn.style.color='#888'});
btn.addEventListener('click',function(){overlay.remove();resolve(b.value||i)});
bc.appendChild(btn);
});
box.appendChild(bc);
}else{setTimeout(function(){overlay.remove();resolve()},3000);}
overlay.appendChild(box);d.body.appendChild(overlay);
});
}

// ========== AUTH ==========
function getDeviceId(){
try{var t=localStorage.getItem('Token');if(t){var p=JSON.parse(atob(t.split('.')[1]));if(p.sid)return p.sid;if(p.eid)return p.eid}return 'D-'+Date.now().toString(36)}catch(e){return 'D-'+Date.now()}
}
function calcExp(d){var d=parseInt(d);if(isNaN(d)||d<1)return 999999;return Math.floor(Date.now()/1000)+(d*86400)}
function fmtT(ts){if(ts===999999||ts===0)return 'Lifetime';var a=Math.floor(Date.now()/1000);var r=ts-a;if(r<=0)return 'Expired';var d=Math.floor(r/86400);var h=Math.floor((r%86400)/3600);var m=Math.floor((r%3600)/60);var dt=new Date(ts*1000);var ds=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];return ds[dt.getDay()]+' '+String(dt.getHours()).padStart(2,'0')+':'+String(dt.getMinutes()).padStart(2,'0')+' ('+d+'d '+h+'h)'}

// ========== LOADING ==========
var loadingOverlay=d.createElement('div');
loadingOverlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;backdrop-filter:blur(20px);background:rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;';
var loadingBox=d.createElement('div');
loadingBox.style.cssText='background:#0d0d0d;border:1px solid #1a1a1a;border-radius:16px;padding:28px 36px;text-align:center;font-family:Inter,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,0.8);';
var loadingSpin=d.createElement('div');
loadingSpin.style.cssText='width:36px;height:36px;border:2px solid #1a1a1a;border-top-color:#fff;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 14px;';
var loadingText=d.createElement('div');
loadingText.style.cssText='font-size:12px;font-weight:500;color:#ccc;';loadingText.textContent='Verifying...';
loadingBox.appendChild(loadingSpin);loadingBox.appendChild(loadingText);
loadingOverlay.appendChild(loadingBox);d.body.appendChild(loadingOverlay);

// ========== VERIFY LOGIN ==========
var deviceId=getDeviceId();
fetch(fb+'/Users.json?auth='+ak).then(function(r){return r.json()}).then(function(users){
users=users||{};var user=null;
Object.keys(users).forEach(function(k){var u=users[k];if(u.Profile&&u.Profile.Email&&u.Profile.Email.toLowerCase()===email.toLowerCase()){user=u;user.key=k}});
loadingOverlay.remove();

if(!user){dialog('User Not Found','Email not registered.',null,'#ff4757');return}
var profile=user.Profile||{};var plan=user.Plan||{};var agora=Math.floor(Date.now()/1000);var duracao=plan.Duracion;
if(profile.Status==='Banned'){dialog('Account Banned','Permanently suspended.',null,'#ff4757');return}
if(profile.Status==='Disabled'){dialog('Account Disabled','Contact administrator.',null,'#febc2e');return}
if(profile.Status==='Expired'){dialog('Subscription Expired','Renew to continue.\n\n'+fmtT(duracao),null,'#ff4757');return}

var isFirstTime=(!profile.Uid||profile.Uid===''||!duracao||duracao==='');
if(isFirstTime){
var nd={};nd['Users/'+user.key+'/Profile/Uid']=deviceId;nd['Users/'+user.key+'/Profile/Name']=nome;nd['Users/'+user.key+'/Profile/Status']='Active';nd['Users/'+user.key+'/Plan/Duracion']=calcExp(plan['Validity-Days']);
fetch(fb+'/.json?auth='+ak,{method:'PATCH',body:JSON.stringify(nd)}).then(function(){loadPage(user)});
return;
}
if(profile.Uid!==deviceId){dialog('Device Not Authorized','Linked to another device.',null,'#ff4757');return}
if(duracao!==999999&&duracao!==0&&agora>duracao){
var up={};up['Users/'+user.key+'/Profile/Status']='Expired';
fetch(fb+'/.json?auth='+ak,{method:'PATCH',body:JSON.stringify(up)});
dialog('Subscription Expired','Expired.\n\n'+fmtT(duracao),null,'#ff4757');return;
}
loadPage(user);
}).catch(function(){loadingOverlay.remove();notify('Connection error','error')});

function loadPage(user){
var ia=user.IA||{};
var api=null;
Object.keys(ia).forEach(function(k){if(ia[k].Status==='ok')api=ia[k]});
if(!api)notify('No API configured. Generate button disabled.','error');

fetch('https://redacao-api.pr.gov.br/api/v2/proposta/'+propostaId+'/estudante/'+sid,{headers:{'Authorization':'Bearer '+token}}).then(function(r){return r.json()}).then(function(data){
var p=data.proposta||data;
var tema=(p.descTema||'').replace(/^TEMA:\s*/i,'').replace(/Tema:\s*/i,'').split('-')[0].trim();
var genero=p.descGenero||'';
var minP=p.minPalvra||150;
var maxP=p.maxPalavra||500;
var tokenRedacao=p.tokenRedacao||p.uIdProposta||'';

d.open();
d.write('<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AiCode</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"><link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#050505;color:#ccc;font-family:Inter,sans-serif;min-height:100vh}.container{max-width:700px;margin:0 auto;padding:16px}.header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#0d0d0d;border:1px solid #1a1a1a;border-radius:12px;margin-bottom:12px}.dots{display:flex;gap:5px}.dot{width:9px;height:9px;border-radius:50%}.dot-red{background:#ff5f57}.dot-yellow{background:#febc2e}.dot-green{background:#28c840}.logo{font-size:15px;font-weight:500}.logo .ai{color:#888}.logo .code{color:#fff}.info-card{background:#0d0d0d;border:1px solid #1a1a1a;border-radius:10px;padding:12px;margin-bottom:10px}.info-card .tema{font-size:13px;font-weight:500;color:#ccc;margin-bottom:4px}.info-card .meta{font-size:10px;color:#555}.field{margin-bottom:10px}.field-label{font-size:9px;color:#555;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;display:flex;align-items:center;justify-content:space-between}.field-input-wrap{position:relative}.field-input{width:100%;height:38px;background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:0 36px 0 10px;font-size:12px;color:#999;outline:none;font-family:Inter,sans-serif}.field-input:focus{border-color:#333}.field-textarea{width:100%;min-height:340px;background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:10px;font-size:12px;color:#999;outline:none;font-family:Inter,sans-serif;resize:vertical;line-height:1.7}.field-textarea:focus{border-color:#333}.field-icon{position:absolute;right:4px;top:50%;transform:translateY(-50%);width:28px;height:28px;border-radius:6px;cursor:pointer;border:1px solid #2a2a2a;background:transparent;display:flex;align-items:center;justify-content:center;color:#888;font-size:13px}.field-icon:hover{border-color:#444;color:#bbb}.btn-row{display:flex;gap:6px;margin-top:10px}.btn{flex:1;height:36px;border-radius:8px;font-size:11px;font-weight:500;cursor:pointer;font-family:Inter,sans-serif;background:transparent;color:#888;border:1px solid #2a2a2a;display:flex;align-items:center;justify-content:center;gap:5px}.btn:hover{border-color:#444;color:#bbb}.btn.green{color:#28c840;border-color:#1a2a1a}.btn.green:hover{border-color:#28c840}.btn.blue{color:#3b82f6;border-color:#1a1a3a}.btn.blue:hover{border-color:#3b82f6}.word-count{font-size:9px;color:#555}.loading{text-align:center;color:#555;padding:6px;font-size:10px;display:none}.toast{position:fixed;top:16px;right:16px;z-index:9999;display:flex;flex-direction:column;gap:6px}.toast-item{background:#0d0d0d;border:1px solid #1a1a1a;padding:10px 14px;border-radius:10px;font-size:11px;color:#888;font-family:Inter,sans-serif;animation:slideIn 0.3s ease-out;display:flex;align-items:center;gap:8px;min-width:200px}@keyframes slideIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}.toast-item.success{border-color:#0a1a0a}.toast-item.error{border-color:#1a0a0a}.toast-item.info{border-color:#1a1a0a}.toast-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}.toast-dot.success{background:#28c840}.toast-dot.error{background:#ff4757}.toast-dot.info{background:#febc2e}</style></head><body><div class="toast" id="toastContainer"></div><div class="container"><div class="header"><div class="dots"><div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div></div><div class="logo"><span class="ai">Ai</span><span class="code">Code</span></div></div><div class="info-card"><div class="tema">'+tema+'</div><div class="meta">'+genero+' • '+minP+'-'+maxP+' palavras</div></div><div class="field"><div class="field-label"><span>Titulo</span></div><div class="field-input-wrap"><input class="field-input" id="titulo" placeholder="Titulo da redacao" maxlength="100"><button class="field-icon" onclick="document.getElementById(\'titulo\').value=\'\'" title="Limpar"><i class="bx bx-x"></i></button></div></div><div class="field"><div class="field-label"><span>Redacao</span><span class="word-count" id="wordcount">0 palavras</span></div><textarea class="field-textarea" id="redacao" placeholder="Escreva sua redacao..."></textarea></div><div class="loading" id="loading">Gerando com IA...</div><div class="btn-row"><button class="btn blue" onclick="generateEssay()"><i class="bx bxs-magic-wand"></i>Gerar com IA</button></div><div class="btn-row"><button class="btn" onclick="clearAll()"><i class="bx bx-eraser"></i>Limpar</button><button class="btn green" onclick="saveFinish()"><i class="bx bx-check"></i>Concluir</button></div></div><script>var token="'+token+'";var sid="'+sid+'";var propostaId="'+propostaId+'";var minP='+minP+';var maxP='+maxP+';var tokenRedacao="'+tokenRedacao+'";var fb="'+fb+'";var ak="'+ak+'";var tema="'+tema.replace(/"/g,'\\"')+'";var genero="'+genero.replace(/"/g,'\\"')+'";var email="'+email+'";var api='+JSON.stringify(api||null)+';function notify(msg,type){var c=document.getElementById("toastContainer");var n=document.createElement("div");n.className="toast-item "+type;n.innerHTML=\'<div class="toast-dot \'+type+\'"></div>\'+msg;c.appendChild(n);if(c.children.length>3)c.firstChild.remove();setTimeout(function(){n.style.opacity="0";n.style.transition="0.3s";setTimeout(function(){n.remove()},300)},4000)}function clearAll(){document.getElementById("titulo").value="";document.getElementById("redacao").value="";updateCount()}function updateCount(){var t=document.getElementById("redacao").value;var w=t.split(/\\s+/).filter(function(p){return p.length>0}).length;document.getElementById("wordcount").textContent=w+" / "+maxP+" palavras"}document.getElementById("redacao").addEventListener("input",updateCount);async function generateEssay(){if(!api){notify("Nenhuma API configurada","error");return}document.getElementById("loading").style.display="block";notify("Gerando redacao...","info");try{var prompt="Escreva uma redacao em PORTUGUES sobre: "+tema+"\\nGenero: "+genero+"\\nPalavras: "+minP+" a "+maxP+"\\n\\nFormato:\\nTITULO: [titulo]\\nTEXTO: [redacao]";var endpoint,headers={"Content-Type":"application/json"},body={};if(api.Provider==="Gemini"){endpoint="https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key="+api.API;body={contents:[{parts:[{text:prompt}]}]}}else if(api.Provider==="ChatGPT"){endpoint="https://api.openai.com/v1/chat/completions";headers["Authorization"]="Bearer "+api.API;body={model:"gpt-3.5-turbo",messages:[{role:"user",content:prompt}],max_tokens:2000}}else if(api.Provider==="DeepSeek"){endpoint="https://api.deepseek.com/v1/chat/completions";headers["Authorization"]="Bearer "+api.API;body={model:"deepseek-chat",messages:[{role:"user",content:prompt}],max_tokens:2000}}else{endpoint="https://api.mistral.ai/v1/chat/completions";headers["Authorization"]="Bearer "+api.API;body={model:"mistral-large-latest",messages:[{role:"user",content:prompt}],max_tokens:2000}}var resp=await fetch(endpoint,{method:"POST",headers:headers,body:JSON.stringify(body)});var data=await resp.json();var texto=data.choices?data.choices[0].message.content:data.candidates[0].content.parts[0].text;texto=texto.replace(/\\*\\*/g,"").replace(/##/g,"");var tit="",red="";var tm=texto.match(/TITULO:\\s*(.+?)(?:\\n|$)/i);var txm=texto.match(/TEXTO:\\s*([\\s\\S]+)/i);if(tm)tit=tm[1].trim();if(txm)red=txm[1].trim();if(!tit&&!red){var linhas=texto.split("\\n").filter(function(l){return l.trim()});tit=linhas[0]||"";red=linhas.slice(1).join("\\n")||""}document.getElementById("titulo").value=tit;document.getElementById("redacao").value=red;updateCount();notify("Redacao gerada!","success")}catch(e){notify("Erro: "+e.message,"error")}document.getElementById("loading").style.display="none"}function saveFinish(){var titulo=document.getElementById("titulo").value;var texto=document.getElementById("redacao").value;var w=texto.split(/\\s+/).filter(function(p){return p.length>0}).length;if(w<minP){notify("Minimo de "+minP+" palavras. Voce tem "+w+".","error");return}var body={id:0,idEstudante:parseInt(sid),idRedacao:parseInt(propostaId),token:tokenRedacao,scorePlataforma:100,scoreProfessor:100,titulo:titulo,texto:texto,json:"{}",status:3,ipHost:"",createdAt:new Date().toISOString(),createdBy:0};notify("Concluindo...","info");fetch("https://redacao-api.pr.gov.br/api/v2/comentario/"+tokenRedacao,{method:"POST",headers:{"Authorization":"Bearer "+token,"Content-Type":"application/json"},body:JSON.stringify(body)}).then(function(r){return r.text()}).then(function(res){if(res==="true"){notify("Concluida com nota 100!","success")}else{notify("Erro: "+res,"error")}}).catch(function(e){notify("Erro: "+e.message,"error")})}</script></div></body></html>');
d.close();
});
}
})();
