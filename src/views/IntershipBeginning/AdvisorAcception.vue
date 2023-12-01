<template>

  <div>
    <div class="pageContentRow">
      <TextCustom
        margin='0px 0px 15px 0px'
        display='block'>
        O seguinte aluno realizou a solicitação orientação para estágio.
      </TextCustom>
      <TextCustom v-if="this.pageDisabled"
        margin='0px 0px 15px 0px'
        display='block'>
        Esta solicitação já foi respondida.
      </TextCustom>
      <TextCustom v-else
        margin='0px 0px 15px 0px'
        display='block'>
        Aceite o discente para a possibilidade de continuar o processo de início.
      </TextCustom>
    </div>

    <DetailsCard
      id="stuDetails"
      title="Dados do aluno solicitante"
      :showItemsOnStart="true"
      :items="this.studentDetailsCardItems"
    />

    <div class="pageContentRow btnWrapper" v-if="!this.pageDisabled">
      <ButtonCustom
        id="btnConfirm"
        ref="btnConfirm"
        label="Aceitar"
        customTextColor="white"
        customBackColor="darkblue1"
        customFontSize="normal"
        width="200px"
        padding="3px 20px"
        margin="0px 5px"
        @click="doAccept()"
      />
      <ButtonCustom
        id="btnReject"
        ref="btnReject"
        label="Recusar"
        customTextColor="white"
        customBackColor="darkblue1"
        customFontSize="normal"
        width="200px"
        padding="3px 20px"
        margin="0px 5px"
        @click="doReject()"
      />
      <ButtonCustom v-if="!this.pageDisabled"
        id="btnCancel"
        ref="btnCancel"
        label="Voltar"
        customTextColor="white"
        customBackColor="darkblue1"
        customFontSize="normal"
        width="200px"
        padding="3px 20px"
        margin="0px 5px"
        @click="this.$root.renderView('home')"
      />
    </div>

  </div>

</template>

<script>

import ButtonCustom from '../../components/ButtonCustom.vue'
import DetailsCard from '../../components/DetailsCard.vue'
import Requests from '../../js/requests.js'
import TextCustom from '../../components/TextCustom.vue'

export default {

  name: 'AdvisorAcceptionView',

  components: {
    ButtonCustom,
    DetailsCard,
    TextCustom
  },

  data() {
    return {
      studentDetailsCardItems: [],
      pageDisabled: false
    }
  },

  async created() {

    let pageContext = this;

    // verify query params
    if(!this.$route.query || !this.$route.query['user_has_state_id']){
      this.$root.renderMsg('error', 'Pagina de solicitação inválida!','', function () { pageContext.$root.renderView('home'); });
      return;
    }
    let userHasStateId = this.$route.query['user_has_state_id'];

    // request for solicitation data
    let vreturn = await this.$root.doRequest(Requests.getSolicitation, [userHasStateId]);
    if(!vreturn || !vreturn['ok']){
      this.$root.renderRequestErrorMsg(vreturn, ['Usuario não possui o estado da solicitação!', 'Acesso a solicitação não permitido!']);
      this.$root.renderView('home');
      return;
    }
    this.solicitationData = vreturn['response']['solicitation'];
    this.studentData = vreturn['response']['student'];
    this.advisorData = vreturn['response']['advisor'];
    this.transitions = vreturn['response']['solicitation']['transitions'];
    
    this.studentDetailsCardItems = [
      { "label": "Nome", "value": this.studentData["user_name"] },
      { "label": "Email institucional", "value": this.studentData["institutional_email"] },
      { "label": "Curso", "value": this.studentData["course"] },
      { "label": "Matricula", "value": this.studentData["matricula"] },
      { "label": "Telefone", "value": this.studentData["phone"] }
    ];

    this.pageDisabled = false;
    if(this.solicitationData['decision'] != 'Em analise'){
      this.pageDisabled = true;
    }
    else if(this.solicitationData['state_profile_editor_acronyms']){
      let tmpBool = true;
      let acronyms = this.solicitationData['state_profile_editor_acronyms'].split(',');
      acronyms.forEach(acronym => {
        if(this.$root.userLoggedData['profile_acronyms'].includes(acronym)){
          tmpBool = false;
        }
      });
      this.pageDisabled = tmpBool;
    }

    this.$root.pageName = 'Aceite de aluno pelo orientador';
  },

  methods:{

    // accept solicitation by advisor
    async doAccept(){
      let vreturn = await this.$root.doRequest( 
        Requests.patchSolicitationAdvisor,
        [ this.solicitationData['user_has_solicitation_id'], this.advisorData['siape'] ]);

      if(!vreturn || !vreturn['ok']){
        this.$root.renderRequestErrorMsg(vreturn, []);
        return;
      }
      await this.doSolicitation(this.transitions.find(ts => ts['transition_decision'] == 'Deferido')['id']);
    },
    // reject solicitation by advisor
    async doReject(){
      await this.doSolicitation(this.transitions.find(ts => ts['transition_decision'] == 'Indeferido')['id']);
    },
    // do Solicitation
    async doSolicitation(transitionId){
      let vreturn = await this.$root.doRequest(
        Requests.postSolicitation,
        [
          this.solicitationData['user_has_state_id'],
          transitionId,
          null
        ]);

      if(!vreturn || !vreturn['ok']){
        this.$root.renderRequestErrorMsg(vreturn, [
          'Usuario não possui o estado da solicitação!',
          'Edição a solicitação não permitida!',
          'Perfil editor a solicitação inválido!',
          'Edição do estado da solicitação não permitido!',
          'Esta etapa da solicitação não foi iniciada!',
          'Esta etapa da solicitação foi expirada!',
          'Esta solicitação já foi realizada!',
          'Input da solicitação está faltando!',
          'Anexo da solicitação está faltando!',
          'Transição não encontrada para este estado!']);
        return;
      }
      else{
        let pageContext = this;
        this.$root.renderMsg(
          'ok',
          'Solicitação realizada!',
          'O aluno agora pode iniciar o processo de assinaturas.',
          function () { pageContext.$root.renderView('home'); }
        );
      }
    }
  }
}
</script>

<!-- style applies only to this component -->
<style scoped>

.pageContentRow{
  margin-top: 15px;
  margin-bottom: 15px;
}
.textC, .tableC{
  margin-top: 5px;
}
.center{
  text-align: center;
  margin: auto;
  margin-top: 5px;
}
.btnWrapper{
  display: block;
  width: 100%;
}
.btn, .btnWrapper{
  border: none;
  outline: none;
}
.radioSolicitation{
  margin: 20px 0px;
}
@media (min-width: 900px) {
  .btnWrapper{
    text-align: right;
  }
  .btn{
    display: inline-block;
    width: 40%;
  }
}
@media (max-width: 900px) {
  .btnWrapper{
    text-align: center;
  }
  .btn{
    width: 100%;
    margin-top: 10px;
  }
}

</style>