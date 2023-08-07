<template>

  <div v-if="this.tableData != null"
    class="tableWrapper">

    <!-- previous and next buttons -->
    <div v-if="this.showPrevNextButtons" class="prevNextWrapper">

      <font-awesome-icon v-if="this.actualPage > 1"
        icon="fa-solid fa-chevron-left"
        class="prevNextIcon"
        :style="{
          'font-weight': this.cFontWeight,
          'font-size': this.cFontSize,
          'color': this.darkblue1
        }"
        @click="$emit('previousClick')"
      />

      <span>{{ this.actualPage }}/{{ this.maxPages }}</span>

      <font-awesome-icon v-if="this.actualPage < this.maxPages"
        icon="fa-solid fa-chevron-right"
        class="prevNextIcon"
        :style="{
          'font-weight': this.cFontWeight,
          'font-size': this.cFontSize,
          'color': this.darkblue1
        }"
        @click="$emit('nextClick')"
      />

    </div>
    
    <!-- desktop version -->
    <div class="shownOnlyOnNotMobile">
      <div class="titleWrapper"
        :style="{
          'font-weight': this.cFontWeightBold,
          'font-size': this.cFontSizeBold,
          'border-color': this.gray2,
          'background-color': this.gray2
        }">

        <div v-for="(title, indexT) in this.tableData['titles']" :key="indexT"
          class="title"
          :style="{
            'width': this.tableData['colWidths'][indexT]
          }">
          {{ title }}
        </div>
      
      </div>

      <div v-if="this.tableData['content'].length > 0"
        class="contentWrapper"
        :style="{
          'font-weight': this.cFontWeight,
          'font-size': this.cFontSize,
          'border-color': this.gray2,
          'background-color': this.white
        }">

        <div v-for="(contentRow, indexR) in this.tableData['content']" :key="indexR"
          class="contentRow">

          <div v-for="(content, indexC) in contentRow" :key="indexC"
            class="content"
            :style="{
              'width': this.tableData['colWidths'][indexC],
              'border-color': this.gray2
            }">

            <span v-if="this.tableData['colTypes'][indexC] == 'string'">
              <TextCustom
                :ref="'tableContent' + indexR"
                display='inline'>
                {{ content }}
              </TextCustom>
            </span>

            <span v-if="this.tableData['colTypes'][indexC] == 'iconfunction'">
              <font-awesome-icon v-if="content['iconName']"
                :icon="content['iconName']"
                class="tableIcon"
                :style="{
                  'font-weight': this.cFontWeight,
                  'font-size': this.cFontSize,
                  'color': this.darkblue1
                }"
                @click="content['iconSelFunction']"
              />
            </span>

            <CheckboxC v-if="this.tableData['colTypes'][indexC] == 'checkbox'"
              :ref="'tableContent' + indexR"
              class="tableCheckBox"
              :id="'tableCheckBox' + indexR + '_' + indexC"
              :name="'tableCheckBox' + indexR + '_' + indexC"
            />

            <CheckboxC v-if="this.tableData['colTypes'][indexC] == 'checkbox-single'"
              :ref="'tableContent' + indexR"
              class="tableCheckBox"
              :id="'tableCheckBoxS' + indexR + '_' + indexC"
              :name="'tableCheckBox' + indexR + '_' + indexC"
              @checkBoxClicked="this.cleanOtherCheckboxItems(indexR, indexC)"
            />

          </div>
        </div>
      </div>
    </div>

    <!-- Mobile version -->
    <div class="shownOnlyOnMobile">

      <div v-if="this.tableData['content'].length > 0"
        class="contentWrapperMobile">

        <div v-for="(contentBox, indexR) in this.tableData['content']" :key="indexR"
          class="contentBox"
          :style="{
            'font-weight': this.cFontWeight,
            'font-size': this.cFontSize,
            'border-color': this.gray2
          }">

          <div v-for="(content, indexC) in contentBox" :key="indexC"
            class="contentBoxItem">

            <TextCustom 
              customFontSize='normal_bold'>
              {{ this.tableData['titles'][indexC] }}:
            </TextCustom>

            <span v-if="this.tableData['colTypes'][indexC] == 'string'">
              <TextCustom
                :ref="'tableContent' + indexR">
                {{ content }}
              </TextCustom>
            </span>
            
            <span v-if="this.tableData['colTypes'][indexC] == 'iconfunction'">
              <font-awesome-icon v-if="content['iconName']"
                :icon="content['iconName']"
                class="tableIcon"
                :style="{
                  'font-weight': this.cFontWeight,
                  'font-size': this.cFontSize,
                  'color': this.darkblue1,
                  'margin-left': '5px'
                }"
                @click="content['iconSelFunction']"
              />
            </span>

            <CheckboxC v-if="this.tableData['colTypes'][indexC] == 'checkbox'"
              :ref="'tableContent' + indexR"
              class="tableCheckBox"
              :id="'tableCheckBoxM' + indexR + '_' + indexC"
              :name="'tableCheckBoxM' + indexR + '_' + indexC"
            />

            <CheckboxC v-if="this.tableData['colTypes'][indexC] == 'checkbox-single'"
              :ref="'tableContent' + indexR"
              class="tableCheckBox"
              :id="'tableCheckBoxMS' + indexR + '_' + indexC"
              :name="'tableCheckBoxMS' + indexR + '_' + indexC"
              @checkBoxClicked="this.cleanOtherCheckboxItems(indexR, indexC)"
            />
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import CheckboxC from "../components/CheckboxC.vue"
import Utils from "../js/utils.js"
import TextCustom from "../components/TextCustom.vue"

export default {

  name: 'TableCustom',

  components: {
    CheckboxC,
    TextCustom
  },

  props: {
    tableData: {
      default: null,
      type: Object
    },
    width: String,
    showPrevNextButtons: {
      default: false,
      type: Boolean
    },
    actualPage: {
      default: 1,
      type: Number
    },
    maxPages: {
      default: 1,
      type: Number
    }
  },

  data(){
    return{}
  },

  created() {
    this.darkblue1 = Utils.handleColorSelection('darkblue1');
    this.white = Utils.handleColorSelection('white');
    this.gray2 = Utils.handleColorSelection('gray2');
    
    let tmp = Utils.handleFontType(this.customFontSize);
    this.cFontSize = tmp[0];
    this.cFontWeight = tmp[1];

    tmp = Utils.handleFontType('normal_bold');
    this.cFontSizeBold = tmp[0];
    this.cFontWeightBold = tmp[1];
  },

  methods: {

    parseTableCell(cell, row, col){
      
      if(cell.name && (cell.name.includes('tableInput') || cell.name.includes('tableSelect') || cell.name.includes('tableCheckBox')) ){
        return cell.getV();
      }

      if(this.tableData['colTypes'][col] == 'string'){
        return this.tableData['content'][row][col];
      }

      return '';
    },

    getV(row=null, col=null){

      let tableV = [];

      if(row!=null && col!=null){
        return this.parseTableCell(this.$refs['tableContent' + row][col], row, col);
      }

      for(let i = 0; i < this.tableData['content'].length; i++){

        let line = [];
        for(let j = 0; j < this.tableData['colTypes'].length; j++){
          line.push( this.parseTableCell(this.$refs['tableContent' + i][j], i, j) );
        }
        
        tableV.push(line);
      }

      return tableV;
    },

    setV(row, col, value){
      this.$refs['tableContent' + row][col].setV(value);
    },
    
    cleanOtherCheckboxItems(selectedRow, col) {
      this.tableData['content'].forEach((rowData, row) => {
        if(selectedRow != row){
          this.$refs['tableContent' + row][col].setV(false);
        }
      });
    }

  }
}

</script>

<!-- style applies only to this component -->
<style scoped>

.tableWrapper, .prevNextWrapper{
  display: block;
  width: 100%;
  margin: 0px;
  padding: 0px;
  box-shadow: rgba(0, 0, 0, 0.2) -1px 1px 1px;
}
.prevNextWrapper{
  text-align: center;
  margin-bottom: 5px;
}
.prevNextWrapper > *{
  text-align: center;
  margin-right: 20px;
}
.prevNextIcon, .tableIcon{
  cursor: pointer;
}
.titleWrapper, .contentWrapper{
  width: 100%;
  text-align: center;
}
.titleWrapper{
  padding: 12px;
  margin: 0px;
  border: solid 0.2px;
  border-radius: 2px 2px 0px 0px;
}
.titleWrapper > *{
  vertical-align: middle;
}
.contentWrapper{
  padding: 0px;
  margin: 0px;
  border: solid 0.2px;
}
.contentRow{
  display: flex;
  text-align: center;
}
.contentRow > * {
  align-items: stretch;
  padding: 5px 0px;
}
.title, .content{
  display: inline-block;
  font-size: inherit;
  word-wrap: break-word;
}
.content{
  border: solid 0.2px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.contentBox{
  border: solid 0.2px;
  padding: 10px 20px;
}
.contentBoxItem{
  display: block;
  width: 100%;
  margin-top: 7px;
}
.tableCheckBox, .tableCheckBox > *{
  text-align: center;
}

</style>