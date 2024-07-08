<template>
  
  <div class='fileDownloadWrapper'>

    <div style="text-align: left; margin: 10px 0px">
      <TextCustom>
        {{ this.titleText }}
      </TextCustom>
    </div>
    
    <div class='fileDLWrapper'>
      <div :id="this.id + '_Name'" class='fileDownloadName'>
        {{ this.fileName }} 
      </div>

      <a :id="this.id" class='labelDownload'
        :href="this.downloadEndpoint"
        @mouseover="mouseLabelOver()"
        @mouseout="mouseeLabelOut()">

        <font-awesome-icon icon="fa-solid fa-cloud-arrow-down"/>
        {{ this.buttonText }}
      
      </a>

    </div>
  
  </div>

</template>

<script>

import TextCustom from './TextCustom.vue'
import Utils from '../js/utils.js'

export default {

  name: 'FileDownload',

  components:{
    TextCustom
  },

  props:{
    id: String,
    downloadEndpoint: String,
    titleText: String,
    fileName: String,
    buttonText: {
      default: 'Baixar',
      type: String
    }
  },

  data(){
    return{}
  },

  created(){
    this.darkblue1 = Utils.handleColorSelection('darkblue1');
    this.darkblue1hover = this.darkblue1.replace(')', ',0.8)').replace('rgb', 'rgba');
    this.white = Utils.handleColorSelection('white');
  },

  mounted(){
    this.fileDLabel = document.getElementById(this.id);
    this.fileDLabel.style.backgroundColor = this.darkblue1;
    this.fileDLabel.style.color = this.white;
  },

  methods:{
    mouseLabelOver(){
      if(!this.disabled){
        this.fileDLabel.style.backgroundColor = this.darkblue1hover;
      }
    },
    mouseeLabelOut(){
      if(!this.disabled){
        this.fileDLabel.style.backgroundColor = this.darkblue1;
      }
    }
  }
}

</script>

<!-- style applies only to this component -->
<style scoped>

.fileDownloadWrapper{
  font-size: var(--font-size-normal);
  width: 100%;
  border-radius: 1px;
  border: 2px solid rgb(203,203,203);
  padding: 5px 20px;
  display: inline-block;
  text-align: center;
  background-color: rgb(242, 241, 241);
}
.fileDownloadWrapper > *{
  vertical-align: middle;
}
.fileDLWrapper{
  width: 100%;
  border-radius: 5px;
}
.fileDownloadName, .labelDownload{
  margin-bottom: 5px;
  box-shadow: 1px 1px 4px rgba( 0, 0, 0, 0.3 );
  text-decoration: none;
}
@media (min-width: 900px) {
  .fileDownloadName, .labelDownload{
    display: inline-block;
    padding: 5px 10px;
  }
  .fileDownloadName{
    width: calc(100% - 160px);
    border-radius: 5px 0px 0px 5px;
  }
  .labelDownload{
    width: 160px;
    border-radius: 0px 3px 3px 0px;
    border: 1px solid rgb(28,34,86);
  }
}
@media (max-width: 900px) {
  .fileDownloadName, .labelDownload{
    margin: auto;
    display: block;
    padding: 3px 10px;
    border-radius: 5px;
  }
  .fileDownloadName{
    width: 100%;
    margin-bottom: 5px;
  }
  .labelDownload{
    width: 100%;
    border: 1px solid rgb(28,34,86);
  }
}

</style>