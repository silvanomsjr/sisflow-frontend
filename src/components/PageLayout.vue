<template>

  <div class="wrapper">
    
    <div id="TopUserMenu" class="shownOnlyOnNotMobile">

      <div class="TopLeftBox">
        <ImgLogoUfu/>
        <TextCustom 
          customColor="darkblue1"
          customFontSize='page_title'>
          Sisges
        </TextCustom>
      </div>

      <div class="TopRightBox">
        <div class="UserBox">
          <font-awesome-icon 
            class="faIconUser"
            icon="fa-solid fa-user"
            :style="{
              'color': this.darkblue1,
              'font-size': this.iconSize
            }"
          />
          {{ this.userNameF }}
        </div>
        <font-awesome-icon 
          class="faIconUserList"
          icon="fa-solid fa-list"
          :style="{
            'font-size': this.userListHover ? this.iconSizeHover : this.iconSize
          }"
          @mouseover="this.userListHover = true"
          @mouseleave="this.userListHover = false"
          @click="this.modifyUserInfo()"
        />
        <font-awesome-icon 
          class="faIconUserSignOut" 
          icon="fa-solid fa-right-from-bracket"
          :style="{
            'font-size': this.userExitHover ? this.iconSizeHover : this.iconSize
          }"
          @mouseover="this.userExitHover = true"
          @mouseleave="this.userExitHover = false"
          @click="this.userSignOut()"
        />
      </div>

    </div>
    
    <div class="menuContentWrapper">
      <div class="menuBox">
        <PageMenu
          @modifyUserInfo="this.modifyUserInfo()"
          @userSignOut="this.userSignOut()"
        />
      </div>
      
      <div class="contentBox">

        <div>
          <div class="pageTitle">
            <TextCustom
              customColor='darkblue1'
              customFontSize='page_title'>
              {{ this.$root.pageName }}
            </TextCustom>
          </div>
        </div>

        <div class="pageContent"
          :style="{
            'background-color': this.white
          }">
          <slot></slot>
        </div>
      
      </div>
    </div>
    
  </div>

</template>

<script>

import Cst from "../js/constants.js"
import PageMenu from './PageMenu.vue'
import ImgLogoUfu from './ImgLogoUfu.vue'
import TextCustom from './/TextCustom.vue'
import Utils from '../js/utils.js'

export default {

  name: 'PageLayout',

  components: {
    ImgLogoUfu,
    PageMenu,
    TextCustom
  },

  props: {
  },

  data() {
    return{
      userNameF: '',
      userListHover: false,
      userExitHover: false
    }
  },

  created() {
    this.userNameF = Utils.getNameFormated(this.$root.userLoggedData['user_name']);

    this.black1 = Cst.COLOR_BLACK1;
    this.darkblue1 = Cst.COLOR_DARKBLUE1;
    this.gray1 = Cst.COLOR_GRAY1;
    this.white = Cst.COLOR_WHITE;
    
    this.fontSizePageTitle = Utils.handleFontType("page_title")[0];

    this.iconSize = (parseInt(this.fontSizePageTitle.replace(/px/,""))) +"px";
    this.iconSizeHover = (parseInt(this.fontSizePageTitle.replace(/px/,""))+1) +"px";
  },

  mounted(){
    this.topUserMenu = document.getElementById('TopUserMenu');
    this.topUserMenu.style.backgroundColor = this.white;
    this.userBox = document.getElementsByClassName('UserBox')[0];
    this.userBox.style.backgroundColor = this.gray1;
  },

  methods: {
    modifyUserInfo(){
      console.log('modify');
    },
    userSignOut(){
      this.$root.clearLoginData();
      this.$root.renderView('login');
    }
  }

}
</script>

<style scoped>

@media (min-width: 900px) {
  .wrapper{
    position: absolute;
    height: 100%;
    width: 100%;
    text-align: center;
  }
  .wrapper > *{
    vertical-align: middle;
  }
  #TopUserMenu{
    display: flex;
    justify-content: space-between;
    line-height: 100%;
    height: 45px;
    padding: 5px 0px 5px 20px;
  }
  .TopRightBox, .TopLeftBox{
    display: inline-block;
    line-height: 100%;
  }
  #TopUserMenu > *, .TopLeftBox > *{
    vertical-align: middle;
  }
  .TopRightBox{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .menuContentWrapper {
    height: calc(100% - 45px);
    text-align: center;
  }
  .menuContentWrapper > *{
    vertical-align: middle;
  }
  .menuBox, .contentBox{
    display: inline-block;
    min-height: 500px;
    height: 100%;
    line-height: normal;
    padding: 0px;
    margin: 0px;
  }
  .menuBox{
    width: 200px;
    margin-right: 1%;
    border-radius: 10px;
    text-align: center;
  }
  .contentBox{
    width: calc(100% - 220px);
    text-align: left;
  }
  .pageContent{
    min-height: calc(100% - 50px);
    padding: 40px;
    overflow: auto;
    overflow-x: hidden;
    clear: both;
  }
}
@media (min-width: 900px) {
  .menuBox{
    height: calc(100% - 15px);
  }
}
@media (max-width: 900px) {
  .contentBox{
    margin: 10px 0px 0px 0px;
  }
  .pageContent{
    padding: 20px;
  }
}

.pageTitle{
  font-size: 27px;
}
.pageTitle{
  padding: 5px 10px;
  margin-left: 5px;
  display: inline-block;
}
.UserBox{
  border-radius: 20px;
  padding: 1px 10px;
  margin-right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.faIconUser{
  font-weight: 500;
}
.faIconUserList, .faIconUserSignOut{
  font-weight: 500;
  margin-right: 20px;
  cursor: pointer;
}
.pageContent{
  border-radius: 10px;
}

</style>