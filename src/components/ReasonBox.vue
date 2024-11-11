<template>

  <!-- I created my own multiple select to set css correctly -->
  <div :id="'boxWrapper' + this.id" class='boxWrapper'>

    <div class="boxHeader">
      <TextCustom customFontSize='title_bold' display="block">
        {{ this.boxTitle }}
      </TextCustom>
      <TextCustom customFontSize='small' display="block" padding="10px" customColor="black2">
        {{ this.boxInnerTitle }}
      </TextCustom>
    </div>

    <div class="boxFilters">
      <div>
        <InputCustom id='reasonContentInput' ref='reasonContentInput' name='reasonContentInput' 
          width="300px" padding="6px 10px"
          customBackColor="white" customBorderColor="gray3"
          class="filtersInputContent"
          placeholder="Filtrar pelo conteúdo"
          @keyup.enter="this.doClientSideFilter(true, false)"
        />
        <span style="font-weight: 600"> {{ this.selectedContent }} </span>
      </div>

      <div>
        <SelectMultipleC id="reasonClassSelect" ref='reasonClassSelect' name='reasonClasses'
          class="filtersSelectClasses"
          placeholder="Filtrar pelas classes"
          :notShowSelectedLabels="true"
          :items="this.reasonClasses"
          @optClicked="(_) => this.doClientSideFilter(false, true)"
        />
        <span style="font-weight: 600"> {{ this.selectedReasonClasses }} </span>
      </div>

    </div>

    <div class="boxReasons">
      <div v-for="(reason, index) in this.reasons" :key="index" ref='reason' class="boxReasonElement">
        <CheckboxC
          :id="this.id + 'reasonCheckbox' + index"
          :name="this.id + 'reasonCheckbox' + index"
          class="boxReasonElementCheck"
          ref='reasonCheckbox'
          :initialValue="reason['reason_selected'] == true"
          @checkBoxClicked="(checkValue) => this.setMailTemplateHtml(reason['reason_id'], checkValue)"
        />
        <span v-html="reason['reason_inner_html']"/>
      </div>
    </div>

    <div class="boxMailHeader">
      <TextCustom customFontSize='title_bold' display="block">
        {{ this.boxMailTitle }}
      </TextCustom>
      <TextCustom customFontSize='small' display="block" padding="10px" customColor="black2">
        {{ this.boxInnerMailTitle }}
      </TextCustom>
    </div>

    <MailTemplateEditor ref='mailTemplateEditor'/>

  </div>

</template>

<script>

import CheckboxC from './CheckboxC.vue'
import InputCustom from './InputCustom.vue'
import MailTemplateEditor from './MailTemplateEditor.vue'
import SelectMultipleC from './SelectMultipleC.vue'
import TextCustom from './TextCustom.vue'
import Requests from '../js/requests.js'

export default {

  name: 'ReasonBox',

  components: {
    CheckboxC,
    InputCustom,
    MailTemplateEditor,
    SelectMultipleC,
    TextCustom
  },

  props: {
    id: String,
    userHasStateId: {
      type: String,
      required: true,
    },
    initialReasonClasses: {
      default: '',
      type: String
    },
    initialContent: {
      default: '',
      type: String
    },
    boxTitle: {
      default: 'Motivos',
      type: String
    },
    boxInnerTitle: {
      default: 'Selecione os motivos para eventual indeferimento abaixo. Você pode filtrar os motivos que aparecem pela sua classe ou pelo seu conteúdo.',
      type: String
    },
    boxMailTitle: {
      default: 'E-mail',
      type: String
    },
    boxInnerMailTitle: {
      default: 'Visualize o e-mail resultante abaixo. Você pode editar o corpo do template antes de enviar.',
      type: String
    }
  },

  data() {
    return {
      reasonClasses: [],
      rawReasons: [],
      reasons: [],
      selectedContent: '',
      selectedReasonClasses: '',
      selectedReasons: {}
    }
  },

  async created(){
    this.selectedContent = this.initialContent;
    this.selectedReasonClasses = this.initialReasonClasses;

    await this.loadReasonsFromDB(this.userHasStateId, null, null);
    this.doClientSideFilter(false, false);
  },

  methods:{

    async loadReasonsFromDB(userHasStateId, content, reasonClasses){
      
      let vreturn = await this.$root.doRequest(Requests.getReasons, [ userHasStateId, content, reasonClasses ]);

      if(!vreturn || !vreturn['ok'] || !vreturn['response'] || !vreturn['response']['reasons']){
        this.$root.renderRequestErrorMsg(vreturn, [content, reasonClasses]);
        this.$root.renderView('home');
        return;
      }

      this.reasonClasses = [];
      this.rawReasons = [];
      vreturn['response']['classes'].forEach(rclass => { 
        this.reasonClasses.push({'label': rclass['reason_class_name'], 'value': rclass['reason_class_id']});
      });
      vreturn['response']['reasons'].forEach(reason => { this.rawReasons.push(reason); });
    },

    doClientSideFilter(changeContent, changeClasses){

      // set changes in filters
      if(changeContent){
        this.selectedContent = this.$refs.reasonContentInput.getV();
        this.$refs.reasonContentInput.setV("");
      }
      if(changeClasses){
        this.selectedReasonClasses = this.$refs.reasonClassSelect.getL();
      }

      // do client side filter based on rawReasons
      this.reasons = [];
      if(this.selectedContent != "" && this.selectedReasonClasses != ""){

        let parsedReasonClasses = this.selectedReasonClasses.split(",").map(reasonClass => reasonClass.trim());
        
        this.rawReasons.forEach(reason => {
          for(let i = 0; i < parsedReasonClasses.length; i++){
            if(reason['reason_class_name'] == parsedReasonClasses[i] && reason['reason_inner_html'].includes(this.selectedContent)){
              this.reasons.push(reason);
              break;
            }
          }
        });
      }
      else if(this.selectedContent != ""){

        this.rawReasons.forEach(reason => {
          if(reason['reason_inner_html'].includes(this.selectedContent)){
            this.reasons.push(reason);
          }
        });
      }
      else if(this.selectedReasonClasses != ""){
        
        let parsedReasonClasses = this.selectedReasonClasses.split(",").map(reasonClass => reasonClass.trim());
        
        this.rawReasons.forEach(reason => {
          for(let i = 0; i < parsedReasonClasses.length; i++){
            if(reason['reason_class_name'] == parsedReasonClasses[i]){
              this.reasons.push(reason);
              break;
            }
          }
        });
      }
      else{
        this.reasons = this.rawReasons;
      }

      // set checkbox values
      this.reasons.forEach( (reason) => {
        reason['reason_selected'] = this.selectedReasons[reason['reason_id']] == true;
      });
    },

    getMailTemplateHtml(){
      return this.$refs.mailTemplateEditor.getMailBodyHTML();
    },

    setMailTemplateHtml(reasonId, checkValue){
      
      // set reason check value
      this.selectedReasons[reasonId] = checkValue;

      // foreach possible reason inserts to email if it is checked
      let mailHTML = "";
      this.rawReasons.forEach( (reason) => {
        if(this.selectedReasons[reason['reason_id']]){
          mailHTML += `<li>${reason['reason_inner_html']}</li>`;
        }
      });

      // set mail body html
      if(mailHTML != ""){
        this.$refs.mailTemplateEditor.setMailBodyHTML(`<p>Solicitação <b>indeferida</b> pelos seguintes motivos:</p><p><ul>${mailHTML}</ul></p>`);
      }
      else{
        this.$refs.mailTemplateEditor.setMailBodyHTML("");
      }
    }
  }
}

</script>

<!-- style applies only to this component -->
<style scoped>

.boxWrapper{
  border: 1px solid var(--color-gray2);
  border-radius: 2px;
  box-shadow: rgba(0, 0, 0, 0.2) -1px 1px 1px;
  position: relative;
  display: inline-block;
  text-align: left;
  width: 100%;
}
.boxHeader, .boxMailHeader{
  background-color: var(--color-gray1);
  border-bottom: 0.5px solid var(--color-gray2);
  color: var(--color-black2);
  padding: 15px;
}
.boxMailHeader{
  border-top: 0.5px solid var(--color-gray2);
}
.boxFilters{
  border-bottom: 0.5px solid var(--color-gray2);
  color: var(--color-black2);
  padding: 5px;
}
.filtersInputContent, .filtersSelectClasses{
  margin: 5px 10px;
  width: 300px;
}
.boxReasons{
  padding: 5px;
}
.boxReasonElement{
  margin: 5px 10px;
}
.boxReasonElementCheck{
  margin-right: 10px;
}

</style>