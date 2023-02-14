<template>
  
  <input v-if="this.mask != null && this.mask.length > 0"
    class="inputcustom"
    :id="this.id"
    :name="this.name"
    :ref="this.id + '_PC'"
    :type="this.type"
    :maxlength="this.maxlength"
    :placeholder="this.placeholder"
    :autocomplete="this.autocomplete"
    :style="{
      'color': this.cTextColor,
      'background-color': this.cBackColor,
      'border': this.border,
      'border-color': this.cBorderColor,
      'font-weight': this.cFontWeight,
      'font-size': this.cFontSize,
      'width': this.width,
      'padding': this.padding,
      'display': this.display
    }"
    v-mask="this.mask"
    @input="$emit('onChangeAction')"
  >

  <input v-else
    class="inputcustom"
    :id="this.id"
    :name="this.name"
    :ref="this.id + '_PC'"
    :type="this.type"
    :maxlength="this.maxlength"
    :placeholder="this.placeholder"
    :autocomplete="this.autocomplete"
    :style="{
      'color': this.cTextColor,
      'background-color': this.cBackColor,
      'border': this.border,
      'border-color': this.cBorderColor,
      'font-weight': this.cFontWeight,
      'font-size': this.cFontSize,
      'width': this.width,
      'padding': this.padding,
      'display': this.display
    }"
    v-on:keypress="addIfIsLetter($event)"
    @input="$emit('onChangeAction')"
  >

</template>

<script>

import Utils from "../js/utils.js"

export default {

  name: 'InputCustom',

  props:{
    id: String,
    name: String,
    maxlength: String,
    mask: [ Array, String ],
    type: {
      default: 'text',
      type: String
    },
    border: {
      default: '1px solid',
      type: String
    },
    customTextColor: {
      default: 'black1',
      type: String
    },
    customBackColor: {
      default: 'gray1',
      type: String
    },
    customBorderColor: {
      default: 'darkblue1',
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
    onlyLetters: {
      default: false,
      type: Boolean
    },
    placeholder: {
      default: '',
      type: String
    },
    autocomplete: {
      default: 'off',
      type: String
    },
    padding: {
      default: '3px 7px',
      type: String
    },
    display: {
      default: 'inline-block',
      type: String
    }
  },

  data(){
    return{
      cTextColor: 'rgb(0,0,0)',
      cBackColor: 'rgb(242,241,241)',
      cBorderColor: 'rgb(28,34,86)',
      cFontSize: 'inherit',
      cFontWeight: 'inherit'
    }
  },

  created(){
    this.cTextColor = Utils.handleColorSelection(this.customTextColor);
    this.cBackColor = Utils.handleColorSelection(this.customBackColor);
    this.cBorderColor = Utils.handleColorSelection(this.customBorderColor);
    
    let tmp = Utils.handleFontType(this.customFontSize);
    this.cFontSize = tmp[0];
    this.cFontWeight = tmp[1];
  },

  methods: {
    addIfIsLetter(e) {
      if(this.onlyLetters){
        let char = String.fromCharCode(e.keyCode);
        if(/^[A-Z a-z]+$/.test(char)) {
          return true;
        }
        else {
          e.preventDefault();
        }
      }
    },
    getV(){
      return this.$refs[this.id + '_PC'].value;
    },
    setV(value){
      this.$refs[this.id + '_PC'].value = value;
    }
  }
}

</script>

<!-- style applies only to this component -->
<style scoped>

.inputcustom{
  border-radius: 5px;
}
.inputcustom:focus{
  outline-width: 0;
}

</style>