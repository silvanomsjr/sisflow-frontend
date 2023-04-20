const brasilApi = `${process.env.VUE_APP_EXTERNAL_SERVICE_BRASILAPI}`

// Must be used once a year
async function getNationalHolidays(year){

  // formatted response
  var fResp = {};

  try{
    fResp['response'] = await fetch(`${brasilApi}feriados/v1/${year}`);
    fResp['status'] = fResp['response'].status;

    let fRespOk = fResp['response'].ok;

    if(fResp['response']['statusText'] != 'NO CONTENT'){
      fResp['response'] = await fResp['response'].json();
    }
    
    // if ok, return
    if(fRespOk){
      fResp['ok'] = true;
      return fResp;
    }

    // if not, location is set to return error message
    fResp['ok'] = false;
    fResp['location'] = `Return in ${brasilApi}`;

    return fResp;
  }
  catch(error){
    fResp['ok'] = false;
    fResp['location'] = `Exception in ${brasilApi}`;
    fResp['message'] = error.message;

    return fResp;
  }
}

export default{
  getNationalHolidays
}