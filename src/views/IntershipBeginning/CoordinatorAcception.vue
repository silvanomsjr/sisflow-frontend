<template>

  <div>
    <ButtonCustom
        id="btnReturn"
        ref="btnReturn"
        label="← Voltar"
        customTextColor="white"
        customBackColor="darkblue1"
        customFontSize="normal"
        padding="3px 20px"
        margin="0px 5px"
        @click="this.$root.renderView('home')"
      />
    <div class="pageContentRow">

      <TextCustom v-if="!this.pageDisabled" margin='0px 0px 15px 0px' display='block'>
        Olá coordenador. Segue abaixo documentos do aluno para download caso necessário:
      </TextCustom>

      <TextCustom v-else margin='0px 0px 15px 0px' display='block'>
        Olá coordenador. Esta solicitação já foi respondida, verifique abaixo os documentos do aluno:
      </TextCustom>

    </div>

    <!-- <DetailsCard 
      id="stuDetails" title="Dados do aluno solicitante" :showItemsOnStart="true" :items="this.studentDetailsCardItems"
    /> -->
    <v-expansion-panels
      style="margin: 10px 0;"
      v-model="expansionPanel"
    >
      <v-expansion-panel>
        <v-expansion-panel-title>
          <h3 class="detailsTitle">
            Dados do aluno solicitante
          </h3>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row dense>
            <v-col
              v-for="item in studentDetailsCardItems"
              :key="item?.value"
              cols="12"
              sm="12"
              md="12"
            >
              <b>{{ item?.label }}:</b> {{ item?.value }}
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <FileDownload v-if="this.histTextual"
      id='downht' titleText="Faça o download do histórico textual" class="fileD"
      :fileName="this.histTextual['download_name']" :downloadEndpoint="this.histTextual['download_endpoint']"
    />
    <FileDownload v-if="this.histVisual"
      id='downhv' titleText="Faça o download do histórico visual" class="fileD"
      :fileName="this.histVisual['download_name']" :downloadEndpoint="this.histVisual['download_endpoint']"
    />
    <FileDownload v-if="this.vinculoE"
      id='download3' titleText="Faça o download do comprovante de vínculo empregatício" class="fileD"
      :fileName="this.vinculoE['download_name']" :downloadEndpoint="this.vinculoE['download_endpoint']"
    />

    <ReasonBox v-if="this.pageLoaded" :userHasStateId="this.userHasStateId" ref='reasonBox'/>

    <div class="pageContentRow center" v-if="!this.pageDisabled">
      <ButtonCustom id="btnReject" ref="btnReject" 
        label="Indeferir ✘" customTextColor="white" customBackColor="darkred" customFontSize="normal" width="30%" padding="3px 20px" margin="0px 5px"
        @click="doReject()"
      />
      <ButtonCustom id="btnConfirm" ref="btnConfirm" 
        label="Deferir ✔" customTextColor="white" customBackColor="darkgreen" customFontSize="normal" width="30%" padding="3px 20px" margin="0px 5px" 
        @click="doAccept()"
      />
      
    </div>
  </div>
</template>

<script>

import ButtonCustom from '../../components/ButtonCustom.vue'
// import DetailsCard from '../../components/DetailsCard.vue'
import FileDownload from '../../components/FileDownload.vue'
import ReasonBox from '../../components/ReasonBox.vue'
import Requests from '../../js/requests.js'
import TextCustom from '../../components/TextCustom.vue'

export default {

  name: 'CoordinatorAcceptionView',

  components: {
    ButtonCustom,
    FileDownload,
    ReasonBox,
    TextCustom
  },

  data() {
    return {
      expansionPanel: 0,
      histTextual: null,
      histVisual: null,
      vinculoE: null,
      studentDetailsCardItems: [],
      pageDisabled: false,
      userHasStateId: 0,
      pageLoaded: false
    }
  },

  async created() {

    let pageContext = this;

    // verify query params
    if(!this.$route.query || !this.$route.query['user_has_state_id']){
      this.$root.renderMsg('error', 'Pagina de solicitação inválida!','', function () { pageContext.$root.renderView('home'); });
      return;
    }
    this.userHasStateId = this.$route.query['user_has_state_id'];

    // request for solicitation data
    let vreturn = await this.$root.doRequest(Requests.getSolicitation, [this.userHasStateId]);
    if(!vreturn || !vreturn['ok']){
      this.$root.renderRequestErrorMsg(vreturn, ['Usuario não possui o estado da solicitação!', 'Acesso a solicitação não permitido!']);
      this.$root.renderView('home');
      return;
    }
    this.solicitationData = vreturn['response']['solicitation'];
    this.studentData = vreturn['response']['student'];
    this.advisorData = vreturn['response']['advisor'];
    this.transitions = vreturn['response']['solicitation']['transitions'];

    this.studentDetailsCardItems = [
      { "label": "Nome", "value": this.studentData["user_name"] },
      { "label": "Email institucional", "value": this.studentData["institutional_email"] },
      { "label": "Curso", "value": this.studentData["course"] },
      { "label": "Matricula", "value": this.studentData["matricula"] },
      { "label": "Telefone", "value": this.studentData["phone"] }
    ];

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

    this.loadDocs();
    this.$root.pageName = 'Solicitação de inicio de estágio - Verificação de documentação do aluno pela coordenação';
    this.pageLoaded = true;
  },

  methods:{

    loadDocs(){

      this.histTextual = null;
      this.histVisual = null;
      this.vinculoE = null;
      
      // find histTextual and histVisual
      if(this.solicitationData['solicitation_user_data'] && this.solicitationData['solicitation_user_data']['uploads']){
        let uploads = this.solicitationData['solicitation_user_data']['uploads'];
        Object.keys(uploads).forEach(uploadName => {
          if(uploadName.includes('HistTextual') || uploadName.includes('HistVisual')){

            let upload = uploads[uploadName];
            let splitHashTmp = upload['upload_hash_name'].split('_');

            if(uploadName.includes('HistTextual')){
              this.histTextual = {
                'download_name': `Historico_Textual_${splitHashTmp[0]}`,
                'download_endpoint': `${process.env.VUE_APP_SERVICE_URL}file?bearer=${this.$root.userJwtToken}&file_name=${upload['upload_hash_name']}`
              };
            }
            else {
              this.histVisual = {
                'download_name': `Historico_Visual_${splitHashTmp[0]}`,
                'download_endpoint': `${process.env.VUE_APP_SERVICE_URL}file?bearer=${this.$root.userJwtToken}&file_name=${upload['upload_hash_name']}`
              };
            }
          }
        });
      }

      // find vinculoE
      if(this.solicitationData['solicitation_user_data'] && this.solicitationData['solicitation_user_data']['select_uploads']){
        let select_uploads = this.solicitationData['solicitation_user_data']['select_uploads'];
        Object.keys(select_uploads).forEach(suploadName => {
          if(suploadName.includes('Vinculo')){

            let supload = select_uploads[suploadName];
            let splitHashTmp = supload['select_upload_hash_name'].split('_');

            this.vinculoE = {
              'download_name': `Vinculo_${splitHashTmp[1]}_${splitHashTmp[0]}`,
              'download_endpoint': `${process.env.VUE_APP_SERVICE_URL}file?bearer=${this.$root.userJwtToken}&file_name=${supload['select_upload_hash_name']}`
            };
          }
        });
      }
    },

    // accept solicitation by coordinator
    async doAccept(){
      await this.doSolicitation(this.transitions.find(ts => ts['transition_decision'] == 'Deferido')['id']);
    },
    // reject solicitation by coordinator
    async doReject(){

      let mailBody = this.$refs.reasonBox.getMailTemplateHtml();

      if(mailBody && mailBody != "" && mailBody != "<p><br></p>"){
        await this.sendMail(mailBody);
      }
      await this.doSolicitation(this.transitions.find(ts => ts['transition_decision'] == 'Indeferido')['id']);
    },
    // send mail
    async sendMail(mailBody){
      let vreturn = await this.$root.doRequest(
        Requests.postSendMail,
        [
          this.solicitationData['user_has_state_id'],
          'Solicitação de inicio de estágio indeferida',
          mailBody,
          true,
          false,
          false
        ]);

      if(!vreturn || !vreturn['ok']){
        this.$root.renderRequestErrorMsg(vreturn, []);
        return;
      }
    },
    // do Solicitation
    async doSolicitation(transitionId){
      let vreturn = await this.$root.doRequest(
        Requests.postSolicitation,
        [
          this.solicitationData['user_has_state_id'],
          transitionId,
          null
        ]);

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
          'Anexo da solicitação está faltando!',
          'Transição não encontrada para este estado!']);
        return;
      }
      else{
        let pageContext = this;
        this.$root.renderMsg(
          'ok',
          'Solicitação realizada!',
          '',
          function () { pageContext.$root.renderView('home'); }
        );
      }
    }
  }
}
</script>

<!-- style applies only to this component -->
<style scoped>

.detailsTitle{
  font-weight: bold;
  font-size: var(--font-size-title);
}

.pageContentRow{
  margin-top: 15px;
  margin-bottom: 15px;
}
.textC, .tableC{
  margin-top: 5px;
}
.center{
  text-align: center;
  margin: auto;
  margin-top: 5px;
}
.btnWrapper{
  display: block;
  width: 100%;
}
.btn, .btnWrapper{
  border: none;
  outline: none;
}
.radioSolicitation{
  margin: 20px 0px;
}
.fileD{
  margin-bottom: 5px;
}
@media (min-width: 900px) {
  .btnWrapper{
    text-align: left;
  }
  .btn{
    display: inline-block;
    width: 40%;
  }
}
@media (max-width: 900px) {
  .btnWrapper{
    text-align: center;
  }
  .btn{
    width: 100%;
    margin-top: 10px;
  }
}

</style>
