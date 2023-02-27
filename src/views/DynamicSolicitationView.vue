<template>

  <div v-if="this.createdDone">
    Dynamic Page
  </div>

</template>

<script>

export default {
  
  name: 'DynamicSolicitationView',

  components: {
  },

  data() {
    return {
      createdDone: false
    }
  },

  created() {

    let pageContext = this;

    // verify query params
    if(!this.$route.query || !this.$route.query['page_data']){
      this.$root.renderMsg(
        'error', 
        'Pagina de solicitação inválida!',
        '',
        function () { pageContext.$root.renderView('home'); });
      return;
    }

    this.pageData = JSON.parse(this.$route.query['page_data']);
    
    // if data is not correct
    if(!this.isCorrectRequiredPageDataFields()){
      this.$root.renderMsg(
        'error', 
        'Pagina de solicitação inválida!', 
        'Verifique com o coordenador se o erro persistir!',
        function () { pageContext.$root.renderView('home'); });
      return;
    }

    // if user not allowed
    if(!this.$root.isUserAllowedForPage(this.$root.userLoggedData, this.pageData['perfis_permitidos'])){
      this.$root.renderUserNotAllowedMsg();
      return;
    }

    this.$root.pageName = this.pageData['titulo'];

    this.createdDone = true;
  },

  mounted() {
  },

  methods:{
    isCorrectRequiredPageDataFields(){
      return this.pageData && this.pageData['titulo'] && this.pageData['perfis_permitidos'];
    }
  }
}
</script>

<!-- style applies only to this component -->
<style scoped>
</style>