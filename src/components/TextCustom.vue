<template>

  <h3
    class="textcustom"
    :style="{ 
      'color': this.cColor,
      'font-weight': this.cFontWeight,
      'font-size': this.cFontSize,
      'text-decoration': this.textDecoration,
      'margin': this.margin,
      'display': this.display
    }">

    <slot></slot>

  </h3>

</template>

<script>

import Utils from "../js/utils.js"

export default {

  name: 'TextCustom',

  props: {
    customColor: {
      default: 'black1',
      type: String
    },
    customFontSize: {
      default: 'normal',
      type: String
    },
    textDecoration: {
      default: 'none',
      type: String
    },
    margin: {
      default: '0px',
      type: String
    },
    display: {
      default: 'inline',
      type: String
    }
  },

  data(){
    return{
      cColor: 'rgb(0,0,0)',
      cFontSize: 'inherit',
      cFontWeight: 'inherit'
    }
  },

  created(){
    // color dinamic selection
    this.cColor = Utils.handleColorSelection(this.customColor);

    // font dinamic selection
    let tmp = Utils.handleFontType(this.customFontSize);
    this.cFontSize = tmp[0];
    this.cFontWeight = tmp[1];
  }
}
</script>

<!-- style applies only to this component -->
<style scoped>

.textcustom{
  margin: auto;
  padding: 0px;
  overflow-wrap: break-word;
}

</style>