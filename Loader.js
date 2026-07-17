void(function(){
if(!location.hostname.includes('redacao.pr.gov.br')){alert('Site errado!');return}
var nome=localStorage.getItem('Name');
var email=localStorage.getItem('Email');
if(!nome||!email){alert('Faça login!');return}
if(!email.endsWith('@escola.pr.gov.br')){alert('Email inválido!');return}

var fb='https://script-b4955-default-rtdb.firebaseio.com';
var ak='AIzaSyBBtmp2uV5ZlCUqD1tRGDdssfsSHgkYGwY';

function getDeviceId(){
  try{
    var t=localStorage.getItem('Token');
    if(t){var p=JSON.parse(atob(t.split('.')[1]));if(p.sid)return p.sid;if(p.eid)return p.eid}
    var l=localStorage.getItem('eid')||localStorage.getItem('sid');
    return l||'D-'+Date.now().toString(36)
  }catch(e){return 'D-'+Date.now()}
}

function calcExp(plan){
  if(!plan||!plan.number||!plan.type)return 999999;
  var n=parseInt(plan.number);
  if(isNaN(n)||n<1)return 999999;
  var t=plan.type.toLowerCase();
  var a=Math.floor(Date.now()/1000);
  var m={min:60,minutos:60,minutes:60,h:3600,horas:3600,hours:3600,d:86400,dias:86400,days:86400,meses:2592000,months:2592000,anos:31536000,years:31536000};
  if(t==='infinite')return 999999;
  return m[t]?a+(n*m[t]):999999
}

function fmtT(ts){
  if(ts===999999||ts===0)return '♾️ Vitalício';
  var a=Math.floor(Date.now()/1000);
  var r=ts-a;
  if(r<=0)return '❌ Expirado';
  var d=Math.floor(r/86400);
  var h=Math.floor((r%86400)/3600);
  var min=Math.floor((r%3600)/60);
  var dt=new Date(ts*1000);
  var ds=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  var dia=ds[dt.getDay()];
  var hh=String(dt.getHours()).padStart(2,'0');
  var mm=String(dt.getMinutes()).padStart(2,'0');
  if(r<60)return r+'s';
  if(r<3600)return min+'min';
  if(r<86400)return h+'h '+min+'min';
  return dia+' '+hh+':'+mm+' ('+d+'D '+h+'h)'
}

function toTs(dh){
  var p=dh.split(' ');
  var d=p[0].split('/');
  var h=p[1]?p[1].split(':'):['0','0'];
  return Math.floor(new Date(d[2],d[1]-1,d[0],h[0]||0,h[1]||0,0).getTime()/1000)
}

var deviceId=getDeviceId();

fetch(fb+'/settings.json?auth='+ak).then(function(r){return r.json()}).then(function(s){
  s=s||{};
  
  if(s.maintenance&&s.pauseActive){
    alert('🔧 Sistema em manutenção!');
    return
  }
  
  if(s.maintenance&&!s.pauseActive&&s.pauseStart&&s.pauseEnd){
    var inicio=toTs(s.pauseStart);
    var fim=toTs(s.pauseEnd);
    var pausa=fim-inicio;
    
    if(pausa>0){
      fetch(fb+'/users.json?auth='+ak).then(function(r){return r.json()}).then(function(users){
        users=users||{};
        var updates={};
        var count=0;
        
        Object.keys(users).forEach(function(k){
          var u=users[k];
          if(u.subscription&&u.subscription.expiresAt&&u.subscription.expiresAt!==999999&&u.subscription.expiresAt!==0){
            updates['users/'+k+'/subscription/expiresAt']=u.subscription.expiresAt+pausa;
            updates['users/'+k+'/subscription/pausedTotal']=(u.subscription.pausedTotal||0)+pausa;
            count++;
          }
        });
        
        updates['settings/maintenance']=false;
        updates['settings/pauseActive']=false;
        updates['settings/pauseStart']='';
        updates['settings/pauseEnd']='';
        
        fetch(fb+'/.json?auth='+ak,{method:'PATCH',body:JSON.stringify(updates)}).then(function(){
          alert('✅ Manutenção finalizada!\n+'+Math.floor(pausa/3600)+'h '+Math.floor((pausa%3600)/60)+'min para '+count+' usuários');
        });
      });
      return
    }
  }
  
  fetch(fb+'/users.json?auth='+ak).then(function(r){return r.json()}).then(function(users){
    users=users||{};
    var user=null;
    
    Object.keys(users).forEach(function(k){
      if(users[k].email&&users[k].email.toLowerCase()===email.toLowerCase()){user=users[k];user.key=k}
    });
    
    if(!user){alert('❌ Email não cadastrado!\n\n'+email);return}
    
    var sub=user.subscription||{};
    var hasDeviceId=user.deviceId&&user.deviceId!=='';
    var hasExpiresAt=sub.expiresAt&&sub.expiresAt!==0;
    
    if(!hasDeviceId||!hasExpiresAt){
      var updates={};
      updates['users/'+user.key+'/deviceId']=deviceId;
      if(!user.name||user.name==='')updates['users/'+user.key+'/name']=nome;
      updates['users/'+user.key+'/subscription/startedAt']=Math.floor(Date.now()/1000);
      updates['users/'+user.key+'/subscription/expiresAt']=calcExp(user.plan);
      updates['users/'+user.key+'/subscription/pausedTotal']=0;
      
      fetch(fb+'/.json?auth='+ak,{method:'PATCH',body:JSON.stringify(updates)}).then(function(){
        alert('✅ Bem-vindo, '+user.user+'!\n\nAssinatura ativada!')
      }).catch(function(e){alert('Erro ao salvar: '+e.message)});
      return
    }
    
    if(user.deviceId!==deviceId){
      alert('❌ Dispositivo não autorizado!');
      return
    }
    
    var agora=Math.floor(Date.now()/1000);
    if(sub.expiresAt!==999999&&agora>sub.expiresAt){
      alert('❌ Assinatura expirada!\n'+fmtT(sub.expiresAt));
      return
    }
    
    alert('✅ Bem-vindo, '+user.user+'!\n\n👑 '+user.type+'\n⏰ '+fmtT(sub.expiresAt)+'\n🤖 IA: '+(user.ia&&user.ia.api?'Configurada':'Não'))
  }).catch(function(e){alert('Erro: '+e.message)})
}).catch(function(e){alert('Erro: '+e.message)})
})();
