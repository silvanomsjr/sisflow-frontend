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

    <div class="pageContentRow">
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
        Realizar solicitações
      </TextCustom>

      <SelectCustom 
        ref='selectc'
        id="selectId"
        class="selectC"
        name="selectName"
        :items="this.selectSolicitationsOpts"
      />

      <div class='btnWrapper'>
        <ButtonCustom
          id="btnSend"
          label="Solicitar"
          customTextColor="white"
          customBackColor="darkblue1"
          customFontSize="normal"
          width="90%"
          padding="3px 20px"
          @click="doSolicitation"
        />
      </div>
    </div>

  </div>

</template>

<script>

import ButtonCustom from '../components/ButtonCustom.vue'
import Requests from '../js/requests.js'
import SelectCustom from '../components/SelectCustom.vue'
import TableCustom from '../components/TableCustom.vue'
import TextCustom from '../components/TextCustom.vue'
//import Utils from '../js/utils.js'

export default {
  
  name: 'HomeView',

  components: {
    ButtonCustom,
    SelectCustom,
    TableCustom,
    TextCustom
  },

  data() {
    return {
      userCourse: 'BCC',
      selectSolicitationsOpts: [
        { label: 'Inicio de estágio obrigatório', value: '1' },
        { label: 'Envio de relatório parcial', value: '2' },
        { label: 'Envio de relatório final', value: '3' }
      ],
      solicitationsTable: {
        'titles': [ 'Nome', 'Data e hora', 'Descricao', 'Decisao', 'Motivo', 'Visualizar' ],
        'colTypes': [ 'string', 'string', 'string', 'string', 'string', 'iconfunction' ],
        'colWidths': [ '15%', '15%', '35%', '10%', '15%', '10%' ],
        'content': []
      }
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
                    'solicitation_step': solicitation['id_etapa_solicitacao'] })
              }
            }
          ]);
        });
      }
      else{
        this.$root.renderRequestErrorMsg(vreturn);
      }
    },

    async doSolicitation(){

      let solicitationId = this.$refs.selectc.getV();

      let vreturn = await this.$root.doRequest(
        Requests.putSolicitation,
        [solicitationId]);

      if(vreturn && vreturn['ok']){
        await this.loadSolicitationsTable();
        this.$root.renderView('solicitation', { 'solicitation': solicitationId, 'solicitation_step': 1 })
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
@media (min-width: 900px) {
  .selectC, .btnWrapper{
    display: inline-block;
    width: 50%;
  }
}
@media (max-width: 900px) {
  .selectC, .btnWrapper{
    text-align: center;
    width: 100%;
    margin-top: 10px;
  }
}


</style>