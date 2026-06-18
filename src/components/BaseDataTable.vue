<template>
  <v-card border flat class="pa-4 rounded-lg">
    <v-card-title class="px-0 pt-0 mb-4">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="search"
            :placeholder="searchPlaceholder || 'Search...'"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            flat
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      :loading="loading"
      hover
      class="border-thin rounded"
    >
      <template #loading>
        <v-progress-linear color="primary" indeterminate height="3" class="mt-2"></v-progress-linear>
      </template>

      <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  headers: { type: Array, required: true },
  items: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  searchPlaceholder: { type: String, default: '' }
})

const search = ref('')
</script>