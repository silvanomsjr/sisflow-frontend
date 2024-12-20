<template>
  <!-- <div class="center boxLogin"
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
  </div> -->
  <main>
    <div class="cardLogin">
      <div class="logo">
        <ImgLogoUfu />
        <h3>SisFlow</h3>
      </div>
      <div class="divLine">
        <LineCustom width="80%" />
      </div>
      <div class="cardTop">
        <h3>Login</h3>
        <v-form @submit.prevent="doLogin" ref="loginForm">
          <v-text-field
            v-model="emailInput"
            variant="outlined"
            density="compact"
            autocomplete="instmail"
            label="E-mail institucional"
            :rules="[rules.required]"
          />
          <v-text-field
            v-model="passwordInput"
            variant="outlined"
            density="compact"
            type="password"
            autocomplete="current-password"
            label="Senha"
            :rules="[rules.required]"
          />
          <v-btn type="submit" color="#1c2256" variant="flat">Logar</v-btn>
        </v-form>
      </div>
      <div class="cardBottom">
        <span> Ainda não possui conta? </span>
        <v-btn
          variant="plain"
          type="submit"
          id="btnRedirectSign"
          @click="this.$root.renderView('sign')"
        >
          Cadastrar
        </v-btn>
      </div>
    </div>
  </main>
</template>

<script>
// import ButtonCustom from '../components/ButtonCustom.vue'
// import InputCustom from '../components/InputCustom.vue'
// import TextCustom from "../components/TextCustom.vue";
import ImgLogoUfu from "../components/ImgLogoUfu.vue";
import LineCustom from "../components/LineCustom.vue";
import Utils from "../js/utils.js";

export default {
  name: "LoginView",

  components: {
    ImgLogoUfu,
    LineCustom,
    // ButtonCustom,
    // InputCustom,
    // TextCustom,
  },

  data() {
    return {
      topBackColor: "rgb(255,255,255)",
      bottomBackColor: "rgb(28, 34, 86)",
      boxBorderColor: "rgb(28, 34, 86)",
      emailInput: "",
      passwordInput: "",
    };
  },
  computed: {
    rules: () => Utils.rules,
  },

  created() {
    this.topBackColor = Utils.handleColorSelection("white");
    this.bottomBackColor = Utils.handleColorSelection("darkblue1");
    this.boxBorderColor = Utils.handleColorSelection("darkblue1");
  },

  methods: {
    async doLogin() {
      const checkForm = await this.$refs.loginForm.validate();
      if (checkForm.valid) {
        // verify institutional mail
        if (!this.emailInput.match(/\S+@\S+\.\S+/)) {
          this.$root.renderMsg("warn", "Email inválido!", "");
          this.$root.clearLoginData();
          return;
        }
        if (!this.emailInput.endsWith("@ufu.br")) {
          this.$root.renderMsg(
            "warn",
            "O email informado deve ser o institucional!",
            ""
          );
          this.$root.clearLoginData();
          return;
        }

        // verify password
        if (!/^\S*$/.test(this.passwordInput)) {
          this.$root.renderMsg(
            "warn",
            "Senha inválida!",
            "A senha não contém espaços."
          );
          return;
        }
        if (!/^.{8,18}$/.test(this.passwordInput)) {
          this.$root.renderMsg(
            "warn",
            "Senha inválida!",
            "A senha não contém de 8 a 18 caracteres."
          );
          return;
        }

        let vreturn = await this.$root.doLoginRequest(
          this.emailInput,
          this.passwordInput
        );

        if (vreturn && vreturn["ok"]) {
          this.$root.renderView("home");
        } else {
          this.$root.renderRequestErrorMsg(vreturn, [
            "Usuário não encontrado no sistema",
            "Usuário não cadastrado",
            "Senha incorreta",
          ]);
        }
      }
    },
  },
};
</script>

<!-- style applies only to this component -->
<style scoped>
/* .boxLogin {
  border: none;
  box-shadow: 0 0 0 3px;
  border-radius: 40px;
  overflow: hidden;
  padding: 0px;
}
@media (max-width: 900px) {
  .center {
    margin: auto;
    text-align: center;
  }
  .boxLogin {
    width: 80%;
  }
}
@media (min-width: 900px) {
  .center {
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translateX(-50%) translateY(-50%);
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  .boxLogin {
    width: 40%;
  }
}
.top,
.bottom {
  padding: 13px 30px;
  margin: 0px;
}
.logo {
  line-height: 100%;
  text-align: center;
  margin-bottom: 10px;
}
.logo > * {
  vertical-align: middle;
}
.signFields {
  margin-top: 10px;
}
.divhref {
  margin-left: 20px;
}
.horCenter {
  text-align: center;
}
.divLine {
  margin-top: 3px;
}
.divForm {
  margin: 10px;
}
.divField {
  display: inline-block;
  width: 80%;
  margin: 7px;
}
.alignLeft {
  text-align: left;
}
.btnLogar {
  margin: 10px 0px;
} */
main {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cardLogin {
  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0px 10px 40px #00000056;

  .logo {
    display: flex;
    padding: 1rem;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    & > h3 {
      color: #1c2256;
      font-weight: 600;
      display: inline;
      font-size: 20px;
      margin: 0;
    }
  }

  .divLine {
    width: 100%;
    margin-top: 3px;
  }

  .cardTop {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem 2rem 1rem 2rem;

    & > form {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      div {
        width: 100%;
        margin-bottom: 0.5rem;
      }
    }

    & > h3 {
      font-weight: 600;
      font-size: 20px;
      margin-bottom: 1.2rem;
    }
  }
  .cardBottom {
    width: 100%;
    padding: 1rem;
    background-color: #1c2256;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0 0 10px 10px;
    & {
      color: white;
    }
  }
}
</style>
