<template>

  <div>
    
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

    <TextCustom
      customFontSize='title'
      margin='20px 0px 5px 0px'
      display='block'>
      Suas solicitações
    </TextCustom>

    <TableCustom class="tableC"
      :tableData="this.solicitationsTable"/>

  </div>

</template>

<script>

import TableCustom from '../components/TableCustom.vue'
import TextCustom from '../components/TextCustom.vue'
import Utils from '../js/utils.js'

export default {
  
  name: 'HomeView',

  components: {
    TableCustom,
    TextCustom
  },

  data() {
    return {
      userCourse: 'BCC',
      solicitationsTable: {
        'titles': [ 'Tipo', 'Data e hora', 'Descricao', 'Decisao', 'Motivo', 'Visualizar' ],
        'colTypes': [ 'string', 'string', 'string', 'string', 'string', 'iconfunction' ],
        'colWidths': [ '15%', '15%', '35%', '10%', '15%', '10%' ],
        'content': []
      },
      dynamicPageData: {
        'titulo': 'Solicitação de avaliação para inicio de estágio',
        'perfis_permitidos': ['A'],
        'descricao_top': '<p>Nesta etapa o aluno solicita uma avaliação de sua documentação ' + 
          'acadêmica ao coordenador de estágios para que este verifique se o aluno atende ' + 
          'às normas gerais de estágio.</p>' + 
          '<p>As normas podem ser visualizadas no link: ' + 
          '<a href="https://facom.ufu.br/graduacao/bcc/estagio-supervisionado">Normas de Estagio BCC</a>.</p>' + 
          '<p>Para prosseguir anexe os documentos solicitados:</p>',
        'descricao_mid': '',
        'descricao_bot': '',
        'anexos': [
          { 
            'label_txt' : 'Envie seu histórico textual',
            'file_abs_type' : 'HT'
          },
          { 
            'label_txt' : 'Envie seu histórico visual',
            'file_abs_type' : 'HV'
          }
        ],
        'enviar_req': true
      }
    }
  },

  created() {
    this.$root.pageName = 'Home';

    let pageContext = this;
    this.solicitationsTable['content'] = [];
    this.solicitationsTable['content'].push([
      'Avaliação para inicio de estagio',
      Utils.getDateTimeString(new Date(), '/'),
      'O aluno solicitou ao coordenador de estágios a avaliação da documentação acadêmica para verificar a possibilidade de realizar estágio',
      'Em análise',
      'Aguardando o retorno do coordenador de estágios',
      {
        'iconName' : 'fa-solid fa-clock-rotate-left', 
        'iconSelFunction' : function(){
          pageContext.$root.renderView('solicitation', { page_data: JSON.stringify(pageContext.dynamicPageData) });
        }
      }
    ]);
  },

  mounted() {},

  methods:{}
}
</script>

<!-- style applies only to this component -->
<style scoped>

.textC, .tableC{
  margin-top: 5px;
}

</style>