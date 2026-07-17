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

function calcExp(dias){
  var d=parseInt(dias);
  if(isNaN(d)||d<1)return 999999;
  return Math.floor(Date.now()/1000)+(d*86400)
}

function fmtT(ts){
  if(ts===999999||ts===0)return 'Vitalício';
  var a=Math.floor(Date.now()/1000);
  var r=ts-a;
  if(r<=0)return 'Expirado';
  var d=Math.floor(r/86400);
  var h=Math.floor((r%86400)/3600);
  var m=Math.floor((r%3600)/60);
  var dt=new Date(ts*1000);
  var ds=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  var dia=ds[dt.getDay()];
  var hh=String(dt.getHours()).padStart(2,'0');
  var mm=String(dt.getMinutes()).padStart(2,'0');
  if(r<60)return r+'s';
  if(r<3600)return m+'min';
  if(r<86400)return h+'h '+m+'min';
  return dia+' '+hh+':'+mm+' ('+d+'D '+h+'h)'
}

var deviceId=getDeviceId();

fetch(fb+'/Users.json?auth='+ak).then(function(r){
  if(!r.ok)throw new Error('Erro '+r.status);
  return r.json()
}).then(function(users){
  users=users||{};
  var user=null;
  
  Object.keys(users).forEach(function(k){
    var u=users[k];
    if(u.Profile&&u.Profile.Email&&u.Profile.Email.toLowerCase()===email.toLowerCase()){
      user=u;
      user.key=k;
    }
  });
  
  if(!user){alert('Email não cadastrado!');return}
  
  var profile=user.Profile||{};
  var plan=user.Plan||{};
  var ai=user.AI||{};
  var agora=Math.floor(Date.now()/1000);
  var duracao=plan.Duracion;
  var updates={};
  
  if(profile.Status==='Banned'){
    alert('CONTA BANIDA\n\nSua conta foi suspensa.');
    return
  }
  
  if(profile.Status==='Disabled'){
    alert('CONTA DESATIVADA\n\nSua conta foi desativada.');
    return
  }
  
  if(profile.Status==='Expired'){
    alert('ASSINATURA EXPIRADA\n\n'+fmtT(duracao)+'\n\nRenove para continuar.');
    return
  }
  
  var isFirstTime=(!profile.Uid||profile.Uid===''||!duracao||duracao==='');
  
  if(isFirstTime){
    updates['Users/'+user.key+'/Profile/Uid']=deviceId;
    updates['Users/'+user.key+'/Profile/Status']='Active';
    updates['Users/'+user.key+'/Plan/Duracion']=calcExp(plan['Validity-Days']);
    
    fetch(fb+'/.json?auth='+ak,{method:'PATCH',body:JSON.stringify(updates)}).then(function(){
      alert('Bem-vindo, '+profile.Username+'!\n\n'+profile.Patent+'\n'+plan.Type+'\n'+fmtT(calcExp(plan['Validity-Days'])))
    }).catch(function(e){alert('Erro ao salvar: '+e.message)});
    return
  }
  
  if(profile.Uid!==deviceId){
    alert('DISPOSITIVO NAO AUTORIZADO\n\nConta vinculada a outro dispositivo.');
    return
  }
  
  if(duracao!==999999&&duracao!==0&&agora>duracao){
    updates['Users/'+user.key+'/Profile/Status']='Expired';
    fetch(fb+'/.json?auth='+ak,{method:'PATCH',body:JSON.stringify(updates)}).then(function(){
      alert('ASSINATURA EXPIRADA\n\nStatus atualizado para Expired.\n'+fmtT(duracao))
    }).catch(function(e){alert('Erro: '+e.message)});
    return
  }
  
  alert('Bem-vindo, '+profile.Username+'!\n\n'+profile.Patent+'\n'+plan.Type+'\n'+fmtT(duracao)+'\nIA: '+(ai.API?'Configurada':'Nao'))
}).catch(function(e){
  alert('Erro de conexao: '+e.message)
})
})();
