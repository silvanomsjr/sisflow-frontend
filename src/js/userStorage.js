// user token management methods, saved in session cache (not persistent locally for security)
function getTokenJwt() {
  let data = window.sessionStorage.getItem('jwt');
  return data != null && data != 'null' ? data : null;
}

function setTokenJwt(value) {
  window.sessionStorage.setItem('jwt', value);
}

function removeTokenJwt() {
  sessionStorage.removeItem('jwt');
}

export default{
  getTokenJwt,
  setTokenJwt,
  removeTokenJwt
}