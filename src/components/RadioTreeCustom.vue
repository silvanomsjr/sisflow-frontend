<template>
  <div class="radioBox">
    <div v-for="(option, index) in options" :key="index">
      <label class="radioBoxLabel">
        <input type="radio" v-model="selectedOption" :value="option.value" class="radioBoxInput"
          :id=" treeDepthId == '' ? 'option-' + index : treeDepthId + '-' + index" 
        >
        
        <span class="radioBoxCircle"></span>
        {{ option.label }}
        
        <div v-if="option.suboptions && selectedOption==option.value" class="radioBoxSuboptions">
          <RadioTreeCustom :options="option.suboptions" v-model="selectedOption"
            :treeDepthId="treeDepthId == '' ? 'option-' + index : treeDepthId + '-' + index"
            @optSelected="(newValue) => this.$emit('optSelected', newValue)"
          />
        </div>
      </label>
    </div>
  </div>
</template>

<script>

import RadioTreeCustom from './RadioTreeCustom.vue'

export default {

  name: 'RadioTreeCustom',

  components: {
    RadioTreeCustom
  },

  props: {
    options: {
      type: Array,
      required: true,
      default: () => []
    },
    treeDepthId: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      selectedOption: '',
      newTreeDepthId: ''
    }
  },

  watch: {
    selectedOption() {
      this.$emit('optSelected', this.selectedOption)
    }
  }
}
</script>

<style scoped>

.radioBox{
  font-size: var(--font-size-normal);
  display: block;
  width: 100%;
}
.radioBoxLabel{
  display: inline-block;
  align-items: center;
  margin-right: 1rem;
  cursor: pointer;
}
.radioBoxInput{
  opacity: 0;
  cursor: pointer;
}
.radioBoxCircle {
  position: relative;
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-right: 0.5rem;
  border: 1px solid var(--color-gray3);
  border-radius: 50%;
}
.radioBoxCircle::before {
  content: "";
  position: absolute;
  display: none;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--color-darkblue1);
}
.radioBoxInput:checked + .radioBoxCircle::before {
  display: block;
}
.radioBoxLabel:hover .radioBoxCircle {
  border-color: var(--color-darkblue1);
}
.radioBoxLabel:hover .radioBoxCircle::before {
  background-color: var(--color-white);
}
.radioBoxLabel:hover .radioBoxInput:checked + .radioBoxCircle::before {
  background-color: var(--color-darkblue1);
}
.radioBoxSuboptions {
  display: block;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  margin-left: 1.5rem;
}
</style>
