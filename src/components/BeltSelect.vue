<template>
  <v-select
    v-model="selectedBelt"
    :items="belts"
    item-title="name"
    item-value="id"
    :label="$t('belts.select')"
    :no-data-text="$t('belts.no_data_found')"
    :loading="loading"
    :rules="rules"
    variant="outlined"
    required
    @update:model-value="emitSelection"
  >
    <!-- Customiza os itens da lista suspensa (dropdown) -->
    <template v-slot:item="{ props, item }">
      <v-list-item v-bind="props">
        <template v-slot:prepend>
          <v-avatar :color="item?.color" size="20" class="me-2" style="border: 1px solid #808080"></v-avatar>
        </template>
      </v-list-item>
    </template>

    <!-- Opcional: Mantém o avatar visível na caixa após selecionar -->
    <template v-slot:selection="{ item }">
      <v-avatar :color="item?.color" size="20" class="me-2" style="border: 1px solid #808080"></v-avatar>
      <span>{{ item.name }}</span>
    </template>
  </v-select>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '@/plugins/axios'

const props = defineProps({
  modelValue: {
    type: [String, null],
    default: null
  },
  rules: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const belts = ref([])
const loading = ref(false)
const selectedBelt = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  selectedBelt.value = newVal
})

const emitSelection = (val) => {
  emit('update:modelValue', val)
}

// 🎨 Função que busca o objeto completo (nome e cor) da lista original do Axios de forma segura
const getBeltData = (beltId) => {
  return belts.value.find(b => b.id === beltId)
}

const fetchBelts = async () => {
  loading.value = true
  try {
    const response = await api.get('/belts')
    if (response.data && response.data.data) {
      belts.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching belts from API:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBelts()
})
</script>