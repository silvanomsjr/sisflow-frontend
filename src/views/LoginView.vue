<template>

  <div class="center boxLogin"
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
          customFontSize='page_title'>
          Login
        </TextCustom>
      </div>

      <form class="divForm">
        <div class="divField">
          <TextCustom
            class="alignLeft"
            display="block">
            E-mail institucional
          </TextCustom>
          <InputCustom
            id='mail'
            ref='mail'
            name='mail'
            autocomplete='on'
            width="100%"
            display="inline-block"
            @keyup.enter="doLogin"
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
            autocomplete='on'
            width="100%"
            display="inline-block"
            @keyup.enter="doLogin"
          />
        </div>
          
        <div class="btnLogar horCenter">
          <ButtonCustom
            id="btnLogin"
            label="Logar"
            customTextColor="white"
            customBackColor="darkblue1"
            customFontSize="normal"
            width="60%"
            padding="3px 20px"
            @click="doLogin"
          />
        </div>

      </form>

    </div>

    <div class="bottom horCenter"
     :style="{
      'background-color': this.bottomBackColor,
      
     }">
      <TextCustom 
        customColor="white"
        customFontSize="small"
        margin="0px 10px 0px 0px">
        Ainda não possui conta?
      </TextCustom>
      <ButtonCustom 
        id="btnRedirectSign"
        label="Cadastrar"
        customFontSize="small"
        width="50%"
        padding="2px 20px"
        @click="this.$root.renderView('sign')"
      />
    </div>
  </div>

</template>

<script>

import ButtonCustom from '../components/ButtonCustom.vue'
import ImgLogoUfu from '../components/ImgLogoUfu.vue'
import InputCustom from '../components/InputCustom.vue'
import LineCustom from '../components/LineCustom.vue'
import TextCustom from '../components/TextCustom.vue'
import Utils from '../js/utils.js'

export default {

  name: 'LoginView',

  components: {
    ButtonCustom,
    ImgLogoUfu,
    InputCustom,
    LineCustom,
    TextCustom
  },

  data(){
    return {
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
    async doLogin(){

      let mailV = this.$refs.mail.getV().trim();
      let passV = this.$refs.pass.getV();

      // verify institutional mail
      if(!mailV.match(/\S+@\S+\.\S+/)){
        this.$root.renderMsg('warn', 'Email inválido!', '');
        this.$root.clearLoginData();
        return;
      }
      if(!mailV.endsWith('@ufu.br')){
        this.$root.renderMsg('warn', 'O email informado deve ser o institucional!', '');
        this.$root.clearLoginData();
        return;
      }
      
      // verify password
      if(!/^\S*$/.test(passV)){
        this.$root.renderMsg('warn', 'Senha inválida!', 'A senha não contém espaços.');
        return;
      }
      if(!/^.{8,18}$/.test(passV)){
        this.$root.renderMsg('warn', 'Senha inválida!', 'A senha não contém de 8 a 18 caracteres.');
        return;
      }

      let vreturn = await this.$root.doLoginRequest(mailV, passV);

      if(vreturn && vreturn['ok']){
        this.$root.renderView('home');
      }
      else{
        this.$root.renderRequestErrorMsg(vreturn, [
          'Usuário não encontrado no sistema',
          'Usuário não cadastrado',
          'Senha incorreta']);
      }
    }
  }
}
</script>

<!-- style applies only to this component -->
<style scoped>

.boxLogin{
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
  .boxLogin{
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
  .boxLogin{
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
  margin: 10px;
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