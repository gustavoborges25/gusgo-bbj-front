<template>
  <MenuLayout>
    <Cabecalho 
      :title="$t('instructors.list.title')"
      :subtitle="$t('instructors.list.subtitle')"
      forwardRoute="/instructors/create"
      :forwardText="$t('instructors.add_button')"
    />
    <BaseDataTable
      :headers="headers"
      :items="instructors"
      :loading="loadingTable"
      :search-placeholder="$t('instructors.search_placeholder')"
    >
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

      <template #[`item.active`]="{ item }">
        <v-badge dot inline :color="item.active ? 'success' : 'error'">
          <span style="margin-right: 5px;">{{ item.active ? $t('instructors.status_active') : $t('instructors.status_inactive') }}</span>
        </v-badge>
      </template>

      <template #[`item.actions`]="{ item }">
        <v-btn v-tooltip="$t('instructors.actions.edit')" icon="mdi-account-edit" size="small" variant="text" color="#ffc107" @click="handleEdit(item)"></v-btn>
        <v-btn v-tooltip="item.active ? $t('instructors.actions.inactive') : $t('instructors.actions.active')" icon="mdi-toggle-switch" size="small" variant="text" :color="item.active ? 'success' : 'grey'" @click="toggleStatus(item)"></v-btn>
        <v-btn v-tooltip="$t('instructors.actions.delete')" icon="mdi-delete" size="small" variant="text" color="error" @click="openDeleteModal(item)"></v-btn>
      </template>
    </BaseDataTable>

    <ConfirmDialog
      v-model="deleteModal"
      :loading="loadingDelete"
      :title="$t('instructors.delete.title')"
      :message="$t('instructors.delete.subtitle_1') + selectedName + $t('instructors.delete.subtitle_2')"
      :confirm-text="$t('instructors.delete.confirm')"
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

const { t } = useI18n()
const instructors = ref([])
const loadingTable = ref(false)
const router = useRouter()
const deleteModal = ref(false)
const loadingDelete = ref(false)
const selectedId = ref(null)
const selectedName = ref(null)

const headers = computed(() => [
  { title: t('instructors.columns.name'), key: 'name', sortable: true },
  { title: t('instructors.columns.belt'), key: 'beltName', sortable: true, align: 'center' },
  { title: t('instructors.columns.degrees'), key: 'degree', sortable: true, align: 'center' },
  { title: t('instructors.columns.status'), key: 'active', sortable: true, align: 'center' },
  { title: t('instructors.actions.title'), key: 'actions', sortable: false, align: 'center' }
])

const fetchInstructors = async () => {
  loadingTable.value = true
  try {
    const response = await api.get('/instructors')
    instructors.value = response.data.data
  } catch (error) {
    toast.error(error.response?.data?.message || 'Falha ao carregar a lista de professores.')
  } finally {
    loadingTable.value = false
  }
}

const openDeleteModal = (instructor) => {
  selectedId.value = instructor.id
  selectedName.value = instructor.name
  deleteModal.value = true
}

const toggleStatus = async (item) => {
  const originalStatus = item.active 

  try {
    const response = await api.patch(`/instructors/${item.id}`, {
      active: !originalStatus
    })

    const updatedInstructor = response.data.data
    item.active = updatedInstructor.active
    toast.success(t('instructors.edit.status'))
  } catch (error) {
    toast.error(error.response?.data?.message || 'Falha ao mudar o status do professor.')
    item.active = originalStatus
  }
}

const handleDelete = async () => {
  if (!selectedId.value) return

  loadingDelete.value = true
  try {
    await api.delete(`/instructors/${selectedId.value}`)
    deleteModal.value = false
    selectedId.value = null
    selectedName.value = null
    toast.success(t('instructors.delete.success'))
    fetchInstructors()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Falha ao excluir o professor.')
  } finally {
    loadingDelete.value = false
  }
}

const handleEdit = (item) => {
  router.push(`/instructors/${item.id}`)
}

onMounted(() => { fetchInstructors() })
</script>