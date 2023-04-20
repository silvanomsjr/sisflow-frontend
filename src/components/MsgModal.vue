<template>

  <div class='transparentWrapper'
    :style="{
      'background-color': this.backgroundWhite
    }">

    <div class='msgBox'
      :style="{
        'background-color': this.white,
        'border-color': this.darkblue1
      }">

      <div class='msgTitle'>

        <div class='msgIconDiv'>

          <font-awesome-icon v-if="this.msgType == 'ok'"
            class="boxIcon"
            icon="fa-solid fa-check"
            :style="{
              'color': 'green',
              'font-size' : this.cFontSize
            }"
          />

          <font-awesome-icon v-if="this.msgType == 'warn'"
            class="boxIcon"
            icon="fa-solid fa-triangle-exclamation"
            :style="{
              'color': 'yellow',
              'font-size' : this.cFontSize
            }"
          />

          <font-awesome-icon v-if="this.msgType == 'error'"
            class="boxIcon"
            icon="fa-solid fa-triangle-exclamation"
            :style="{
              'color': 'red',
              'font-size' : this.cFontSize
            }"
          />

        </div>

        <div class='msgTitleDiv'>
          <TextCustom
            customFontSize='title'
            display='inline-block'>

            {{ this.msgTitle }}
          
          </TextCustom>
        </div>
        
      </div>

      <div class="msgLine">
        <LineCustom width="70%"/>
      </div>

      <div class='msgInfo' v-if="typeof this.msgInfo == 'string'">
        <TextCustom customFontSize='normal'>
          {{ this.msgInfo }}
        </TextCustom>
      </div>

      <div class='msgInfo' v-else v-for="(item, index) in msgInfo" :key="index">
        <TextCustom customFontSize='normal'>
          {{ item }}
        </TextCustom>
      </div>

      <div class='msgOkButton'>
        <ButtonCustom v-if="this.msgAccept"
          id="btnmsgacc"
          label="Sim"
          customTextColor="white"
          customBackColor="darkblue1"
          padding="2px 20px"
          margin="0px 5px"
          @click="this.$root.msgModalEnabled = false; this.$root.finishWaitRenderMsgButtonPress(true); this.$emit('accept')"
        />
        <ButtonCustom v-if="this.msgReject"
          id="btnmsgrej"
          label="Não"
          customBackColor="gray2"
          padding="2px 20px"
          margin="0px 5px"
          @click="this.$root.msgModalEnabled = false; this.$root.finishWaitRenderMsgButtonPress(false); this.$emit('reject')"
        />
        <ButtonCustom v-if="!this.msgAccept && !this.msgReject"
          id="btnmsgok"
          label="OK"
          customTextColor="white"
          customBackColor="darkblue1"
          padding="2px 20px"
          margin="0px 5px"
          @click="this.$root.msgModalEnabled = false; this.$root.finishWaitRenderMsgButtonPress(true); this.$emit('ok')"
        />
      </div>

    </div>

  </div>

</template>

<script>

import ButtonCustom from './ButtonCustom.vue'
import Cst from '../js/constants.js'
import LineCustom from './LineCustom.vue'
import TextCustom from './TextCustom.vue'
import Utils from '../js/utils.js'

export default {

  name: 'MsgModal',

  components: {
    ButtonCustom,
    LineCustom,
    TextCustom
  },

  props: {
    msgType: String,
    msgTitle: String,
    msgInfo: [ Array, String ],
    msgAccept: Boolean,
    msgReject: Boolean
  },

  created() {
    this.darkblue1 = Cst.COLOR_DARKBLUE1;
    this.white = Cst.COLOR_WHITE;
    this.backgroundWhite = this.white.replace(')', ',0.5)').replace('rgb', 'rgba');
    this.cFontSize = Utils.handleFontType('title')[0];
  }

}
</script>

<style scoped>

.transparentWrapper{
  position: fixed;
  top: 50%;
  left: 50%;
  -ms-transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translate(-50%,-50%);
  transform: translate(-50%,-50%);
  z-index: 100;
  width: 100vw;
  line-height: 100vh;
  text-align: center;
}
.transparentWrapper > *{
  vertical-align: middle;
  line-height: normal;
}
.msgBox{
  display: inline-block;
  margin: auto;
  border: 5px solid;
  border-radius: 40px;
  padding: 0px 20px;
}
@media (max-width: 900px) {
  .msgBox{
    max-width: 80%;
  }
}
@media (min-width: 900px) {
  .msgBox{
    max-width: 40%;
  }
}
.msgTitle{
  margin: 20px 30px 5px 30px;
  text-align: center;
}
.msgIconDiv, .msgTitleDiv{
  display: inline-block;
}
.msgIconDiv{
  margin-right: 10px;
}
.msgLine{
  margin: 0px 0px 20px 0px;
}
.msgInfo{
  word-break: break-word;
  margin: 20px 0px;
}
.msgOkButton{
  margin: 0px 0px 20px 0px;
}

</style>