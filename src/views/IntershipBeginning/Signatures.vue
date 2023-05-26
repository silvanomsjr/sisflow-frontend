<template>

  <div>
    <div class="pageContentRow">
      <TextCustom
        margin='0px 0px 15px 0px'
        display='block'>
        {{
          "O aluno nomedoaluno solicitou a sua orientação para o estágio na modalidade modalidadeestagio." + !this.pageDisabled ? "" :
          "Você já respondeu a esta solicitação."
        }}
      </TextCustom>
    </div>

    <div class="pageContentRow">
      <TextCustom
        customFontSize='title'
        margin='20px 0px 5px 0px'
        display='block'>
        Dados do aluno
      </TextCustom>
    </div>

    <div class="pageContentRow">
      <ButtonCustom
        id="btnConfirm"
        ref="btnConfirm"
        label="Confirmar"
        customTextColor="white"
        customBackColor="darkblue1"
        customFontSize="normal"
        width="100%"
        padding="3px 20px"
        @click="doAccept()"
      />
    </div>

    <div class="pageContentRow">
      <ButtonCustom
        id="btnReject"
        ref="btnReject"
        label="Rejeitar"
        customTextColor="white"
        customBackColor="darkblue1"
        customFontSize="normal"
        width="100%"
        padding="3px 20px"
        @click="doReject()"
      />
    </div>

    <div class="pageContentRow">
      <ButtonCustom
        id="btnCancel"
        ref="btnCancel"
        label="Cancelar"
        customTextColor="white"
        customBackColor="darkblue1"
        customFontSize="normal"
        width="100%"
        padding="3px 20px"
        @click="doCancel()"
      />
    </div>
  </div>

</template>

<script>

import ButtonCustom from '../../components/ButtonCustom.vue'
import Requests from '../../js/requests.js'
import TextCustom from '../../components/TextCustom.vue'

export default {

  name: 'AdvisorAcceptionView',

  components: {
    ButtonCustom,
    TextCustom
  },

  data() {
    return {
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
    this.advisorData = vreturn['response']['advisor'];
    this.transitions = vreturn['response']['solicitation']['transitions'];
    
    console.log(this.transitions);
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
    // cancel solicitation by advisor
    async doCancel(){
      await this.doSolicitation(this.transitions.find(ts => ts['transition_decision'] == 'Cancelado pelo orientador')['id']);
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
  margin-bottom: 20px;
}
.textC, .tableC{
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
    text-align: left;
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