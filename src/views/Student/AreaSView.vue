<template>

  <div>
    <div>
      <TextCustom 
        customColor="black1"
        customFontSize='page_title'>
        Dados do aluno
      </TextCustom>
    </div>
    <div class="divLine">
      <LineCustom width="90%"/>
    </div>
    <div style="margin-left: 20px;">
      <p>Matricula : {{this.user['matricula']}}</p>
      <p>Tipo : {{this.user['tipo']}}</p>
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

  name: 'AreaSView',

  components: {
    LineCustom,
    TextCustom
  },

  data(){
    return {
    }
  },

  created(){
    this.$root.pageName = 'Area de teste do aluno';
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