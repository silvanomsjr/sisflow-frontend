<template>

  <div v-show="this.createdDone && this.pageData && this.pageData['components']">

    <div v-for="(component) in this.pageData['components']" :key="component['component_order']">

      <div v-if="component['component_type'] == 'inner_html'"
        :id="'inner_html_' + component['component_id']"
        ref="pageComp"
        v-html="component['inner_html']">
      </div>

      <div v-if="component['component_type'] == 'input'">
        {{ component['input_label'] }}

        <InputCustom :id="'input_' + component['component_id']"
          ref="pageComp"
          :name="component['input_name']"
          :type="component['input_type']"
          :disabled="this.pageDisabled"
          autocomplete='off'
        />
      </div>

      <div v-if="component['component_type'] == 'upload'">
        <FileUpload :id="'upload_' + component['component_id']" 
          ref="pageComp"
          class="fileU"
          :titleText="component['upload_label']"
          :fileContentName="component['upload_name']"
          :uploadEndpoint="this.fileUploadEndpoint"
          :disabled="this.pageDisabled"
        />
      </div>

      <div v-if="component['component_type'] == 'select_upload'">
        <SelectFileUpload :id="'select_upload_' + component['component_id']"
          ref="pageComp"
          class="selFileU"
          :selectLabel="component['select_upload_label']"
          :selectOpts="component['select_upload_options']"
          :uploadEndpoint="this.fileUploadEndpoint"
          :disabled="this.pageDisabled"
        />
      </div>

      <div v-if="component['component_type'] == 'download'">
        <FileDownload :id="'download_' + component['component_id']"
          ref="pageComp"
          class="fileD"
          :titleText="component['download_label']"
          fileName="AlunoVitor_HistTextual_1Ok9uqsqIj.pdf"
          downloadEndpoint="http://localhost:5000/file?bearer=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpbnN0aXR1dGlvbmFsX2VtYWlsIjoiYWRtaW5AdWZ1LmJyIiwic2Vjb25kYXJ5X2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcl9uYW1lIjoiQWRtaW4iLCJnZW5kZXIiOiJNIiwicGhvbmUiOiIzNDExMTExMTExMSIsImNyZWF0aW9uX2RhdGV0aW1lIjoiMjAyMy0wMy0yNCAxNjo1OTowOCIsInByb2ZpbGVzIjpbeyJwcm9maWxlX25hbWUiOiJhZG1pbiIsInByb2ZpbGVfYWNyb255bSI6IkFETSIsInByb2ZpbGVfZHluYW1pY19maWVsZHNfbWV0YWRhdGEiOm51bGwsInVzZXJfZGluYW15Y19wcm9maWxlX2ZpZWxkc19kYXRhIjpudWxsLCJzdGFydF9kYXRldGltZSI6IjIwMjMtMDMtMjQgMTY6NTk6MDgiLCJlbmRfZGF0ZXRpbWUiOiJOb25lIn1dLCJwcm9maWxlX2Fjcm9ueW1zIjpbIkFETSJdfQ.FXu9N9Y-5Zne0GqbYJ1ADtciuonGIRm2isEjVty946v8ThsytzXuAVaIxxl6UN8TFPIZJz8STHQSK9z8oGOEdCvWPWGBIogVlLP-wisjPYkW3yr6tsDjTC2x_bXLeEw1tsVLlpgf2DOvIAqyUHL3mIl89mujJEMKB05AnO0xgONFcGJAHSFttam7KNsQ1XP8HOdhU4cqF0MvxN3V6LzLrpJC9uh-JKowxyvkLjL_xhK2xnGTcwyxqhjEfO5HxPrQUOBTbr1pQIeKDDvlHmeBNus8opZRCQrJkUFGh9mWMxRI8N2SBOFkTDyQJ2tE7E95butRyAtiP6JsHmvEqZu8NA&file_name=AlexsandroSantosSoares_PACOORDENADOR_FdqEj6B09R.pdf"
        />
      </div>

      <div v-if="component['component_type'] == 'button' && !this.pageDisabled" class="sendSolicitationWrapper">
        <ButtonCustom
          :id="'button_' + component['component_id']"
          ref="pageComp"
          :label="component['button_label']"
          customTextColor="white"
          customBackColor="darkblue1"
          customFontSize="normal"
          width="100%"
          padding="3px 20px"
          @click="doSolicitation(component['transition_id'])"
          />
      </div>
    </div>
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
      pageData: [],
      fileUploadEndpoint: '',
      pageDisabled: false
    }
  },

  async created() {

    let pageContext = this;

    // verify query params
    if(!this.$route.query || !this.$route.query['user_has_state_id']){
      this.$root.renderMsg('error', 'Pagina de solicitação inválida!','', function () { pageContext.$root.renderView('home'); });
      return;
    }
    let userHasStateId = this.$route.query['user_has_state_id'];

    // request for dynamic page data
    let vreturn = await this.$root.doRequest(Requests.getSolicitation, [userHasStateId]);

    if(!vreturn || !vreturn['ok']){
      this.$root.renderRequestErrorMsg(vreturn, ['Usuario não possui o estado da solicitação!', 'Acesso a solicitação não permitido!']);
      this.$root.renderView('home');
      return;
    }

    console.log(vreturn);

    this.solicitationData = vreturn['response']['solicitation'];
    this.pageData = vreturn['response']['solicitation']['page'];

    this.pageDisabled = 
      this.solicitationData['decision'] != 'Em analise' || 
      !this.$root.userLoggedData['profile_acronyms'].includes(this.solicitationData['state_profile_editor_acronym']);
    
    // verify dynamic page data
    if(!this.isCorrectRequiredPageDataFields()){
      this.$root.renderMsg('error','Pagina de solicitação inválida!','Verifique com a coordenação se o erro persistir!', function () { pageContext.$root.renderView('home'); });
      return;
    }

    this.$root.pageName = this.pageData['title'];
    this.createdDone = true;
  },
  
  mounted() {
    this.fileUploadEndpoint = process.env.VUE_APP_SERVICE_URL + 'file';
  },

  methods:{
    isCorrectRequiredPageDataFields(){
      return this.pageData && this.pageData['title'];
    },
    async doSolicitation(transitionId){
      
      let solicitationData = { 'inputs' : [], 'uploads' : [], 'select_uploads' : [] };

      for(let i = 0; i < this.pageData['components'].length; i++){
        let component = this.pageData['components'][i];
        let pageComponent = this.$refs['pageComp'][i];

          console.log(component);
          console.log(pageComponent);

        if(component['component_type'] == 'input'){

          let inputV = pageComponent.getV();

          if(component['input_required'] && !inputV){
            this.$root.renderMsg('warn', component['input_missing_message'], '');
            return;
          }
          else if(inputV && component['input_type'] == 'date'){
            let dateParts = inputV.split("-");
            let dateInput = new Date(dateParts[0], dateParts[1]-1, dateParts[2]);

            for(let j = 0; j < component['input_date_rules'].length; j++){
              let rule = component['input_date_rules'][j];

              let startDate = new Date();
              let endDate = new Date();
              startDate.setDate(startDate.getDate() + rule['rule_start_days']);
              endDate.setDate(endDate.getDate() + rule['rule_end_days']);

              if(
                (rule['rule_type'] == 'must-be-from-today' && (dateInput.getTime() < startDate.getTime() || dateInput.getTime() > endDate.getTime()))
                || (rule['rule_type'] == 'must-not-be-from-today' && dateInput.getTime() >= startDate.getTime() && dateInput.getTime() < endDate.getTime())
              ){
                if(rule['rule_message_type'] == 'warn'){
                  this.$root.renderMsg('warn', rule['rule_missing_message'], '');
                }
                else{
                  this.$root.renderMsg('error', rule['rule_missing_message'],'');
                }
                return;
              }
            }
          }

          solicitationData['inputs'].push({
            'input_name' : component['input_name'],
            'input_value' : inputV
          });
          
        }
        else if(component['component_type'] == 'upload'){
          
          if(component['upload_required'] && (pageComponent.getFileIHashName() == null || !pageComponent.isLoaded())){
            this.$root.renderMsg('warn', component['upload_missing_message'], '');
            return;
          }
          else if(pageComponent.getFileIHashName() != null && pageComponent.isLoaded()){
            solicitationData['uploads'].push({
              'upload_name' : component['upload_name'],
              'upload_hash_name' : pageComponent.getFileIHashName()
            });
          }

        }
        else if(component['component_type'] == 'select_upload'){

          if(component['select_upload_required'] && (pageComponent.getFileIHashName() == null || !pageComponent.isLoaded())){
            this.$root.renderMsg('warn', component['select_upload_missing_message'], '');
            return;
          }
          else if(pageComponent.getFileIHashName() != null && pageComponent.isLoaded()){
            solicitationData['select_uploads'].push({
              'select_upload_name' : component['select_upload_name'],
              'select_upload_hash_name' : pageComponent.getFileIHashName()
            });
          }
        }
      }

      let vreturn = await this.$root.doRequest(
        Requests.postSolicitation,
        [this.solicitationData['user_has_state_id'], transitionId, solicitationData]);

      if(!vreturn || !vreturn['ok']){
        this.$root.renderRequestErrorMsg(vreturn, [
          'Usuario não possui o estado da solicitação!',
          'Edição a solicitação não permitida!',
          'Perfil editor a solicitação inválido!',
          'Edição do estado da solicitação não permitido!',
          'Esta etapa da solicitação não foi iniciada!',
          'Esta etapa da solicitação foi expirada!',
          'Esta solicitação já foi realizada!',
          'Input da solicitação está faltando!',
          'Anexo da solicitação está faltando!']);
        return;
      }
      else{
        //let pageContext = this;
        this.$root.renderMsg(
          'ok',
          'Solicitação realizada!',
          'Aguarde os prazos e verifique seus e-mails para mais atualizações.',
          function () { /*pageContext.$root.renderView('home');*/ }
        );
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