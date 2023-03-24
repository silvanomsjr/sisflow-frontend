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
  
  let insEmail = args[0];

  var myHeaders = {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'institutional_email': insEmail
    })
  }

  let vreturn = await baseRequestFBody(myHeaders, 'sign');
  return vreturn;
}

async function signVerifyCodeData(_, args){

  let insEmail = args[0];
  let valCode = args[1];

  var myHeaders = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    }
  }

  var querystring = `?institutional_email=${insEmail}&validation_code=${valCode}`;

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
  
  let insEmail = args[0];
  let secEmail = args[1];
  let phone = args[2]
  let plainPass = args[3];
  let valCode = args[4];

  var myHeaders = {
    method: 'PUT',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'institutional_email': insEmail,
      'secondary_email': secEmail,
      'phone': phone,
      'plain_password': plainPass,
      'validation_code': valCode
    })
  }

  let vreturn = await baseRequestFBody(myHeaders, 'sign');
  return vreturn;
}

async function getCoordinatorSolicitations(token_jwt, args){

  args;

  var myHeaders = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${token_jwt}`
    }
  }

  let vreturn = await baseRequestFBody(myHeaders, '/coordinator/solicitations');
  console.log(vreturn);
  return vreturn;
}

async function getProfessorSolicitations(token_jwt, args){

  args;

  var myHeaders = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${token_jwt}`
    }
  }

  let vreturn = await baseRequestFBody(myHeaders, '/professor/solicitations');
  return vreturn;
}

async function getStudentSolicitations(token_jwt, args){

  args;

  var myHeaders = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${token_jwt}`
    }
  }

  let vreturn = await baseRequestFBody(myHeaders, '/student/solicitations');
  return vreturn;
}

async function getSolicitation(token_jwt, args){
  
  let userHasStepId = args[0];
  
  var myHeaders = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${token_jwt}`
    }
  }
  
  var querystring = `?user_has_step_id=${userHasStepId}`;
  let vreturn = await baseRequestFBody(myHeaders, `solicitation${querystring}`);
  return vreturn;
}

async function putSolicitation(token_jwt, args){
  
  let solicitationId = args[0];

  var myHeaders = {
    method: 'PUT',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${token_jwt}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'solicitation_id': solicitationId
    })
  }

  let vreturn = await baseRequestFBody(myHeaders, 'solicitation');
  return vreturn;
}

async function postSolicitation(token_jwt, args){
  
  let student_id = args[0];
  let solicitation_id = args[1];
  let solicitation_step_order = args[2];
  let solicitation_data = args[3];

  var myHeaders = {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${token_jwt}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'student_id': student_id,
      'solicitation_id': solicitation_id,
      'solicitation_step_order': solicitation_step_order,
      'solicitation_data': solicitation_data
    })
  }

  let vreturn = await baseRequestFBody(myHeaders, 'solicitation');
  return vreturn;
}

export default{
  loginDo,
  signMakeCode,
  signVerifyCodeData,
  signVerifyCodeToken,
  signDoWithCode,
  getCoordinatorSolicitations,
  getProfessorSolicitations,
  getStudentSolicitations,
  getSolicitation,
  putSolicitation,
  postSolicitation
}