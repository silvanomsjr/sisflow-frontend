<template>
  
  <div class='fileInputWrapper'>

    <div style="text-align: left; margin: 10px 0px">
      <TextCustom>
        {{ this.titleText }}
      </TextCustom>
    </div>
    
    <div class='fileNLWrapper'>
      <div :id="this.id + '_Name'" class='fileInputName'> 
        {{ this.fileIName }} 
      </div>

      <label :id="this.id + '_L'" class='labelInput' :for="this.id"> 
        <font-awesome-icon :icon="this.tmpIconName"/>
        {{ this.tmpButtonText }}
      </label>

      <input class='fileInput'
        :id="this.id"
        :name="this.name"
        :ref="this.id + '_I'"
        type='file'
        @click="resetFileUpload()"
        @change="handleFileUpload($event)"
      >
    </div>

    <progress class='fileIProgress' :ref="this.id + '_P'" value='0' max='100'/>
  
  </div>

</template>

<script>

import Cst from "../js/constants.js"
import TextCustom from "../components/TextCustom.vue"

export default {

  name: 'FileUpload',

  components:{
    TextCustom
  },

  props:{
    id: String,
    name: String,
    uploadEndpoint: String,
    fileDirName: String,
    titleText: String,
    buttonText: {
      default: 'Selecionar',
      type: String
    },
    buttonTextSending: {
      default: 'Enviando...',
      type: String
    },
    accept: {
      default: 'application/pdf',
      type: String
    },
    maxFileSize: {
      default: 10,
      type: Number
    }
  },

  data(){
    return{
      tmpButtonText: '',
      tmpIconName: '',
      fileIName: '...'
    }
  },

  created(){
    this.darkblue1 = Cst.COLOR_DARKBLUE1;
    this.gray1 = Cst.COLOR_GRAY1;
    this.gray2 = Cst.COLOR_GRAY2;
    this.white = Cst.COLOR_WHITE;

    this.tmpButtonText = this.buttonText;
  },

  mounted(){
    this.fileI = document.getElementById(this.id);
    this.fileILabel = document.getElementById(this.id + '_L');
    this.fileINameDiv = document.getElementById(this.id + '_Name');
    this.progressE = this.$refs[this.id + '_P'];
    
    this.fileINameDiv.style.backgroundColor = this.white;
    this.fileILabel.style.backgroundColor = this.darkblue1;
    this.fileILabel.style.color = this.white;
    
    this.setLabelEnabled();
  },

  methods:{
    handleFileUpload(event){
      
      // if event element and its file
      if(!this.fileI.disabled && event.target.files && event.target.files[0]){

        let file = event.target.files[0];
        let fileType = file['type'];
        let fileName = file['name'];
        let fileSize = Math.round(file['size'] / 1024 / 1024 * 10) / 10;
        let fileUserNameF = this.$root.userLoggedData['nome'].replaceAll(' ', '');
        let fileDirName = this.fileDirName;
        let userNameIns = this.$root.userLoggedData['email_ins'];

        if(!this.accept.includes(fileType)){
          this.$emit('onIncorrectFileType');
          event.target.files = null;
          return;
        }

        if(fileSize > this.maxFileSize){
          this.$emit('onIncorrectFileSize');
          event.target.files = null;
          return;
        }
        
        this.fileIName = fileName;
        this.progressE.setAttribute('value', 0);
        this.setLabelDisabled();
        this.uploadFile(file, fileUserNameF, fileDirName, userNameIns);
      }
    },

    uploadFile(file, fileUserName, fileDirName, userMailIns){
      
      let pageContext = this;
      let payload = new FormData();
      payload.append('file', file);
      payload.append('file_user_name', fileUserName)
      payload.append('file_dir_name', fileDirName)
      payload.append('user_mail_ins', userMailIns)

      // create a XMLHttpRequest object to make an request with progress tracking
      let xhr = new XMLHttpRequest();
      xhr.open('POST', this.uploadEndpoint);

      // on upload use an event listener to track progress done
      xhr.upload.addEventListener('progress', function(event){
        pageContext.progressE.setAttribute('value', (event.loaded/event.total) * 100);
      });

      // when request finishes
      xhr.addEventListener('load', function(){
        console.log(xhr.status);
        console.log(xhr.response);
        pageContext.setLabelEnabled();
      });

      xhr.send(payload);
    },

    setLabelEnabled(){
      this.tmpIconName = 'fa-solid fa-cloud-arrow-up';
      this.tmpButtonText = this.buttonText;
      this.fileILabel.style.cursor = 'pointer';
      this.fileI.disabled = false;
    },

    setLabelDisabled(){
      this.tmpIconName = 'fa-solid fa-arrow-rotate-right';
      this.tmpButtonText = this.buttonTextSending;
      this.fileILabel.style.cursor = 'default';
      this.fileI.disabled = true;
    },

    resetFileUpload(){
      this.fileI.value = '';
    }
  }
}

</script>

<!-- style applies only to this component -->
<style scoped>

.fileInputWrapper{
  width: 100%;
  border-radius: 1px;
  border: 2px solid rgb(203,203,203);
  padding: 5px 20px;
  display: inline-block;
  text-align: center;
  background-color: rgb(242, 241, 241);
}
.fileInputWrapper > *{
  vertical-align: middle;
}
.fileInput{
  display: none
}
.fileNLWrapper{
  width: 100%;
  border-radius: 5px;
}
.fileInputName, .labelInput{
  margin-bottom: 5px;
  box-shadow: 1px 1px 4px rgba( 0, 0, 0, 0.3 );
}
@media (min-width: 900px) {
  .fileInputName, .labelInput{
    display: inline-block;
    padding: 5px 10px;
  }
  .fileInputName{
    width: calc(100% - 160px);
    border-radius: 5px 0px 0px 5px;
  }
  .labelInput{
    width: 160px;
    border-radius: 0px 3px 3px 0px;
    border: 1px solid rgb(28,34,86);
  }
}
@media (max-width: 900px) {
  .fileInputName, .labelInput{
    margin: auto;
    display: block;
    padding: 2px 10px;
    border-radius: 5px;
  }
  .fileInputName{
    width: 100%;
    margin-bottom: 5px;
  }
  .labelInput{
    width: 160px;
    border: 1px solid rgb(28,34,86);
  }
}
.fileIProgress{
  display: inline-block;
  text-align: center;
  margin: auto;
  border-radius: 7px; 
  width: 100%;
  height: 15px;
  box-shadow: 1px 1px 4px rgba( 0, 0, 0, 0.3 );
}
.fileIProgress::-webkit-progress-bar {
  background-color: white;
  border-radius: 7px;
}
.fileIProgress::-webkit-progress-value {
  background-color: rgb(28,34,86);
  border-radius: 7px;
}

</style>