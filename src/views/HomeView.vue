<template>

  <div v-if="this.userProfiles!=null">
    
    <div class="pageContentRow">
      <TextCustom
        margin='0px 0px 15px 0px'
        display='block'>
        <p>Bem vindo ao Sisges, o sistema de gestão de estagios supervisionados.</p>
        <p>O sistema foi criado com a finalidade de facilitar as etapas relacionadas 
          à gestão de estágios supervisionados fornecendo a possibilidade de realizar as 
          solicitações às pessoas envolvidas no procedimento de forma centralizada e organizada.</p>
        <p v-if="this.userProfiles.includes('ADM')">
          Você está logado com uma conta de perfil administrador, abaixo você pode visualizar as solicitações de alunos ordenadas pela data de criação.
        </p>
        <p v-else-if="this.userProfiles.includes('COO')">
          Coordenador, abaixo você pode visualizar solicitações de alunos ordenadas pela data de criação.
        </p>
        <p v-else-if="this.userProfiles.includes('ADV')">
          Orientador, abaixo você pode visualizar solicitações de seus alunos orientados ordenadas pela data de criação.
        </p>
        <p v-else>
          Não se esqueça de verificar diariamente seu email institucional e/ou secundário após realizar 
          solicitações.
        </p>
      </TextCustom>
    </div>

    <div class="pageContentRow" v-if="this.coordinatorSolTable['content'].length > 0">
      <TextCustom
        customFontSize='title'
        margin='20px 0px 5px 0px'
        display='block'>
        Solicitações
      </TextCustom>

      <TableCustom class="tableC"
        :tableData="this.coordinatorSolTable"/>
    </div>

    <div class="pageContentRow" v-if="this.advisorSolTable['content'].length > 0">
      <TextCustom
        customFontSize='title'
        margin='20px 0px 5px 0px'
        display='block'>
        Solicitações de seus alunos orientados
      </TextCustom>

      <TableCustom class="tableC"
        :tableData="this.advisorSolTable"/>
    </div>

    <div class="pageContentRow" v-if="this.studentSolTable['content'].length > 0">
      <TextCustom
        customFontSize='title'
        margin='20px 0px 5px 0px'
        display='block'>
        Suas solicitações
      </TextCustom>

      <TableCustom class="tableC"
        :tableData="this.studentSolTable"/>
    </div>

    <div class="pageContentRow" v-if="this.userProfiles.includes('STU')">
      <TextCustom
        customFontSize='title'
        margin='20px 0px 5px 0px'
        display='block'>
        Solicitar início de estágio
      </TextCustom>

      <RadioTreeCustom ref="radioSolicitation" class="radioSolicitation"
        :options="this.radioOpts" @optSelected="(newValue) => this.handleOptsClick(newValue)"/>
      
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
            :disabled="this.btnSendSolDisabled"
            @click="createSolicitation"
          />
        </div>
      </div>
    </div>

  </div>

</template>

<script>

import ButtonCustom from '../components/ButtonCustom.vue'
import Requests from '../js/requests.js'
import RadioTreeCustom from '../components/RadioTreeCustom.vue'
import TableCustom from '../components/TableCustom.vue'
import TextCustom from '../components/TextCustom.vue'
//import Utils from '../js/utils.js'

export default {
  
  name: 'HomeView',

  components: {
    ButtonCustom,
    RadioTreeCustom,
    TableCustom,
    TextCustom
  },

  data() {
    return {
      userProfiles: null,
      coordinatorSolTable: {
        'titles': [ 'Aluno', 'Orientador', 'Solicitação', 'Descricao', 'Data e hora', 'Decisao', 'Motivo', 'Ação' ],
        'colTypes': [ 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'iconfunction' ],
        'colWidths': [ '11%', '10%', '15%', '25%', '10%', '11%', '11%', '7%' ],
        'content': []
      },
      advisorSolTable: {
        'titles': [ 'Aluno', 'Solicitação', 'Descricao', 'Data e hora', 'Decisao', 'Motivo', 'Ação' ],
        'colTypes': [ 'string', 'string', 'string', 'string', 'string', 'string', 'iconfunction' ],
        'colWidths': [ '11%', '15%', '30%', '10%', '15%', '12%', '7%' ],
        'content': []
      },
      studentSolTable: {
        'titles': [ 'Solicitação', 'Descricao', 'Data e hora', 'Decisao', 'Motivo', 'Ação' ],
        'colTypes': [ 'string', 'string', 'string', 'string', 'string', 'iconfunction' ],
        'colWidths': [ '18%', '35%', '15%', '10%', '15%', '7%' ],
        'content': []
      },
      radioOptSelected: '',
      radioOpts: [
        { label: 'Estágio obrigatório', value: 'eo',
          suboptions: [
            { label: 'Estágio externo com vínculo empregatício', value: 1 },
            { label: 'Estágio externo', value: 2 }
          ]
        },
        { label: 'Estágio nao obrigatório', value: 'eno',
          suboptions: [
            { label: 'Externo', value: 3 },
            { label: 'Interno', value: 4 }
          ]
        }
      ],
      btnSendSolDisabled: true
    }
  },

  async created() {

    this.$root.pageName = 'Home';
    this.userProfiles = this.$root.userLoggedData['profile_acronyms'];

    if(this.userProfiles.includes('ADM') || this.userProfiles.includes('COO')){
      await this.loadCoordinatorSolTable();
    }

    else if(this.userProfiles.includes('ADV')){
      await this.loadAdvisorSolTable();
    }

    else if(this.userProfiles.includes('STU')){
      await this.loadStudentSolTable();
    }
  },

  mounted() {},

  methods:{

    async loadCoordinatorSolTable(){

      let vreturnCoor = await this.$root.doRequest(
        Requests.getCoordinatorSolicitations,
        []);

      if(vreturnCoor && vreturnCoor['ok']){

        let pageContext = this;
        pageContext.coordinatorSolTable['content'] = [];

        vreturnCoor['response'].forEach(solicitation => {

          let iconName = null;
          if(pageContext.userProfiles.includes("COO") && solicitation['profile_acronyms'].includes("COO") && 
            solicitation['state_active'] && solicitation['state_decision'] == 'Em analise'){
            iconName = 'fa-solid fa-pencil';
          }
          else if(pageContext.userProfiles.includes("ADV") && solicitation['profile_acronyms'].includes("ADV") && 
            solicitation['state_active'] && solicitation['state_decision'] == 'Em analise'){
            iconName = 'fa-solid fa-pencil';
          }
          else if(!solicitation['state_active']){
            iconName = 'fa-solid fa-eye';
          }

          this.coordinatorSolTable['content'].push([
            solicitation['student_name'],
            solicitation['advisor_name'],
            solicitation['solicitation_name'],
            solicitation['state_description'],
            solicitation['state_start_datetime'] ? solicitation['state_start_datetime'].replaceAll('-','/'): '' ,
            solicitation['state_decision'],
            solicitation['state_reason'],
            {
              'iconName' : iconName,
              'iconSelFunction' : function(){
                if(iconName){
                  pageContext.$root.renderView(
                    solicitation['state_static_page_name'] ? solicitation['state_static_page_name'] : 'solicitation', 
                    { 'user_has_state_id': solicitation['user_has_state_id'] 
                  });
                }
              }
            }
          ]);
        });
      }
      else{
        this.$root.renderRequestErrorMsg(vreturnCoor);
      }
    },

    async loadAdvisorSolTable(){

      let vreturnAdv = await this.$root.doRequest(
        Requests.getAdvisorSolicitations,
        []);

      if(vreturnAdv && vreturnAdv['ok']){

        let pageContext = this;
        pageContext.advisorSolTable['content'] = [];

        vreturnAdv['response'].forEach(solicitation => {

          let iconName = null;
          if(pageContext.userProfiles.includes("ADV") && solicitation['profile_acronyms'].includes("ADV")){
            if(solicitation['state_active'] && solicitation['state_decision'] == 'Em analise'){
              iconName = 'fa-solid fa-pencil';
            }
            else{
              iconName = 'fa-solid fa-eye';
            }
          }

          this.advisorSolTable['content'].push([
            solicitation['student_name'],
            solicitation['solicitation_name'],
            solicitation['state_description'],
            solicitation['state_start_datetime'] ? solicitation['state_start_datetime'].replaceAll('-','/'): '',
            solicitation['state_decision'],
            solicitation['state_reason'],
            {
              'iconName' : iconName,
              'iconSelFunction' : function(){
                if(iconName){
                  pageContext.$root.renderView(
                    solicitation['state_static_page_name'] ? solicitation['state_static_page_name'] : 'solicitation', 
                    { 'user_has_state_id': solicitation['user_has_state_id'] 
                  });
                }
              }
            }
          ]);
        });
      }
      else{
        this.$root.renderRequestErrorMsg(vreturnAdv);
      }
    },

    async loadStudentSolTable(){

      let vreturnStud = await this.$root.doRequest(
        Requests.getStudentSolicitations,
        []);

      if(vreturnStud && vreturnStud['ok']){

        let pageContext = this;
        pageContext.studentSolTable['content'] = [];

        vreturnStud['response'].forEach(solicitation => {

          let iconName = null;
          if(pageContext.userProfiles.includes("STU") && solicitation['profile_acronyms'].includes("STU")){
            if(solicitation['state_active'] && solicitation['state_decision'] == 'Em analise'){
              iconName = 'fa-solid fa-pencil';
            }
            else{
              iconName = 'fa-solid fa-eye';
            }
          }

          this.studentSolTable['content'].push([
            solicitation['solicitation_name'],
            solicitation['state_description'],
            solicitation['state_start_datetime'] ? solicitation['state_start_datetime'].replaceAll('-','/') : '',
            solicitation['state_decision'],
            solicitation['state_reason'],
            {
              'iconName' : iconName,
              'iconSelFunction' : function(){
                if(iconName){
                  pageContext.$root.renderView(
                    solicitation['state_static_page_name'] ? solicitation['state_static_page_name'] : 'solicitation', 
                    { 'user_has_state_id': solicitation['user_has_state_id'] 
                  });
                }
              }
            }
          ]);
        });
      }
      else{
        this.$root.renderRequestErrorMsg(vreturnStud);
      }
    },

    async handleOptsClick(newValue){

      this.radioOptSelected = newValue;

      if(isNaN(this.radioOptSelected)){
        this.btnSendSolDisabled = true;
      }
      else{
        this.btnSendSolDisabled = false;
      }
    },

    async createSolicitation(){

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