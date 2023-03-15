<template>

  <div>
    
    <div class="pageContentRow">
      <TextCustom
        margin='0px 0px 15px 0px'
        display='block'>
        <p>Bem vindo ao Sisges, o sistema de gestão de estagios supervisionados.</p>
        <p>O sistema foi criado com a finalidade de facilitar as etapas relacionadas 
          à gestão de estágios supervisionados fornecendo a possibilidade de realizar as 
          solicitações às pessoas envolvidas no procedimento de forma centralizada e organizada.</p>
        <p>Não se esqueça de verificar diariamente seu email institucional e/ou secundário após realizar 
          solicitações.</p>
      </TextCustom>
    </div>

    <div class="pageContentRow" v-if="this.solicitationsTable['content'].length > 0">
      <TextCustom
        customFontSize='title'
        margin='20px 0px 5px 0px'
        display='block'>
        Suas solicitações
      </TextCustom>

      <TableCustom class="tableC"
        :tableData="this.solicitationsTable"/>
    </div>

    <div class="pageContentRow">
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
      userCourse: 'BCC',
      solicitationsTable: {
        'titles': [ 'Nome', 'Data e hora', 'Descricao', 'Decisao', 'Motivo', 'Visualizar' ],
        'colTypes': [ 'string', 'string', 'string', 'string', 'string', 'iconfunction' ],
        'colWidths': [ '15%', '15%', '35%', '10%', '15%', '10%' ],
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
    await this.loadSolicitationsTable();
  },

  mounted() {},

  methods:{

    async loadSolicitationsTable(){

      let vreturn = await this.$root.doRequest(
        Requests.getSolicitations,
        []);

      if(vreturn && vreturn['ok']){

        let pageContext = this;

        pageContext.solicitationsTable['content'] = [];

        vreturn['response'].forEach(solicitation => {
          this.solicitationsTable['content'].push([
            solicitation['nome_solicitacao'],
            solicitation['data_hora_inicio'].replaceAll('-','/'),
            solicitation['descricao'],
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
        this.$root.renderRequestErrorMsg(vreturn);
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
        await this.loadSolicitationsTable();
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