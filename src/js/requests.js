var sha256 = require('js-sha256');

const base_url = `${process.env.VUE_APP_LOCAL_URL}`

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
async function doLogin(_, args){

  let userMailIns = args[0];
  let userPass = args[1];

  // password is encrypted with SHA-256 algorithm for security
  let userPassHash = sha256(userPass);
  let auth = window.btoa(`${userMailIns}:${userPassHash}`);
  
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

async function signGetCode(_, args){
  
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

async function doSign(_, args){
  
  let mailIns = args[0];
  let emailSec = args[1];
  let hashSenha = sha256(args[2]);
  let cadCode = args[3];

  var myHeaders = {
    method: 'PUT',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'email_ins': mailIns,
      'email_sec': emailSec,
      'hash_senha': hashSenha,
      'cad_code': cadCode
    })
  }

  let vreturn = await baseRequestFBody(myHeaders, 'sign');
  return vreturn;
}

export default{
  doLogin,
  signGetCode,
  doSign
}