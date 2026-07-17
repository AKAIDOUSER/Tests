void(function(){
if(!location.hostname.includes('redacao.pr.gov.br')){alert('Site errado!');return}
var nome=localStorage.getItem('Name');
var email=localStorage.getItem('Email');
if(!nome||!email){alert('Faça login!');return}
if(!email.endsWith('@escola.pr.gov.br')){alert('Email inválido!');return}

function getID(){
  try{
    var t=localStorage.getItem('Token');
    if(t){var p=JSON.parse(atob(t.split('.')[1]));if(p.sid)return p.sid;if(p.eid)return p.eid}
    var l=localStorage.getItem('eid')||localStorage.getItem('sid');
    if(l)return l;
    return 'D-'+Date.now().toString(36)
  }catch(e){return 'D-'+Date.now()}
}

function calcD(v){
  if(!v||!v.Number||!v.Type)return 999999;
  var n=parseInt(v.Number);
  if(isNaN(n)||n<1)return 999999;
  var t=v.Type.toLowerCase();
  var a=Math.floor(Date.now()/1000);
  var m={min:60,minutos:60,minutes:60,h:3600,horas:3600,hours:3600,d:86400,dias:86400,days:86400,m:2592000,meses:2592000,months:2592000,y:31536000,anos:31536000,years:31536000};
  return m[t]?a+(n*m[t]):t==='infinite'?999999:999999
}

function fmtT(ts){
  if(ts===999999||ts===0)return 'Vitalício';
  var a=Math.floor(Date.now()/1000);
  var r=ts-a;
  if(r<=0)return 'Expirado';
  var d=Math.floor(r/86400);
  var h=Math.floor((r%86400)/3600);
  var mi=Math.floor((r%3600)/60);
  var dt=new Date(ts*1000);
  var ds=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  var sd=ds[dt.getDay()];
  var hh=String(dt.getHours()).padStart(2,'0');
  var mm=String(dt.getMinutes()).padStart(2,'0');
  if(r<60)return r+'s';
  if(r<3600)return mi+'min';
  if(r<86400)return h+'h '+mi+'min';
  if(r<172800)return sd+', '+hh+':'+mm+' (1D '+h+'h)';
  return sd+', '+hh+':'+mm+' ('+d+'D)'
}

var id=getID();
var fb='https://script-b4955-default-rtdb.firebaseio.com';
var ak='AIzaSyBBtmp2uV5ZlCUqD1tRGDdssfsSHgkYGwY';

fetch(fb+'/Users.json?auth='+ak).then(function(r){return r.json()}).then(function(d){
  var u=null;
  Object.keys(d||{}).forEach(function(k){if(d[k].Email.toLowerCase()===email.toLowerCase()){u=d[k];u.key=k}});
  if(!u){alert('Email não encontrado!');return}
  var ib=u.Uid||'';
  var db=u.Duracion;
  if(!ib||!db||db===''||db===0){
    var nd={};
    if(!u.Name||u.Name==='')nd.Name=nome;
    nd.Uid=id;
    nd.Duracion=u.Validity?calcD(u.Validity):999999;
    fetch(fb+'/Users/'+u.key+'.json?auth='+ak,{method:'PATCH',body:JSON.stringify(nd)}).then(function(){alert('✅ Bem-vindo, '+u.User+'!')});
    return
  }
  if(ib!==id){alert('❌ Dispositivo não autorizado!');return}
  var a=Math.floor(Date.now()/1000);
  if(db!==999999&&db!==0&&a>db){alert('❌ Acesso expirado!\n'+fmtT(db));return}
  alert('✅ Bem-vindo, '+u.User+'!\n\n👑 '+u.Type+'\n⏰ '+fmtT(db)+'\n🤖 '+(u.Ia&&u.Ia.API||'Nenhum'))
}).catch(function(){alert('Erro de conexão!')})
})();
