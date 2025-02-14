<template>
  <div class="custom-table-container">
    <v-data-table
      :headers="props.headers"
      :items="props.items"
      no-data-text="Nenhuma solicitação encontrada"
      hide-default-footer
    >
      <template #body="{ items }">
        <tr v-if="items?.length == 0">
          <td colspan="6" style="text-align: center">
            Nenhuma solicitação encontrada
          </td>
        </tr>
        <tr v-for="(item, index) in items" :key="index">
          <td
            v-for="(col, index_col) in visibleHeaders"
            :key="index_col"
            style="text-align: center"
          >
            <span>{{ item[col.key] }}</span>
          </td>
          <td
            class="v-data-table-column-align-center"
            style="text-align: center"
          >
            <v-btn
              v-if="item.icon"
              variant="plain"
              @click="item.actionFunction"
            >
              <v-icon :icon="item.icon"> </v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
});

const visibleHeaders = computed(() => {
  return props.headers.filter((header) => header.key);
});
</script>

<style scoped>
.custom-table-container {
  border: 1px solid rgb(203, 203, 203);
}

:deep(thead) tr {
  background: rgb(203, 203, 203);
}
:deep(.v-data-table-header__content) {
  font-weight: bold;
}
</style>
