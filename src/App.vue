<template>

  <div id="appWrapper">
    <div id="pageBackground" ></div>
    <div id="pageWrapper">
      <!-- Render login and Sign -->
      <router-view v-if="this.createdDone && this.mountedDone && (this.$route.path == '/' || this.$route.path == '/sign')"/>
      
      <!-- Render other pages -->
      <PageLayout v-else-if="
        this.createdDone &&
        this.mountedDone &&
        this.userLoggedData != null && 
        this.userAcessAllowed">

        <router-view/>

      </PageLayout>

      <!-- Shows load circle -->
      <LoadModal v-show="!this.msgModalEnabled && (!this.createdDone || !this.mountedDone || this.loadModalEnabled)"/>

      <!-- Shows message modal -->
      <MsgModal ref='warningMsg' v-show="this.msgModalEnabled"
        :msgType="this.msgType"
        :msgInfo="this.msgInfo"
        :msgTitle="this.msgTitle"
        :msgAccept="this.msgAccept"
        :msgReject="this.msgReject"
        @ok="this.msgOkFunction"
        @accept="this.msgAcceptFunction"
        @reject="this.msgRejectFunction"
      />
    </div>
  </div>

</template>

<script>

import Cst from './js/constants.js'
import jwt_decode from 'jwt-decode'
import LoadModal from './components/LoadModal.vue'
import MsgModal from './components/MsgModal.vue'
import PageLayout from './components/PageLayout.vue'
import Requests from './js/requests.js'
import UserStorage from './js/userStorage.js'
import Utils from './js/utils.js'

export default {

  name: 'App',
  
  components: {
    LoadModal,
    PageLayout,
    MsgModal
  },

  data() {
    return {
      createdDone: false,
      mountedDone: false,
      userLoggedData: null,
      userAcessAllowed: false,
      userJwtToken: null,
      pageName: '',

      loadModalEnabled: false,

      msgModalEnabled: false,
      msgType: 'ok',
      msgTitle: 'Title',
      msgInfo: 'Message',
      msgAccept: false,
      msgReject: false,
      msgOkFunction: null,
      msgAcceptFunction: null,
      msgRejectFunction: null,
      renderMsgButtonPressed: false,
      renderMsgAccepted: true
    }
  },

  created(){

    // verify token in session cache 
    this.userJwtToken = UserStorage.getTokenJwt();

    if (this.userJwtToken != null){
      this.userLoggedData = jwt_decode(this.userJwtToken);

      if(this.$route.meta && this.$route.meta.allowedUsers){

        this.userAcessAllowed = this.isUserAllowedForPage(this.userLoggedData, this.$route.meta.allowedUsers);

        if(!this.userAcessAllowed){
          this.renderUserNotAllowedMsg();
        }
      }
    }

    // page is only rendered after getting user data
    this.createdDone = true;
  },

  mounted() {
    // page is only rendered starting dynamic css colors vars
    this.startCssDynamicColors();
    this.mountedDone = true;
  },

  watch:{
    // when route changes, verify viewName to block unauthorized acess
    $route(to){
      let viewName = to.name;

      // access non login/sign url without user logged
      if( (this.userJwtToken == null || this.userLoggedData == null) && viewName != 'login' && viewName != 'sign' ){
        this.$router.push({ name: 'login' });
      }
      // verifies if user is allowed to access a page with allowedUsers
      else if(this.userLoggedData && this.$route.meta && this.$route.meta.allowedUsers){

        this.userAcessAllowed = this.isUserAllowedForPage(this.userLoggedData, this.$route.meta.allowedUsers);

        if(!this.userAcessAllowed){
          this.renderUserNotAllowedMsg();
          return;
        }
      }
    }
  },

  methods: {

    /** Render methods **/
    renderView(viewName, viewQueryParams = null){
      
      // no user data, redirect to login
      if( (this.userLoggedData == null || this.userJwtToken == null) && viewName != 'login' && viewName != 'sign'){
        this.$router.push({ name: 'login' });
        return;
      }

      if(viewQueryParams != null){
        this.$router.push({ name: viewName, query: viewQueryParams });
      }
      else{
        this.$router.push({ name: viewName });
      }
    },
    async waitRenderMsgButtonPress() {
      let timeout = async ms => new Promise(res => setTimeout(res, ms));

      this.renderMsgButtonPressed = false;
      while (this.renderMsgButtonPressed === false){
        await timeout(100);
      }
      this.renderMsgButtonPressed = false;
    },
    async finishWaitRenderMsgButtonPress(isAccepted){
      this.renderMsgAccepted = isAccepted;
      this.renderMsgButtonPressed = true;
    },
    async renderMsg(msgType, msgTitle, msgInfo, msgOkFunction = null, msgAcceptFunction = null, msgRejectFunction = null, awaitForClick = null){
      this.msgType = msgType;
      this.msgTitle = msgTitle;
      this.msgInfo = msgInfo;
      this.msgAccept = msgAcceptFunction == null ? false : true;
      this.msgReject = msgRejectFunction == null ? false : true;
      this.msgOkFunction = msgOkFunction;
      this.msgAcceptFunction = msgAcceptFunction;
      this.msgRejectFunction = msgRejectFunction;
      
      this.msgModalEnabled = true;

      if(awaitForClick){
        await this.waitRenderMsgButtonPress();
        return this.renderMsgAccepted;
      }
    },
    renderUserNotAllowedMsg(){
      let pageContext = this;
      this.renderMsg(
        'warn', 
        'Acesso não permitido!', 
        'O usuário não possui permissão para acessar esta pagina.',
        function () { pageContext.renderView('home'); });
    },
    renderRequestErrorMsg(vreturn, knownMsgs = null){

      var isKnownMsg = false;

      if(vreturn && vreturn['response'] && knownMsgs){
        knownMsgs.forEach(knownMsg => {
          if(!isKnownMsg && vreturn['response']['message'] == knownMsg){
            this.renderMsg('warn', '', vreturn['response']['message']);
            isKnownMsg = true;
          }
        });
      }
      
      if(!isKnownMsg){
        var errorMsgs = ['Um erro ocorreu, informações:'];

        if(typeof vreturn === 'string'){
          errorMsgs.push(vreturn);
        }
        else{
          if(vreturn['location']){
            errorMsgs.push(vreturn['location']);
          }
          if(vreturn['response']){
            errorMsgs.push( Utils.getJsonKeyTree(vreturn['response']) );
            if(vreturn['response']['message']){
              errorMsgs.push(vreturn['response']['message']);
            }
          }
          if(vreturn['method']){
            errorMsgs.push(vreturn['method']);
          }
        }
        this.renderMsg('error', '', errorMsgs);
      }
    },

    /** Requests methods **/
    async doLoginRequest(mailV, passV){

      let vreturn = await this.doRequest(Requests.loginDo, [mailV, passV]);

      if(vreturn && vreturn['ok']){
        let token = vreturn['response'];
        UserStorage.setTokenJwt(token);
        this.userJwtToken = token;
        this.userLoggedData = jwt_decode(this.userJwtToken);
      }

      return vreturn;
    },
    async doRequest(requestF, requestArgs, enableLadingModal=true) {

      var vreturn = {};

      try{
        if(enableLadingModal){
          this.loadModalEnabled = true;
        }
        vreturn = await requestF(this.userJwtToken, requestArgs);
      }
      catch(error){
        vreturn['method'] = 'Exception in doRequest method: ' + error.message;
      }
      finally{
        this.loadModalEnabled = false;
      }
      return vreturn;
    },
    /** **/

    /** Other methods */

    startCssDynamicColors(){
      let appWrapper = document.getElementById('appWrapper');

      Cst.DYNAMIC_CSS_VARS.forEach(cssVar => {
        appWrapper.style.setProperty(cssVar['label'], cssVar['value']);
      });
    },

    isUserAllowedForPage(userData, allowedUsers){
      
      if(!userData){
        return false;
      }

      // if pages allows acess to all users
      if(allowedUsers == 'ALL' || allowedUsers == 'DYNAMIC'){
        return true;
      }

      // foreach allowed type of user for page verify if user is one
      let allowed = false;
      allowedUsers.forEach(allowedUser => {
        if(userData['profile_acronyms'].includes(allowedUser)){
          allowed = true;
        }
      });
      return allowed;
    },

    clearLoginData(){
      UserStorage.removeTokenJwt();
      this.userJwtToken = null;
      this.userLoggedData = null;
    },
    /**  **/
  }
}
</script>

<style>

#pageWrapper {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-weight: 500;
  font-size: var(--font-size-normal);
}
@media (min-width: 900px) {
  .shownOnlyOnMobile{
    display: none !important;
  }
}
@media (max-width: 900px) {
  .shownOnlyOnNotMobile{
    display: none !important;
  }
}

</style>

<style scoped>

#pageBackground {
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: #F0F2F5;
  z-index: -1;
}
#pageWrapper {
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  z-index: 1;
}

</style>