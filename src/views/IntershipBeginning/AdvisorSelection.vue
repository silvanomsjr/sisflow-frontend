<template>

  <div>
    <div class="pageContentRow">
      <TextCustom
        margin='0px 0px 15px 0px'
        display='block'>
        {{ !this.pageDisabled ? 
          "Para continuar com a solicitação você deve escolher um orientador." : 
          "Aguarde o orientador aceitar a sua solicitação "
        }}
      </TextCustom>
    </div>

    <div class="pageContentRow" v-if="!this.pageDisabled">
      <TextCustom
        customFontSize='title'
        margin='20px 0px 5px 0px'
        display='block'>
        Orientadores
      </TextCustom>

      <div>
        <TextCustom
          margin='15px 10px 15px 0px'
          display='inline-block'>
          Nome do Orientador: 
        </TextCustom>
        <InputCustom
          id='advisorName'
          ref='advisorName'
          name='advisorName'
          width="calc(100% - 180px)"
          display="inline-block"
          @onChangeAction='advisorInputChange()'
        />
      </div>

      <TableCustom :key="tblAdvisorKey"
        ref="advisorsTable"
        class="tableC"
        :showPrevNextButtons="true"
        :actualPage="this.actualPage"
        :maxPages="this.maxPages"
        @previousClick="this.previousPage()"
        @nextClick="this.nextPage()"
        :tableData="this.advisorsTableData"
      />
    </div>

    <div class="pageContentRow" v-else>
      <TextCustom
        margin='15px 10px 15px 0px'
        display='inline-block'>
        Orientador solicitado: 
      </TextCustom>
      <TableCustom
        ref="advisorSelectedTable"
        class="tableC"
        :tableData="this.advisorSelectedTableData"
      />
    </div>

    <div class="pageContentRow" v-if="!this.pageDisabled">
      <div class='btnWrapper'>
        <div class='btn'>
          <ButtonCustom
            id="btnSendSol"
            label="Solicitar"
            customTextColor="white"
            customBackColor="darkblue1"
            customFontSize="normal"
            width="98%"
            padding="3px 20px"
            @click="doSolicitation"
          />
        </div>
      </div>
    </div>
  </div>

</template>

<script>

import ButtonCustom from '../../components/ButtonCustom.vue'
import InputCustom from '../../components/InputCustom.vue'
import Requests from '../../js/requests.js'
import TableCustom from '../../components/TableCustom.vue'
import TextCustom from '../../components/TextCustom.vue'
//import Utils from '../../js/utils.js'

export default {
  
  name: 'AdvisorSelectionView',

  components: {
    ButtonCustom,
    InputCustom,
    TableCustom,
    TextCustom
  },

  data() {
    return {
      advisorsTableData: {
        'titles': [ 'Selecionar', 'Nome', 'Email', 'Quantidade de Orientados' ],
        'colTypes': [ 'checkbox-single', 'string', 'string', 'string' ],
        'colWidths': [ '10%', '35%', '35%', '20%' ],
        'content': []
      },
      advisorSelectedTableData: {
        'titles': [ 'Nome', 'Email', 'Quantidade de Orientados' ],
        'colTypes': [ 'string', 'string', 'string' ],
        'colWidths': [ '40%', '40%', '20%' ],
        'content': []
      },
      actualPage: 1,
      maxPages: 1,
      startRow: 0,
      quantityRows: 2,
      advisorName: '',
      cleanIfLessThan3: false,
      pageDisabled: false,
      transitionManualId: null,
      tblAdvisorKey: 0
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
    this.solicitationUserData = vreturn['response']['solicitation']['solicitation_user_data'];
    this.advisorData = vreturn['response']['advisor'];
    
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

    if(!this.pageDisabled){
      this.transitionManualId = this.solicitationData['transitions'].find(tr => tr['type'] == 'manual')['id'];
      await this.loadAdvisorsTable();
    }
    else{
      this.advisorSelectedTableData['content'].push([
        this.advisorData['user_name'], this.advisorData['institutional_email'], this.advisorData['advisor_students']
      ]);
    }
    
    this.$root.pageName = 'Seleção de Orientador';
  },

  methods:{

    async loadAdvisorsTable(){

      let vreturn = await this.$root.doRequest(
        Requests.getAdvisors,
        [ this.startRow, this.quantityRows, this.advisorName ], false);

      if(vreturn && vreturn['ok']){

        // max pages for paginator
        this.maxPages = Math.max(Math.ceil(vreturn['response']['count']/this.quantityRows), 1);

        this.advisorsTableData['content'] = [];
        this.advisorsTableData['siapes'] = [];

        vreturn['response']['advisors'].forEach(advisor => {
          this.advisorsTableData['siapes'].push(advisor['siape']);
          this.advisorsTableData['content'].push([
            '',
            advisor['user_name'],
            advisor['institutional_email'],
            advisor['advisor_students']
          ]);
        });
        this.tblAdvisorKey++;
      }
      else{
        this.$root.renderRequestErrorMsg(vreturn);
      }
    },
    previousPage(){
      this.actualPage = this.actualPage - 1;
      this.startRow = this.startRow - this.quantityRows;
      this.loadAdvisorsTable();
    },
    nextPage(){
      this.actualPage = this.actualPage + 1;
      this.startRow = this.startRow + this.quantityRows;
      this.loadAdvisorsTable();
    },
    advisorInputChange(){
      this.advisorName = this.$refs.advisorName.getV();

      if(this.advisorName.length >= 3 || this.cleanIfLessThan3){
        this.actualPage = 1;
        this.maxPages = 2;
        this.startRow = 0;
        this.quantityRows = 2;
        this.loadAdvisorsTable();
        if(this.advisorName.length < 3){
          this.cleanIfLessThan3 = false;
        }
        else{
          this.cleanIfLessThan3 = true;
        }
      }
    },
    async doSolicitation(){

      let advisorTableD = this.$refs['advisorsTable'].getV();
      let advisorSelected = advisorTableD ? advisorTableD.findIndex(advisor => advisor[0] == true) : -1;

      if(advisorSelected == -1){
        this.$root.renderMsg('warn', 'Selecione um orientador', '');
        return;
      }

      // put solicitation advisor
      let vreturn = await this.$root.doRequest( 
        Requests.putSolicitationAdvisor,
        [ this.solicitationData['user_has_solicitation_id'], this.advisorsTableData['siapes'][advisorSelected] ]);

      if(!vreturn || !vreturn['ok']){
        this.$root.renderRequestErrorMsg(vreturn, []);
        return;
      }
      
      // do Solicitation
      vreturn = await this.$root.doRequest(
        Requests.postSolicitation,
        [
          this.solicitationData['user_has_state_id'],
          this.transitionManualId,
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
          'Aguarde a aprovação do orientador para iniciar o processo de coleta de assinaturas.',
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