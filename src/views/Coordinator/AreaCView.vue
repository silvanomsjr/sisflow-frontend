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
      <p>Siape : {{this.profileCoordinator['siape']}}</p>
      <p>Perfis : {{this.user['profile_acronyms']}}</p>
      <p>Nome : {{this.user['user_name']}}</p>
      <p>Telefone : {{this.user['phone']}}</p>
      <p>Email institucional : {{this.user['institutional_email']}}</p>
      <p>Email secundário : {{this.user['secondary_email']}}</p>
    </div>

    <div class="divLine">
      <LineCustom width="90%"/>
    </div>

    <div style="margin-left: 20px;">
      <p>Usuários permitidos: {{ this.$route.meta.allowedUsers }}</p>
    </div>

    <div class="divLine">
      <LineCustom width="90%"/>
    </div>

    <div style="margin-left: 20px;" v-if="this.nationalHolidays['response']">
    
      <p>Feriados nacionais da API</p>
    
      <div style="margin-left: 20px;" v-for="(holiday, indexT) in this.nationalHolidays['response']" :key="indexT">
        <div style="display: inline-block; margin: 10px 0px;">
          {{ holiday['name'] }} : {{ holiday['date'] }}
        </div>
      </div>
    
    </div>
  </div>

</template>

<script>

import ExternalRequests from '../../js/externalRequests.js'
import LineCustom from '../../components/LineCustom.vue'
import TextCustom from '../../components/TextCustom.vue'
import Utils from '../../js/utils.js'

export default {

  name: 'AreaPView',

  components: {
    LineCustom,
    TextCustom
  },

  data(){
    return {
      createdDone: false,
      nationalHolidays: null
    }
  },

  async created(){
    this.$root.pageName = 'Area de teste do professor';
    this.user = this.$root.userLoggedData;
    this.profileCoordinator = Utils.getUserProfile(this.$root.userLoggedData, 'COO');

    this.nationalHolidays = await ExternalRequests.getNationalHolidays(2023);

    this.createdDone = true;
  },
}
</script>

<!-- style applies only to this component -->
<style scoped>

.divLine{
  margin: 20px 0px;
}

</style>