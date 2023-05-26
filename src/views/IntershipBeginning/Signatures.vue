<template>

  <div>
    <div class="pageContentRow">
      <TextCustom
        margin='0px 0px 15px 0px'
        display='inline'>
        Nesta etapa as pessoas envolvidas no processo de inicio de estágio realizam a assinatura dos documentos Termo de Compromisso de 
        Estágio(<b>TCE</b>) e Plano de Atividades(<b>PA</b>) para dar inicio ao estágio. Para mais informações sobre estes documentos verifique
        as 
      </TextCustom>
      <HrefCustom v-if="this.studentData && this.studentData['course']=='BCC'"
        id="cchref"
        customColor="lightblue"
        href="https://facom.ufu.br/graduacao/bcc/estagio-supervisionado">
        regras de estágio para o curso Ciências da Computação.
      </HrefCustom>
      <HrefCustom v-if="this.studentData && this.studentData['course']=='BSI'"
        id="sihref"
        customColor="lightblue"
        href="https://facom.ufu.br/legislacoes/normas-de-estagio-curricular-do-bacharelado-em-sistemas-de-informacao">
        regras de estágio para o curso de Sistemas de Informação.
      </HrefCustom>
      <TextCustom
        margin='10px 0px 10px 0px'
        display='block'>
        Seguir a <b>ordem de coleta, preenchimento de assinaturas</b> indicada: Aluno, Supervisor e Orientador para os documentos.
        Sendo o supervisor o responsável pelo acompanhamento do estágio da empresa.
      </TextCustom>
      <TextCustom
        margin='10px 0px 10px 0px'
        display='block'>
        Com as assinaturas coletadas a coordenação de estágios irá avaliar a documentação no prazo de até 4 dias úteis e assinar 
        caso estiver tudo em conformidade com as normas. Após é solicitada a validação e assinatura do Setor de Estágios(SESTA) para a 
        homologação do documento e inicio do processo de estágio. O SESTA possui até 5 dias úteis para realizar a validação e homologação.
      </TextCustom>
    </div>

    <DetailsCard v-if="this.userProfiles.includes('ADM') || this.userProfiles.includes('COO') || this.userProfiles.includes('ADV')"
      id="stuDetails"
      title="Dados do aluno"
      :items="this.studentDetailsCardItems"
    />

    <DetailsCard v-if="this.userProfiles.includes('ADM') || this.userProfiles.includes('COO')"
      id="advDetails"
      title="Dados do orientador"
      :items="this.advisorDetailsCardItems"
    />

    <SelectCustom 
      ref="selectTcePa"
      class="selectC"
      labelValue="TCE com PA incluso?" 
      :items="this.selectTcePaItems"
      @optClicked="(optValue) => this.showTcePaTogether = optValue"
    />

    <div v-if="this.showTcePaTogether">
      <FileUpload 
        id="tcepa" 
        ref="uploadTcePa"
        class="fileU"
        titleText="Envie o TCE com PA"
        fileContentName="TCEPA"
        :uploadEndpoint="this.fileUploadEndpoint"
      />
    </div>
    <div v-else>
      <FileUpload 
        id="tce" 
        ref="uploadTcePa"
        class="fileU"
        titleText="Envie o TCE"
        fileContentName="TCE"
        :uploadEndpoint="this.fileUploadEndpoint"
      />
      <FileUpload 
        id="pa" 
        ref="uploadTcePa"
        class="fileU"
        titleText="Envie o PA"
        fileContentName="PA"
        :uploadEndpoint="this.fileUploadEndpoint"
      />
    </div>

    <div class="pageContentRow">
      <ButtonCustom
        id="btnConfirm"
        ref="btnConfirm"
        label="Confirmar"
        customTextColor="white"
        customBackColor="darkblue1"
        customFontSize="normal"
        width="100%"
        padding="3px 20px"
        @click="doAccept()"
      />
    </div>

    <div class="pageContentRow">
      <ButtonCustom
        id="btnReject"
        ref="btnReject"
        label="Rejeitar"
        customTextColor="white"
        customBackColor="darkblue1"
        customFontSize="normal"
        width="100%"
        padding="3px 20px"
        @click="doReject()"
      />
    </div>

    <div class="pageContentRow">
      <ButtonCustom
        id="btnCancel"
        ref="btnCancel"
        label="Cancelar"
        customTextColor="white"
        customBackColor="darkblue1"
        customFontSize="normal"
        width="100%"
        padding="3px 20px"
        @click="doCancel()"
      />
    </div>
  </div>

</template>

<script>

import ButtonCustom from '../../components/ButtonCustom.vue'
import DetailsCard from '../../components/DetailsCard.vue'
import HrefCustom from '../../components/HrefCustom.vue'
import FileUpload from '../../components/FileUpload.vue'
import Requests from '../../js/requests.js'
import SelectCustom from '../../components/SelectCustom.vue'
import TextCustom from '../../components/TextCustom.vue'

export default {

  name: 'SignatureView',

  components: {
    ButtonCustom,
    DetailsCard,
    HrefCustom,
    FileUpload,
    SelectCustom,
    TextCustom
  },

  data() {
    return {
      studentData: null,
      studentDetailsCardItems: [],
      advisorDetailsCardItems: [],
      selectTcePaItems: [
        { "label": "Sim", "value": true },
        { "label": "Não", "value": false }
      ],
      fileUploadEndpoint: '',
      showTcePaTogether: true,
      pageDisabled: false
    }
  },

  async created() {

    let pageContext = this;
    this.userProfiles = this.$root.userLoggedData['profile_acronyms'];

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
    
    this.loadDetailCards();
    this.$root.pageName = 'Processo de assinaturas para início de estágio';
  },

  mounted() {
    this.fileUploadEndpoint = process.env.VUE_APP_SERVICE_URL + 'file';
  },

  methods:{

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
    // accept solicitation by advisor
    async doAccept(){
      let vreturn = await this.$root.doRequest( 
        Requests.patchSolicitationAdvisor,
        [ this.solicitationData['user_has_solicitation_id'], this.advisorData['siape'] ]);

      if(!vreturn || !vreturn['ok']){
        this.$root.renderRequestErrorMsg(vreturn, []);
        return;
      }
      await this.doSolicitation(this.transitions.find(ts => ts['transition_decision'] == 'Deferido')['id']);
    },
    // reject solicitation by advisor
    async doReject(){
      await this.doSolicitation(this.transitions.find(ts => ts['transition_decision'] == 'Indeferido')['id']);
    },
    // cancel solicitation by advisor
    async doCancel(){
      await this.doSolicitation(this.transitions.find(ts => ts['transition_decision'] == 'Cancelado pelo orientador')['id']);
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
          'O aluno agora pode iniciar o processo de assinaturas.',
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
  margin-bottom: 20px;
}
.textC, .tableC{
  margin-top: 5px;
}
.selectC{
  padding: 10px;
  border-radius: 10px;
  margin: 10px 0px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.fileU{
  margin: 10px 0px;
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