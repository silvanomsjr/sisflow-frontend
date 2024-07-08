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

    <div class="pageContentRow boxWrapper" v-if="this.historyItems.length > 0">
      <TextCustom
        customFontSize='title_bold'
        display='inline'>
        Documentos
      </TextCustom>

      <div v-for="(history, index) in this.historyItems" :key="index">
        
        <div v-if="(this.historyItems[0]['download_name'].includes('TcePa') && index == 0) || 
          (!this.historyItems[0]['download_name'].includes('TcePa') && (index == 0 || index == 1))">
          <FileDownload
            :id="'download_' + index"
            ref="pageDownload"
            class="fileD"
            :titleText="history['download_label']"
            :fileName="history['download_name']"
            :downloadEndpoint="history['download_endpoint']"
          />
        </div>
        <div v-else-if="this.showHistory">
          <FileDownload
            :id="'download_' + index"
            ref="pageDownload"
            class="fileD"
            :titleText="history['download_label']"
            :fileName="history['download_name']"
            :downloadEndpoint="history['download_endpoint']"
          />
        </div>
        
      </div>
      <div class="right">
        <ButtonCustom
          id="btnShowHistory"
          ref="btnShowHistory"
          :label="this.showHistory ? 'Esconder histórico' : 'Mostrar histórico'"
          customTextColor="white"
          customBackColor="darkblue1"
          customFontSize="normal"
          width="200px"
          padding="3px 20px"
          @click="this.showHistory = !this.showHistory"
        />
      </div>
      
    </div>

    <div class="pageContentRow boxWrapper" v-if="!this.pageDisabled">
      <TextCustom
        margin='0px 0px 15px 0px'
        customFontSize='title_bold'
        display='block'>
        Enviar documentos
      </TextCustom>

      <SelectCustom 
        ref="selectTcePa"
        class="selectC"
        labelValue="TCE com PA incluso?" 
        :items="this.selectTcePaItems"
        :initialOptSelected="0"
        @optClicked="(optValue) => this.tcePaTogether = optValue"
      />

      <div v-if="this.tcePaTogether">
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
          ref="uploadTce"
          class="fileU"
          titleText="Envie o TCE"
          fileContentName="TCE"
          :uploadEndpoint="this.fileUploadEndpoint"
        />
        <FileUpload 
          id="pa" 
          ref="uploadPa"
          class="fileU"
          titleText="Envie o PA"
          fileContentName="PA"
          :uploadEndpoint="this.fileUploadEndpoint"
        />
      </div>

      <div class="pageContentRow left">
        <ButtonCustom
          id="btnSendDocs"
          ref="btnSendDocs"
          label="Enviar documentos"
          customTextColor="white"
          customBackColor="darkblue1"
          customFontSize="normal"
          width="200px"
          padding="3px 20px"
          margin="0px 20px"
          @click="sendDocs()"
        />
        <ButtonCustom v-if="this.userProfiles.includes('ADM') || this.userProfiles.includes('COO')"
          id="btnSendDocsSesta"
          ref="btnSendDocsSesta"
          label="SESTA: Enviar e deferir"
          customTextColor="white"
          customBackColor="darkblue1"
          customFontSize="normal"
          width="200px"
          padding="3px 20px"
          @click="sendDocs(true)"
        />
      </div>
    </div>

    <div class="pageContentRow right">
      <ButtonCustom v-if="!this.pageDisabled && (this.userProfiles.includes('ADM') || this.userProfiles.includes('COO'))"
        id="btnDefer"
        ref="btnDefer"
        label="Deferir"
        customTextColor="white"
        customBackColor="darkblue1"
        customFontSize="normal"
        width="200px"
        padding="3px 20px"
        margin="0px 5px"
        @click="doDeferWithoutSend()"
      />
      <ButtonCustom v-if="!this.pageDisabled && (this.userProfiles.includes('ADM') || this.userProfiles.includes('COO'))"
        id="btnReject"
        ref="btnReject"
        label="Indeferir"
        customTextColor="white"
        customBackColor="darkblue1"
        customFontSize="normal"
        width="200px"
        padding="3px 20px"
        margin="0px 5px"
        @click="doReject()"
      />
      
    </div>
  </div>

</template>

<script>

import ButtonCustom from '../../components/ButtonCustom.vue'
import DetailsCard from '../../components/DetailsCard.vue'
import HrefCustom from '../../components/HrefCustom.vue'
import FileDownload from '../../components/FileDownload.vue'
import FileUpload from '../../components/FileUpload.vue'
import Requests from '../../js/requests.js'
import SelectCustom from '../../components/SelectCustom.vue'
import TextCustom from '../../components/TextCustom.vue'
import Utils from '../../js/utils.js'


export default {

  name: 'SignatureView',

  components: {
    ButtonCustom,
    DetailsCard,
    HrefCustom,
    FileDownload,
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
      historyItems: [],
      actualHistoryVersion: 1,
      showHistory: false,
      fileUploadEndpoint: '',
      tcePaTogether: true,
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
    
    this.loadDetailCards();
    this.loadHistory();
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

    loadHistory(){

      this.historyItems = [];
      this.actualHistoryVersion = 1;
      
      if(this.solicitationData['solicitation_user_data'] && this.solicitationData['solicitation_user_data']['uploads']){
        let uploads = this.solicitationData['solicitation_user_data']['uploads'];
        Object.keys(uploads).forEach(uploadName => {
          if(uploadName.includes('Tce') || uploadName.includes('Pa')){

            let upload = uploads[uploadName];
            let splitHashTmp = upload['upload_hash_name'].split('_');
            let splitNameTmp = upload['upload_name'].split('_');

            this.historyItems.push({
              'download_label': `${splitNameTmp[1] == "TcePa" ? "TCE com PA" : splitNameTmp[1].toUpperCase()} enviado por ${Utils.getNameFormated(splitHashTmp[0].replace(/([A-Z])/g, ' $1').trim(), 1)}`,
              'download_name': `${upload['upload_name']}_${splitHashTmp[0]}`,
              'download_endpoint': `${process.env.VUE_APP_SERVICE_URL}file?bearer=${this.$root.userJwtToken}&file_name=${upload['upload_hash_name']}`
            });

            let version = uploadName.split('_')[0];
            let versionNumber = Number.parseInt(version.replace('v',''));
            if(versionNumber + 1 > this.actualHistoryVersion){
              this.actualHistoryVersion = versionNumber + 1;
            }
          }
        });
      }
      this.historyItems.sort((a, b) => b['download_name'].localeCompare(a['download_name']));
    },

    async sendDocs(sestaProfile = false){
      
      // checks if uploads are valid
      if(this.tcePaTogether && this.$refs['uploadTcePa'].getFileIHashName() == null){
        this.$root.renderMsg('warn', 'Anexo TCE com PA está faltando', '');
        return;
      }
      else if(!this.tcePaTogether){
        if(this.$refs['uploadTce'].getFileIHashName() == null){
          this.$root.renderMsg('warn', 'Anexo TCE está faltando', '');
          return;
        }
        else if(this.$refs['uploadPa'].getFileIHashName() == null){
          this.$root.renderMsg('warn', 'Anexo Pa está faltando', '');
          return;
        }
      }

      // create solicitation data and sets final signature file with correct name
      let solicitationData = { 'inputs' : [], 'uploads' : [], 'select_uploads' : [] };
      if(this.tcePaTogether){
        solicitationData['uploads'].push({
          'upload_name' : `v${this.actualHistoryVersion}_TcePa`,
          'upload_hash_name' : this.$refs['uploadTcePa'].getFileIHashName()
        });
        solicitationData['uploads'].push({
          'upload_name' : 'TCEPA',
          'upload_hash_name' : this.$refs['uploadTcePa'].getFileIHashName()
        });
      }
      else{
        solicitationData['uploads'].push({
          'upload_name' : `v${this.actualHistoryVersion}_Tce`,
          'upload_hash_name' : this.$refs['uploadTce'].getFileIHashName()
        });
        solicitationData['uploads'].push({
          'upload_name' : `v${this.actualHistoryVersion}_Pa`,
          'upload_hash_name' : this.$refs['uploadPa'].getFileIHashName()
        });
        solicitationData['uploads'].push({
          'upload_name' : 'TCE',
          'upload_hash_name' : this.$refs['uploadTce'].getFileIHashName()
        });
        solicitationData['uploads'].push({
          'upload_name' : 'PA',
          'upload_hash_name' : this.$refs['uploadPa'].getFileIHashName()
        });
      }

      // parse transition id
      let transitionId = null;
      if(sestaProfile){
        let transitionName = 'SESTA: send docs and defer ' + (this.tcePaTogether ? 'TCE com PA' : 'TCE e PA');
        transitionId = this.transitions.find(tr => tr['transition_name'] == transitionName)['id'];
      }
      else if(this.userProfiles.includes('ADM') || this.userProfiles.includes('COO')){
        transitionId = this.transitions.find(tr => tr['transition_name'] == 'COO: send docs loopback')['id'];
      }
      else if(this.userProfiles.includes('ADV')){
        transitionId = this.transitions.find(tr => tr['transition_name'] == 'ADV: send docs loopback')['id'];
      }
      else if(this.userProfiles.includes('STU')){
        transitionId = this.transitions.find(tr => tr['transition_name'] == 'STU: send docs loopback')['id'];
      }
      if(!transitionId){
        this.$root.renderMsg('warn', 'Id de transição inválido, se o erro persisitir contatar a coordenação de estágios', '');
        return;
      }

      await this.sendSolicitation(this.solicitationData['user_has_state_id'], transitionId, solicitationData);
    },

    async doDeferWithoutSend(){

      if(!this.historyItems || this.historyItems.length == 0){
        this.$root.renderMsg('warn', 'Não foram anexados nenhuma documentação!', '');
        return
      }
      
      let transitionName = 'COO: defer ' + (this.historyItems[0]['download_name'].includes('TcePa') ? 'TCE com PA' : 'TCE e PA');
      let transitionId = this.transitions.find(tr => tr['transition_name'] == transitionName)['id'];
      await this.sendSolicitation(this.solicitationData['user_has_state_id'], transitionId);
    },

    async doReject(){
      let transitionId = this.transitions.find(tr => tr['transition_name'] == 'COO: reject')['id'];
      await this.sendSolicitation(this.solicitationData['user_has_state_id'], transitionId, null, true);
    },

    async sendSolicitation(userHasStateId, transitionId, solicitationData=null, is_reject=false){
      // send solicitation
      let vreturn = await this.$root.doRequest(
        Requests.postSolicitation,
        [userHasStateId, transitionId, solicitationData]);

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
          is_reject ? 'Procedimento indeferido!' : 'Documentos enviados!',
          is_reject ? '' : (this.userProfiles.includes('ADM') ? 
            'Aguarde as outras partes envolvidas ou finalize o processo de assinaturas' :
            'Aguarde a assinatura e validação dos documentos'),
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
  margin: 10px 0px;
}
.boxWrapper{
  margin: 0px;
  padding: 20px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.textC, .tableC{
  margin-top: 5px;
}
.selectC{
  padding: 10px;
  border-radius: 10px;
  margin: 10px 0px;
}
.fileU{
  margin: 10px 0px;
}
.left{
  text-align: left;
  margin-top: 5px;
}
.right{
  text-align: right;
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