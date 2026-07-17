void(function(){
if(!location.hostname.includes('redacao.pr.gov.br')){
  alert('Este script só funciona no site Redação Paraná.');
  return;
}

function decodificarToken(t){
  try{var p=t.split('.');if(p.length===3)return JSON.parse(atob(p[1]))}catch(e){}
  return null;
}

function codificarToken(payload){
  var h={alg:'HS256',typ:'JWT'};
  var H=btoa(JSON.stringify(h)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  var B=btoa(JSON.stringify(payload)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  return H+'.'+B+'.ORIGINAL';
}

function dataStr(u){return u?new Date(parseInt(u)*1000).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'}):'Não definida';}

function editarExpiracao(callback){
  var expAtual=localStorage.getItem('ExpiresAt');
  var op=prompt('Definir expiração:\n1-Data e hora (dd/mm/aaaa hh:mm)\n2-Minutos\n3-Horas\n4-Dias\n5-Nunca expira\n6-Unix timestamp\n\nAtual: '+dataStr(expAtual));
  if(!op)return;
  if(op==='1'){
    var dh=prompt('Data e hora (dd/mm/aaaa hh:mm):');
    if(dh){var p=dh.split(' ');var d=p[0].split('/');var h=p[1]?p[1].split(':'):['23','59'];var dt=new Date(d[2],d[1]-1,d[0],h[0]||23,h[1]||59,0);callback(Math.floor(dt.getTime()/1000),dt.toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}));}
  }else if(op==='2'){
    var m=parseInt(prompt('Minutos:'));
    if(m>0){var dt=new Date();dt.setMinutes(dt.getMinutes()+m);callback(Math.floor(dt.getTime()/1000),dt.toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}));}
  }else if(op==='3'){
    var h=parseFloat(prompt('Horas (ex: 2.5):'));
    if(h>0){var dt=new Date();dt.setHours(dt.getHours()+Math.floor(h));dt.setMinutes(dt.getMinutes()+Math.round((h%1)*60));callback(Math.floor(dt.getTime()/1000),dt.toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}));}
  }else if(op==='4'){
    var d=parseInt(prompt('Dias:'));
    if(d>0){var dt=new Date();dt.setDate(dt.getDate()+d);callback(Math.floor(dt.getTime()/1000),dt.toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}));}
  }else if(op==='5'){
    callback(4102444800,'31/12/2099 23:59:59');
  }else if(op==='6'){
    var u=prompt('Unix timestamp:');
    if(u&&!isNaN(u))callback(parseInt(u),new Date(parseInt(u)*1000).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}));
  }
}

function backup(key){
  if(!localStorage.getItem('_backup_'+key))localStorage.setItem('_backup_'+key,localStorage.getItem(key)||'');
}

var acao=prompt('🔧 PAINEL REDAÇÃO PARANÁ\n\n1 - 📋 Ver todos os dados\n2 - 🖼️ Editar dados VISUAIS\n3 - 🔐 Editar TOKEN JWT\n4 - ♻️ Restaurar backup original\n\nDigite o número:');
if(!acao)return;

if(acao==='1'){
  var i='=== 📦 LOCAL STORAGE ===\n\n';
  i+='👤 Name: '+(localStorage.getItem('Name')||'Vazio')+'\n';
  i+='📧 Email: '+(localStorage.getItem('Email')||'Vazio')+'\n';
  i+='🆔 ProfileId: '+(localStorage.getItem('ProfileId')||'Vazio')+'\n';
  i+='🔒 IsReadOnly: '+(localStorage.getItem('IsReadOnly')||'Vazio')+'\n';
  i+='👑 Tipo: '+(localStorage.getItem('AccountType')||localStorage.getItem('Role')||localStorage.getItem('UserType')||'Não definido')+'\n';
  i+='⏰ ExpiresAt: '+dataStr(localStorage.getItem('ExpiresAt'))+'\n';
  i+='🔄 RefreshToken: '+(localStorage.getItem('RefreshToken')||'Vazio')+'\n';
  var token=localStorage.getItem('Token');
  i+='🎫 Token: '+(token?token.substring(0,50)+'...':'Vazio');
  
  if(token){
    var payload=decodificarToken(token);
    if(payload){
      i+='\n\n=== 🔐 TOKEN JWT ===\n';
      i+='👤 unique_name: '+(payload.unique_name||'N/D')+'\n';
      i+='📧 email: '+(payload.email||'N/D')+'\n';
      i+='📝 sub: '+(payload.sub||'N/D')+'\n';
      i+='🆔 sid: '+(payload.sid||'N/D')+'\n';
      i+='👑 role: '+(payload.role||payload.Role||payload.userType||'N/D')+'\n';
      i+='⏰ exp: '+dataStr(payload.exp)+'\n';
      i+='🕐 iat: '+dataStr(payload.iat);
    }
  }
  alert(i);
  
}else if(acao==='2'){
  var c=prompt('EDITAR VISUAIS\n\n1-👤 Nome\n2-📧 Email\n3-🆔 Profile ID\n4-👑 Tipo da conta\n5-⏰ Expiração');
  if(c==='1'){var v=prompt('Novo nome:');if(v){backup('Name');localStorage.setItem('Name',v);alert('✅ Nome: '+v);}}
  else if(c==='2'){var v=prompt('Novo email:');if(v){backup('Email');localStorage.setItem('Email',v);alert('✅ Email: '+v);}}
  else if(c==='3'){var v=prompt('Novo Profile ID:');if(v){backup('ProfileId');localStorage.setItem('ProfileId',v);alert('✅ ID: '+v);}}
  else if(c==='4'){
    var v=prompt('Novo tipo (Admin, Professor, Aluno, Premium, Free):');
    if(v){
      backup('AccountType');backup('IsReadOnly');
      localStorage.setItem('AccountType',v);
      localStorage.setItem('Role',v);
      localStorage.setItem('UserType',v);
      localStorage.setItem('IsReadOnly',v.toLowerCase()==='aluno'||v.toLowerCase()==='free'?'undefined':'');
      alert('✅ Tipo: '+v);
    }
  }else if(c==='5'){
    backup('ExpiresAt');
    editarExpiracao(function(unix,data){
      localStorage.setItem('ExpiresAt',unix);
      alert('✅ Expiração: '+data);
    });
  }
  
}else if(acao==='3'){
  var token=localStorage.getItem('Token');
  if(!token){alert('❌ Token não encontrado!');return;}
  var payload=decodificarToken(token);
  if(!payload){alert('❌ Token inválido!');return;}
  
  var c=prompt('EDITAR TOKEN JWT\n\n1-👤 unique_name: '+(payload.unique_name||'N/D')+'\n2-📧 email: '+(payload.email||'N/D')+'\n3-📝 sub: '+(payload.sub||'N/D')+'\n4-🆔 sid: '+(payload.sid||'N/D')+'\n5-👑 role: '+(payload.role||payload.Role||payload.userType||'N/D')+'\n6-⏰ exp: '+dataStr(payload.exp)+'\n7-🕐 iat: '+dataStr(payload.iat));
  if(!c)return;
  
  backup('Token');
  
  if(c==='1'){var v=prompt('unique_name:');if(v){payload.unique_name=v;}}
  else if(c==='2'){var v=prompt('email:');if(v){payload.email=v;}}
  else if(c==='3'){var v=prompt('sub:');if(v){payload.sub=v;}}
  else if(c==='4'){var v=prompt('sid:');if(v){payload.sid=v;}}
  else if(c==='5'){
    var v=prompt('role (Admin, Professor, Aluno):');
    if(v){if(payload.role)payload.role=v;if(payload.Role)payload.Role=v;if(payload.userType)payload.userType=v;}
  }else if(c==='6'){
    editarExpiracao(function(unix){payload.exp=unix;});
  }else if(c==='7'){
    var o=prompt('Definir iat:\n1-Data (dd/mm/aaaa hh:mm)\n2-Agora\n3-Unix');
    if(o==='1'){var dh=prompt('Data e hora:');if(dh){var p=dh.split(' ');var d=p[0].split('/');var h=p[1]?p[1].split(':'):['23','59'];payload.iat=Math.floor(new Date(d[2],d[1]-1,d[0],h[0]||23,h[1]||59,0).getTime()/1000);}}
    else if(o==='2'){payload.iat=Math.floor(Date.now()/1000);}
    else if(o==='3'){var u=prompt('Unix:');if(u&&!isNaN(u))payload.iat=parseInt(u);}
  }else{return;}
  
  localStorage.setItem('Token',codificarToken(payload));
  alert('✅ Token JWT alterado!\n\n⚠️ A assinatura foi quebrada. O servidor rejeitará este token em requisições.');
  
}else if(acao==='4'){
  var restaurados=[];
  ['Name','Email','ProfileId','Token','RefreshToken','ExpiresAt','IsReadOnly','AccountType','Role','UserType'].forEach(function(k){
    var b=localStorage.getItem('_backup_'+k);
    if(b!==null){localStorage.setItem(k,b);restaurados.push(k);}
  });
  alert(restaurados.length>0?'✅ Restaurados: '+restaurados.join(', '):'❌ Nenhum backup.');
}else{
  alert('❌ Opção inválida!');
}
})();
