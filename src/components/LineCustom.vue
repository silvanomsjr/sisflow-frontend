<template>

  <hr 
    class="linecustom"
    :style="{ 
      'border-top-color': this.cColor,
      'width': this.width
    }"
  >

</template>

<script>

import Utils from "../js/utils.js"

export default {

  name: 'LineCustom',

  props: {
    customColor: {
      default: 'black1',
      type: String
    },
    width: {
      default: '100%',
      type: String
    }
  },

  data(){
    return{
      cColor: 'rgb(0,0,0)'
    }
  },

  created(){
    // color dinamic selection
    this.cColor = Utils.handleColorSelection(this.customColor);
  }

}
</script>

<!-- style applies only to this component -->
<style scoped>

.linecustom{
  border: none;
  border-top: 3px solid;
  margin: auto;
  padding: 0px;
  line-height: normal;
}

</style>