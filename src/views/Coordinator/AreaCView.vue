<template>

  <div>
    <div>
      <TextCustom 
        customColor="black1"
        customFontSize='page_title'>
        Dados do coordenador
      </TextCustom>
    </div>
    <div class="divLine">
      <LineCustom width="90%"/>
    </div>
    <div style="margin-left: 20px;">
      <p>Siape : {{this.user['perfil_coordenador']['siape']}}</p>
      <p>Perfis : {{this.user['perfis']}}</p>
      <p>Nome : {{this.user['nome']}}</p>
      <p>Telefone : {{this.user['telefone']}}</p>
      <p>Email institucional : {{this.user['email_ins']}}</p>
      <p>Email secundário : {{this.user['email_sec']}}</p>
    </div>

    <div class="divLine">
      <LineCustom width="90%"/>
    </div>

    <div style="margin-left: 20px;">
      <p>Usuários permitidos: {{ $route.meta.allowedUsers }}</p>
    </div>
  </div>

</template>

<script>

import LineCustom from '../../components/LineCustom.vue'
import TextCustom from '../../components/TextCustom.vue'

export default {

  name: 'AreaPView',

  components: {
    LineCustom,
    TextCustom
  },

  data(){
    return {
    }
  },

  created(){
    this.$root.pageName = 'Area de teste do professor';
    this.user = this.$root.userLoggedData;
  },
}
</script>

<!-- style applies only to this component -->
<style scoped>

.divLine{
  margin: 20px 0px;
}

</style>