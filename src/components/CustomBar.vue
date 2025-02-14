<template>
  <div class="filters-container">
    <v-layout style="height: 25px">
      <v-system-bar :height="25" color="#737373" window absolute>
        <span v-if="props.text">{{ props.text }}</span>
        <v-spacer v-if="props.text" />
        <v-btn
          v-if="props.cleanBtn"
          @click="emits('clearFunction')"
          variant="plain"
          density="compact"
        >
          <v-icon icon="mdi-eraser"></v-icon>
        </v-btn>
        <v-btn
          @click="emits('customFunction')"
          variant="plain"
          density="compact"
        >
          <v-icon :icon="props.icon"></v-icon>
        </v-btn>
      </v-system-bar>
    </v-layout>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";

const emits = defineEmits(["customFunction", "clearFunction"]);
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: false,
  },
  cleanBtn: {
    type: Boolean,
    required: false,
  },
});
</script>

<style scoped>
.filters-container {
  position: relative;
}
</style>
