void(function(){
if(!location.hostname.includes('redacao.pr.gov.br')){alert('Wrong site!');return}
var nome=localStorage.getItem('Name');
var email=localStorage.getItem('Email');
if(!nome||!email){alert('Login required!');return}
if(!email.endsWith('@escola.pr.gov.br')){alert('Invalid email domain!');return}

var fb='https://script-b4955-default-rtdb.firebaseio.com';
var ak='AIzaSyBBtmp2uV5ZlCUqD1tRGDdssfsSHgkYGwY';
var d=document;

if(!d.querySelector('style[data-loader]')){
  var s=d.createElement('style');
  s.setAttribute('data-loader','true');
  s.textContent='@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap");'+
    '@keyframes spin{to{transform:rotate(360deg)}}'+
    '@keyframes slideIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}'+
    '@keyframes slideOut{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(40px)}}'+
    '@keyframes fadeIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}'+
    '@keyframes fadeOut{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(0.95)}}'+
    '@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}';
  d.head.appendChild(s);
}

if(!d.querySelector('link[href*="boxicons"]')){
  var l=d.createElement('link');
  l.href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css';
  l.rel='stylesheet';
  d.head.appendChild(l);
}

var nC=d.createElement('div');
nC.setAttribute('data-notifications','true');
nC.style.cssText='position:fixed;top:16px;right:16px;display:flex;flex-direction:column;gap:8px;z-index:99999;';
d.body.appendChild(nC);

function notify(msg,type,duracao){
  duracao=duracao||3000;
  var n=d.createElement('div');
  n.style.cssText='background:#0d0d0d;border:1px solid #1a1a1a;padding:12px 18px;border-radius:14px;'+
    'box-shadow:0 8px 32px rgba(0,0,0,0.6);display:flex;align-items:center;gap:8px;font-size:12px;'+
    'color:#888;animation:slideIn 0.25s ease-out;font-family:Inter,sans-serif;';
  
  var icon=d.createElement('i');
  icon.style.cssText='font-size:16px;';
  if(type==='success'){icon.className='bx bx-check-circle';icon.style.color='#28c840';n.style.borderColor='#0a1a0a'}
  else if(type==='error'){icon.className='bx bx-error-circle';icon.style.color='#ff4757';n.style.borderColor='#1a0a0a'}
  else{icon.className='bx bx-info-circle';icon.style.color='#febc2e';n.style.borderColor='#1a1a0a'}
  
  n.appendChild(icon);
  n.appendChild(d.createTextNode(msg));
  nC.appendChild(n);
  
  if(nC.children.length>3){nC.firstChild.style.animation='slideOut 0.25s ease-in forwards';setTimeout(function(){if(nC.firstChild)nC.firstChild.remove()},250)}
  
  setTimeout(function(){n.style.animation='slideOut 0.25s ease-in forwards';setTimeout(function(){if(n.parentNode)n.remove()},250)},duracao)
}

function dialog(title,msg,buttons,iconName,iconColor){
  return new Promise(function(resolve){
    var overlay=d.createElement('div');
    overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:99998;'+
      'backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);background:rgba(0,0,0,0.4);';
    
    var box=d.createElement('div');
    box.style.cssText='width:340px;padding:28px 28px 24px;position:fixed;top:50%;left:50%;z-index:99999;'+
      'font-family:Inter,sans-serif;background:#0d0d0d;border-radius:20px;border:1px solid #1a1a1a;'+
      'box-shadow:0 20px 60px rgba(0,0,0,0.8);animation:fadeIn 0.3s ease-out;transform:translate(-50%,-50%);text-align:center;';
    
    if(iconName){
      var iconEl=d.createElement('i');
      iconEl.className='bx '+iconName;
      iconEl.style.cssText='font-size:40px;color:'+(iconColor||'#ccc')+';margin-bottom:16px;display:block;';
      box.appendChild(iconEl);
    }
    
    var titleEl=d.createElement('div');
    titleEl.style.cssText='font-size:15px;font-weight:500;color:#ccc;margin-bottom:8px;';
    titleEl.textContent=title;
    
    var msgEl=d.createElement('div');
    msgEl.style.cssText='font-size:12px;color:#666;line-height:1.6;margin-bottom:22px;white-space:pre-line;';
    msgEl.textContent=msg;
    
    var btnContainer=d.createElement('div');
    btnContainer.style.cssText='display:flex;gap:8px;justify-content:center;';
    
    box.appendChild(titleEl);
    box.appendChild(msgEl);
    box.appendChild(btnContainer);
    overlay.appendChild(box);
    d.body.appendChild(overlay);
    
    buttons.forEach(function(b,i){
      var btn=d.createElement('button');
      btn.textContent=b.text;
      btn.style.cssText='height:38px;padding:0 24px;border-radius:10px;font-size:12px;font-weight:500;'+
        'cursor:pointer;font-family:Inter,sans-serif;transition:0.2s;border:1px solid #2a2a2a;'+
        'background:'+(b.primary?'#fff':'transparent')+';color:'+(b.primary?'#000':'#888')+';';
      
      btn.addEventListener('mouseenter',function(){if(!b.primary){btn.style.borderColor='#444';btn.style.color='#bbb'}});
      btn.addEventListener('mouseleave',function(){if(!b.primary){btn.style.borderColor='#2a2a2a';btn.style.color='#888'}});
      btn.addEventListener('click',function(){overlay.style.animation='fadeOut 0.2s ease-in forwards';setTimeout(function(){overlay.remove()},200);resolve(b.value||i)});
      
      btnContainer.appendChild(btn)
    })
  })
}

function showLoading(msg){
  var overlay=d.createElement('div');
  overlay.setAttribute('data-loading','true');
  overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:99998;'+
    'backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);background:rgba(0,0,0,0.3);'+
    'display:flex;justify-content:center;align-items:center;';
  
  var box=d.createElement('div');
  box.style.cssText='background:#0d0d0d;border:1px solid #1a1a1a;border-radius:20px;padding:28px 40px;'+
    'box-shadow:0 20px 60px rgba(0,0,0,0.8);text-align:center;font-family:Inter,sans-serif;';
  
  var spin=d.createElement('div');
  spin.style.cssText='width:36px;height:36px;border:2px solid #1a1a1a;border-top-color:#fff;'+
    'border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 16px;';
  
  var text=d.createElement('div');
  text.style.cssText='font-size:13px;font-weight:500;color:#ccc;';
  text.textContent=msg||'Loading...';
  
  box.appendChild(spin);
  box.appendChild(text);
  overlay.appendChild(box);
  d.body.appendChild(overlay);
  
  return {
    close:function(newMsg){
      if(newMsg){text.textContent=newMsg;spin.style.borderColor='#1a3a1a';spin.style.borderTopColor='#28c840'}
      setTimeout(function(){overlay.style.opacity='0';overlay.style.transition='0.3s';setTimeout(function(){overlay.remove()},300)},newMsg?1200:0)
    },
    remove:function(){overlay.remove()}
  }
}

function getDeviceId(){
  try{
    var t=localStorage.getItem('Token');
    if(t){var p=JSON.parse(atob(t.split('.')[1]));if(p.sid)return p.sid;if(p.eid)return p.eid}
    var l=localStorage.getItem('eid')||localStorage.getItem('sid');
    return l||'D-'+Date.now().toString(36)
  }catch(e){return 'D-'+Date.now()}
}

function calcExp(dias){
  var d=parseInt(dias);
  if(isNaN(d)||d<1)return 999999;
  return Math.floor(Date.now()/1000)+(d*86400)
}

function fmtT(ts){
  if(ts===999999||ts===0)return 'Lifetime';
  var a=Math.floor(Date.now()/1000);
  var r=ts-a;
  if(r<=0)return 'Expired';
  var d=Math.floor(r/86400);
  var h=Math.floor((r%86400)/3600);
  var m=Math.floor((r%3600)/60);
  var dt=new Date(ts*1000);
  var ds=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var dia=ds[dt.getDay()];
  var hh=String(dt.getHours()).padStart(2,'0');
  var mm=String(dt.getMinutes()).padStart(2,'0');
  if(r<60)return r+'s';
  if(r<3600)return m+'min';
  if(r<86400)return h+'h '+m+'min';
  return dia+' '+hh+':'+mm+' ('+d+'d '+h+'h)'
}

var deviceId=getDeviceId();
var loading=showLoading('Verifying credentials...');

fetch(fb+'/Users.json?auth='+ak).then(function(r){
  if(!r.ok)throw new Error('Status '+r.status);
  return r.json()
}).then(function(users){
  users=users||{};
  var user=null;
  
  Object.keys(users).forEach(function(k){
    var u=users[k];
    if(u.Profile&&u.Profile.Email&&u.Profile.Email.toLowerCase()===email.toLowerCase()){
      user=u;user.key=k
    }
  });
  
  if(!user){
    loading.remove();
    dialog('User Not Found','The email '+email+' is not registered in the database.\n\nPlease contact an administrator.',[{text:'Close',primary:true}],'bx-user-x','#ff4757');
    return
  }
  
  var profile=user.Profile||{};
  var plan=user.Plan||{};
  var ai=user.AI||{};
  var agora=Math.floor(Date.now()/1000);
  var duracao=plan.Duracion;
  
  if(profile.Status==='Banned'){
    loading.remove();
    dialog('Account Banned','Your account has been permanently suspended.\n\nContact support for more information.',[{text:'Close',primary:true}],'bx-block','#ff4757');
    return
  }
  
  if(profile.Status==='Disabled'){
    loading.remove();
    dialog('Account Disabled','Your account has been disabled.\n\nPlease contact an administrator to reactivate.',[{text:'Close',primary:true}],'bx-minus-circle','#febc2e');
    return
  }
  
  if(profile.Status==='Expired'){
    loading.remove();
    dialog('Subscription Expired','Your subscription has expired.\n\n'+fmtT(duracao)+'\n\nPlease renew to continue.',[{text:'Close',primary:true}],'bx-time-five','#ff4757');
    notify('Subscription expired: '+fmtT(duracao),'error',5000);
    return
  }
  
  var isFirstTime=(!profile.Uid||profile.Uid===''||!duracao||duracao==='');
  
  if(isFirstTime){
    loading.close('Setting up account...');
    
    var nd={};
    nd['Users/'+user.key+'/Profile/Uid']=deviceId;
    nd['Users/'+user.key+'/Profile/Name']=nome;
    nd['Users/'+user.key+'/Profile/Status']='Active';
    nd['Users/'+user.key+'/Plan/Duracion']=calcExp(plan['Validity-Days']);
    
    setTimeout(function(){
      fetch(fb+'/.json?auth='+ak,{method:'PATCH',body:JSON.stringify(nd)}).then(function(){
        loading.remove();
        notify('Welcome, '+profile.Username+'! Account activated.','success',4000);
      }).catch(function(e){
        loading.remove();
        notify('Error: '+e.message,'error',5000)
      })
    },2000);
    return
  }
  
  if(profile.Uid!==deviceId){
    loading.remove();
    dialog('Device Not Authorized','This account is linked to another device.\n\nAccess denied.',[{text:'Close',primary:true}],'bx-devices','#ff4757');
    return
  }
  
  if(duracao!==999999&&duracao!==0&&agora>duracao){
    loading.remove();
    var up={};
    up['Users/'+user.key+'/Profile/Status']='Expired';
    fetch(fb+'/.json?auth='+ak,{method:'PATCH',body:JSON.stringify(up)}).then(function(){
      notify('Subscription expired','error',5000)
    });
    return
  }
  
  loading.close('Access granted...');
  
  setTimeout(function(){
    loading.remove();
    notify('Welcome back, '+profile.Username+'!','success',4000)
  },1500)
  
}).catch(function(e){
  loading.remove();
  notify('Connection error: '+e.message,'error',5000)
})
})();
