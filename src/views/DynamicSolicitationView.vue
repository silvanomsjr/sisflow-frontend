<template>

  <div v-show="this.createdDone && this.pageData">
    
    <div id="descBoxTop" v-show="this.pageData && this.pageData['top_inner_html']"></div>

    <div id="inputsBox" v-if="this.pageData && this.pageData['inputs_solicitados']">
      <div v-for="(inputC, index) in this.pageData['inputs_solicitados']" :key="index">
        <InputCustom :id="'inputc' + index" :name="'inputc' + index" ref="inputc"
          :type="inputC['input_type']"
          autocomplete='off'
        />
      </div>
    </div>

    <div id="uploadsBox" v-if="this.pageData && this.pageData['anexos']">
      <div v-for="(fileU, index) in this.pageData['anexos']" :key="index">
        <FileUpload :id="'fileu' + index" ref="fileu" class="fileU"
          :titleText="fileU['label_txt']"
          :fileDirName="fileU['file_abs_type']"
          :uploadEndpoint="this.fileUploadEndpoint"
          :disabled="this.pageDisabled"
        />
      </div>
    </div>

    <div id="selectUploadsBox" v-if="this.pageData && this.pageData['select_anexos']">
      <div v-for="(selFileU, index) in this.pageData['select_anexos']" :key="index">
        <SelectFileUpload :id="'selFileU' + index" ref="selFileU" class="selFileU"
          :selectLabel="selFileU['label_txt']"
          :selectOpts="selFileU['select_opts']"
          :uploadEndpoint="this.fileUploadEndpoint"
          :disabled="this.pageDisabled"
        />
      </div>
    </div>
    
    <div id="descBoxMid" v-show="this.pageData && this.pageData['mid_inner_html']"></div>
    
    <div class="sendSolicitationWrapper">
      <div class="sendSolicitationBtnWrapper" v-if="this.pageData && this.pageData['botao_solicitar'] && !this.pageDisabled">
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

    <div id="descBoxBot" v-show="this.pageData && this.pageData['bot_inner_html']"></div>

  </div>

</template>

<script>

import ButtonCustom from '../components/ButtonCustom.vue'
import FileUpload from '../components/FileUpload.vue'
import SelectFileUpload from '../components/SelectFileUpload.vue'
import Requests from '../js/requests.js'

export default {
  
  name: 'DynamicSolicitationView',

  components: {
    ButtonCustom,
    FileUpload,
    SelectFileUpload
  },

  data() {
    return {
      createdDone: false,
      mountedDone: false,
      pageData: [],
      fileUploadEndpoint: '',

      idSolicitation: null,
      solicitationStepOrder: null,

      pageDisabled: false
    }
  },

  async created() {

    let pageContext = this;

    // verify query params
    if(!this.$route.query || !this.$route.query['solicitation'] || !this.$route.query['solicitation_step_order']){
      this.$root.renderMsg(
        'error', 
        'Pagina de solicitação inválida!',
        '',
        function () { pageContext.$root.renderView('home'); });
      return;
    }
    this.solicitation = this.$route.query['solicitation'];
    this.solicitationStepOrder = this.$route.query['solicitation_step_order'];

    let vreturn = await this.$root.doRequest(
      Requests.getSolicitation,
      [this.solicitation, this.solicitationStepOrder]);

    if(!vreturn || !vreturn['ok']){
      this.$root.renderRequestErrorMsg(vreturn, ['Usuario não possui a etapa de solicitação!']);
      this.$root.renderView('home');
      return;
    }

    //this.requestData = vreturn['response'];
    this.pageData = vreturn['response']['pagina_dinamica'];
    
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
    this.pageDisabled = this.pageData['decisao'] != 'Em analise';

    this.createdDone = true;
  },
  
  mounted() {
    this.descBoxTop = document.getElementById('descBoxTop');
    this.descBoxMid = document.getElementById('descBoxMid');
    this.descBoxBot = document.getElementById('descBoxBot');
    this.fileUploadEndpoint = process.env.VUE_APP_SERVICE_URL + 'file';

    this.mountedDone = true;
  },

  watch: {
    // when created and mounted set innerhtmls
    createdDone() {
      if(this.createdDone && this.mountedDone){
        this.setInnerHtmls();
      }
    },
    mountedDone() {
      if(this.createdDone && this.mountedDone){
        this.setInnerHtmls();
      }
    }
  },

  methods:{
    isCorrectRequiredPageDataFields(){
      return this.pageData && this.pageData['titulo'] && this.pageData['perfis_permitidos'];
    },
    setInnerHtmls(){
      // although the data comes from db, we avoid xss atacks using default sanitizer from setHTML
      this.descBoxTop.setHTML(this.pageData['top_inner_html']);
      this.descBoxMid.setHTML(this.pageData['mid_inner_html']);
      this.descBoxBot.setHTML(this.pageData['bot_inner_html']);
    },
    async doSolicitation(){
      
      let solicitationData = { 'inputs' : [], 'attachments' : [], 'select_attachments' : [] }
      let attachmentOk = true;
      let selAttachmentOk = true;

      // verify each attachment 
      if(this.pageData['anexos']){

        this.pageData['anexos'].forEach( (anexo, index) => {
          if(anexo['required'] && (this.$refs['fileu'][index].getFileIHashName() == null || !this.$refs['fileu'][index].isLoaded())){
            this.$root.renderMsg('warn', anexo['missing_msg'], '');
            attachmentOk = false;
          }
          else if(this.$refs['fileu'][index].getFileIHashName() != null && this.$refs['fileu'][index].isLoaded()){
            solicitationData['attachments'].push({
              'file_abs_type' : anexo['file_abs_type'],
              'name' : this.$refs['fileu'][index].getFileIHashName()
            })
          }
        });
      }
      if(!attachmentOk){
        return;
      }

      // verify each select attachment 
      if(this.pageData['select_anexos']){

        this.pageData['select_anexos'].forEach( (selectAnexo, index) => {
          if(selectAnexo['required'] && (this.$refs['selFileU'][index].getFileIHashName() == null || !this.$refs['selFileU'][index].isLoaded())){
            this.$root.renderMsg('warn', selectAnexo['missing_msg'], '');
            selAttachmentOk = false;
          }
          else if(this.$refs['selFileU'][index].getFileIHashName() != null && this.$refs['selFileU'][index].isLoaded()){
            solicitationData['select_attachments'].push({
              'file_abs_type' : this.$refs['selFileU'][index].getFileAbsType(),
              'name' : this.$refs['selFileU'][index].getFileIHashName()
            })
          }
        });
      }
      if(!selAttachmentOk){
        return;
      }

      let vreturn = await this.$root.doRequest(
        Requests.postSolicitation,
        [this.solicitation, this.solicitationStepOrder, solicitationData]);

      if(!vreturn || !vreturn['ok']){
        this.$root.renderRequestErrorMsg(vreturn, [
          'Usuario não possui a etapa de solicitação!',
          'Esta solicitação está com status Deferido!',
          'Esta solicitação está com status Indeferido!',
          'Esta etapa da solicitação já foi realizada aguarde sua conclusão!',
          'Esta etapa da solicitação foi expirada!',
          'Anexo da solicitação está faltando!'
          ]);
        return;
      }
      else{
        let pageContext = this;
        this.$root.renderMsg(
          'ok',
          'Solicitação realizada!',
          'Aguarde os prazos e verifique seus e-mails para mais atualizações.',
          function () { pageContext.$root.renderView('home'); });
      }
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
.fileU, .selFileU{
  margin-top: 10px;
  width: 100%;
}

</style>