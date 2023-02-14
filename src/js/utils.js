import Cst from './constants.js';

function isPageOnMobile(){
  let viewportWidth = document.documentElement.clientWidth;
  return viewportWidth < Cst.SM_VIEWPORT_SIZE;
}

function handleColorSelection(colorType){

  if(colorType == 'inherit'){
    return 'inherit';
  }
  if(colorType == 'black1'){
    return Cst.COLOR_BLACK1;
  }
  if(colorType == 'black2'){
    return Cst.COLOR_BLACK2;
  }
  if(colorType == 'darkblue1'){
    return Cst.COLOR_DARKBLUE1;
  }
  if(colorType == 'darkblue2'){
    return Cst.COLOR_DARKBLUE1;
  }
  if(colorType == 'gray1'){
    return Cst.COLOR_GRAY1;
  }
  if(colorType == 'lightblue'){
    return Cst.COLOR_LIGHTBLUE;
  }
  if(colorType == 'gray2'){
    return Cst.COLOR_GRAY2;
  }
  if(colorType == 'white'){
    return Cst.COLOR_WHITE;
  }
  console.log("Warning: Wrong custom color selected " + colorType)
  return Cst.COLOR_BLACK1;

}

function handleFontType(fontType){

  let viewportWidth = document.documentElement.clientWidth;
  let fontSize = 'inherit';
  let fontWeight = '500';

  if(fontType == 'page_title'){
    fontSize = viewportWidth > Cst.SM_VIEWPORT_SIZE ? Cst.TEXT_PAGE_TITLE : Cst.SMTEXT_PAGE_TITLE;
    fontWeight = '600';
  }
  else if(fontType == 'title'){
    fontSize = viewportWidth > Cst.SM_VIEWPORT_SIZE ? Cst.TEXT_TITLE : Cst.SMTEXT_TITLE;
    fontWeight = '500';
  }
  else if(fontType == 'small'){
    fontSize = viewportWidth > Cst.SM_VIEWPORT_SIZE ? Cst.TEXT_SMALL : Cst.SMTEXT_SMALL;
    fontWeight = '500';
  }
  else if(fontType == 'small_bold'){
    fontSize = viewportWidth > Cst.SM_VIEWPORT_SIZE ? Cst.TEXT_SMALL : Cst.SMTEXT_SMALL;
    fontWeight = '600';
  }
  else if(fontType == 'normal_bold'){
    fontSize = viewportWidth > Cst.SM_VIEWPORT_SIZE ? Cst.TEXT_NORMAL : Cst.SMTEXT_NORMAL;
    fontWeight = '600';
  }
  else{
    fontSize = viewportWidth > Cst.SM_VIEWPORT_SIZE ? Cst.TEXT_NORMAL : Cst.SMTEXT_NORMAL;
    fontWeight = '500';
  }

  return [fontSize, fontWeight];
}

function getJsonKeyTree(json){

  if(json == null){
    return '{}'
  }

  let primaryK = Object.keys(json);
  let first = true;

  let retString = '{';
  
  try{
    primaryK.forEach(pk => {

      if(isNaN(pk)){
        if(first){
          retString += pk;
          first = false;
        }
        else{
          retString += ', ' + pk;
        }

        let innerJson = getJsonKeyTree(json[pk]);
        if(innerJson != '{}'){
          retString += innerJson;
        }
      }
    });
    retString += '}';
  }
  catch(error){
    return 'getJsonKeyTree error: ' + error.message;
  }

  return retString;
}


function getNameFormated(name){
  let tmp = name.split(' ');
  return ( 
    (tmp[0] ? tmp[0] + ' ' + 
    (tmp[1] ? ' ' + tmp[1].charAt(0) + '.' + 
    (tmp[2] ? ' ' + tmp[2].charAt(0) + '.' : '') : '') : name)
  ).slice(0, 15);
}

function validateMail(mail){
  let mRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
  return mRegex.test(mail);
}

export default{
  handleColorSelection,
  handleFontType,
  isPageOnMobile,
  getJsonKeyTree,
  getNameFormated,
  validateMail
}