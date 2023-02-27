<template>

  <div v-if="this.createdDone">
    
    <div id="descBoxTop" v-show="this.pageData['descricao_top']"></div>

    <div id="uploadsBox" v-if="this.pageData['anexos']">
      <div v-for="(item, index) in this.pageData['anexos']" :key="index">
        <FileUpload :id="'fileupht' + index" class="fileU"
          :titleText="item['label_txt']"
          :fileDirName="item['file_abs_type']"
          :uploadEndpoint="this.fileUploadEndpoint"
        />
      </div>
    </div>

    <div id="descBoxMid" v-show="this.pageData['descricao_mid']"></div>

    <div class="sendSolicitationWrapper">
      <div class="sendSolicitationBtnWrapper" v-if="this.pageData['enviar_req'] == true">
        <ButtonCustom
          id="btnSend"
          label="Solicitar"
          customTextColor="white"
          customBackColor="darkblue1"
          customFontSize="normal"
          width="100%"
          padding="3px 20px"
          @click="doSolicitation"
          />
      </div>
    </div>

    <div id="descBoxBot" v-show="this.pageData['descricao_bot']"></div>

  </div>

</template>

<script>

import ButtonCustom from '../components/ButtonCustom.vue'
import FileUpload from '../components/FileUpload.vue'

export default {
  
  name: 'DynamicSolicitationView',

  components: {
    ButtonCustom,
    FileUpload
  },

  data() {
    return {
      createdDone: false,
      pageData: [],
      fileUploadEndpoint: ''
    }
  },

  created() {

    let pageContext = this;

    // verify query params
    if(!this.$route.query || !this.$route.query['page_data']){
      this.$root.renderMsg(
        'error', 
        'Pagina de solicitação inválida!',
        '',
        function () { pageContext.$root.renderView('home'); });
      return;
    }

    this.pageData = JSON.parse(this.$route.query['page_data']);
    
    // if data is not correct
    if(!this.isCorrectRequiredPageDataFields()){
      this.$root.renderMsg(
        'error', 
        'Pagina de solicitação inválida!', 
        'Verifique com o coordenador se o erro persistir!',
        function () { pageContext.$root.renderView('home'); });
      return;
    }

    // if user not allowed
    if(!this.$root.isUserAllowedForPage(this.$root.userLoggedData, this.pageData['perfis_permitidos'])){
      this.$root.renderUserNotAllowedMsg();
      return;
    }

    this.$root.pageName = this.pageData['titulo'];

    this.createdDone = true;
  },

  mounted() {
    this.descBoxTop = document.getElementById('descBoxTop');
    this.descBoxMid = document.getElementById('descBoxMid');
    this.descBoxBot = document.getElementById('descBoxBot');
    this.fileUploadEndpoint = process.env.VUE_APP_SERVICE_URL + 'file';

    // avoid xss atacks using default sanitizer from setHTML
    this.descBoxTop.setHTML(this.pageData['descricao_top']);
    this.descBoxMid.setHTML(this.pageData['descricao_mid']);
    this.descBoxBot.setHTML(this.pageData['descricao_bot']);
  },

  methods:{
    isCorrectRequiredPageDataFields(){
      return this.pageData && this.pageData['titulo'] && this.pageData['perfis_permitidos'];
    },
    doSolicitation(){
      alert('solicitacao');
    }
  }
}
</script>

<!-- style applies only to this component -->
<style scoped>

.sendSolicitationWrapper{
  display: block;
  width: 100%;
  text-align: center;
  margin-top: 10px;
}
.sendSolicitationBtnWrapper{
  display: inline-block;
  margin: auto;
}
@media (min-width: 900px) {
  .sendSolicitationBtnWrapper{
    width: 30%;
  }
}
@media (max-width: 900px) {
  .sendSolicitationBtnWrapper{
    width: 50%;
  }
}
.fileU{
  margin-top: 10px;
  width: 100%;
}

</style>