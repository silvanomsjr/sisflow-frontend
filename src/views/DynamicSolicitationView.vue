<template>

  <div v-show="this.createdDone && this.pageData">
    
    <div id="descBoxTop" v-show="this.pageData && this.pageData['top_inner_html']"></div>

    <div id="inputsBox" v-if="this.pageData && this.pageData['inputs']">
      <div v-for="(inputC, index) in this.pageData['inputs']" :key="index">
        {{ inputC['label_txt'] }}
        <InputCustom :id="'inputc' + index" :name="'inputc' + index" ref="inputc"
          :type="inputC['input_type']"
          autocomplete='off'
          :disabled="this.pageDisabled"
        />
      </div>
    </div>

    <div id="downloadsBox" v-if="this.pageData && this.pageData['downloads']">
      <div v-for="(fileD, index) in this.pageData['downloads']" :key="index">
        <FileDownload :id="'filed' + index" ref="filed" class="fileD"
          :titleText="fileD['label_txt']"
          fileName="AlunoVitor_HistTextual_1Ok9uqsqIj.pdf"
          downloadEndpoint="http://localhost:5000/file?bearer=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpbnN0aXR1dGlvbmFsX2VtYWlsIjoiYWRtaW5AdWZ1LmJyIiwic2Vjb25kYXJ5X2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcl9uYW1lIjoiQWRtaW4iLCJnZW5kZXIiOiJNIiwicGhvbmUiOiIzNDExMTExMTExMSIsImNyZWF0aW9uX2RhdGV0aW1lIjoiMjAyMy0wMy0yNCAxNjo1OTowOCIsInByb2ZpbGVzIjpbeyJwcm9maWxlX25hbWUiOiJhZG1pbiIsInByb2ZpbGVfYWNyb255bSI6IkFETSIsInByb2ZpbGVfZHluYW1pY19maWVsZHNfbWV0YWRhdGEiOm51bGwsInVzZXJfZGluYW15Y19wcm9maWxlX2ZpZWxkc19kYXRhIjpudWxsLCJzdGFydF9kYXRldGltZSI6IjIwMjMtMDMtMjQgMTY6NTk6MDgiLCJlbmRfZGF0ZXRpbWUiOiJOb25lIn1dLCJwcm9maWxlX2Fjcm9ueW1zIjpbIkFETSJdfQ.FXu9N9Y-5Zne0GqbYJ1ADtciuonGIRm2isEjVty946v8ThsytzXuAVaIxxl6UN8TFPIZJz8STHQSK9z8oGOEdCvWPWGBIogVlLP-wisjPYkW3yr6tsDjTC2x_bXLeEw1tsVLlpgf2DOvIAqyUHL3mIl89mujJEMKB05AnO0xgONFcGJAHSFttam7KNsQ1XP8HOdhU4cqF0MvxN3V6LzLrpJC9uh-JKowxyvkLjL_xhK2xnGTcwyxqhjEfO5HxPrQUOBTbr1pQIeKDDvlHmeBNus8opZRCQrJkUFGh9mWMxRI8N2SBOFkTDyQJ2tE7E95butRyAtiP6JsHmvEqZu8NA&file_name=AlexsandroSantosSoares_PACOORDENADOR_FdqEj6B09R.pdf"
        />
      </div>
    </div>

    <div id="uploadsBox" v-if="this.pageData && this.pageData['uploads']">
      <div v-for="(fileU, index) in this.pageData['uploads']" :key="index">
        <FileUpload :id="'fileu' + index" ref="fileu" class="fileU"
          :titleText="fileU['label_txt']"
          :fileContentName="fileU['file_content_id']"
          :uploadEndpoint="this.fileUploadEndpoint"
          :disabled="this.pageDisabled"
        />
      </div>
    </div>

    <div id="selectUploadsBox" v-if="this.pageData && this.pageData['select_uploads']">
      <div v-for="(selFileU, index) in this.pageData['select_uploads']" :key="index">
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
      <div class="sendSolicitationBtnWrapper" v-if="this.pageData && this.pageData['is_solicitation_button_active'] && !this.pageDisabled">
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
import InputCustom from '../components/InputCustom.vue'
import FileDownload from '../components/FileDownload.vue'
import FileUpload from '../components/FileUpload.vue'
import SelectFileUpload from '../components/SelectFileUpload.vue'
import Requests from '../js/requests.js'

export default {
  
  name: 'DynamicSolicitationView',

  components: {
    ButtonCustom,
    InputCustom,
    FileDownload,
    FileUpload,
    SelectFileUpload
  },

  data() {
    return {
      createdDone: false,
      mountedDone: false,
      pageData: [],
      fileUploadEndpoint: '',

      solicitationId: null,
      solicitationStepOrder: null,

      pageDisabled: false
    }
  },

  async created() {

    let pageContext = this;

    // verify query params
    if(!this.$route.query || !this.$route.query['user_has_step_id']){

      this.$root.renderMsg(
        'error', 
        'Pagina de solicitação inválida!',
        '',
        function () { pageContext.$root.renderView('home'); });
      return;
    }
    this.userHasStepId = this.$route.query['user_has_step_id'];

    // request for dynamic page data
    let vreturn = await this.$root.doRequest(Requests.getSolicitation, [this.userHasStepId]);

    if(!vreturn || !vreturn['ok']){
      this.$root.renderRequestErrorMsg(vreturn, ['Usuario não possui a etapa de solicitação!', 'Acesso a solicitação não permitido!']);
      this.$root.renderView('home');
      return;
    }

    this.solicitationData = vreturn['response']['solicitation'];
    this.pageData = vreturn['response']['solicitation']['page'];

    this.pageDisabled = 
      this.solicitationData['decision'] != 'Em analise' || 
      !this.$root.userLoggedData['profile_acronyms'].includes(this.solicitationData['step_profile_editor_acronym']);
    
    // verify dynamic page data
    if(!this.isCorrectRequiredPageDataFields()){
      this.$root.renderMsg(
        'error',
        'Pagina de solicitação inválida!',
        'Verifique com o coordenador se o erro persistir!',
        function () { pageContext.$root.renderView('home'); });
      return;
    }

    this.$root.pageName = this.pageData['title'];

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
      return this.pageData && this.pageData['title'];
    },
    setInnerHtmls(){
      // although the data comes from db, we avoid xss atacks using default sanitizer from setHTML
      this.descBoxTop.setHTML(this.pageData['top_inner_html']);
      this.descBoxMid.setHTML(this.pageData['mid_inner_html']);
      this.descBoxBot.setHTML(this.pageData['bot_inner_html']);
    },
    async doSolicitation(){
      
      let solicitationData = { 'inputs' : [], 'uploads' : [], 'select_uploads' : [] }
      let inputOk = true;
      let attachmentOk = true;
      let selAttachmentOk = true;

      // verify each input
      if(this.pageData['inputs']){

        this.pageData['inputs'].forEach( (input, index) => {
          
          let inputV = this.$refs['inputc'][index].getV();

          if(input['required'] && !inputV){
            this.$root.renderMsg('warn', input['missing_msg'], '');
            inputOk = false;
          }

          else if(inputV && input['input_type'] == 'date' && input['input_date_rules']){

            let dateParts = inputV.split("-");
            let dateInput = new Date(dateParts[0], dateParts[1]-1, dateParts[2]);

            input['input_date_rules'].forEach( (rule) => {

              let minDate = new Date();
              minDate.setDate(minDate.getDate() + rule['min_days_plus_today']);
              let maxDate = new Date();
              maxDate.setDate(maxDate.getDate() + rule['max_days_plus_today']);

              if(dateInput.getTime() > minDate.getTime() && dateInput.getTime() <= maxDate.getTime()){

                if(rule['rule_type'] == 'warn'){
                  this.$root.renderMsg('warn', rule['msg'], '');
                  solicitationData['inputs'].push({
                    'label_txt' : input['label_txt'],
                    'value' : inputV
                  });
                }
                else if(rule['rule_type'] == 'error'){
                  this.$root.renderMsg(
                    'error',
                    rule['msg'],
                    '',
                    function () { self.$root.renderView('login'); });
                  inputOk = false;
                }
              }
              else{
                solicitationData['inputs'].push({
                  'label_txt' : input['label_txt'],
                  'value' : inputV
                });
              }
            });
          }
        });
      }
      if(!inputOk){
        return;
      }

      // verify each attachment 
      if(this.pageData['uploads']){

        this.pageData['uploads'].forEach( (upload, index) => {
          if(upload['required'] && (this.$refs['fileu'][index].getFileIHashName() == null || !this.$refs['fileu'][index].isLoaded())){
            this.$root.renderMsg('warn', upload['missing_msg'], '');
            attachmentOk = false;
          }
          else if(this.$refs['fileu'][index].getFileIHashName() != null && this.$refs['fileu'][index].isLoaded()){
            solicitationData['uploads'].push({
              'file_content_id' : upload['file_content_id'],
              'hash_name' : this.$refs['fileu'][index].getFileIHashName()
            });
          }
        });
      }
      if(!attachmentOk){
        return;
      }

      // verify each select attachment 
      if(this.pageData['select_uploads']){

        this.pageData['select_uploads'].forEach( (selectUpload, index) => {
          if(selectUpload['required'] && (this.$refs['selFileU'][index].getFileIHashName() == null || !this.$refs['selFileU'][index].isLoaded())){
            this.$root.renderMsg('warn', selectUpload['missing_msg'], '');
            selAttachmentOk = false;
          }
          else if(this.$refs['selFileU'][index].getFileIHashName() != null && this.$refs['selFileU'][index].isLoaded()){
            solicitationData['select_uploads'].push({
              'file_content_id' : this.$refs['selFileU'][index].getFileAbsType(),
              'hash_name' : this.$refs['selFileU'][index].getFileIHashName()
            });
          }
        });
      }
      if(!selAttachmentOk){
        return;
      }

      let vreturn = await this.$root.doRequest(
        Requests.postSolicitation,
        [this.solicitationData['user_has_step_id'], 'Deferido', 'Deferido automaticamente pelo sistema', solicitationData]);

      if(!vreturn || !vreturn['ok']){
        this.$root.renderRequestErrorMsg(vreturn, [
          'Usuario não possui a etapa de solicitação!',
          'Edição a solicitação não permitida!',
          'Perfil editor a solicitação inválido!',
          'Solicitação está fora de ordem!',
          'Esta etapa da solicitação não foi iniciada!',
          'Esta etapa da solicitação foi expirada!',
          'Esta solicitação já foi realizada!',
          'Input da solicitação está faltando!',
          'Anexo da solicitação está faltando!']);
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
.fileD, .fileU, .selFileU{
  margin-top: 10px;
  width: 100%;
}

</style>