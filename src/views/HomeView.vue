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
        <p v-if="this.userProfiles.includes('A')">
          Você está logado com uma conta de perfil administrador, abaixo você pode visualizar as solicitações de alunos ordenadas pela data de criação.
        </p>
        <p v-else-if="this.userProfiles.includes('C')">
          Coordenador, abaixo você pode visualizar solicitações de alunos ordenadas pela data de criação.
        </p>
        <p v-else-if="this.userProfiles.includes('P')">
          Professor, abaixo você pode visualizar solicitações de seus alunos orientados ordenadas pela data de criação.
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

    <div class="pageContentRow" v-if="this.professorSolTable['content'].length > 0">
      <TextCustom
        customFontSize='title'
        margin='20px 0px 5px 0px'
        display='block'>
        Solicitações de seus alunos orientados
      </TextCustom>

      <TableCustom class="tableC"
        :tableData="this.professorSolTable"/>
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

    <div class="pageContentRow" v-if="this.userProfiles.includes('S')">
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
            @click="doSolicitation"
          />
        </div>
      </div>
    </div>

    <FileDownload id="filed" ref="filed"
      titleText="Faça o download do seu histórico assinado"
      fileName="AlunoVitor_HistTextual_0sYa3J5OJD.pdf"
      downloadEndpoint="http://localhost:5000/file?bearer=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c3VhcmlvIjoyLCJlbWFpbF9pbnMiOiJhbHVub0B1ZnUuYnIiLCJlbWFpbF9zZWMiOiJhbHVub0BnbWFpbC5jb20iLCJub21lIjoiQWx1bm8gVml0b3IiLCJzZXhvIjoiTSIsInRlbGVmb25lIjoiMzQyMjIyMjIyMjIiLCJkYXRhX2hvcmFfY3JpYWNhbyI6IjIwMjMtMDMtMTUgMjM6Mzk6NTQiLCJwZXJmaWxfYWx1bm8iOnsibWF0cmljdWxhIjoiMTExMTFCU0kxMTEiLCJjdXJzbyI6IkJTSSJ9LCJwZXJmaXMiOlsiUyJdfQ.kiIJcNE5YGVO97wChpnhMWoMWLE3ATCfYc_1nQy6u1P10WwomNImSVQ8Ibyq8g1MeKGNFYXJbHc8KBPEYFaiSgilnbW-yUZYf7emZxDIhTSJqc20vs-3DysxJC4VOI_Qoh1JmtDQC9wWxwPRIa0BBgQNMHcnkVKQi3Jr-mIsFAOKKoRHSECI3UeMXhYdH1n3zZk1ljQ4SYlLVx8ApHeAtHfNMPL225R16wXrdmsjw2v6RpFV4SHjWTOVeMsEhkuUAOV0gGKg6_qB9h9-Wfyar1QwupOKy2x1uA5FDEjeCPUC1oXRUgXmnhsKmIL322zrs2ZX_Qzek2Tx8kCg7WN2Cw&file_name=AlunoVitor_HistTextual_0sYa3J5OJD.pdf"
    />

  </div>

</template>

<script>

import ButtonCustom from '../components/ButtonCustom.vue'
import Requests from '../js/requests.js'
import RadioTreeCustom from '../components/RadioTreeCustom.vue'
import TableCustom from '../components/TableCustom.vue'
import TextCustom from '../components/TextCustom.vue'
import FileDownload from '../components/FileDownload.vue'
//import Utils from '../js/utils.js'

export default {
  
  name: 'HomeView',

  components: {
    ButtonCustom,
    RadioTreeCustom,
    TableCustom,
    TextCustom,
    FileDownload
  },

  data() {
    return {
      userProfiles: null,
      coordinatorSolTable: {
        'titles': [ 'Aluno', 'Orientador', 'Solicitação', 'Descricao', 'Data e hora', 'Decisao', 'Motivo', 'Visualizar' ],
        'colTypes': [ 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'iconfunction' ],
        'colWidths': [ '10%', '10%', '15%', '25%', '10%', '11%', '11%', '8%' ],
        'content': []
      },
      professorSolTable: {
        'titles': [ 'Aluno', 'Solicitação', 'Descricao', 'Data e hora', 'Decisao', 'Motivo', 'Visualizar' ],
        'colTypes': [ 'string', 'string', 'string', 'string', 'string', 'string', 'iconfunction' ],
        'colWidths': [ '10%', '15%', '30%', '10%', '15%', '12%', '8%' ],
        'content': []
      },
      studentSolTable: {
        'titles': [ 'Solicitação', 'Descricao', 'Data e hora', 'Decisao', 'Motivo', 'Visualizar' ],
        'colTypes': [ 'string', 'string', 'string', 'string', 'string', 'iconfunction' ],
        'colWidths': [ '15%', '35%', '15%', '10%', '15%', '10%' ],
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
    this.userProfiles = this.$root.userLoggedData['perfis'];

    if(this.userProfiles.includes('A') || this.userProfiles.includes('C')){
      await this.loadCoordinatorSolTable();
    }

    if(this.userProfiles.includes('P')){
      await this.loadProfessorSolTable();
    }

    if(this.userProfiles.includes('S')){
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
          this.coordinatorSolTable['content'].push([
            solicitation['nome_aluno'],
            solicitation['nome_orientador'],
            solicitation['nome_solicitacao'],
            solicitation['descricao'],
            solicitation['data_hora_inicio'].replaceAll('-','/'),
            solicitation['decisao'],
            solicitation['motivo'],
            {
              'iconName' : 'fa-solid fa-clock-rotate-left', 
              'iconSelFunction' : function(){
                pageContext.$root.renderView(
                  'solicitation', {
                    'solicitation': solicitation['id_solicitacao'],
                    'solicitation_step_order': solicitation['ordem_etapa_solicitacao'] })
              }
            }
          ]);
        });
      }
      else{
        this.$root.renderRequestErrorMsg(vreturnCoor);
      }
    },

    async loadProfessorSolTable(){

      let vreturnProf = await this.$root.doRequest(
        Requests.getProfessorSolicitations,
        []);

      if(vreturnProf && vreturnProf['ok']){

        let pageContext = this;

        pageContext.professorSolTable['content'] = [];

        vreturnProf['response'].forEach(solicitation => {
          this.professorSolTable['content'].push([
            solicitation['nome_aluno'],
            solicitation['nome_solicitacao'],
            solicitation['descricao'],
            solicitation['data_hora_inicio'].replaceAll('-','/'),
            solicitation['decisao'],
            solicitation['motivo'],
            {
              'iconName' : 'fa-solid fa-clock-rotate-left', 
              'iconSelFunction' : function(){
                pageContext.$root.renderView(
                  'solicitation', {
                    'solicitation': solicitation['id_solicitacao'],
                    'solicitation_step_order': solicitation['ordem_etapa_solicitacao'] })
              }
            }
          ]);
        });
      }
      else{
        this.$root.renderRequestErrorMsg(vreturnProf);
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
          this.studentSolTable['content'].push([
            solicitation['nome_solicitacao'],
            solicitation['descricao'],
            solicitation['data_hora_inicio'].replaceAll('-','/'),
            solicitation['decisao'],
            solicitation['motivo'],
            {
              'iconName' : 'fa-solid fa-clock-rotate-left', 
              'iconSelFunction' : function(){
                pageContext.$root.renderView(
                  'solicitation', {
                    'solicitation': solicitation['id_solicitacao'],
                    'solicitation_step_order': solicitation['ordem_etapa_solicitacao'] })
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

      let vreturn = await this.$root.doRequest(
        Requests.putSolicitation,
        [solicitationOpt]);

      if(vreturn && vreturn['ok']){
        await this.loadStudentSolTable();
        this.$root.renderView('solicitation', { 'solicitation': solicitationOpt, 'solicitation_step_order': 1 })
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