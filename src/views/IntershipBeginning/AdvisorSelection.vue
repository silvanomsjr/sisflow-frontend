<template>

  <div>
    <div class="pageContentRow">
      <TextCustom
        margin='0px 0px 15px 0px'
        display='block'>
        Para continuar com a solicitação você deve escolher um orientador.
      </TextCustom>
    </div>

    <div class="pageContentRow">
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

      <TableCustom class="tableC"
        :showPrevNextButtons="true"
        :actualPage="this.actualPage"
        :maxPages="this.maxPages"
        @previousClick="this.previousPage()"
        @nextClick="this.nextPage()"
        :tableData="this.advisorsTableData"
      />
    </div>

    <div class="pageContentRow">
      
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
            :disabled="this.pageDisabled"
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
  
  name: 'HomeView',

  components: {
    ButtonCustom,
    InputCustom,
    TableCustom,
    TextCustom
  },

  data() {
    return {
      userProfiles: null,
      advisorsTableData: {
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
    this.solicitationUserData = vreturn['response']['solicitation']['solicitation_user_data'];

    this.pageDisabled = 
      this.solicitationData['decision'] != 'Em analise' || 
      !this.$root.userLoggedData['profile_acronyms'].includes(this.solicitationData['state_profile_editor_acronym']);

    console.log(vreturn);
    await this.loadAdvisorsTable();
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
        console.log(vreturn);

        vreturn['response']['advisors'].forEach(solicitation => {
          this.advisorsTableData['content'].push([
            solicitation['user_name'],
            solicitation['institutional_email'],
            3
          ]);
        });
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

      if(isNaN(this.radioOptSelected) || !this.radioOptSelected){
        this.$root.renderMsg('warn', 'Solicitação inválida!', '');
        return;
      }

      let solicitationOpt = parseInt(this.radioOptSelected);
      
      if(solicitationOpt < 0 || solicitationOpt > 4){
        this.$root.renderMsg('warn', 'Solicitação inválida!', '');
        return;
      }

      let vreturn = await this.$root.doRequest( Requests.putSolicitation, [solicitationOpt] );

      if(vreturn && vreturn['ok']){
        this.$root.renderView( 'solicitation', { 'user_has_state_id': vreturn['response']['user_has_state_id'] })
      }
      else{
        this.$root.renderRequestErrorMsg(vreturn, ['Você já possui essa solicitação!']);
      }
    }
  }
}
</script>

<!-- style applies only to this component -->
<style scoped>

.pageContentRow{
  margin-bottom: 40px;
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