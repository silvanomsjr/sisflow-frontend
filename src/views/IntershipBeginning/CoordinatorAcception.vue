<template>

  <div>
    <div class="pageContentRow">

      <TextCustom v-if="!this.pageDisabled" margin='0px 0px 15px 0px' display='block'>
        Olá coordenador. Segue abaixo documentos do aluno para download caso necessário:
      </TextCustom>

      <TextCustom v-else margin='0px 0px 15px 0px' display='block'>
        Olá coordenador. Esta solicitação já foi respondida, verifique abaixo os documentos do aluno:
      </TextCustom>

    </div>

    <DetailsCard 
      id="stuDetails" title="Dados do aluno solicitante" :showItemsOnStart="true" :items="this.studentDetailsCardItems"
    />

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

    <div class="pageContentRow center" v-if="!this.pageDisabled">
      <ButtonCustom id="btnConfirm" ref="btnConfirm" 
        label="Deferir" customTextColor="white" customBackColor="darkblue1" customFontSize="normal" width="30%" padding="3px 20px" margin="0px 5px" 
        @click="doAccept()"
      />
      <ButtonCustom id="btnReject" ref="btnReject" 
        label="Indeferir" customTextColor="white" customBackColor="darkblue1" customFontSize="normal" width="30%" padding="3px 20px" margin="0px 5px"
        @click="doReject()"
      />
      <ButtonCustom v-if="!this.pageDisabled" id="btnCancel" ref="btnCancel" 
        label="Voltar" customTextColor="white" customBackColor="darkblue1" customFontSize="normal" width="30%" padding="3px 20px" margin="0px 5px" 
        @click="this.$root.renderView('home')"
      />
    </div>
  </div>
</template>

<script>

import ButtonCustom from '../../components/ButtonCustom.vue'
import DetailsCard from '../../components/DetailsCard.vue'
import FileDownload from '../../components/FileDownload.vue'
import Requests from '../../js/requests.js'
import TextCustom from '../../components/TextCustom.vue'

export default {

  name: 'CoordinatorAcceptionView',

  components: {
    ButtonCustom,
    DetailsCard,
    FileDownload,
    TextCustom
  },

  data() {
    return {
      histTextual: null,
      histVisual: null,
      vinculoE: null,
      studentDetailsCardItems: [],
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

    // request for solicitation data
    let vreturn = await this.$root.doRequest(Requests.getSolicitation, [userHasStateId]);
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
              'download_endpoint': `${process.env.VUE_APP_SERVICE_URL}file?bearer=${this.$root.userJwtToken}&file_name=${supload['upload_hash_name']}`
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
      await this.doSolicitation(this.transitions.find(ts => ts['transition_decision'] == 'Indeferido')['id']);
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