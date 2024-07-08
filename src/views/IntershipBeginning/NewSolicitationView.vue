<template>

    <div>
      <ButtonCustom
          id="btnReturn"
          ref="btnReturn"
          label="← Voltar"
          customTextColor="white"
          customBackColor="darkblue1"
          customFontSize="normal"
          padding="3px 20px"
          margin="0px 5px"
          @click="this.$root.renderView('home')"
        />
      <div class="pageContentRow">
        <TextCustom
          margin='0px 0px 15px 0px'
          display='block'>
          Nesta seção da-se início à solicitação do processo de estágio, seguindo as regras definidas.
        </TextCustom>
        <HrefCustom v-if="this.studentData && this.studentData['course']=='BCC'"
        id="cchref"
        customColor="lightblue"
        href="https://facom.ufu.br/graduacao/bcc/estagio-supervisionado">
        regras de estágio para o curso Ciências da Computação.
      </HrefCustom>
      <HrefCustom v-if="this.studentData && this.studentData['course']=='BSI'"
        id="sihref"
        customColor="lightblue"
        href="https://facom.ufu.br/legislacoes/normas-de-estagio-curricular-do-bacharelado-em-sistemas-de-informacao">
        regras de estágio para o curso de Sistemas de Informação.
      </HrefCustom>
        
      </div>
      <div class='solicitationBox' v-if="this.userProfiles.includes('STU')">

<div class="solicitationBoxTitle">
  <TextCustom customFontSize='title_bold' display="block">
    Realizar Nova Solicitação
  </TextCustom>
  <TextCustom customFontSize='small' display="block" padding="10px" customColor="black2">
    Realize uma solicitação às partes relacionadas selecionando o tipo e preenchendo os campos listados
  </TextCustom>
</div>

<div class="solicitationBoxItem">
  <div>
    <TextCustom customFontSize='normal' display="block" margin="5px 10px 0px 10px">
      Tipo de solicitação
    </TextCustom>
    <SelectCustom id="solicitationTypeSelect" ref='solicitationTypeSelect' name='solicitationType'
      class="solicitationBoxSelect"
      placeholder="Selecione: "
      :items="this.solicitationTypes"
      @optClicked="(optValue) => {this.selectedSolType=optValue; this.handleOptsClick(true);}"
    />
  </div>
</div>

<div class="solicitationBoxItem" v-if="this.selectedSolType=='Início de estágio obrigatório' || this.selectedSolType=='Início de estágio não obrigatório'">
  
  <div v-if="this.selectedSolType=='Início de estágio obrigatório'">
    <TextCustom customFontSize='normal' display="block" margin="5px 10px 0px 10px">
      Relação de trabalho
    </TextCustom>
    <SelectCustom id="employmentRelationshipSelect" ref='employmentRelationshipSelect' name='employmentRelationship'
      class="solicitationBoxSelect"
      placeholder="Selecione: "
      :items="this.employmentRelationships"
      @optClicked="(optValue) => {this.employmentRelationship=optValue; this.handleOptsClick();}"
    />
  </div>
</div>

<div class="solicitationBoxItem">
  
  <div class='btnWrapper'>
    <div class='btn'>
      <ButtonCustom id="btnSendSol"
        label="Iniciar"
        customTextColor="white"
        customBackColor="darkblue1"
        customFontSize="normal"
        width="150px"
        padding="3px 20px"
        :disabled="this.btnSendSolDisabled"
        @click="createSolicitation"
      />
    </div>
  </div>

</div>
</div>
  
    </div>
  
  </template>
  
  <script>
  
  import ButtonCustom from '../../components/ButtonCustom.vue'
  import TextCustom from '../../components/TextCustom.vue'
  import SelectCustom from '../components/SelectCustom.vue'

  
  export default {
    name: 'NewSolicitationView',

    components: {
        ButtonCustom,
        TextCustom,
        SelectCustom
    },

    data() {
        return {
            selectedSolType: null,
            employmentRelationship: null,
            intershipLocal: null,
            solicitationTypes: [
                {'label': 'Início de estágio obrigatório', 'value': 'Início de estágio obrigatório'},
                {'label': 'Início de estágio não obrigatório', 'value': 'Início de estágio não obrigatório'}
            ],
            employmentRelationships: [
                {'label': 'Com vínculo empregatício', 'value': 'Com vínculo empregatício'},
                {'label': 'Sem vínculo empregatício', 'value': 'Sem vínculo empregatício'}
            ],
            intershipLocals: [
                {'label': 'Externo', 'value': 'Externo'},
                {'label': 'Interno', 'value': 'Interno'}
            ],
            btnSendSolDisabled: true
        }
    },
    mounted () {},

    methods: {
        handleOptsClick(restartValues=false){

if(restartValues){
  this.employmentRelationship = null;
  this.intershipLocal = null;
  if(this.$refs.intershipLocalSelect){
    this.$refs.intershipLocalSelect.setV(null);
  }
  if(this.$refs.employmentRelationshipSelect){
    this.$refs.employmentRelationshipSelect.setV(null);
  }
}

if(this.selectedSolType=='Início de estágio obrigatório' && this.employmentRelationship != null){
  this.btnSendSolDisabled = false;
}
else if(this.selectedSolType=='Início de estágio não obrigatório'){
  this.btnSendSolDisabled = false;
}
else{
  this.btnSendSolDisabled = true;
}
},

async createSolicitation(){

let solicitationId = null;
if(this.selectedSolType=='Início de estágio obrigatório' && this.employmentRelationship != null){
  if(this.employmentRelationship=='Com vínculo empregatício'){
    solicitationId = 1;
  }
  else{
    solicitationId = 2;
  }
}
else if(this.selectedSolType=='Início de estágio não obrigatório'){
  solicitationId = 3;
}
else{
  this.$root.renderMsg('warn', 'Solicitação inválida!', '');
  return;
}

let vreturn = await this.$root.doRequest(
  Requests.putSolicitation,
  [solicitationId]);

if(vreturn && vreturn['ok']){
  this.$root.renderView( 'solicitation', { 'user_has_state_id': vreturn['response']['user_has_state_id'] })
}
else{
  this.$root.renderRequestErrorMsg(vreturn, [
    'Dados da solicitação não encontrados',
    'Você já possui essa solicitação',
    'Erro ao criar a solicitação do usuário',
    'Erro ao criar o estado da solicitação do usuário'
  ]);
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