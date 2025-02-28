<template>
  <v-btn
    v-bind="$attrs"
    variant="flat"
    class="text-none"
    :density="props.density"
    :text="props.text"
    :prepend-icon="props.icon"
    @click="emits('customFunction')"
  >
  </v-btn>
</template>
<script setup>
import { defineEmits, defineOptions, defineProps } from "vue";

defineOptions({
  inheritAttrs: true,
});

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: false,
    default: "",
  },
  density: {
    type: String,
    required: false,
    default: "comfortable",
  },
});
const emits = defineEmits(["customFunction"]);
</script>

<style scoped>
button {
  color: #fff;
  transition: all 0.5s ease;
  background: rgba(28, 34, 86, 1);
  margin: 10px auto;
}

button:hover {
  background: rgba(28, 34, 86, 0.8);
}
</style>
