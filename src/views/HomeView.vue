<template>

  <div>
    
    Bem vindo ao Sisges o sistema de gestão de estagios supervisionados

    <TableCustom class="tableC"
      :tableData="this.solicitationsTable"/>

    <div class="fileUTitle">
      Envie seu histórico textual
      <div class="fileUWrapper">
        <FileUpload id="fileupht" class="fileU"
          labelValue='Selecionar'
          fileDirName="HT"
          :uploadEndpoint="this.fileUploadEndpoint"
          @onIncorrectFileType="this.showIncorrectFileType"
          @onIncorrectFileSize="this.showIncorrectFileSize"
        />
      </div>
    </div>
    
    <div class="fileUTitle">
      Envie seu histórico visual
      <div class="fileUWrapper">
        <FileUpload id="fileuphv" class="fileU"
          labelValue='Selecionar'
          fileDirName="HV"
          :uploadEndpoint="this.fileUploadEndpoint"
          @onIncorrectFileType="this.showIncorrectFileType"
          @onIncorrectFileSize="this.showIncorrectFileSize"
        />
      </div>
    </div>

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
.fileUWrapper{
  border: 2px solid rgb(28,34,86);
  border-radius: 15px;
}
.fileUTitle{
  margin: 30px 0px;
}
.fileUWrapper, .fileUTitle{
  text-align: center;
}
@media (min-width: 900px) {
  .fileU{
    display: inline-block;
    width: 30%;
  }
}
@media (max-width: 900px) {
  .fileU{
    display: inline-block;
    width: 90%;
  }
}


</style>