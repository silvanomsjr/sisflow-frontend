<template>

  <div id="dashContent">
    
    Bem vindo ao Sisges o sistema de gestão de estagios supervisionados

  </div>

</template>

<script>

export default {
  
  name: 'HomeView',

  props: {
  },

  components: {
  },

  data() {
    return {
    }
  },

  created() {
    this.$root.pageName = 'Home';
  },

  mounted() {
  },

  methods:{
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

</style>