<template>
  <MenuLayout>
    <!-- Cabeçalho da Página -->
    <v-row class="mb-4 align-center justify-space-between">
      <v-col cols="12" sm="8">
        <h1 class="text-h4 font-weight-bold text-grey-darken-3">
          {{ $t('students.title') }}
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          {{ $t('students.subtitle') }}
        </p>
      </v-col>
      <v-col cols="12" sm="4" class="text-sm-right">
        <v-btn color="primary" prepend-icon="mdi-account-plus" size="large" rounded="md" elevation="1">
          {{ $t('students.add_button') }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- Alerta de Erro de Conectividade -->
    <v-alert v-if="errorMsg" type="error" variant="tonal" class="mb-4" closable @click:close="errorMsg = ''">
      {{ errorMsg }}
    </v-alert>

    <!-- Card Principal com Filtro e Tabela -->
    <v-card border flat class="pa-4 rounded-lg">
      <v-card-title class="px-0 pt-0 mb-4">
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              :placeholder="$t('students.search_placeholder')"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              flat
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>

      <!-- Tabela de Dados Conectada à API -->
      <v-data-table
        :headers="headers"
        :items="students"
        :search="search"
        :loading="loading"
        hover
        class="border-thin rounded"
      >
        <!-- Customização do indicador de carregamento -->
        <template #loading>
          <v-progress-linear color="primary" indeterminate height="3" class="mt-2"></v-progress-linear>
        </template>

        <!-- Customização da Coluna de Faixas -->
        <template #[`item.currentBeltName`]="{ item }">
          <v-chip
            :color="getBeltChipColor(item.currentBeltName)"
            size="small"
            class="font-weight-bold border-sm text-capitalize"
            variant="flat"
          >
            <v-icon icon="mdi-medal" start size="16"></v-icon>
            {{ item.currentBeltName }}
          </v-chip>
        </template>

        <!-- Customização da Coluna de Graus -->
        <template #[`item.beltDegree`]="{ item }">
          <span class="font-weight-bold">{{ item.beltDegree }} 🌟</span>
        </template>

        <!-- Customização da Coluna de Status -->
        <template #[`item.active`]="{ item }">
          <v-badge
            dot
            inline
            :color="item.active ? 'success' : 'error'"
            class="font-weight-medium"
          >
            {{ item.active ? $t('students.status_active') : $t('students.status_inactive') }}
          </v-badge>
        </template>

        <!-- Customização da Coluna de Ações -->
        <template #[`item.actions`]="{ item }">
          <v-btn icon="mdi-pencil" size="x-small" variant="text" color="info" class="me-1" @click="editStudent(item)"></v-btn>
          <v-btn icon="mdi-delete" size="x-small" variant="text" color="error" @click="deleteStudent(item)"></v-btn>
        </template>
      </v-data-table>
    </v-card>
  </MenuLayout>
</template>

<script setup>
import MenuLayout from '@/layouts/MenuLayout.vue'
import api from '@/plugins/axios' // 👈 Importa a nossa instância global do Axios
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const search = ref('')
const students = ref([])
const loading = ref(false)
const errorMsg = ref('')

// Configuração das colunas
const headers = computed(() => [
  { title: t('students.columns.name'), key: 'name', sortable: true },
  { title: t('students.columns.belt'), key: 'currentBeltName', sortable: true, align: 'center' },
  { title: t('students.columns.degrees'), key: 'beltDegree', sortable: true, align: 'center' },
  { title: t('students.columns.join_date'), key: 'joinDate', sortable: true },
  { title: t('students.columns.status'), key: 'active', sortable: true, align: 'center' },
  { title: t('students.actions'), key: 'actions', sortable: false, align: 'right' }
])

// 🔄 Função que busca os dados reais do Spring Boot
const fetchStudents = async () => {
  loading.value = true
  errorMsg.value = ''
  
  try {
    // 1. Recupera as informações do usuário logado para saber qual o id da academia
    const savedUser = localStorage.getItem('user_token')
    if (!savedUser) return
    
    const user = JSON.parse(savedUser)
    const academyId = user.academyId

    // 2. Faz a chamada HTTP para o endpoint: GET /api/v1/students/academy/{academyId}
    const response = await api.get(`/students/academy/${academyId}`)
    
    // 3. Alimenta a tabela mapeando o wrapper RestResponse (response.data.data)
    students.value = response.data.data
  } catch (error) {
    console.error('API Error:', error)
    errorMsg.value = error.response?.data?.message || t('students.error_loading')
  } finally {
    loading.value = false
  }
}

// Dispara a busca assim que o componente é montado na árvore do Vue
onMounted(() => {
  fetchStudents()
})

const getBeltChipColor = (beltName) => {
  if (!beltName) return 'grey'
  switch (beltName.toLowerCase()) {
    case 'branca': return 'grey-lighten-4 text-black'
    case 'azul': return 'blue-darken-2'
    case 'roxa': return 'purple-darken-2'
    case 'marrom': return 'brown-darken-2'
    case 'preta': return 'black text-white'
    default: return 'grey-darken-1'
  }
}

const editStudent = (student) => {
  console.log('Edit student:', student.name)
}

const deleteStudent = (student) => {
  console.log('Delete student ID:', student.id)
}
</script>