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

async function signVerifyCode(_, args){

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

export default{
  loginDo,
  signMakeCode,
  signVerifyCode,
  signDoWithCode
}