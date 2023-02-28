const base_url = `${process.env.VUE_APP_SERVICE_URL}`

// Used to avoid code duplication on requests
async function baseRequestFBody(headers, endpoint){

  var vreturn = {};

  try{
    vreturn['response'] = await fetch(`${base_url}${endpoint}`, headers);
    vreturn['status'] = vreturn['response'].status;

    let vreturnOk = vreturn['response'].ok;

    if(vreturn['response']['statusText'] != 'NO CONTENT'){
      vreturn['response'] = await vreturn['response'].json();
    }
    
    // if ok, return
    if(vreturnOk){
      vreturn['ok'] = true;
      return vreturn;
    }

    // if not, location is set to return error message
    vreturn['ok'] = false;
    vreturn['location'] = `Return in ${endpoint}`;

    return vreturn;
  }
  catch(error){
    vreturn['ok'] = false;
    vreturn['location'] = `Exception in ${endpoint}`;
    vreturn['message'] = error.message;

    return vreturn;
  }
}

// do auth with user login mail password
async function loginDo(_, args){

  let userMailIns = args[0];
  let userPass = args[1];

  let auth = window.btoa(`${userMailIns}:${userPass}`);
  
  var myHeaders = {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Basic ${auth}`
    }
  }

  let vreturn = await baseRequestFBody(myHeaders, 'login');
  return vreturn;
}

async function signMakeCode(_, args){
  
  let mailIns = args[0];

  var myHeaders = {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'email_ins': mailIns
    })
  }

  let vreturn = await baseRequestFBody(myHeaders, 'sign');
  return vreturn;
}

async function signVerifyCodeData(_, args){

  let emailIns = args[0];
  let cadCode = args[1];

  var myHeaders = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    }
  }

  var querystring = `?email_ins=${emailIns}&cad_code=${cadCode}`;

  let vreturn = await baseRequestFBody(myHeaders, `sign${querystring}`);
  return vreturn;
}

async function signVerifyCodeToken(_, args){

  let token = args[0];

  var myHeaders = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    }
  }

  var querystring = `?acess_token=${token}`;

  let vreturn = await baseRequestFBody(myHeaders, `sign${querystring}`);
  return vreturn;
}

async function signDoWithCode(_, args){
  
  let emailIns = args[0];
  let emailSec = args[1];
  let telefone = args[2]
  let senha = args[3];
  let cadCode = args[4];

  var myHeaders = {
    method: 'PUT',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'email_ins': emailIns,
      'email_sec': emailSec,
      'telefone': telefone,
      'senha': senha,
      'cad_code': cadCode
    })
  }

  let vreturn = await baseRequestFBody(myHeaders, 'sign');
  return vreturn;
}

async function getSolicitations(token_jwt, args){
  
  args;

  var myHeaders = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${token_jwt}`
    }
  }

  let vreturn = await baseRequestFBody(myHeaders, 'solicitations');
  return vreturn;
}

async function putSolicitation(token_jwt, args){
  
  let id_solicitacao = args[0];

  var myHeaders = {
    method: 'PUT',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${token_jwt}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'id_solicitacao': id_solicitacao
    })
  }

  let vreturn = await baseRequestFBody(myHeaders, 'solicitation');
  return vreturn;
}

async function getSolicitation(token_jwt, args){
  
  let solicitation = args[0];
  let solicitation_step_order = args[1];

  var myHeaders = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${token_jwt}`
    }
  }
  var querystring = `?solicitation=${solicitation}&solicitation_step_order=${solicitation_step_order}`;

  let vreturn = await baseRequestFBody(myHeaders, `solicitation${querystring}`);
  return vreturn;
}

export default{
  loginDo,
  signMakeCode,
  signVerifyCodeData,
  signVerifyCodeToken,
  signDoWithCode,
  getSolicitations,
  getSolicitation,
  putSolicitation
}