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

function calcularExpiracao(plan){
  if(!plan||!plan.number||!plan.type)return 999999;
  var n=parseInt(plan.number);
  if(isNaN(n)||n<1)return 999999;
  var t=plan.type.toLowerCase();
  var agora=Math.floor(Date.now()/1000);
  var multiplicadores={
    min:60,minutos:60,minutes:60,
    h:3600,horas:3600,hours:3600,
    d:86400,dias:86400,days:86400,
    m:2592000,meses:2592000,months:2592000,
    y:31536000,anos:31536000,years:31536000
  };
  if(t==='infinite')return 999999;
  return multiplicadores[t]?agora+(n*multiplicadores[t]):999999
}

function formatarTempo(ts){
  if(ts===999999||ts===0)return '♾️ Vitalício';
  var agora=Math.floor(Date.now()/1000);
  var restante=ts-agora;
  if(restante<=0)return '❌ Expirado';
  var d=Math.floor(restante/86400);
  var h=Math.floor((restante%86400)/3600);
  var m=Math.floor((restante%3600)/60);
  var dt=new Date(ts*1000);
  var dias=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  var dia=dias[dt.getDay()];
  var hh=String(dt.getHours()).padStart(2,'0');
  var mm=String(dt.getMinutes()).padStart(2,'0');
  if(restante<60)return restante+'s';
  if(restante<3600)return m+'min';
  if(restante<86400)return h+'h '+m+'min';
  return dia+' '+hh+':'+mm+' ('+d+'D '+h+'h)'
}

function toTimestamp(dh){
  var p=dh.split(' ');
  var d=p[0].split('/');
  var h=p[1]?p[1].split(':'):['0','0'];
  return Math.floor(new Date(d[2],d[1]-1,d[0],h[0]||0,h[1]||0,0).getTime()/1000)
}

var deviceId=getDeviceId();

fetch(fb+'/settings.json?auth='+ak).then(function(r){return r.json()}).then(function(settings){
  settings=settings||{};
  
  if(settings.maintenance){
    if(settings.pauseActive){
      alert('🔧 SISTEMA EM MANUTENÇÃO\n\nO script está temporariamente indisponível.\nTente novamente mais tarde.');
      return
    }
    
    if(!settings.pauseActive&&settings.pauseStart&&settings.pauseEnd){
      var inicio=toTimestamp(settings.pauseStart);
      var fim=toTimestamp(settings.pauseEnd);
      var tempoPausado=fim-inicio;
      
      if(tempoPausado>0){
        fetch(fb+'/users.json?auth='+ak).then(function(r){return r.json()}).then(function(users){
          users=users||{};
          var updates={};
          var count=0;
          
          Object.keys(users).forEach(function(k){
            var u=users[k];
            if(u.subscription&&u.subscription.expiresAt&&u.subscription.expiresAt!==999999&&u.subscription.expiresAt!==0){
              updates['users/'+k+'/subscription/expiresAt']=u.subscription.expiresAt+tempoPausado;
              updates['users/'+k+'/subscription/pausedTotal']=(u.subscription.pausedTotal||0)+tempoPausado;
              count++;
            }
          });
          
          updates['settings/maintenance']=false;
          updates['settings/pauseActive']=false;
          updates['settings/pauseStart']='';
          updates['settings/pauseEnd']='';
          
          fetch(fb+'/.json?auth='+ak,{method:'PATCH',body:JSON.stringify(updates)}).then(function(){
            var horas=Math.floor(tempoPausado/3600);
            var mins=Math.floor((tempoPausado%3600)/60);
            alert('✅ MANUTENÇÃO FINALIZADA\n\n⏰ Tempo adicionado: '+horas+'h '+mins+'min\n👥 Usuários atualizados: '+count);
          });
        });
        return
      }
    }
  }
  
  fetch(fb+'/users.json?auth='+ak).then(function(r){return r.json()}).then(function(users){
    users=users||{};
    var user=null;
    
    Object.keys(users).forEach(function(k){
      if(users[k].email.toLowerCase()===email.toLowerCase()){user=users[k];user.key=k}
    });
    
    if(!user){alert('❌ Email não encontrado no banco de dados.');return}
    
    var sub=user.subscription||{};
    var isFirstTime=(!user.deviceId||user.deviceId===''||!sub.expiresAt||sub.expiresAt===0);
    
    if(isFirstTime){
      var updates={};
      updates['users/'+user.key+'/deviceId']=deviceId;
      if(!user.name||user.name==='')updates['users/'+user.key+'/name']=nome;
      updates['users/'+user.key+'/subscription/startedAt']=Math.floor(Date.now()/1000);
      updates['users/'+user.key+'/subscription/expiresAt']=calcularExpiracao(user.plan);
      updates['users/'+user.key+'/subscription/pausedTotal']=0;
      
      fetch(fb+'/.json?auth='+ak,{method:'PATCH',body:JSON.stringify(updates)}).then(function(){
        alert('✅ BEM-VINDO, '+user.user+'!\n\n🎉 Sua assinatura foi ativada com sucesso!')
      });
      return
    }
    
    if(user.deviceId!==deviceId){
      alert('❌ DISPOSITIVO NÃO AUTORIZADO\n\nEsta conta está vinculada a outro dispositivo.');
      return
    }
    
    var agora=Math.floor(Date.now()/1000);
    if(sub.expiresAt!==999999&&sub.expiresAt!==0&&agora>sub.expiresAt){
      alert('❌ ASSINATURA EXPIRADA\n\nSua assinatura expirou em:\n'+formatarTempo(sub.expiresAt)+'\n\nEntre em contato para renovar.');
      return
    }
    
    alert('✅ BEM-VINDO, '+user.user+'!\n\n👑 Plano: '+user.type+'\n⏰ Expira: '+formatarTempo(sub.expiresAt)+'\n⏸️ Pausas: '+(sub.pausedTotal?Math.floor(sub.pausedTotal/3600)+'h '+(Math.floor((sub.pausedTotal%3600)/60))+'min':'Nenhuma')+'\n🤖 IA: '+(user.ia&&user.ia.api?'Configurada':'Não configurada'))
  });
}).catch(function(){alert('❌ Erro de conexão com o servidor.')});
})();
