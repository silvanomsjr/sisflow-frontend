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
          downloadEndpoint="http://localhost:5000/file?bearer=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c3VhcmlvIjoyLCJlbWFpbF9pbnMiOiJhbHVub0B1ZnUuYnIiLCJlbWFpbF9zZWMiOiJhbHVub0BnbWFpbC5jb20iLCJub21lIjoiQWx1bm8gVml0b3IiLCJzZXhvIjoiTSIsInRlbGVmb25lIjoiMzQyMjIyMjIyMjIiLCJkYXRhX2hvcmFfY3JpYWNhbyI6IjIwMjMtMDMtMTUgMjM6Mzk6NTQiLCJwZXJmaWxfYWx1bm8iOnsibWF0cmljdWxhIjoiMTExMTFCU0kxMTEiLCJjdXJzbyI6IkJTSSJ9LCJwZXJmaXMiOlsiUyJdfQ.kiIJcNE5YGVO97wChpnhMWoMWLE3ATCfYc_1nQy6u1P10WwomNImSVQ8Ibyq8g1MeKGNFYXJbHc8KBPEYFaiSgilnbW-yUZYf7emZxDIhTSJqc20vs-3DysxJC4VOI_Qoh1JmtDQC9wWxwPRIa0BBgQNMHcnkVKQi3Jr-mIsFAOKKoRHSECI3UeMXhYdH1n3zZk1ljQ4SYlLVx8ApHeAtHfNMPL225R16wXrdmsjw2v6RpFV4SHjWTOVeMsEhkuUAOV0gGKg6_qB9h9-Wfyar1QwupOKy2x1uA5FDEjeCPUC1oXRUgXmnhsKmIL322zrs2ZX_Qzek2Tx8kCg7WN2Cw&file_name=AlunoVitor_HistTextual_1Ok9uqsqIj.pdf"
        />
      </div>
    </div>

    <div id="uploadsBox" v-if="this.pageData && this.pageData['uploads']">
      <div v-for="(fileU, index) in this.pageData['uploads']" :key="index">
        <FileUpload :id="'fileu' + index" ref="fileu" class="fileU"
          :titleText="fileU['label_txt']"
          :fileDirName="fileU['file_abs_type']"
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

      idSolicitation: null,
      solicitationStepOrder: null,

      pageDisabled: false
    }
  },

  async created() {

    let pageContext = this;

    // verify query params
    if(!this.$route.query || 
      !this.$route.query['student_id']|| 
      !this.$route.query['solicitation_id'] || 
      !this.$route.query['solicitation_step_order'] || 
      !this.$route.query['solicitation_profile']){

      this.$root.renderMsg(
        'error', 
        'Pagina de solicitação inválida!',
        '',
        function () { pageContext.$root.renderView('home'); });
      return;
    }
    this.studentId = this.$route.query['student_id'];
    this.solicitationId = this.$route.query['solicitation_id'];
    this.solicitationStepOrder = this.$route.query['solicitation_step_order'];
    this.solicitationProfile = this.$route.query['solicitation_profile'];

    // request for dynamic page data
    let vreturn = await this.$root.doRequest(
      Requests.getSolicitation,
      [this.studentId, this.solicitationId, this.solicitationStepOrder, this.solicitationProfile]);

    if(!vreturn || !vreturn['ok']){
      this.$root.renderRequestErrorMsg(vreturn, ['Usuario não possui a etapa de solicitação!', 'Acesso a solicitação não permitido!']);
      this.$root.renderView('home');
      return;
    }

    this.solicitationStep = vreturn['response']['etapa_solicitacao'];
    this.pageData = vreturn['response']['pagina_dinamica'];

    this.pageDisabled = 
      this.solicitationStep['decisao'] != 'Em analise' || 
      !this.$root.userLoggedData['perfis'].includes(this.solicitationStep['perfil_editor_atual']);
    
    // verify dynamic page data
    if(!this.isCorrectRequiredPageDataFields()){
      this.$root.renderMsg(
        'error',
        'Pagina de solicitação inválida!',
        'Verifique com o coordenador se o erro persistir!',
        function () { pageContext.$root.renderView('home'); });
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
      return this.pageData && this.pageData['titulo'];
    },
    setInnerHtmls(){
      // although the data comes from db, we avoid xss atacks using default sanitizer from setHTML
      this.descBoxTop.setHTML(this.pageData['top_inner_html']);
      this.descBoxMid.setHTML(this.pageData['mid_inner_html']);
      this.descBoxBot.setHTML(this.pageData['bot_inner_html']);
    },
    async doSolicitation(){
      
      let solicitationData = { 'inputs' : [], 'attachments' : [], 'select_attachments' : [] }
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
                  })
                }
                else if(rule['rule_type'] == 'error'){
                  this.$root.renderMsg('error', rule['msg'], '');
                  inputOk = false;
                }
              }
              else{
                solicitationData['inputs'].push({
                  'label_txt' : input['label_txt'],
                  'value' : inputV
                })
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
            solicitationData['attachments'].push({
              'file_abs_type' : upload['file_abs_type'],
              'name' : this.$refs['fileu'][index].getFileIHashName()
            })
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
        [this.studentId, this.solicitationId, this.solicitationStepOrder, solicitationData]);

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
.fileD, .fileU, .selFileU{
  margin-top: 10px;
  width: 100%;
}

</style>