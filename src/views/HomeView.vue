<template>

  <div id="dashContent">
    
    Bem vindo ao Sisges o sistema de gestão de estagios supervisionados

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

export default {
  
  name: 'HomeView',

  props: {
  },

  components: {
    FileUpload
  },

  data() {
    return {
      fileUploadEndpoint: ''
    }
  },

  created() {
    this.$root.pageName = 'Home';
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

#dashContent{
  width: 100%;
  height: calc(100% - 8px);
}
.dashText{
  margin: 5px;
}
.wrapperMtLogo, .wrapperMtLogoMobyle{
  display: inline-block;
  width: 100%;
  text-align: center;
}
.wrapperMtLogo > *, .wrapperMtLogoMobyle > *{
  vertical-align: middle;
}
.wrapperMtLogoMobyle{
  margin: 50px 0px;
}
.imgLogo{
  display: inline-block;
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