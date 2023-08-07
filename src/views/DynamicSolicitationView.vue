<template>

  <div class="dynamicPageWrapper" v-show="this.createdDone && this.pageData && this.pageData['components']">

    <div v-for="(component) in this.pageData['components']" :key="component['component_order']"
      :class="component['component_type'] == 'button' ? 'buttonComponentWrapper' : ''"
    >

      <div v-if="component['component_type'] == 'inner_html'" class="innerHtmlWrapper"
        :id="'inner_html_' + component['component_id']"
        ref="pageComp"
        v-html="component['inner_html']">
      </div>

      <div v-if="component['component_type'] == 'details'">
        <DetailsCard v-if="component['details_type']=='student'"
          id="stuDetails"
          title="Dados do aluno"
          :showItemsOnStart="true"
          :items="this.studentDetailsCardItems"
        />
        <DetailsCard v-if="component['details_type']=='advisor'"
          id="advDetails"
          title="Dados do orientador"
          :showItemsOnStart="true"
          :items="this.advisorDetailsCardItems"
        />
      </div>

      <div v-if="component['component_type'] == 'input'">
        {{ component['input_label'] }}

        <InputCustom :id="'input_' + component['component_id']"
          ref="pageComp"
          :name="component['input_name']"
          :type="component['input_type']"
          :inputValue="component['input_value']"
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
          :fileName="component['download_name']"
          :downloadEndpoint="component['download_endpoint']"
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
          @click="doSolicitation(`Button-${component['button_transation_type']}`)"
          />
      </div>
    </div>
  </div>

</template>

<script>

import ButtonCustom from '../components/ButtonCustom.vue'
import DetailsCard from '../components/DetailsCard.vue'
import InputCustom from '../components/InputCustom.vue'
import FileDownload from '../components/FileDownload.vue'
import FileUpload from '../components/FileUpload.vue'
import SelectFileUpload from '../components/SelectFileUpload.vue'
import Requests from '../js/requests.js'

export default {
  
  name: 'DynamicSolicitationView',

  components: {
    ButtonCustom,
    DetailsCard,
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
      pageDisabled: false,
      studentDetailsCardItems: [],
      advisorDetailsCardItems: []
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

    this.solicitationData = vreturn['response']['solicitation'];
    this.studentData = vreturn['response']['student'];
    this.advisorData = vreturn['response']['advisor'];
    this.pageData = vreturn['response']['solicitation']['page'];
    this.solicitationUserData = vreturn['response']['solicitation']['solicitation_user_data'];

    // verify if page is disabled
    this.pageDisabled = false;
    if(this.solicitationData['decision'] != 'Em analise'){
      this.pageDisabled = true;
    }
    else if(this.solicitationData['state_profile_editor_acronyms']){
      let tmpBool = true;
      let acronyms = this.solicitationData['state_profile_editor_acronyms'].split(',');
      acronyms.forEach(acronym => {
        if(this.$root.userLoggedData['profile_acronyms'].includes(acronym)){
          tmpBool = false;
        }
      });
      this.pageDisabled = tmpBool;
    }

    // verify dynamic page data
    if(!this.isCorrectRequiredPageDataFields()){
      this.$root.renderMsg('error','Pagina de solicitação inválida!','Verifique com a coordenação se o erro persistir!', function () { pageContext.$root.renderView('home'); });
      return;
    }

    this.parsePageUserData();
    this.loadDetailCards();

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
    loadDetailCards(){
      this.studentDetailsCardItems = [
        { "label": "Nome", "value": this.studentData["user_name"] },
        { "label": "Email institucional", "value": this.studentData["institutional_email"] },
        { "label": "Curso", "value": this.studentData["course"] },
        { "label": "Matricula", "value": this.studentData["matricula"] },
        { "label": "Telefone", "value": this.studentData["phone"] }
      ];
      this.advisorDetailsCardItems = [
        { "label": "Nome", "value": this.advisorData["user_name"] },
        { "label": "Email institucional", "value": this.advisorData["institutional_email"] },
        { "label": "Alunos orientados", "value": this.advisorData["advisor_students"] },
        { "label": "Siape", "value": this.advisorData["siape"] },
        { "label": "Telefone", "value": this.advisorData["phone"] }
      ];
    },
    parsePageInput(component){

      if(this.pageDisabled && this.solicitationUserData && this.solicitationUserData['inputs'] && this.solicitationUserData['inputs'][component['input_name']]){
        component['input_value'] = this.solicitationUserData['inputs'][component['input_name']]['input_value'];
      }
    },
    parsePageUpload(component){

      if(this.pageDisabled && this.solicitationUserData && this.solicitationUserData['uploads'] && this.solicitationUserData['uploads'][component['upload_name']]){
        component['component_type'] = 'download';
        component['download_label'] = component['upload_label'];
        component['download_name'] = this.solicitationUserData['uploads'][component['upload_name']]['upload_hash_name'];
        component['download_endpoint'] = `${process.env.VUE_APP_SERVICE_URL}file?bearer=${this.$root.userJwtToken}&file_name=${this.solicitationUserData['uploads'][component['upload_name']]['upload_hash_name']}`;
      }
    },
    parsePageSelectUpload(component){
      if(this.pageDisabled && this.solicitationUserData && this.solicitationUserData['select_uploads'] && this.solicitationUserData['select_uploads'][component['select_upload_name']]){
        component['component_type'] = 'download';
        component['download_label'] = component['select_upload_label'];
        component['download_name'] = this.solicitationUserData['select_uploads'][component['select_upload_name']]['select_upload_hash_name'];
        component['download_endpoint'] = `${process.env.VUE_APP_SERVICE_URL}file?bearer=${this.$root.userJwtToken}&file_name=${this.solicitationUserData['select_uploads'][component['select_upload_name']]['select_upload_hash_name']}`;
      }
    },
    parsePageDownload(component){

      if(component['download_from'] == 'internal_from_upload'){
        if(this.solicitationUserData && this.solicitationUserData['uploads'] && this.solicitationUserData['uploads'][component['internal_upload_name']]){
          component['download_name'] = this.solicitationUserData['uploads'][component['internal_upload_name']]['upload_hash_name'];
          component['download_endpoint'] = `${process.env.VUE_APP_SERVICE_URL}file?bearer=${this.$root.userJwtToken}&file_name=${this.solicitationUserData['uploads'][component['internal_upload_name']]['upload_hash_name']}`;
        }
      }
      else if(component['download_from'] == 'internal_from_select_upload'){
        if(this.solicitationUserData && this.solicitationUserData['select_uploads'] && this.solicitationUserData['select_uploads'][component['internal_select_upload_name']]){
          component['download_name'] = this.solicitationUserData['select_uploads'][component['internal_select_upload_name']]['select_upload_hash_name'];
          component['download_endpoint'] = `${process.env.VUE_APP_SERVICE_URL}file?bearer=${this.$root.userJwtToken}&file_name=${this.solicitationUserData['select_uploads'][component['internal_select_upload_name']]['select_upload_hash_name']}`;
        }
      }
    },
    parsePageUserData(){

      // parse page components based on solicitationUserData
      if(this.pageData && this.pageData['components']){
        for(let i = 0; i < this.pageData['components'].length; i++){

          let component = this.pageData['components'][i];

          if(component['component_type'] == 'input'){
            this.parsePageInput(component);
          }
          else if(component['component_type'] == 'upload'){
            this.parsePageUpload(component);
          }
          else if(component['component_type'] == 'select_upload'){
            this.parsePageSelectUpload(component);
          }
          else if(component['component_type'] == 'download'){
            this.parsePageDownload(component);
          }
        }
      }
    },
    
    // compares input from query and its value from page
    async isInputValid(queryInput, pageInput){

      let pageInputValue = pageInput.getV();
      
      if(queryInput['input_required'] && !pageInputValue){
        this.$root.renderMsg('warn', queryInput['input_missing_message'], '');
        return false;
      }
      else if(pageInputValue && queryInput['input_type'] == 'date'){

        let dateParts = pageInputValue.split("-");
        let dateInput = new Date(dateParts[0], dateParts[1]-1, dateParts[2]);

        for(let i = 0; i < queryInput['input_date_rules'].length; i++){
          let rule = queryInput['input_date_rules'][i];

          let startDate = null;
          let endDate = null;
          if(rule['rule_start_days']){
            startDate = new Date();
            startDate.setDate(startDate.getDate() + rule['rule_start_days']);
          }
          if(rule['rule_end_days']){
            endDate = new Date();
            endDate.setDate(endDate.getDate() + rule['rule_end_days']);
          }

          if(
            (rule['rule_type'] == 'must-be-from-today' && 
              ( (startDate ? dateInput.getTime() < startDate.getTime() : false) || (endDate ? dateInput.getTime() > endDate.getTime() : false) ))
            || 
            (rule['rule_type'] == 'must-not-be-from-today' && 
              (startDate ? dateInput.getTime() >= startDate.getTime() : true) && (endDate ? dateInput.getTime() < endDate.getTime() : true) )
          ){
            if(rule['rule_message_type'] == 'warn'){
              return await this.$root.renderMsg('warn', rule['rule_missing_message'], '', null, function(){}, function(){}, true);
            }
            else{
              return this.$root.renderMsg('error', rule['rule_missing_message'],'');
            }
          }
        }
      }
      return true;
    },
    isUploadValid(queryUpload, pageUpload){
      
      if(queryUpload['upload_required'] && (pageUpload.getFileIHashName() == null || !pageUpload.isLoaded())){
        this.$root.renderMsg('warn', queryUpload['upload_missing_message'], '');
        return false;
      }
      return true;
    },
    isSelectUploadValid(querySelectUpload, pageSelectUpload){
      
      if(querySelectUpload['select_upload_required'] && (pageSelectUpload.getFileIHashName() == null || !pageSelectUpload.isLoaded())){
        this.$root.renderMsg('warn', querySelectUpload['select_upload_missing_message'], '');
        return false;
      }
      return true;
    },
    async isComponentsValid(){

      // foreach query component from page
      for(let i = 0; i < this.pageData['components'].length; i++){
        let queryComponent = this.pageData['components'][i];
        let pageComponent = this.$refs['pageComp'][i];

        // verify if page component data is valid
        if(queryComponent['component_type'] == 'input'){
          if(!await this.isInputValid(queryComponent, pageComponent)){
            return false;
          }
        }
        else if(queryComponent['component_type'] == 'upload'){
          if(!this.isUploadValid(queryComponent, pageComponent)){
            return false;
          }
        }
        else if(queryComponent['component_type'] == 'select_upload'){
          if(!this.isSelectUploadValid(queryComponent, pageComponent)){
            return false;
          }
        }
      }
      return true;
    },
    getTransitionId(dynamicPageComponent){
      if(this.solicitationData.transitions){
        for(let i = 0; i < this.solicitationData.transitions.length; i++){
          let transition = this.solicitationData.transitions[i];
          if(transition["type"] == "from_dynamic_page" && transition["dynamic_page_component"] == dynamicPageComponent){
            return transition["id"];
          }
        }
      }
      return null;
    },
    async doSolicitation(dynamicPageComponent){
      
      if(!await this.isComponentsValid()){
        return;
      }
      let transitionId = this.getTransitionId(dynamicPageComponent);
      if(transitionId == null){
        this.$root.renderMsg('warn', 'Tipo de transação inválido', 'Caso o erro persista contate a coordenação');
        return;
      }

      let solicitationData = { 'inputs' : [], 'uploads' : [], 'select_uploads' : [] };

      // add all valided component data to solicitationData
      for(let i = 0; i < this.pageData['components'].length; i++){
        let queryComponent = this.pageData['components'][i];
        let pageComponent = this.$refs['pageComp'][i];

        if(queryComponent['component_type'] == 'input'){
          solicitationData['inputs'].push({
            'input_name' : queryComponent['input_name'],
            'input_value' : pageComponent.getV()
          });
        }
        else if(queryComponent['component_type'] == 'upload' && pageComponent.getFileIHashName() != null && pageComponent.isLoaded()){
          solicitationData['uploads'].push({
            'upload_name' : queryComponent['upload_name'],
            'upload_hash_name' : pageComponent.getFileIHashName()
          });
        }
        else if(queryComponent['component_type'] == 'select_upload' && pageComponent.getFileIHashName() != null && pageComponent.isLoaded()){
          solicitationData['select_uploads'].push({
            'select_upload_name' : queryComponent['select_upload_name'],
            'select_upload_hash_name' : pageComponent.getFileIHashName()
          });
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
        let pageContext = this;
        this.$root.renderMsg(
          'ok',
          'Solicitação realizada!',
          'Aguarde os prazos e verifique seus e-mails para mais atualizações.',
          function () { pageContext.$root.renderView('home'); }
        );
      }
    }
  }
}
</script>

<!-- style applies only to this component -->
<style scoped>

.dynamicPageWrapper{
  font-size: var(--font-size-normal);
  text-align: right;
}
.innerHtmlWrapper{
  text-align: left;
}
.buttonComponentWrapper{
  display: inline-block;
  margin-right: 1%;
  width: 200px;
}
.sendSolicitationWrapper{
  display: block;
  width: 100%;
  text-align: right;
  margin-top: 10px;
}
.sendSolicitationBtnWrapper{
  display: inline-block;
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

<style>
.innerHtmlWrapper, .innerHtmlWrapper > *{
  list-style-type: circle;
}
</style>