<template>

  <div>
    
    Bem vindo ao Sisges o sistema de gestão de estagios supervisionados

    <TableCustom class="tableC"
      :tableData="this.solicitationsTable"/>

    <FileUpload id="fileupht" class="fileU"
      titleText="Envie seu histórico textual:"
      fileDirName="HT"
      :maxFileSize="100"
      :uploadEndpoint="this.fileUploadEndpoint"
      @onIncorrectFileType="this.showIncorrectFileType"
      @onIncorrectFileSize="this.showIncorrectFileSize"
    />
  
    <FileUpload id="fileuphv" class="fileU"
      titleText="Envie seu histórico visual:"
      fileDirName="HV"
      :maxFileSize="100"
      :uploadEndpoint="this.fileUploadEndpoint"
      @onIncorrectFileType="this.showIncorrectFileType"
      @onIncorrectFileSize="this.showIncorrectFileSize"
    />

  </div>

</template>

<script>

import FileUpload from '../components/FileUpload.vue'
import TableCustom from '../components/TableCustom.vue'
import Utils from '../js/utils.js'

export default {
  
  name: 'HomeView',

  components: {
    FileUpload,
    TableCustom
  },

  data() {
    return {
      fileUploadEndpoint: '',
      solicitationsTable: {
        'titles': [ 'Solicitacao', 'Data e hora', 'Descricao', 'Decisao', 'Motivo', 'Visualizar' ],
        'colTypes': [ 'string', 'string', 'string', 'string', 'string', 'iconfunction' ],
        'colWidths': [ '15%', '15%', '35%', '10%', '15%', '10%' ],
        'content': []
      }
    }
  },

  created() {
    this.$root.pageName = 'Home';

    this.solicitationsTable['content'] = [];
    this.solicitationsTable['content'].push([
      'Avaliação para inicio de estagio',
      Utils.getDateTimeString(new Date(), '/'),
      'O aluno solicitou ao coordenador de estágios a avaliação da documentação acadêmica para verificar a possibilidade de realizar estágio',
      'Em análise',
      'Aguardando o retorno do coordenador de estágios',
      { 'iconName' : 'fa-solid fa-clock-rotate-left', 'iconSelFunction' : function(){alert('oi')} }
    ]);
  },

  mounted() {
    this.fileUploadEndpoint = process.env.VUE_APP_SERVICE_URL + 'file';
  },

  methods:{
    showIncorrectFileType(){
      this.$root.renderMsg('warn', 'O arquivo deve possuir o formato pdf.', '');
    },
    showIncorrectFileSize(){
      this.$root.renderMsg('warn', 'O tamanho do arquivo não pode ultrapassar 10MB.', '');
    }
  }
}
</script>

<!-- style applies only to this component -->
<style scoped>

.tableC{
  margin-top: 20px;
}
.fileU{
  margin-top: 20px;
  width: 100%;
}

</style>