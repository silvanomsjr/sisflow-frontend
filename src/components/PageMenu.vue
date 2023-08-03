<template>

  <div class="menuWrapper"
    :style="{ 
      'background-color': this.black1
    }"
    @mouseleave='this.handleMouseOut()'
    tabindex="0">

    <div>
      <div class="menuTitleWrapper shownOnlyOnMobile">

        <font-awesome-icon class="menuBars"
          icon="fa-solid fa-bars"
          :color="this.white"
          @mouseover="this.barsHover = true"
          @mouseleave="this.barsHover = false"
          @click="this.showMenuOnMobile = !this.showMenuOnMobile"
          :style="{
            'font-size': this.barsHover ? this.iconSizeHover : this.iconSize
          }"
        />

        <div class="menuLogo">
          <ImgLogoUfu 
            color_name="white"
            width="27px" 
            height="27px"
          />
          <TextCustom 
            customColor="white"
            customFontSize='page_title'
            margin='0px 0px 0px 10px'>
            Sisges
          </TextCustom>
        </div>

        <div class="userConfigDiv"
          :style="{
            'color': this.white
          }">
          
          <font-awesome-icon class="userConfigIcon" 
            icon="fa-solid fa-list"
            :style="{
              'font-size': this.userListHover ? this.iconSizeHover : this.iconSize
            }"
            @mouseover="this.userListHover = true"
            @mouseleave="this.userListHover = false"
            @click="this.$emit('modifyUserInfo')"
          />
          <font-awesome-icon class="userConfigIcon" 
            icon="fa-solid fa-right-from-bracket" 
            :style="{
              'font-size': this.userExitHover ? this.iconSizeHover : this.iconSize
            }"
            @mouseover="this.userExitHover = true"
            @mouseleave="this.userExitHover = false"
            @click="this.$emit('userSignOut')"
          />
        </div>
      </div>
      
      <div class="iMenuWrapper" v-show="!this.isOnMobyle || (this.isOnMobyle && this.showMenuOnMobile)">

        <div v-for="(item, index) in items" :key="index"
          class="itemContainer"
          :id="item.label"
          :style="{
            'background-color': item.iSelected ? this.gray2 : this.black1,
            'color': item.iSelected ? this.black1 : this.white,
            'text-decoration': item.iSelected && item.subItems.length == 0 ? 'underline' : 'none'
          }">

          <div class="itemLabelContainer"
            @mouseover="item.iHover=true"
            @mouseleave="item.iHover=false"
            @click="setItemSelected(index);"
            :style="{
              'text-decoration': item.iSelected && item.subItems.length == 0 ? 'underline' : 'none',
              'font-weight': item.iHover || item.iSelected ? 'bold' : '500'
            }">

            <font-awesome-icon class='itemIcon' :icon="'fa-solid fa-' + item.faIconName"/>
            <TextCustom class='itemTextLabel'
              customColor='inherit'
              customFontSize="inherit"
              display='inline'
              :style="{'font-weight': item.iHover || item.iSelected ? 'bold' : '500'}">

              {{ item.label }}

            </TextCustom>
            <font-awesome-icon v-if="item.subItems.length > 0"
              :icon=" item.subItemsShow ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"
              class="iconChevron"
            />
          </div>

          <div v-if="item.subItemsShow">
            <div v-for="(subItem, indexS) in item.subItems" :key="indexS"
              class="subItemContainer"
              :id="item.label + indexS"
              @click="setSubItemSelected(index, indexS);"
              @mouseover="subItem.sHover=true"
              @mouseleave="subItem.sHover=false"
              :style="{'text-decoration': item.iSelected && subItem.sSelected ? 'underline' : 'none',}">

              <TextCustom class='itemTextLabel'
                customColor='inherit'
                customFontSize="normal"
                display='inline'
                :style="{'font-weight': subItem.sSelected || subItem.sHover ? 'bold' : '500'}">

                {{ subItem.subLabel }}

              </TextCustom>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>

import Cst from '../js/constants.js'
import ImgLogoUfu from '../components/ImgLogoUfu.vue'
import TextCustom from './TextCustom.vue'
import Utils from '../js/utils.js'

export default {

  name: 'PageMenu',

  components: {
    ImgLogoUfu,
    TextCustom
  },

  props: {
    backgroundColor: String
  },

  data() {
    return {
      items: [
        { label: "Solicitações", faIconName: "home", view: 'home', iSelected: true, iHover: false, subItemsShow: false, subItems: [] },
        { label: "Areas", faIconName: "users", view: '', iSelected: false, iHover: false, subItemsShow: false, subItems: [ 
          { subLabel: "Aluno", view: 'areastudent', sSelected: false, sHover: false }, 
          { subLabel: "Orientador", view: 'areaadvisor', sSelected: false, sHover: false },
          { subLabel: "Coordenador", view: 'areacoordinator', sSelected: false, sHover: false }
        ]}
      ],
      itemSelected: 0,
      subItemSelected: 0,
      isOnMobyle: false,
      showMenuOnMobile: false,
      barsHover: false,
      userListHover: false,
      userExitHover: false
    }
  },

  created() {

    this.black1 = Cst.COLOR_BLACK1;
    this.darkblue1 = Cst.COLOR_DARKBLUE1;
    this.gray2 = Cst.COLOR_GRAY2;
    this.white = Cst.COLOR_WHITE;

    let tmp = Utils.handleFontType("normal");
    this.fontSizeNormal = tmp[0];
    this.fontWeightNormal = tmp[1];
    tmp = Utils.handleFontType("small");
    this.fontSizeSmall = tmp[0];
    this.fontWeightSmall = tmp[1];

    this.fontSizePageTitle = Utils.handleFontType("page_title")[0];
    this.iconSize = (parseInt(this.fontSizePageTitle.replace(/px/,""))) +"px";
    this.iconSizeHover = (parseInt(this.fontSizePageTitle.replace(/px/,""))+1) +"px";

    this.userName = Utils.getNameFormated(this.$root.userLoggedData['user_name']);
  },

  mounted() {
    window.addEventListener('resize', this.verifyOnMobile);
    this.verifyOnMobile();
  },
  unmounted() {
    window.removeEventListener('resize', this.verifyOnMobile);
  },

  methods: {

    verifyOnMobile(){
      this.isOnMobyle = Utils.isPageOnMobile();
    },
    handleMouseOut(){
      this.showMenuOnMobile = false;
    },
    setItemSelected(itemIndex){

      if(this.items[itemIndex].subItems.length == 0){

        this.items[this.itemSelected].iSelected = false;
        if(this.items[this.itemSelected].subItems.length > 0){
          this.items[this.itemSelected].subItems.forEach(subItem => {
            subItem.sSelected = false;
          });
        }

        this.itemSelected=itemIndex;
        this.items[this.itemSelected].iSelected = true;

        this.renderView(itemIndex, null);
      }
      else{
        this.items[itemIndex].subItemsShow = !this.items[itemIndex].subItemsShow;
      }
    },
    setSubItemSelected(itemIndex, subItemIndex){

      this.items[this.itemSelected].iSelected = false;
      if(this.items[this.itemSelected].subItems.length > 0){
        this.items[this.itemSelected].subItems.forEach(subItem => {
          subItem.sSelected = false;
        });
      }
      
      this.itemSelected=itemIndex;
      this.subItemSelected=subItemIndex;

      this.items[this.itemSelected].iSelected = true;
      this.items[this.itemSelected].subItems[this.subItemSelected].sSelected = true;

      this.renderView(itemIndex, subItemIndex);
    },
    renderView(itemIndex, subItemIndex){

      let viewName = subItemIndex == null ? this.items[itemIndex].view : this.items[itemIndex].subItems[subItemIndex].view;

      if(viewName != ''){
        this.$root.renderView(viewName);
      }
      
    }
  }
}
</script>

<style scoped>

@media (min-width: 900px) {
  .menuWrapper{
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }
  .menuWrapper > div{
    padding: 3%;
  }
  .iMenuWrapper{
    margin: 10px 0px 0px 0px;
  }
}
@media (max-width: 900px) {
  .menuWrapper{
    border-radius: 0px 0px 20px 20px;
    padding: 5px 20px ;
  }
  .menuTitleWrapper{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .menuBars{
    display: inline-block;
    margin-right: 10px;
    cursor: pointer;
  }
  .menuTitle{
    display: none;
  }
  .userConfigDiv{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .menuLogo{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .userConfigName, .userConfigIcon{
    margin: 0px 10px 0px 0px;
  }
  .userConfigIcon{
    cursor: pointer;
  }
  .iMenuWrapper{
    padding-bottom: 10px;
  }
}

.menuTitle{
  margin: 3px 0px 12px 0px;
}
.imgCrown{
  display: inline;
}
.itemContainer{
  border-radius: 10px;
  padding: 5px 0px 5px 12px;
  margin: 3px 0px;
  line-height: 20px;
  font-size: 17px;
  text-align: left;
  cursor: pointer
}
.itemContainer > *{
  display: inline;
  vertical-align: middle;
}
.itemIcon{
  margin-right: 5px;
}
.itemLabelContainer{
  display: inline-block;
  width: 100%;
}
.iconChevron{
  font-size: 10px;
  float: right;
  margin: 4px 6px 0px 0px;
}
.subItemContainer{
  margin: 5px 0px 0px 15px;
  font-size: 15px;
}

</style>