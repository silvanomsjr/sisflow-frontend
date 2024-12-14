<template>

  <a href="/home">
  <img v-if="this.color_name == 'blue'"
    class="ufuIconLogo"
    src="../assets/ufu_logo_small.png"
    alt="Logo Ufu"
    :style="{
      'width': this.width,
      'height': this.height
    }"
  >

  <img v-else
    class="ufuIconLogo"
    src="../assets/ufu_logo_white_small.png"
    alt="Logo Ufu"
    :style="{
      'width': this.width,
      'height': this.height
    }"
  >
</a>

</template>

<script>

export default {

  name: 'ImgLogoUfu',

  props: {
    color_name: {
      default: 'blue',
      type: String
    },
    width: {
      default: '35px',
      type: String
    },
    height: {
      default: '35px',
      type: String
    }
  }
}
</script>

<!-- style applies only to this component -->
<style scoped>

.ufuIconLogo{
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

</style>
