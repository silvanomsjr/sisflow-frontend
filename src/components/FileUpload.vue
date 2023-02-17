<template>
  
  <div class='fileInputWrapper'>
    <label :id="this.id + '_L'" class='labelInput' :for="this.id"> {{ this.labelValue }} &#187; </label>
    <input class='fileInput'
      :id="this.id"
      :name="this.name"
      :ref="this.id + '_I'"
      type='file'
      @change="handleFileUpload($event)"
    >
    <progress class='fileIProgress' :ref="this.id + '_P'" value='0' max='100'/>
  </div>

</template>

<script>

import Cst from "../js/constants.js"

export default {

  name: 'InputCustom',

  props:{
    id: String,
    name: String,
    uploadEndpoint: String,
    labelValue: String,
    fileDirName: String,
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
    return{}
  },

  created(){
    this.darkblue1 = Cst.COLOR_DARKBLUE1;
    this.white = Cst.COLOR_WHITE;
  },

  mounted(){
    this.fileILabel = document.getElementById(this.id + '_L');
    this.fileILabel.style.backgroundColor = this.darkblue1;
    this.fileILabel.style.color = this.white;
  },

  methods: {
    handleFileUpload(event){

      // if event element and its file
      if(event.target.files && event.target.files[0]){

        let file = event.target.files[0];
        let fileType = file['type'];
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
        
        this.uploadFile(file, fileUserNameF, fileDirName, userNameIns);
      }
    },

    uploadFile(file, fileUserName, fileDirName, userMailIns){
      
      let progressU = this.$refs[this.id + '_P'];
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
        progressU.setAttribute('value', (event.loaded/event.total) * 100);
      });

      // when request finishes 
      xhr.addEventListener('load', function(){
        console.log(xhr.status);
        console.log(xhr.response);
      });

      xhr.send(payload);
    }
  }
}

</script>

<!-- style applies only to this component -->
<style scoped>

.fileInputWrapper{
  width: 100%;
  display: inline-block;
  text-align: center;
}
.fileInputWrapper > *{
  vertical-align: middle;
}
input[type='file'] {
  display: none
}
.labelInput {
  display: inline-block;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
  padding: 6px 20px
}
.fileIProgress{
  display: inline-block;
}

</style>