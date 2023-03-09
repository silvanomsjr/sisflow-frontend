<template>

  <button
    :id="this.id"
    class="buttoncustom"
    type="button"
    @mouseover="mouseover"
    @mouseout="mouseout"
    @click="click"
    :disabled="this.disabled"
    :style="{
      'color': this.cTextColor,
      'background-color': this.disabled ? this.cBackDisabledColor : this.cBackColor,
      'font-size': this.cFontSize,
      'font-weight': 500,
      'width': this.width,
      'padding': this.padding,
      'margin': this.margin,
      'cursor': this.disabled ? 'auto' : 'pointer'
    }"
  >

    {{ label }}
  
  </button>

</template>

<script>

import Utils from "../js/utils.js"

export default {

  name: 'ButtonCustom',

  props: {
    id: String,
    label: String,
    customTextColor: {
      default: 'black1',
      type: String
    },
    customBackColor: {
      default: 'white',
      type: String
    },
    customDisabledBackColor: {
      default: 'gray2',
      type: String
    },
    customFontSize: {
      default: 'normal',
      type: String
    },
    width: {
      default: 'auto',
      type: String
    },
    padding: {
      default: '0px 0px 0px 0px',
      type: String
    },
    margin: {
      default: '0px 0px 0px 0px',
      type: String
    },
    disabled: {
      default: false,
      type: Boolean
    }
  },

  data(){
    return{
      cTextColor: 'rgb(0,0,0)',
      cBackColor: 'rgb(255,255,255)',
      cBackHoverColor: 'rgb(255,255,255)',
      cFontSize: 'inherit'
    }
  },

  created(){
    this.cTextColor = Utils.handleColorSelection(this.customTextColor);
    this.cBackColor = Utils.handleColorSelection(this.customBackColor);
    this.cBackHoverColor = Utils.handleColorSelection(this.customBackColor);
    this.cBackDisabledColor = Utils.handleColorSelection(this.customDisabledBackColor);
    this.cFontSize = Utils.handleFontType(this.customFontSize)[0];

    // set background hover color transparent
    if(this.cBackHoverColor.indexOf('a') == -1){
      this.cBackHoverColor = this.cBackHoverColor.replace(')', ',0.8)').replace('rgb', 'rgba');
    }

  },

  mounted(){
    this.buttonc = document.getElementById(this.id);
  },

  methods: {
    click(){
      this.buttonc.style.fontWeight = 600;
    },
    mouseover(){
      if(!this.disabled){
        this.buttonc.style.backgroundColor = this.cBackHoverColor;
      }
    },
    mouseout(){
      if(!this.disabled){
        this.buttonc.style.backgroundColor = this.cBackColor;
      }
    }

  }

}
</script>

<!-- style applies only to this component -->
<style scoped>

.buttoncustom{
  border: 1px solid;
  border-radius: 25px;
  border: 2px solid rgba(255,255,255,0);
}

</style>