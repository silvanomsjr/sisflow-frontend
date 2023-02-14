<template>

  <div class="center boxSign"
    :style="{
      'color': this.boxBorderColor
    }">

    <div class="top horCenter"
      :style="{
        'background-color': this.topBackColor
      }">

      <div class="logo">
        <ImgLogoUfu/>
        <TextCustom 
          customColor="darkblue1"
          customFontSize='page_title'>
          Sisges
        </TextCustom>
      </div>

      <div class="divLine">
        <LineCustom width="80%"/>
      </div>

      <div class="signFields">
        <TextCustom 
          customFontSize='page_title'>
          Cadastro
        </TextCustom>
      </div>

      <form class="divForm">

        <div v-if="!this.waitSignCode">
          <div class="divField">
            <TextCustom
              class="alignLeft"
              display="block">
              E-mail institucional
            </TextCustom>
            <InputCustom
              id='mailins'
              ref='mailins'
              name='mailins'
              autocomplete='off'
              width="100%"
              display="inline-block"
            />
          </div>

          <div class="divField">
            <TextCustom
              class="alignLeft"
              display="block">
              E-mail secundário
            </TextCustom>
            <InputCustom
              id='mailsec'
              ref='mailsec'
              name='mailsec'
              autocomplete='off'
              width="100%"
              display="inline-block"
            />
          </div>

          <div class="divField">
            <TextCustom
              class="alignLeft"
              display="block">
              Senha
            </TextCustom>
            <InputCustom
              id='pass'
              ref='pass'
              name='pass'
              type='password'
              autocomplete='off'
              width="100%"
              display="inline-block"
            />
          </div>

          <div class="divField">
            <TextCustom
              class="alignLeft"
              display="block">
              Confirme a senha
            </TextCustom>
            <InputCustom
              id='passconf'
              ref='passconf'
              name='passconf'
              type='password'
              autocomplete='off'
              width="100%"
              display="inline-block"
            />
          </div>
        </div>

        <div v-else>
          <div class="divField">
            <TextCustom
              class="alignLeft"
              display="block">
              Confirme a código enviado a seu email institucional:
            </TextCustom>
            <InputCustom
              id='signcode'
              ref='signcode'
              name='signcode'
              mask='#########'
              autocomplete='off'
              width="100%"
              display="inline-block"
            />
          </div>
        </div>
          
        <div class="btnLogar horCenter">
          <ButtonCustom
            id="btnSign"
            :label="this.waitSignCode ? 'Confirmar' : 'Cadastrar'"
            customTextColor="white"
            customBackColor="darkblue1"
            customFontSize="normal"
            width="60%"
            padding="3px 20px"
            @click="this.waitSignCode ? this.doSign() : this.processParamsAndMakeSignCode()"
          />
        </div>

      </form>

      <div v-if="!this.waitSignCode"
        class="wrapperhrefs">
        <div>
          <TextCustom 
            customColor="darkblue1"
            customFontSize="small_bold"
            display="block">
            Verifique as regras de estágio para o seu curso:
          </TextCustom>
        </div>
        <div class="divhref">
          <HrefCustom
            id="cchref"
            customColor="lightblue"
            customFontSize="small"
            href="https://facom.ufu.br/graduacao/bcc/estagio-supervisionado">
            Ciência da Computação
          </HrefCustom>
        </div>
        <div class="divhref">
          <HrefCustom
            id="sihref"
            customColor="lightblue"
            customFontSize="small"
            href="https://facom.ufu.br/legislacoes/normas-de-estagio-curricular-do-bacharelado-em-sistemas-de-informacao">
            Sistemas de Informação
          </HrefCustom>
        </div>
      </div>

    </div>

    <div class="bottom horCenter"
     :style="{
      'background-color': this.bottomBackColor,
      
     }">
      <TextCustom
        customColor="white"
        customFontSize="small"
        margin="0px 10px 0px 0px">
        {{ this.waitSignCode ? 'Deseja reenviar o código?' : 'Possui conta cadastrada?'}}
      </TextCustom>
      <ButtonCustom 
        id="btnRedirectLogin"
        :label="this.waitSignCode ? 'Reenviar' : 'Login'"
        customFontSize="small"
        width="50%"
        padding="2px 20px"
        @click="this.waitSignCode ? this.makeSignCode() : this.$root.renderView('login')"
      />
    </div>
  </div>

</template>

<script>

import ButtonCustom from '../components/ButtonCustom.vue'
import HrefCustom from '../components/HrefCustom.vue'
import ImgLogoUfu from '../components/ImgLogoUfu.vue'
import InputCustom from '../components/InputCustom.vue'
import LineCustom from '../components/LineCustom.vue'
import Requests from '../js/requests.js'
import TextCustom from '../components/TextCustom.vue'
import Utils from '../js/utils.js'

export default {

  name: 'SignView',

  components: {
    ButtonCustom,
    HrefCustom,
    ImgLogoUfu,
    InputCustom,
    LineCustom,
    TextCustom
  },

  data(){
    return {
      waitSignCode: false,

      topBackColor: 'rgb(255,255,255)',
      bottomBackColor: 'rgb(28, 34, 86)',
      boxBorderColor: 'rgb(28, 34, 86)'
    }
  },

  created(){
    this.topBackColor = Utils.handleColorSelection('white');
    this.bottomBackColor = Utils.handleColorSelection('darkblue1');
    this.boxBorderColor = Utils.handleColorSelection('darkblue1');
  },

  methods: {

    async processParamsAndMakeSignCode(){

      let mailInsV = this.$refs.mailins.getV().trim();
      let mailSecV = this.$refs.mailsec.getV().trim();
      let passV = this.$refs.pass.getV();
      let passConfV = this.$refs.passconf.getV();

      // verify institutional mail
      if(!Utils.validateMail(mailInsV)){
        this.$root.renderMsg('warn', 'Email institucional inválido!', '');
        this.$root.clearLoginData();
        return;
      }
      if(!mailInsV.endsWith('@ufu.br')){
        this.$root.renderMsg('warn', 'O email informado deve ser o institucional!', '');
        this.$root.clearLoginData();
        return;
      }
      // verify secundary mail
      if(mailSecV){
        if(!Utils.validateMail(mailSecV)){
          this.$root.renderMsg('warn', 'Email secundário inválido!', '');
          this.$root.clearLoginData();
          return;
        }
      }
      // verify password
      let passErrMsg = [];

      if(!/^\S*$/.test(passV))
        passErrMsg.push('Nao conter espaços.');
      if(!/^.{8,18}$/.test(passV))
        passErrMsg.push('Conter de 8 a 18 caracteres.');

      if(passErrMsg.length > 0){
        passErrMsg = ['A senha deve seguir a' + (passErrMsg.length > 1 ? 's regras:' : ' regra')].concat(passErrMsg);
        this.$root.renderMsg('warn', 'Senha inválida!', passErrMsg);
        return;
      }

      if(passV != passConfV){
        this.$root.renderMsg('warn', 'Confirmação de senha inválida!', 'Campos senha e confirmar senha devem ser iguais.');
        return;
      }

      // saves sign vars and send request to send sign code to institutional mail
      this.mailInsV = mailInsV;
      this.mailSecV = mailSecV;
      this.passV = passV;

      await this.makeSignCode();
    },

    async makeSignCode(){

      let vreturn = await this.$root.doRequest(Requests.signGetCode, [this.mailInsV]);

      if(vreturn && vreturn['ok']){
        this.waitSignCode = true;
      }
      else{
        this.$root.renderRequestErrorMsg( vreturn, [
          'Email já utilizado!', 
          'Email institucional não encontrado no sistema!']);
      }
    },

    async doSign(){

      let signCode = this.$refs.signcode.getV().trim();
      if(signCode.length != 9){
        this.$root.renderMsg('warn', 'Codigo inválido!', 'O código possui 9 dígitos!');
        return;
      }

      let vreturn = await this.$root.doRequest(
        Requests.doSign, 
        [this.mailInsV, this.mailSecV, this.passV, signCode]);

      if(vreturn && vreturn['ok']){
        let self = this;
        this.$root.renderMsg(
          'ok', 
          'Sucesso!', 
          'Faça login para acessar o sistema.',
          function () { self.$root.renderView('login'); });
      }
      else{
        this.$root.renderRequestErrorMsg( vreturn, [
          'Email já utilizado!',
          'Chave de cadastro inválida para este email!', 
          'Email institucional não encontrado no sistema!']);
      }
    }
  }
}
</script>

<!-- style applies only to this component -->
<style scoped>

.boxSign{
  border: none;
  box-shadow: 0 0 0 3px;
  border-radius: 40px;
  overflow: hidden;
  padding: 0px;
}
@media (max-width: 900px) {
  .center{
    margin: auto;
    text-align:center;
  }
  .boxSign{
    width: 80%;
  }
}
@media (min-width: 900px) {
  .center{
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translateX(-50%) translateY(-50%);
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
  }
  .boxSign{
    width: 40%;
  }
}
.top, .bottom{
  padding: 13px 30px;
  margin: 0px;
}
.logo{
  line-height: 100%;
  text-align: center;
  margin-bottom: 10px;
}
.logo > *{
  vertical-align: middle;
}
.signFields{
  margin-top: 10px;
}
.wrapperhrefs{
  margin-top: 20px;
}
.divhref{
  margin-left: 20px;
}
.horCenter{
  text-align: center;
}
.divLine{
  margin-top: 3px;
}
.divForm{
  margin: 5px;
}
.divField{
  display: inline-block;
  width: 80%;
  margin: 7px;
}
.alignLeft{
  text-align: left;
}
.btnLogar{
  margin: 10px 0px;
}

</style>