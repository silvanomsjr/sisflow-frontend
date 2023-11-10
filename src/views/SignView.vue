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
          SisFlow
        </TextCustom>
      </div>

      <div class="divLine">
        <LineCustom width="80%"/>
      </div>

      <div class="signFields">
        <TextCustom 
          customFontSize='page_title'
          display="block">
          Cadastro
        </TextCustom>
      </div>

      <form class="divForm">

        <div v-if="this.signStep == 1">
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
        </div>

        <div v-if="this.signStep == 2">
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
              maxlength='10'
              autocomplete='off'
              width="100%"
              display="inline-block"
            />
          </div>
        </div>

        <div v-if="this.signStep == 3">
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
              Telefone
            </TextCustom>
            <InputCustom
              id='phonenum'
              ref='phonenum'
              name='phonenum'
              :mask="['(##) ####-####', '(##) #####-####']"
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
          
        <div v-if="this.signStep < 3"
          class="btnLogar horCenter">

          <ButtonCustom
            id="btnSign"
            :label="this.signStep == 1 ?
              'Enviar Código' : 
              'Confirmar'"
            customTextColor="white"
            customBackColor="darkblue1"
            customFontSize="normal"
            width="50%"
            padding="3px 20px"
            @click="this.signStep == 1 ?
              this.verifyInsMakeSignCode() : 
              this.verifySignCode()"
          />
        </div>
      </form>
    </div>

    <div class="bottom horCenter"
     :style="{
      'background-color': this.bottomBackColor,
     }">
      <TextCustom v-if="this.signStep < 3"
        customColor="white"
        customFontSize="small"
        margin="0px 10px 0px 0px">
        {{ this.signStep == 1 ? 'Possui conta cadastrada?' : 'Deseja reenviar o código?' }}
      </TextCustom>
      <ButtonCustom
        id="btnRedirectLogin"
        :label="this.signStep == 1 ? 
          'Login' : this.signStep == 2 ? 
          'Reenviar' : 
          'Cadastrar'"
        customFontSize="small"
        width="40%"
        padding="2px 20px"
        @click="this.signStep == 1 ? 
          this.$root.renderView('login') : this.signStep == 2 ?
          this.makeSignCode() : 
          this.doSign()"
      />
    </div>
  </div>

</template>

<script>

import ButtonCustom from '../components/ButtonCustom.vue'
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
    ImgLogoUfu,
    InputCustom,
    LineCustom,
    TextCustom
  },

  data(){
    return {
      signStep: 1,

      topBackColor: 'rgb(255,255,255)',
      bottomBackColor: 'rgb(28, 34, 86)',
      boxBorderColor: 'rgb(28, 34, 86)'
    }
  },

  async created(){
    this.topBackColor = Utils.handleColorSelection('white');
    this.bottomBackColor = Utils.handleColorSelection('darkblue1');
    this.boxBorderColor = Utils.handleColorSelection('darkblue1');

    // if token given by url
    if(this.$route.query && this.$route.query['acess_token']){
      let token = this.$route.query['acess_token'];

      let vreturn = await this.$root.doRequest(
        Requests.signVerifyCodeToken,
        [token]);

      if(vreturn && vreturn['ok']){
        this.mailInsV = vreturn['response']['institutional_email'];
        this.signCode = vreturn['response']['validation_code'];
        this.signStep = 3;
      }
      else{
        this.$root.renderMsg('warn', 'Código inválido!', 'Os códigos expiram após 8 horas, reenvie um novo caso necessário.');
      }
    }

  },

  methods: {

    async verifyInsMakeSignCode(){
      
      this.$root.clearLoginData();

      let mailInsV = this.$refs.mailins.getV().trim();

      // verify institutional mail
      if(!Utils.validateMail(mailInsV)){
        this.$root.renderMsg('warn', 'Email institucional inválido!', '');
        return;
      }
      if(!mailInsV.endsWith('@ufu.br')){
        this.$root.renderMsg('warn', 'O email informado deve ser o institucional!', '');
        return;
      }

      this.mailInsV = mailInsV;
      await this.makeSignCode();
    },

    // request 1 - send institutional mail to generate sign code
    async makeSignCode(){

      let vreturn = await this.$root.doRequest(
        Requests.signMakeCode,
        [this.mailInsV]);

      if(vreturn && vreturn['ok']){
        this.signStep = 2;
      }
      else{
        this.$root.renderRequestErrorMsg( vreturn, [
          'Email já utilizado!', 
          'Email institucional não encontrado no sistema!']);
      }
    },

    // request 2 - verifyes sign auth code
    async verifySignCode(){

      let signCode = this.$refs.signcode.getV().trim();

      // verify sgnCode format
      if(signCode.length != 10){
        this.$root.renderMsg('warn', 'Codigo inválido!', 'O código deve possuir 10 dígitos!');
        return;
      }

      let vreturn = await this.$root.doRequest(
        Requests.signVerifyCodeData,
        [this.mailInsV, signCode]);

      if(vreturn && vreturn['ok']){
        this.signCode = signCode;
        this.signStep = 3;
      }
      else{
        this.$root.renderMsg('warn', 'Código inválido!', 'Os códigos expiram após 8 horas, reenvie um novo caso necessário.');
      }
    },

    // request 3 - do user registration
    async doSign(){
      
      let mailSecV = this.$refs.mailsec.getV().trim();
      let phonenumV = this.$refs.phonenum.getV().replaceAll(/\(|\)|-|\s/g, '');
      let passV = this.$refs.pass.getV();
      let passConfV = this.$refs.passconf.getV();

      // verify secundary mail
      if(mailSecV){
        if(!Utils.validateMail(mailSecV)){
          this.$root.renderMsg('warn', 'Email secundário inválido!', 'O campo é opcional e está invalido.');
          return;
        }
      }
      else{
        mailSecV = '';
      }

      // verify phone num
      if(phonenumV){
        if(phonenumV.length > 0 && phonenumV.length < 10){
          this.$root.renderMsg('warn', 'Telefone inválido!', 'O campo é opcional e está preenchido parcialmente.');
          return;
        }
      }
      else{
        phonenumV = '';
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

      let vreturn = await this.$root.doRequest(
        Requests.signDoWithCode,
        [this.mailInsV, mailSecV, phonenumV, passV, this.signCode]);

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
    width: 50%;
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