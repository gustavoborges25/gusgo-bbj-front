<template>
  <MenuLayout>
        <Cabecalho 
          :title="$t('students.list.title')"
          :subtitle="$t('students.list.subtitle')"
          forwardRoute="/students/create"
          :forwardText="$t('students.add_button')"
        >        
          <template #actions>
            <v-btn 
              color="secondary" 
              variant="outlined"
              prepend-icon="mdi-file-upload-outline" 
              size="large" 
              rounded="md"
              to="/students/import"
            >
              {{ $t('students.import_button') }}
            </v-btn>

            <v-btn 
              color="primary" 
              prepend-icon="mdi-account-plus" 
              size="large" 
              rounded="md" 
              elevation="1"
              to="/students/create"
            >
              {{ $t('students.add_button') }}
            </v-btn>
          </template>
        </Cabecalho>
    <BaseDataTable
      :headers="headers"
      :items="students"
      :loading="loadingTable"
      :search-placeholder="$t('students.search_placeholder')"
    >
      <template #item.birthDate="{ value }">
        {{ formatarData(value) }}
      </template>

      <template #[`item.beltName`]="{ item }">
        <v-chip
          :color="item.beltColor"
          size="small"
          class="font-weight-bold border-sm text-capitalize"
          variant="flat"
        >
          <v-icon icon="mdi-medal" start size="16"></v-icon>
          {{ item.beltName }}
        </v-chip>
      </template>

      <template #[`item.degree`]="{ item }">
        <span class="font-weight-bold">{{ item.degree }} 🌟</span>
      </template>

      <template #item.joinDate="{ value }">
        {{ formatarData(value) }}
      </template>

      <template #[`item.active`]="{ item }">
        <v-badge dot inline :color="item.active ? 'success' : 'error'">
          <span style="margin-right: 5px;">{{ item.active ? $t('students.status_active') : $t('students.status_inactive') }}</span>
        </v-badge>
      </template>

      <template #[`item.actions`]="{ item }">
        <v-btn v-tooltip="$t('students.actions.edit')" icon="mdi-account-edit" size="small" variant="text" color="#ffc107" @click="handleEdit(item)"></v-btn>
        <v-btn v-tooltip="item.active ? $t('students.actions.inactive') : $t('students.actions.active')" icon="mdi-toggle-switch" size="small" variant="text" :color="item.active ? 'success' : 'grey'" @click="toggleStatus(item)"></v-btn>
        <v-btn v-tooltip="$t('students.actions.delete')" icon="mdi-delete" size="small" variant="text" color="error" @click="openDeleteModal(item)"></v-btn>
      </template>
    </BaseDataTable>

    <ConfirmDialog
      v-model="deleteModal"
      :loading="loadingDelete"
      :title="$t('students.delete.title')"
      :message="$t('students.delete.subtitle_1') + selectedName + $t('students.delete.subtitle_2')"
      :confirm-text="$t('students.delete.confirm')"
      color="error"
      icon="mdi-trash-can-outline"
      @confirm="handleDelete"
    />

  </MenuLayout>
</template>

<script setup>
import MenuLayout from '@/layouts/MenuLayout.vue'
import Cabecalho from '@/components/Cabecalho.vue'
import BaseDataTable from '@/components/BaseDataTable.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import api from '@/plugins/axios'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'
import { useDateFormatter } from '@/composables/useDateFormatter';

const { t } = useI18n()
const students = ref([])
const loadingTable = ref(false)
const router = useRouter()
const deleteModal = ref(false)
const loadingDelete = ref(false)
const selectedId = ref(null)
const selectedName = ref(null)
const { formatarData } = useDateFormatter();

const headers = computed(() => [
  { title: t('students.columns.name'), key: 'name', sortable: true },
  { title: t('students.columns.birth_date'), key: 'birthDate', sortable: true },
  { title: t('students.columns.belt'), key: 'beltName', sortable: true, align: 'center' },
  { title: t('students.columns.degrees'), key: 'degree', sortable: true, align: 'center' },
  { title: t('students.columns.join_date'), key: 'joinDate', sortable: true },
  { title: t('students.columns.status'), key: 'active', sortable: true, align: 'center' },
  { title: t('students.actions'), key: 'actions', sortable: false, align: 'right' }
])

const fetchStudents = async () => {
  loadingTable.value = true
  try {
    const response = await api.get('/students')
    students.value = response.data.data
  } catch (error) {
    toast.error(error.response?.data?.message || 'Falha ao carregar a lista de alunos.')
  } finally {
    loadingTable.value = false
  }
}

const openDeleteModal = (students) => {
  selectedId.value = students.id
  selectedName.value = students.name
  deleteModal.value = true
}

const toggleStatus = async (item) => {
  const originalStatus = item.active 

  try {
    const response = await api.patch(`/students/${item.id}`, {
      active: !originalStatus
    })

    const updatedStudent = response.data.data
    item.active = updatedStudent.active
    toast.success(t('students.edit.status'))
  } catch (error) {
    toast.error(error.response?.data?.message || 'Falha ao mudar o status do aluno.')
    item.active = originalStatus
  }
}

const handleDelete = async () => {
  if (!selectedId.value) return

  loadingDelete.value = true
  try {
    await api.delete(`/students/${selectedId.value}`)
    deleteModal.value = false
    selectedId.value = null
    selectedName.value = null
    toast.success(t('students.delete.success'))
    fetchInstructors()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Falha ao excluir o aluno.')
  } finally {
    loadingDelete.value = false
  }
}

const handleEdit = (item) => {
  router.push(`/students/${item.id}`)
}

onMounted(() => { fetchStudents() })
</script>