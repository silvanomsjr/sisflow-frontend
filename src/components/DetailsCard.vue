<template>

  <div>
    
    <div class="detailsWrapper" @click="this.showItems = !this.showItems">
      <h3 class="detailsTitle">{{this.title}}</h3>
      
      <div v-if="this.showItems && this.items.length > 0">
        <TextCustom v-for="(item, index) in this.items" :key="index"
          class="detailsItem"
          ref='items'
          margin='5px 0px 5px 0px'
          display='block'>
          {{item.label + ": " + item.value}}
        </TextCustom>
      </div>
    </div>

  </div>

</template>

<script>

import TextCustom from "../components/TextCustom.vue"

export default {

  name: 'DetailsCard',

  components: {
    TextCustom
  },

  props: {
    id: String,
    title: String,
    items: Array,
    showItemsOnStart: {
      default: false,
      type: Boolean
    }
  },

  data(){
    return{
      showItems: false
    }
  },

  created() {
    if(this.showItemsOnStart){
      this.showItems = true;
    }
  }
}
</script>

<!-- style applies only to this component -->
<style scoped>

.detailsWrapper{
  display: block;
  padding: 10px;
  margin: 10px 0px;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  cursor: pointer;
}
.detailsTitle{
  font-weight: bold;
  font-size: var(--font-size-title);
}
.detailsItem{
  padding-left: 15px;
}

</style>