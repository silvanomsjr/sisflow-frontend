<template>

  <div>
    <div id="pageBackground" ></div>
    <div id="pageWrapper">
      <!-- Render login and Sign -->
      <router-view v-if="this.createdDone && (this.$route.path == '/' || this.$route.path == '/sign')"/>
      
      <!-- Render other pages -->
      <PageLayout v-else-if="
        this.createdDone && 
        this.userLoggedData != null && 
        this.userAcessAllowed">

        <router-view/>

      </PageLayout>

      <!-- Shows load circle -->
      <LoadModal v-show="!this.msgModalEnabled && (!this.createdDone || this.loadModalEnabled)"/>

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
      userLoggedData: null,
      userAcessAllowed: false,
      tokenData: null,
      pageParams: null,
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
    }
  },

  async created(){

    // verify token in session cache 
    this.tokenData = UserStorage.getTokenJwt();

    if (this.tokenData != null){
      this.userLoggedData = jwt_decode(this.tokenData);

      if (this.$route.meta && this.$route.meta.allowedUsers){
        this.userAcessAllowed = this.$route.meta.allowedUsers.includes(this.userLoggedData['tipo']);
        
        if(!this.userAcessAllowed){
          let self = this;
          this.renderMsg(
            'warn', 
            'Acesso não permitido!', 
            'O usuário não possui permissão para acessar esta pagina.',
            function () { self.$root.renderView('home'); });
        }
      }
    }
    
    // page is only created after getting user data
    this.createdDone = true;
  },

  watch:{
    // when route changes, verify viewName to block unauthorized acess
    $route(to){
      let viewName = to.name;

      // access non login/sign url without user logged
      if( (this.tokenData == null || this.userLoggedData == null) && viewName != 'login' && viewName != 'sign' ){
        this.$router.push({ name: 'login' });
      }
      // verifies if user is allowed to access a page with allowedUsers
      else if(this.userLoggedData && this.$route.meta && this.$route.meta.allowedUsers){
        this.userAcessAllowed = this.$route.meta.allowedUsers.includes(this.userLoggedData['tipo']);
        
        if(!this.userAcessAllowed){
          let self = this;
          this.renderMsg(
            'warn', 
            'Acesso não permitido!', 
            'O usuário não possui permissão para acessar esta pagina.',
            function () { self.$root.renderView('home'); });
        }
      }

      // unauthorized acess
    }
  },

  methods: {

    /** Render methods **/
    renderView(viewName, viewParams = null){

      this.pageParams = null;

      // no user data
      if( (this.userLoggedData == null || this.tokenData == null) && viewName != 'login' && viewName != 'sign'){
        this.$router.push({ name: 'login' });
      }
      else{
        if(viewParams != null){
          this.pageParams = viewParams;
          this.$router.push({ name: viewName });
        }
        else{
          this.$router.push({ name: viewName });
        }
      }
    },
    renderMsg(msgType, msgTitle, msgInfo, msgOkFunction = null, msgAcceptFunction = null, msgRejectFunction = null){
      this.msgType = msgType;
      this.msgTitle = msgTitle;
      this.msgInfo = msgInfo;
      this.msgAccept = msgAcceptFunction == null ? false : true;
      this.msgReject = msgRejectFunction == null ? false : true;
      this.msgOkFunction = msgOkFunction;
      this.msgAcceptFunction = msgAcceptFunction;
      this.msgRejectFunction = msgRejectFunction;
      
      this.msgModalEnabled = true;
    },
    renderRequestErrorMsg(vreturn, knownMsgs){

      var isKnownMsg = false;

      if(vreturn && vreturn['response']){
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
    
    clearLoginData(){
      UserStorage.removeTokenJwt();
      this.tokenData = null;
      this.userLoggedData = null;
    },
    /**  **/

    /** Requests methods **/
    async doLoginRequest(mailV, passV){

      let vreturn = await this.doRequest(Requests.doLogin, [mailV, passV]);

      if(vreturn && vreturn['ok']){
        let token = vreturn['response'];
        UserStorage.setTokenJwt(token);
        this.tokenData = token;
        this.userLoggedData = jwt_decode(this.tokenData);
      }

      return vreturn;
    },
    async doRequest(requestF, requestArgs) {

      var vreturn = {};

      try{
        this.loadModalEnabled = true;
        vreturn = await requestF(this.tokenData, requestArgs);
      }
      catch(error){
        vreturn['method'] = 'Exception in doRequest method: ' + error.message;
      }
      finally{
        this.loadModalEnabled = false;
      }
      return vreturn;
    }
    /** **/
  }
}
</script>

<style>

#pageWrapper {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-weight: 500;
  font-size: 18px;
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